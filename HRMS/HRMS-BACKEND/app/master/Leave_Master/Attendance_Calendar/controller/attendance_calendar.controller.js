const db = require("../../../../models/index");
const attendanceCalendarDetails = db.attendanceCalendarDetail;
const userDetails = db.user;
const screenOnOffDetails = db.screenOnOffDetail;
const leaveApplyDetails = db.leaveApplyDetail;
const leaveTypesDetails = db.leaveTypes;
const holidayDetails = db.holidayDetail;

/////////////// Create Attendance ///////////////

exports.create_Attendance = async (req, res) => {
  try {
    const { employee_id, punching_date, punching_time, punching_status } = req.body;
    if (employee_id) {
      const empId = await userDetails.findOne({ where: { employee_id: employee_id } })
      if (empId) {
        const response = await attendanceCalendarDetails.create({
          employee_id,
          punching_date,
          punching_time,
          punching_status
        });
        return res.status(200).send({ code: 200, message: "Attendance Created Successfully!", data: response });
      } else {
        return res.status(405).send({ code: 405, message: `Employee Id is not available for ${employee_id}` });
      }
    } else {
      return res.status(400).send({ code: 400, message: "Employee Id is Required" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

/////////////// Edit Attendance ///////////////

exports.edit_Attendance = async (req, res) => {
  try {
    const attendanceCalenderId = req.params.id;
    const { employee_id, punching_date, punching_time, punching_status } = req.body;
    const updatedAttendance = await attendanceCalendarDetails.findAll({ where: { attendance_calender_id: attendanceCalenderId } });
    if (!updatedAttendance.length > 0) {
      const updateAttendanceData = await attendanceCalendarDetails.update(
        {
          employee_id,
          punching_date,
          punching_time,
          punching_status
        },
        { where: { attendance_calender_id: attendanceCalenderId } });
      return res.status(200).send({ code: 200, message: "Attendance Data updated successfully", data: updateAttendanceData });
    } else {
      req.send.status(404)({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

/////////////// Get ByID Attendance ///////////////

exports.get_ById_Attendance = async (req, res) => {
  try {
    const employee_id = req.params.employee_id;
    const getData = await attendanceCalendarDetails.findAll({ where: { employee_id: employee_id } });
    if (getData) {
      return res.status(200).send({ code: 200, message: "Fetch Data Attandance Successfully!", data: getData });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

/////////////// Get All InOut Attandance ///////////////

exports.get_All_InOut_Attendance = async (req, res) => {
  try {
    const getData = await attendanceCalendarDetails.findAll({ where: { attendance_status: "ACTIVE" } });
    if (getData) {
      return res.status(200).send({ code: 200, message: "Fetch All Attandance Data Successfully!", data: getData });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

//////////////////////////////////////////// Screen On Off ////////////////////////////////////////////

/////////////// Create Screen On Off ///////////////

exports.create_Screen_On_Off = async (req, res) => {
  try {
    const { employee_id, screen_on_time, screen_off_time, screen_on_date, screen_off_date } = req.body;
    if (employee_id) {
      const empId = await userDetails.findOne({ where: { employee_id: employee_id } })
      if (empId) {
        const response = await screenOnOffDetails.create({
          employee_id,
          screen_on_time,
          screen_off_time,
          screen_on_date,
          screen_off_date
        });
        return res.status(200).send({ code: 200, message: "Screen On Off Created Successfully!", data: response });
      } else {
        return res.status(405).send({ code: 405, message: `Employee Id is not available for ${employee_id}` });
      }
    } else {
      return res.status(400).send({ code: 400, message: "Employee Id is Required" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

/////////////// Edit Screen On Off ///////////////

exports.edit_Screen_On_Off = async (req, res) => {
  try {
    const screenOnOffId = req.params.id;
    const { employee_id, screen_on_time, screen_off_time, screen_on_date, screen_off_date } = req.body;
    const updatedata = await screenOnOffDetails.findAll({ where: { screen_on_off_id: screenOnOffId } });
    if (updatedata) {
      const updateAttendanceData = await screenOnOffDetails.update(
        {
          employee_id,
          screen_on_time,
          screen_off_time,
          screen_on_date,
          screen_off_date
        },
        { where: { screen_on_off_id: screenOnOffId } });
      return res.status(200).send({ code: 200, message: "Screen On Off Data updated successfully", data: updateAttendanceData });
    } else {
      req.send.status(404)({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

/////////////// Get ByID Screen On Off ///////////////

exports.get_ById_Screen_On_Off = async (req, res) => {
  try {
    const employeeId = req.params.employee_id;
    const getData = await screenOnOffDetails.findAll({ where: { employee_id: employeeId } });
    if (getData) {
      return res.status(200).send({ code: 200, message: "Fetch Data Screen On Off Successfully!", data: getData });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

/////////////// Get All Screen On Off ///////////////

exports.get_All_Screen_On_Off = async (req, res) => {
  try {
    const getData = await screenOnOffDetails.findAll({ where: { screen_status: "ACTIVE" } });
    if (getData) {
      return res.status(200).send({ code: 200, message: "Fetch All Screen On Off Data Successfully!", data: getData });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

/////////////// Get ById Manager Name ///////////////

exports.get_ById_Manager_Name = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const getData = await userDetails.findOne({
      where: { employee_id: employeeId },
      attributes: ["reporting_manager_id", "reporting_manager"]
    });
    if (getData) {
      return res.status(200).send({ code: 200, message: "Fetch All Screen On Off Data Successfully!", data: getData });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};


/////////////// Get ById Employee Attendance ///////////////

exports.get_ById_Employee_Attendance = async (req, res) => {
  try {
    const employeeId = req.params.employee_id;
    const leaveData = await leaveTypesDetails.findOne()
    const getAllData = await leaveApplyDetails.findAll({ where: { employee_id: employeeId } });
    let taken_total_leave = 0;
    let remaining_leave = 0;
    let extra_leave = 0;
    if (getAllData) {
      for (let i = 0; i < getAllData.length; i++) {
        if (getAllData[i].leave_apply_status === 'APPROVED') {
          taken_total_leave += getAllData[i].leave_count
        }
      }
      if (taken_total_leave > leaveData.leave_in_month) {
        extra_leave = taken_total_leave - leaveData.leave_in_month
        remaining_leave = 0;
      } else {
        remaining_leave = leaveData.leave_in_month - taken_total_leave
      }
      let sendBody = {
        remaining_leave,
        extra_leave,
        taken_total_leave,
        leave_in_month: leaveData.leave_in_month,
        leave_type: leaveData.leave_type
      }
      return res.status(200).send({ code: 200, message: "Fetch Data employee Attendance Successfully!", data: sendBody });
    } else {
      let sendBody = {
        remaining_leave,
        extra_leave,
        taken_total_leave,
        leave_in_month: leaveData.leave_in_month + leaveData.leave_in_month,
        leave_type: leaveData.leave_type
      }
      return res.status(200).send({ code: 200, message: "Fetch Data employee Attendance Successfully!", data: sendBody });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  };
};

/////////////// Get All Employee Attendance ///////////////

exports.get_All_Employee_Attendance = async (req, res) => {
  try {
    const getAllData = await leaveApplyDetails.findAll({
      where: { leave_apply_status: "APPROVED" },
      attributes: ["employee_id", "applier_name", "leave_count", "leave_type", "start_date", "end_date"]
    });
    if (getAllData) {
      return res.status(200).send({ code: 200, message: "Fetch All Employee Attendance Data Successfully!", data: getAllData });
    } else {
      return res.status(404).send({ code: 404, message: "Record Not Found!" });
    };
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};


/////////////// Employee Attendance ///////////////

// exports.employee_Attendance = async (req, res) => {
//   try {
//     const employeeId = req.params.employee_id;
//     const leave_Apply = await leaveApplyDetails.findAll(req.body.start_date, { where: { employee_id: employeeId } });

//     if (leave_Apply) {
//       return res.status(200).send({ code: 200, message: "Fetch All Data Successfully!", data: leave_Apply });
//     } else {
//       return res.status(404).send({ code: 404, message: "Record Not Found" });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ code: 500, message: "Server Error" });
//   }
// };

/////////////// Total Attendance By Employee ///////////////

// exports.total_Attendance_By_Employee = async (req, res) => {
//   try {
//     const employeeId = req.params.employee_id
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ code: 500, message: "Server Error" });
//   }
// };
