module.exports = (sequelize, Sequelize) => {
    const daily_attendance_master = sequelize.define("ESS_DAILY_ATTENDANCE_MASTER", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        att_date: {
            type: Sequelize.STRING,
        },
        att_datetime: {
            type: Sequelize.DATE,
        },
        att_day: {
            type: Sequelize.STRING,
        },
        att_month: {
            type: Sequelize.INTEGER,
        },
        att_year: {
            type: Sequelize.INTEGER,
        },
        working_hours: {
            type: Sequelize.STRING(100),
        },
        // attendance_status: {
        //     type: Sequelize.ENUM("P", "A", "PL", "UL", "DA", "DP", "HD", "PHL", "UHL","CO","WFO","WHO","H"),
        //     ////// Present , Absent , Paid_leave, Unpaid_leave, Default_Absent, Default_present, Half_day, Paid_halfDay_leave, Unpaid_HalfDay_leave, COMP OFF, Week Full Day Off, Week Half Day Off  //////////////
        //     defaultValue: "A",
        // },
        attendance_status: {
            type: Sequelize.ENUM("P", "A", "DA", "DP", "HD", "CO","WFO","WHO","H","PFD","PHD","HPFD","HPHD","NPFD","NPHD","UL","UHL"),
            ////// Present , Absent , Default_Absent, Default_present, Half_day,  COMP OFF, Week Full Day Off, Week Half Day Off  //////////////
            /////////Paid Full Day,Paid Half Day,Half Paid Full Day,Half Paid Half Day,Non Paid Full Day,Non Paid Half Day,Unpaid full without quota,Unpaid half without quota///


            defaultValue: "P",
        },
        status: {
            type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
        isDeleted: {
            type: Sequelize.BOOLEAN(true, false),
            defaultValue: false
        }
    },
        {
            freezeTableName: true,
        }
    );
    return daily_attendance_master;
};