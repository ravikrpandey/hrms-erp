const db = require("../../../models");
const ProjectCostTransaction = db.projectCostTransaction;
const Project = db.project;
const ProjectMember = db.projectMember;
const TimesheetLog = db.timesheetLog;
const TimesheetSubmission = db.timesheetSubmission;
const ProjectExpense = db.projectExpense;

const round2 = (val) => Math.round((parseFloat(val) || 0) * 100) / 100;

const resolveEmployeeHourlyRate = async (projectId, employeeId, logDate = null, allowFallback = false) => {
  try {
    if (ProjectMember && projectId && employeeId) {
      const memberWhere = { project_id: projectId, employee_id: employeeId, is_active: 1 };
      if (logDate) {
        memberWhere[db.Sequelize.Op.or] = [
          { assigned_date: null },
          { assigned_date: { [db.Sequelize.Op.lte]: logDate } },
        ];
      }
      let member = await ProjectMember.findOne({
        where: memberWhere,
        order: [["assigned_date", "DESC"], ["id", "DESC"]],
      });
      if (!member) {
        member = await ProjectMember.findOne({
          where: { project_id: projectId, employee_id: employeeId, is_active: 1 },
          order: [["id", "DESC"]],
        });
      }
      if (
        member &&
        member.hourly_rate !== null &&
        member.hourly_rate !== undefined &&
        !isNaN(parseFloat(member.hourly_rate))
      ) {
        const rate = parseFloat(member.hourly_rate);
        if (rate >= 0) return round2(rate);
      }
    }

    if (employeeId) {
      const [userRows] = await db.sequelize.query(
        "SELECT salary_per_hr, salary_per_day, basic_salary FROM HRMS_REGISTERED_USER WHERE employee_id = :employeeId LIMIT 1",
        { replacements: { employeeId } }
      );
      if (userRows && userRows.length > 0) {
        const salaryPerHr = userRows[0].salary_per_hr;
        if (salaryPerHr !== null && !isNaN(parseFloat(salaryPerHr)) && parseFloat(salaryPerHr) >= 0) {
          return round2(salaryPerHr);
        }

        const salaryPerDay = parseFloat(userRows[0].salary_per_day);
        if (!isNaN(salaryPerDay) && salaryPerDay > 0) {
          return round2(salaryPerDay / 8);
        }

        const basicSalary = parseFloat(userRows[0].basic_salary);
        if (!isNaN(basicSalary) && basicSalary > 0) {
          return round2(basicSalary / (30 * 8));
        }
      }
    }
  } catch (err) {
    console.error("Error resolving employee hourly rate:", err);
  }

  return allowFallback ? 500.0 : null;
};

const recalculateProjectFinancials = async (projectId, transaction = null) => {
  if (!projectId) return null;

  const [rows] = await db.sequelize.query(
    `SELECT 
      COALESCE(SUM(amount), 0) AS total_spent,
      COALESCE(SUM(CASE WHEN (source_type = 'TIMESHEET_LABOR' OR (source_type = 'ADJUSTMENT' AND hours IS NOT NULL AND hours != 0)) AND posting_status = 'POSTED' THEN amount ELSE 0 END), 0) AS labor_cost,
      COALESCE(SUM(CASE WHEN (source_type = 'PROJECT_EXPENSE' OR (source_type = 'ADJUSTMENT' AND (hours IS NULL OR hours = 0))) AND posting_status = 'POSTED' THEN amount ELSE 0 END), 0) AS expense_cost
     FROM PROJECT_COST_TRANSACTIONS 
     WHERE project_id = :projectId AND posting_status = 'POSTED'`,
    {
      replacements: { projectId },
      transaction,
    }
  );

  const totalSpent = round2(rows[0]?.total_spent || 0);
  const laborCost = round2(rows[0]?.labor_cost || 0);
  const expenseCost = round2(rows[0]?.expense_cost || 0);

  const project = await Project.findOne({
    where: { project_id: projectId },
    transaction,
  });

  if (project) {
    const budget = round2(project.budget || 0);
    const recognizedRevenue = round2(project.recognized_revenue || 0);
    const financialBalance = round2(budget - totalSpent);
    const availableBudget = Math.max(0, financialBalance);
    const overspendingAmount = Math.max(0, round2(totalSpent - budget));
    const isOverBudget = totalSpent > budget;
    const isRevenueRecognized = recognizedRevenue > 0;
    const profitLoss = isRevenueRecognized ? round2(recognizedRevenue - totalSpent) : null;
    const profitLossStatus = isRevenueRecognized ? "RECOGNIZED" : "UNVERIFIED";

    await Project.update(
      { spent: totalSpent, profit_loss: profitLoss !== null ? profitLoss : 0.0 },
      { where: { project_id: projectId }, transaction }
    );

    return {
      project_id: projectId,
      budget,
      currency: project.currency || "INR",
      recognized_revenue: recognizedRevenue,
      spent: totalSpent,
      labor_cost: laborCost,
      expense_cost: expenseCost,
      financial_balance: financialBalance,
      available_budget: availableBudget,
      overspending_amount: overspendingAmount,
      is_over_budget: isOverBudget,
      profit_loss: profitLoss,
      profit_loss_status: profitLossStatus,
    };
  }

  return null;
};

const postTimesheetSubmissionCosts = async (submissionId, authUser = null, externalTx = null) => {
  const runWithTx = async (t) => {
    const submission = await TimesheetSubmission.findOne({
      where: { submission_id: submissionId, is_deleted: false },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!submission) {
      throw new Error("Timesheet submission not found");
    }

    const logs = await TimesheetLog.findAll({
      where: {
        timesheet_submission_id: submission.submission_id,
        is_deleted: false,
        approval_status: "Approved",
      },
      transaction: t,
    });

    if (!logs || logs.length === 0) {
      return { success: true, count: 0, message: "No approved logs to post" };
    }

    const affectedProjectIds = new Set();
    let postedCount = 0;

    for (const log of logs) {
      const hours = round2(log.total_hours || 0);
      if (hours <= 0) continue;

      const activeTx = await ProjectCostTransaction.findOne({
        where: {
          source_type: "TIMESHEET_LABOR",
          source_reference_id: log.log_id,
          posting_status: "POSTED",
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (activeTx) {
        affectedProjectIds.add(log.project_id);
        continue;
      }

      const reversedTx = await ProjectCostTransaction.findOne({
        where: {
          source_type: "TIMESHEET_LABOR",
          source_reference_id: log.log_id,
          posting_status: "REVERSED",
        },
        order: [["transaction_id", "DESC"]],
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      const baseKey = `TIMESHEET_LABOR_${log.log_id}`;
      const idempotencyKey = reversedTx
        ? `${baseKey}_REPOST_${reversedTx.transaction_id}`
        : baseKey;

      const existingTx = await ProjectCostTransaction.findOne({
        where: { idempotency_key: idempotencyKey },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (existingTx && existingTx.posting_status === "POSTED") {
        affectedProjectIds.add(log.project_id);
        continue;
      }

      const rate = await resolveEmployeeHourlyRate(log.project_id, log.employee_id, log.log_date);
      if (rate === null || rate === undefined || isNaN(rate)) {
        throw new Error(
          `Cannot approve timesheet: Cost rate is not configured for employee #${log.employee_id} (${log.employee_name}) on project #${log.project_id}. Cost rates must be explicitly configured.`
        );
      }
      const amount = round2(hours * rate);

      const project = await Project.findOne({
        where: { project_id: log.project_id },
        transaction: t,
      });

      if (!existingTx) {
        await ProjectCostTransaction.create(
          {
            project_id: log.project_id,
            project_name: project?.project_name || log.project_name || `Project ${log.project_id}`,
            source_type: "TIMESHEET_LABOR",
            source_reference_id: log.log_id,
            source_reference_name: log.work_item || log.task_name || `Log #${log.log_id}`,
            idempotency_key: idempotencyKey,
            employee_id: log.employee_id,
            employee_name: log.employee_name || "Employee",
            task_id: log.task_id,
            task_name: log.task_name,
            transaction_date: log.log_date,
            hours,
            applied_rate: rate,
            amount,
            currency: project?.currency || "INR",
            posting_status: "POSTED",
            notes: log.description || `Labor cost for task "${log.task_name}"`,
            created_by: authUser ? authUser.employee_id : null,
          },
          { transaction: t }
        );
      }

      postedCount++;
      affectedProjectIds.add(log.project_id);
    }

    for (const projectId of affectedProjectIds) {
      await recalculateProjectFinancials(projectId, t);
    }

    return {
      success: true,
      postedCount,
      affectedProjects: Array.from(affectedProjectIds),
    };
  };

  if (externalTx) {
    return await runWithTx(externalTx);
  }
  return await db.sequelize.transaction(async (t) => await runWithTx(t));
};

const reverseTimesheetCosts = async (submissionId, authUser = null, reason = "Timesheet rejected", externalTx = null) => {
  const runWithTx = async (t) => {
    const logs = await TimesheetLog.findAll({
      where: { timesheet_submission_id: submissionId },
      transaction: t,
    });

    if (!logs || logs.length === 0) return { reversedCount: 0 };

    const logIds = logs.map((l) => l.log_id);
    const affectedProjectIds = new Set();

    const transactions = await ProjectCostTransaction.findAll({
      where: {
        source_type: "TIMESHEET_LABOR",
        source_reference_id: logIds,
        posting_status: "POSTED",
        reversal_reference_id: null,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!transactions || transactions.length === 0) {
      return { reversedCount: 0, message: "No active unreversed transactions found" };
    }

    let reversedCount = 0;
    for (const origTx of transactions) {
      const reversalIdempotencyKey = `REVERSAL_TX_${origTx.transaction_id}`;

      const existingReversal = await ProjectCostTransaction.findOne({
        where: { idempotency_key: reversalIdempotencyKey },
        transaction: t,
      });

      if (existingReversal) {
        continue;
      }

      const reversalTx = await ProjectCostTransaction.create(
        {
          project_id: origTx.project_id,
          project_name: origTx.project_name,
          source_type: "ADJUSTMENT",
          source_reference_id: origTx.source_reference_id,
          source_reference_name: `Reversal of Tx #${origTx.transaction_id} (${origTx.source_reference_name})`,
          idempotency_key: reversalIdempotencyKey,
          employee_id: origTx.employee_id,
          employee_name: origTx.employee_name,
          task_id: origTx.task_id,
          task_name: origTx.task_name,
          transaction_date: new Date().toISOString().slice(0, 10),
          hours: -round2(origTx.hours || 0),
          applied_rate: origTx.applied_rate,
          amount: -round2(origTx.amount || 0),
          currency: origTx.currency,
          posting_status: "REVERSED",
          reversal_reference_id: origTx.transaction_id,
          notes: `Compensating reversal: ${reason}`,
          created_by: authUser ? authUser.employee_id : null,
        },
        { transaction: t }
      );

      origTx.posting_status = "REVERSED";
      origTx.reversal_reference_id = reversalTx.transaction_id;
      await origTx.save({ transaction: t });

      affectedProjectIds.add(origTx.project_id);
      reversedCount++;
    }

    for (const projectId of affectedProjectIds) {
      await recalculateProjectFinancials(projectId, t);
    }

    return { reversedCount, affectedProjects: Array.from(affectedProjectIds) };
  };

  if (externalTx) {
    return await runWithTx(externalTx);
  }
  return await db.sequelize.transaction(async (t) => await runWithTx(t));
};

const reverseTimeLogCost = async (logId, authUser = null, reason = "Time log rejected", externalTx = null) => {
  const runWithTx = async (t) => {
    const origTx = await ProjectCostTransaction.findOne({
      where: {
        source_type: "TIMESHEET_LABOR",
        source_reference_id: logId,
        posting_status: "POSTED",
        reversal_reference_id: null,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!origTx) {
      return { success: false, message: "No active posted transaction to reverse for this log" };
    }

    const reversalIdempotencyKey = `REVERSAL_TX_${origTx.transaction_id}`;
    const reversalTx = await ProjectCostTransaction.create(
      {
        project_id: origTx.project_id,
        project_name: origTx.project_name,
        source_type: "ADJUSTMENT",
        source_reference_id: origTx.source_reference_id,
        source_reference_name: `Reversal of Tx #${origTx.transaction_id} (${origTx.source_reference_name})`,
        idempotency_key: reversalIdempotencyKey,
        employee_id: origTx.employee_id,
        employee_name: origTx.employee_name,
        task_id: origTx.task_id,
        task_name: origTx.task_name,
        transaction_date: new Date().toISOString().slice(0, 10),
        hours: -round2(origTx.hours || 0),
        applied_rate: origTx.applied_rate,
        amount: -round2(origTx.amount || 0),
        currency: origTx.currency,
        posting_status: "REVERSED",
        reversal_reference_id: origTx.transaction_id,
        notes: `Compensating reversal: ${reason}`,
        created_by: authUser ? authUser.employee_id : null,
      },
      { transaction: t }
    );

    origTx.posting_status = "REVERSED";
    origTx.reversal_reference_id = reversalTx.transaction_id;
    await origTx.save({ transaction: t });

    await recalculateProjectFinancials(origTx.project_id, t);
    return { success: true, reversalTxId: reversalTx.transaction_id };
  };

  if (externalTx) {
    return await runWithTx(externalTx);
  }
  return await db.sequelize.transaction(async (t) => await runWithTx(t));
};

const adjustTimeLogCost = async (logId, newHours, authUser = null, reason = "Time log adjustment", externalTx = null) => {
  const runWithTx = async (t) => {
    const origTx = await ProjectCostTransaction.findOne({
      where: {
        source_type: "TIMESHEET_LABOR",
        source_reference_id: logId,
        posting_status: "POSTED",
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!origTx) {
      return { success: false, message: "No active posted transaction to adjust" };
    }

    const [currentHoursResult] = await db.sequelize.query(
      `SELECT COALESCE(SUM(hours), 0) AS total_hours 
       FROM PROJECT_COST_TRANSACTIONS 
       WHERE source_reference_id = :logId 
         AND (source_type = 'TIMESHEET_LABOR' OR source_type = 'ADJUSTMENT') 
         AND posting_status = 'POSTED'`,
      {
        replacements: { logId },
        type: db.sequelize.QueryTypes.SELECT,
        transaction: t,
        lock: t.LOCK.UPDATE,
      }
    );

    const oldHours = round2(parseFloat(currentHoursResult?.total_hours != null ? currentHoursResult.total_hours : (origTx.hours || 0)));
    const diffHours = round2(newHours - oldHours);
    if (diffHours === 0) {
      return { success: true, adjusted: false, message: "Hours unchanged" };
    }

    const rate = round2(origTx.applied_rate || 0);
    const diffAmount = round2(diffHours * rate);

    const adjustmentIdempotencyKey = `ADJUSTMENT_LOG_${logId}_${Date.now()}`;
    const adjTx = await ProjectCostTransaction.create(
      {
        project_id: origTx.project_id,
        project_name: origTx.project_name,
        source_type: "ADJUSTMENT",
        source_reference_id: origTx.source_reference_id,
        source_reference_name: `Adjustment on Tx #${origTx.transaction_id}`,
        idempotency_key: adjustmentIdempotencyKey,
        employee_id: origTx.employee_id,
        employee_name: origTx.employee_name,
        task_id: origTx.task_id,
        task_name: origTx.task_name,
        transaction_date: new Date().toISOString().slice(0, 10),
        hours: diffHours,
        applied_rate: rate,
        amount: diffAmount,
        currency: origTx.currency,
        posting_status: "POSTED",
        reversal_reference_id: origTx.transaction_id,
        notes: `Hours adjusted from ${oldHours}h to ${newHours}h: ${reason}`,
        created_by: authUser ? authUser.employee_id : null,
      },
      { transaction: t }
    );

    origTx.notes = `${origTx.notes || ""} | Adjusted by Tx #${adjTx.transaction_id}`.trim();
    await origTx.save({ transaction: t });

    await recalculateProjectFinancials(origTx.project_id, t);
    return { success: true, adjusted: true, diffAmount, adjustmentTxId: adjTx.transaction_id };
  };

  if (externalTx) {
    return await runWithTx(externalTx);
  }
  return await db.sequelize.transaction(async (t) => await runWithTx(t));
};

const postProjectExpenseCost = async (expenseId, authUser = null, externalTx = null) => {
  const runWithTx = async (t) => {
    const expense = await ProjectExpense.findOne({
      where: { id: expenseId, is_deleted: false },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!expense || expense.status !== "Approved") {
      return { success: false, message: "Expense not found or not in Approved status" };
    }

    const activeTx = await ProjectCostTransaction.findOne({
      where: {
        source_type: "PROJECT_EXPENSE",
        source_reference_id: expense.id,
        posting_status: "POSTED",
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (activeTx) {
      return { success: true, alreadyPosted: true };
    }

    const reversedTx = await ProjectCostTransaction.findOne({
      where: {
        source_type: "PROJECT_EXPENSE",
        source_reference_id: expense.id,
        posting_status: "REVERSED",
      },
      order: [["transaction_id", "DESC"]],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const baseKey = `PROJECT_EXPENSE_${expense.id}`;
    const idempotencyKey = reversedTx
      ? `${baseKey}_REPOST_${reversedTx.transaction_id}`
      : baseKey;

    const existingTx = await ProjectCostTransaction.findOne({
      where: { idempotency_key: idempotencyKey },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (existingTx && existingTx.posting_status === "POSTED") {
      return { success: true, alreadyPosted: true };
    }

    const amount = round2(expense.amount || 0);
    if (amount <= 0) {
      return { success: false, message: "Expense amount is zero or negative" };
    }

    const project = await Project.findOne({
      where: { project_id: expense.project_id },
      transaction: t,
    });

    if (!existingTx) {
      await ProjectCostTransaction.create(
        {
          project_id: expense.project_id,
          project_name: project?.project_name || expense.project_name || `Project ${expense.project_id}`,
          source_type: "PROJECT_EXPENSE",
          source_reference_id: expense.id,
          source_reference_name: `${expense.expense_number} - ${expense.expense_type}`,
          idempotency_key: idempotencyKey,
          employee_id: expense.employee_id,
          employee_name: expense.employee_name || "Employee",
          task_id: null,
          task_name: null,
          transaction_date: expense.expense_date,
          hours: null,
          applied_rate: null,
          amount,
          currency: project?.currency || "INR",
          posting_status: "POSTED",
          notes: expense.comments || `Approved expense: ${expense.expense_type}`,
          created_by: authUser ? authUser.employee_id : null,
        },
        { transaction: t }
      );
    }

    await recalculateProjectFinancials(expense.project_id, t);
    return { success: true, posted: true };
  };

  if (externalTx) {
    return await runWithTx(externalTx);
  }
  return await db.sequelize.transaction(async (t) => await runWithTx(t));
};

const reverseProjectExpenseCost = async (expenseId, authUser = null, reason = "Expense reversed", externalTx = null) => {
  const runWithTx = async (t) => {
    const origTx = await ProjectCostTransaction.findOne({
      where: {
        source_type: "PROJECT_EXPENSE",
        source_reference_id: expenseId,
        posting_status: "POSTED",
        reversal_reference_id: null,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!origTx) {
      return { success: false, message: "No active posted expense transaction to reverse" };
    }

    const reversalIdempotencyKey = `REVERSAL_TX_${origTx.transaction_id}`;
    const reversalTx = await ProjectCostTransaction.create(
      {
        project_id: origTx.project_id,
        project_name: origTx.project_name,
        source_type: "ADJUSTMENT",
        source_reference_id: origTx.source_reference_id,
        source_reference_name: `Reversal of Expense Tx #${origTx.transaction_id}`,
        idempotency_key: reversalIdempotencyKey,
        employee_id: origTx.employee_id,
        employee_name: origTx.employee_name,
        task_id: null,
        task_name: null,
        transaction_date: new Date().toISOString().slice(0, 10),
        hours: null,
        applied_rate: null,
        amount: -round2(origTx.amount || 0),
        currency: origTx.currency,
        posting_status: "REVERSED",
        reversal_reference_id: origTx.transaction_id,
        notes: `Compensating expense reversal: ${reason}`,
        created_by: authUser ? authUser.employee_id : null,
      },
      { transaction: t }
    );

    origTx.posting_status = "REVERSED";
    origTx.reversal_reference_id = reversalTx.transaction_id;
    await origTx.save({ transaction: t });

    await recalculateProjectFinancials(origTx.project_id, t);
    return { success: true, reversalTxId: reversalTx.transaction_id };
  };

  if (externalTx) {
    return await runWithTx(externalTx);
  }
  return await db.sequelize.transaction(async (t) => await runWithTx(t));
};

module.exports = {
  resolveEmployeeHourlyRate,
  recalculateProjectFinancials,
  postTimesheetSubmissionCosts,
  reverseTimesheetCosts,
  reverseTimeLogCost,
  adjustTimeLogCost,
  postProjectExpenseCost,
  reverseProjectExpenseCost,
};
