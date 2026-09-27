const { where } = require('sequelize');
const db = require('../../../models/index')

module.exports.createOrUpdateGratuity = async (req, res) => {
  const { maximum_limit, assumed_work_days, assumed_total_days } = req.body;

  if (
    maximum_limit == null ||
    assumed_work_days == null ||
    assumed_total_days == null
  ) {
    return res.status(400).send({
      code: 400,
      message: "maximum_limit, assumed_work_days and assumed_total_days are required!"
    });
  }

  try {

    const existing = await db.gratuity.findOne();

    if (existing) {

      await db.gratuity.update(
        { maximum_limit, assumed_work_days, assumed_total_days },
        { where: { id: existing.id } }
      );

      return res.status(200).send({
        code: 200,
        message: "Gratuity record updated codefully!",
      });
    } else {
      const data = await db.gratuity.create({
        maximum_limit,
        assumed_work_days,
        assumed_total_days
      });

      return res.status(200).send({
        code: 200,
        message: "Gratuity record created codefully!",
        data
      });
    }

  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal server error!"
    });
  }
};


module.exports.getAllGratuity = async (req, res) => {
  try {
    const data = await db.gratuity.findAll({
      where: {
        isDeleted: false
      }
    })
    return res.status(200).send({ code: 200, message: "All Data fetched codefully", data })
  } catch (error) {
    return res.status(500).send({ message: error.message || "Internal server error" })
  }
}



// function getServiceYears(startDate, exitDate) {
//   const start = new Date(startDate);
//   const end = new Date(exitDate);

//   let years = end.getFullYear() - start.getFullYear();
//   const m = end.getMonth() - start.getMonth();
//   if (m < 0 || (m === 0 && end.getDate() < start.getDate())) {
//     years--;
//   }
//   return years;
// }

// exports.calculateGratuity = async (req, res) => {
//   try {
//     const { employee_id, exit_date } = req.body;

//     if (!employee_id || !exit_date) {
//       return res.status(400).send({ code: 400, message: 'Employee ID and exit date required!' });
//     }
//     const employee = await db.user.findByPk(employee_id);
//     if (!employee) {
//       return res.status(404).send({ code: 404, message: 'Employee not found!' });
//     }

//     const complaince = await db.complaince_setting.findOne({
//       where: { employee_id }
//     });

  
//     if (!complaince || !complaince.gratuity_employer ) {
//       return res.status(200).send({
//         code: 200,
//         message: 'Gratuity not applicable for this employee as per compliance settings!',
//         data: { gratuity: 0 }
//       });
//     }

//     const settings = await db.gratuity.findOne({
//       where:{isDeleted:false , status:'ACTIVE'}
//     });
//     if (!settings) {
//       return res.status(500).send({ code: 500, message: 'Gratuity not configured!' });
//     }

//     const serviceYears = getServiceYears(employee.emp_join_date, exit_date);
//     if (serviceYears < 5) {
//       return res.status(200).send({
//         code: 200,
//         message: 'Gratuity not applicable (minimum 5 years service required)!',
//         data: { gratuity: 0, serviceYears }
//       });
//     }

//     const [result] = await db.sequelize.query(
//       `
//       SELECT 
//       COALESCE(SUM(ecl.monthlyBasic), 0) AS monthlyBasicTotal
//   FROM HRMS_EMPLOYEE_PAY_SALARY h
//   JOIN send_TABLE(
//       CAST(send_UNQUOTE(h.earningComponentList) AS send),
//       '$[*]' COLUMNS (
//           id INT PATH '$.id',
//           monthlyBasic DECIMAL(15,2) PATH '$.monthlyBasic'
//       )
//   ) AS ecl
//   JOIN PAYROLL_SLRYCOMPONENT_EARNING pe
//     ON pe.id = ecl.id
//   WHERE h.employee_id = :employee_id
//     AND pe.gratuity = 1;
//   `,
//       {
//         replacements: { employee_id },
//         type: db.Sequelize.QueryTypes.SELECT,
//       }
//     );


//     if (!result || !result.monthlyBasicTotal) {
//       return res.status(200).send({
//         code: 200,
//         message: "No gratuity eligible earning component found !",
//         data: { gratuity: 0, serviceYears }
//       });
//     }

//     const monthlyBasic = parseFloat(result.monthlyBasicTotal);

//     let totalGratuity =
//       monthlyBasic * settings.assumed_work_days *
//       (serviceYears / settings.assumed_total_days);

    
//     if (settings.maximum_limit) {
//       gratuity = Math.min(totalGratuity, parseFloat(settings.maximum_limit));
//     } else {
//       gratuity = totalGratuity;
//     }

//     return res.status(200).send({
//       code: 200,
//       message: 'Gratuity calculated codefully!',
//       data: { gratuity, totalGratuity, serviceYears, monthlyBasic, maximum_limit: settings.maximum_limit }
//     });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).send({
//       code: 500,
//       message: err.message || 'Internal server error!'
//     });
//   }
// };



function getServiceYears(joinDate, exitDate) {
  const start = new Date(joinDate);
  const end = new Date(exitDate);
  const diffTime = end - start;
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365); // approximate
  return diffYears;
}


exports.calculateGratuity = async (req, res) => {
  try {
    const { employee_id, exit_date } = req.body;

    if (!employee_id || !exit_date) {
      return res.status(400).send({ code: 400, message: 'Employee ID and exit date required!' });
    }

    
    const employee = await db.user.findByPk(employee_id);
    if (!employee) {
      return res.status(404).send({ code: 404, message: 'Employee not found!' });
    }

   
    const compliance = await db.complaince_setting.findOne({ where: { employee_id } });
    if (!compliance || parseInt(!compliance.gratuity_employer)) {
      return res.status(200).send({
        code: 200,
        message: 'Gratuity not applicable for this employee as per compliance settings!',
        data: { gratuity: 0 }
      });
    }

    
    const settings = await db.gratuity.findOne({
      where: { isDeleted: false, status: 'ACTIVE' }
    });
    if (!settings) {
      return res.status(500).send({ code: 500, message: 'Gratuity settings not found!' });
    }

   
    const serviceYearsRaw = getServiceYears(employee.emp_join_date, exit_date);
    const serviceYears = Math.round(serviceYearsRaw);

    if (serviceYears < 5) {
      return res.status(200).send({
        code: 200,
        message: 'Gratuity not applicable (minimum 5 years service required)!',
        data: { gratuity: 0, serviceYears }
      });
    }

    
    const [result] = await db.sequelize.query(
      `
      SELECT COALESCE(SUM(ecl.monthlyBasic), 0) AS monthlyBasicTotal
      FROM HRMS_EMPLOYEE_PAY_SALARY h
      JOIN JSON_TABLE(
          CAST(JSON_UNQUOTE(h.earningComponentList) AS JSON),
          '$[*]' COLUMNS (
              id INT PATH '$.id',
              monthlyBasic DECIMAL(15,2) PATH '$.monthlyBasic'
          )
      ) AS ecl
      JOIN PAYROLL_SLRYCOMPONENT_EARNING pe
        ON pe.id = ecl.id
      WHERE h.employee_id = :employee_id
        AND pe.gratuity = 1;
      `,
      {
        replacements: { employee_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    const monthlyBasic = parseFloat(result.monthlyBasicTotal || 0);
    if (monthlyBasic === 0) {
      return res.status(200).send({
        code: 200,
        message: "No gratuity eligible earning component found!",
        data: { gratuity: 0, serviceYears }
      });
    }

   
    let totalGratuity = monthlyBasic * settings.assumed_work_days * (serviceYears / settings.assumed_total_days);
    totalGratuity = parseFloat(totalGratuity.toFixed(2));
  
    let gratuity;
    if (settings.maximum_limit) {
      gratuity = Math.min(totalGratuity, parseFloat(settings.maximum_limit));
    } else {
      gratuity = totalGratuity;
    }
    return res.status(200).send({
      code: 200,
      message: 'Gratuity calculated successfully!',
      data: {
        gratuity,
        totalGratuity,
        serviceYears,
        monthlyBasic,
        maximum_limit: settings.maximum_limit
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).send({
      code: 500,
      message: err.message || 'Internal server error!'
    });
  }
};




