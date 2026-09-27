module.exports = (sequelize, Sequelize) => {
  const bioAttendance_timelist = sequelize.define(
    "BIO_ATT_TIME_EMP_MST",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

        att_month: {
            type: Sequelize.INTEGER,
        },
        att_year: {
            type: Sequelize.INTEGER,
        },
        att_date: {
            type: Sequelize.STRING,
        },
      
      total_working_hr: {
        type: Sequelize.STRING,
      },
      working_hr_list: {
        type: Sequelize.JSON,
      },

      late_working_hr:{
         type: Sequelize.STRING,
      },

      early_in_hr :{
        type:Sequelize.STRING,
      },
      late_in_hr :{
        type:Sequelize.STRING,
      },
      early_out_hr :{
        type:Sequelize.STRING,
      },
      late_out_hr :{
        type:Sequelize.STRING,
      },
      left_grace_day :{
        type:Sequelize.STRING,
      },
      hod_approval:{
       type: Sequelize.TINYINT,
        defaultValue: 0,
      },
      hod_remarks:{
       type: Sequelize.STRING,
       defaultValue: null
      }, 
      isDeleted: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  return bioAttendance_timelist;
};
