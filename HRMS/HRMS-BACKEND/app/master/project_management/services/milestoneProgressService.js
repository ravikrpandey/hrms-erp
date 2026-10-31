const db = require("../../../models");
const { Op } = require("sequelize");

const Project = db.project || db.projectMaster;
const ProjectTask = db.task || db.projectTask;
const ProjectMilestone = db.projectMilestone;

/**
 * Centralized service for Milestone & Project progress calculation.
 * Formula:
 * - Milestone Progress (%) = (Completed Tasks / Total Tasks in Milestone) * 100
 * - Project Progress (%) = (Total Completed Tasks across Project / Total Tasks across Project) * 100
 */
async function recalculateProjectAndMilestones(projectId, transaction = null) {
  if (!projectId) return null;

  const tOptions = transaction ? { transaction } : {};

  // 1. Fetch all active tasks for the project
  const tasks = await ProjectTask.findAll({
    where: { project_id: projectId, is_deleted: false },
    ...tOptions,
  });

  // 2. Fetch all active milestones for the project
  const milestones = await ProjectMilestone.findAll({
    where: { project_id: projectId, is_deleted: false },
    order: [
      ["display_order", "ASC"],
      ["id", "ASC"],
    ],
    ...tOptions,
  });

  // 3. Recalculate each milestone
  const updatedMilestones = [];
  for (const m of milestones) {
    const mTasks = tasks.filter(
      (t) =>
        t.milestone_id &&
        (t.milestone_id == m.id ||
          t.milestone_id == m.milestone_id ||
          t.milestone_id == m.milestone_code)
    );

    const totalTasks = mTasks.length;
    const completedTasks = mTasks.filter((t) => t.status === "Completed").length;
    const inProgressTasks = mTasks.filter(
      (t) => t.status === "In Progress" || t.status === "In Review"
    ).length;

    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    let status = m.status;
    if (m.status !== "Blocked") {
      if (totalTasks > 0 && completedTasks === totalTasks) {
        status = "Completed";
      } else if (completedTasks > 0 || inProgressTasks > 0) {
        status = "In Progress";
      } else {
        status = "Not Started";
      }
    }

    let needsSave = false;
    if (m.progress !== progress) {
      m.progress = progress;
      needsSave = true;
    }
    if (m.status !== status) {
      m.status = status;
      needsSave = true;
    }

    if (needsSave) {
      await m.save(tOptions);
    }

    const plain = m.get ? m.get({ plain: true }) : { ...m };
    plain.total_tasks = totalTasks;
    plain.completed_tasks = completedTasks;
    plain.progress = progress;
    plain.status = status;
    updatedMilestones.push(plain);
  }

  // 4. Recalculate Project overall progress
  const totalProjectTasks = tasks.length;
  const completedProjectTasks = tasks.filter((t) => t.status === "Completed").length;
  const projectProgress =
    totalProjectTasks > 0
      ? Math.round((completedProjectTasks / totalProjectTasks) * 100)
      : 0;

  if (Project) {
    const project = await Project.findByPk(projectId, tOptions);
    if (project && project.progress !== projectProgress) {
      project.progress = projectProgress;
      await project.save(tOptions);
    }
  }

  return {
    projectId,
    projectProgress,
    totalProjectTasks,
    completedProjectTasks,
    milestones: updatedMilestones,
  };
}

/**
 * Validates that a milestone exists and belongs to the given project
 */
async function validateMilestoneBelongsToProject(milestoneId, projectId) {
  if (!milestoneId) return { valid: true, milestone: null };
  const milestone = await ProjectMilestone.findOne({
    where: {
      id: milestoneId,
      project_id: projectId,
      is_deleted: false,
    },
  });
  if (!milestone) {
    return {
      valid: false,
      message: `Milestone #${milestoneId} does not belong to Project #${projectId} or does not exist.`,
    };
  }
  return { valid: true, milestone };
}

module.exports = {
  recalculateProjectAndMilestones,
  validateMilestoneBelongsToProject,
};
