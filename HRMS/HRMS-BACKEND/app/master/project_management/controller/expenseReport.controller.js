const db = require("../../../models");
const ProjectCostTransaction = db.projectCostTransaction;
const Project = db.project;
const { Op } = require("sequelize");
const projectAuth = require("../middleware/projectAuth");

const round2 = (val) => Math.round((parseFloat(val) || 0) * 100) / 100;

exports.getExpenseReport = async (req, res) => {
  try {
    const authUser = await projectAuth.getAuthUser(req);
    if (!authUser) {
      return res.status(401).send({ success: false, message: "Unauthorized" });
    }

    const {
      project_id,
      start_date,
      end_date,
      source_type,
      employee_id,
      posting_status = "POSTED",
      search,
      page = 1,
      limit = 50,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(500, parseInt(limit, 10) || 50));
    const offset = (pageNum - 1) * limitNum;

    const whereClause = {};

    if (project_id && project_id !== "all" && project_id !== "0") {
      whereClause.project_id = parseInt(project_id, 10);
    }

    if (employee_id && employee_id !== "all") {
      whereClause.employee_id = parseInt(employee_id, 10);
    }

    if (source_type && source_type !== "ALL") {
      whereClause.source_type = source_type;
    }

    if (posting_status && posting_status !== "ALL") {
      whereClause.posting_status = posting_status;
    }

    if (start_date && end_date) {
      whereClause.transaction_date = { [Op.between]: [start_date, end_date] };
    } else if (start_date) {
      whereClause.transaction_date = { [Op.gte]: start_date };
    } else if (end_date) {
      whereClause.transaction_date = { [Op.lte]: end_date };
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      whereClause[Op.or] = [
        { project_name: { [Op.like]: q } },
        { employee_name: { [Op.like]: q } },
        { task_name: { [Op.like]: q } },
        { source_reference_name: { [Op.like]: q } },
        { notes: { [Op.like]: q } },
      ];
    }

    // Role-based scoping if not admin/head
    const isAdmin = projectAuth.isProjectAdmin(authUser);
    if (!isAdmin) {
      const managed = await projectAuth.getManagedProjectIds(authUser);
      if (managed !== null) {
        if (whereClause.project_id) {
          if (!managed.includes(whereClause.project_id)) {
            whereClause.employee_id = authUser.employee_id;
          }
        } else {
          whereClause[Op.or] = [
            { project_id: { [Op.in]: managed } },
            { employee_id: authUser.employee_id },
          ];
        }
      }
    }

    // Calculate Summary Metrics (always netting out posted expenditure accurately)
    const summaryWhere = { ...whereClause };
    if (!req.query.posting_status || req.query.posting_status === "POSTED") {
      summaryWhere.posting_status = "POSTED";
    }

    const totalPostedRows = await ProjectCostTransaction.findAll({
      where: summaryWhere,
      attributes: [
        [db.sequelize.fn("COALESCE", db.sequelize.fn("SUM", db.sequelize.col("amount")), 0), "total_expenditure"],
        [
          db.sequelize.fn(
            "COALESCE",
            db.sequelize.fn(
              "SUM",
              db.sequelize.literal(
                "CASE WHEN (source_type = 'TIMESHEET_LABOR' OR (source_type = 'ADJUSTMENT' AND hours IS NOT NULL AND hours != 0)) AND posting_status = 'POSTED' THEN amount ELSE 0 END"
              )
            ),
            0
          ),
          "labor_cost",
        ],
        [
          db.sequelize.fn(
            "COALESCE",
            db.sequelize.fn(
              "SUM",
              db.sequelize.literal(
                "CASE WHEN (source_type = 'PROJECT_EXPENSE' OR (source_type = 'ADJUSTMENT' AND (hours IS NULL OR hours = 0))) AND posting_status = 'POSTED' THEN amount ELSE 0 END"
              )
            ),
            0
          ),
          "expense_cost",
        ],
        [
          db.sequelize.fn(
            "COALESCE",
            db.sequelize.fn(
              "SUM",
              db.sequelize.literal(
                "CASE WHEN (source_type = 'TIMESHEET_LABOR' OR (source_type = 'ADJUSTMENT' AND hours IS NOT NULL)) AND posting_status = 'POSTED' THEN hours ELSE 0 END"
              )
            ),
            0
          ),
          "total_hours",
        ],
      ],
      raw: true,
    });

    const laborCost = round2(totalPostedRows[0]?.labor_cost || 0);
    const expenseCost = round2(totalPostedRows[0]?.expense_cost || 0);
    const totalActualExpenditure = round2(totalPostedRows[0]?.total_expenditure || 0);
    const totalHours = round2(totalPostedRows[0]?.total_hours || 0);

    // Calculate Allocated Budget and Recognized Revenue
    let allocatedBudget = 0;
    let recognizedRevenue = 0;
    let projectCurrency = "INR";

    if (whereClause.project_id) {
      const p = await Project.findOne({
        where: { project_id: whereClause.project_id, is_deleted: false },
      });
      allocatedBudget = round2(p?.budget || 0);
      recognizedRevenue = round2(p?.recognized_revenue || 0);
      projectCurrency = p?.currency || "INR";
    } else {
      const [bRows] = await db.sequelize.query(
        "SELECT COALESCE(SUM(budget), 0) AS total_budget, COALESCE(SUM(recognized_revenue), 0) AS total_revenue FROM PROJECTS WHERE is_deleted = 0"
      );
      allocatedBudget = round2(bRows[0]?.total_budget || 0);
      recognizedRevenue = round2(bRows[0]?.total_revenue || 0);
    }

    const financialBalance = round2(allocatedBudget - totalActualExpenditure);
    const availableBudget = Math.max(0, financialBalance);
    const overspendingAmount = Math.max(0, round2(totalActualExpenditure - allocatedBudget));
    const isOverBudget = totalActualExpenditure > allocatedBudget;
    const isRevenueRecognized = recognizedRevenue > 0;
    const profitLoss = isRevenueRecognized ? round2(recognizedRevenue - totalActualExpenditure) : null;
    const profitLossStatus = isRevenueRecognized ? "RECOGNIZED" : "UNVERIFIED";
    const budgetUtilizationPct = allocatedBudget > 0
      ? Math.round((totalActualExpenditure / allocatedBudget) * 1000) / 10
      : 0;

    // Check currency distribution
    const currencyRows = await ProjectCostTransaction.findAll({
      where: summaryWhere,
      attributes: [
        "currency",
        [db.sequelize.fn("COALESCE", db.sequelize.fn("SUM", db.sequelize.col("amount")), 0), "currency_total"],
      ],
      group: ["currency"],
      raw: true,
    });

    // Fetch paginated transactions
    const { count, rows: transactions } = await ProjectCostTransaction.findAndCountAll({
      where: whereClause,
      order: [["transaction_date", "DESC"], ["transaction_id", "DESC"]],
      limit: limitNum,
      offset,
    });

    return res.status(200).send({
      success: true,
      summary: {
        allocated_budget: allocatedBudget,
        recognized_revenue: recognizedRevenue,
        total_actual_expenditure: totalActualExpenditure,
        total_labor_cost: laborCost,
        total_expense_cost: expenseCost,
        financial_balance: financialBalance,
        available_budget: availableBudget,
        overspending_amount: overspendingAmount,
        is_over_budget: isOverBudget,
        profit_loss: profitLoss,
        profit_loss_status: profitLossStatus,
        budget_utilization_pct: budgetUtilizationPct,
        total_logged_hours: totalHours,
        currency: projectCurrency,
        currency_breakdown: currencyRows.map((c) => ({
          currency: c.currency,
          total: round2(c.currency_total),
        })),
        transaction_count: count,
      },
      data: transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        totalPages: Math.ceil(count / limitNum),
      },
    });
  } catch (error) {
    console.error("Error generating expense report:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error while generating expense report",
      error: error.message,
    });
  }
};

exports.exportExpenseReport = async (req, res) => {
  try {
    const authUser = await projectAuth.getAuthUser(req);
    if (!authUser) {
      return res.status(401).send({ success: false, message: "Unauthorized" });
    }

    const { project_id, start_date, end_date, source_type, employee_id, posting_status } = req.query;
    const whereClause = {};

    if (project_id && project_id !== "all" && project_id !== "0") {
      whereClause.project_id = parseInt(project_id, 10);
    }
    if (employee_id && employee_id !== "all") {
      whereClause.employee_id = parseInt(employee_id, 10);
    }
    if (source_type && source_type !== "ALL") {
      whereClause.source_type = source_type;
    }
    if (posting_status && posting_status !== "ALL") {
      whereClause.posting_status = posting_status;
    }
    if (start_date && end_date) {
      whereClause.transaction_date = { [Op.between]: [start_date, end_date] };
    }

    const transactions = await ProjectCostTransaction.findAll({
      where: whereClause,
      order: [["transaction_date", "DESC"], ["transaction_id", "DESC"]],
      limit: 5000,
    });

    return res.status(200).send({
      success: true,
      data: transactions,
      total: transactions.length,
    });
  } catch (error) {
    console.error("Error exporting expense report:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error while exporting expense report",
      error: error.message,
    });
  }
};
