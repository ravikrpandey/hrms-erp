module.exports = (sequelize, Sequelize) => {
  const TaskComment = sequelize.define(
    "PROJECT_TASK_COMMENTS",
    {
      comment_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      task_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sender_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      sender_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      sender_email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      sender_role: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      action_type: {
        type: Sequelize.STRING(50),
        defaultValue: "comment",
      },
      activity_type: {
        type: Sequelize.STRING(50),
        defaultValue: "COMMENT",
      },
      old_value: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      new_value: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_edited: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  return TaskComment;
};
