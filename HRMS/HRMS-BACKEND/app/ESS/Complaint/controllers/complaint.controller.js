const db = require("../../../models/index");
const User = db.user;
const complaintDetails = db.complaint;


/////////////// Create Complaint ///////////////

exports.createComplaint = async (req, res) => {
    try {
        const { created_by, dept_id, area_id, complaint_description, 
            employee_id, type, upload_files, complaint_type_id ,entity_id,financial_year_id} = req.body;
            const emp_Variable = "COMPLAINT";
           
            const lastEntry = await complaintDetails.findOne({
              where: { status: "ACTIVE" },
              order: [["createdAt", "DESC"]],
            });
            let number = 1;
            if (lastEntry) {
              const lastNumber = parseInt(lastEntry?.complaint_code.slice(-5), 10);
              if (!isNaN(lastNumber)) {
                number = lastNumber + 1;
              }
            }
            const code = String(number).padStart(5, "0");
            const employeeCode = `${emp_Variable}${code}`;
        const response = await complaintDetails.create({
            created_by,
            dept_id,
            area_id,
            complaint_type_id,
            complaint_description,
            employee_id,
            type,
            entity_id,
            financial_year_id,
            complaint_code:employeeCode
        });

        if (response && Array.isArray(upload_files) && upload_files.length > 0) {
            await Promise.all(
                upload_files.map(async (file) => {
                    return db.complaint_doc.create({
                        complaint_id: response.complaint_id,
                        file_name: file?.url
                    });
                })
            );
        }

        return res.status(200).json({ code: 200, message: "Complaint Created Successfully", data: response });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ code: 500, message: "Server Error" });
    }
};


/////////////// Edit Complaint ///////////////

exports.editComplaint = async (req, res) => {
    try {
        const complaintId = req.params.id;
        const { hr_remark, allocate_emp_id, allocate_dept_id,type ,
            status,comment_Evaluator,assign_to,upload_files,reply_remark} = req.body;

        const complaintData = await complaintDetails.findOne({ where: { complaint_id: complaintId } });

        if (!complaintData) {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
      if(type=='DEPARTMENT'){
        await complaintDetails.update(
            {
                hr_remark,
                allocate_emp_id:assign_to??allocate_emp_id,
                allocate_dept_id,
                complain_status: status,
                comment_Evaluator
            },
            { where: { complaint_id: complaintId } }
        );
      }
      if(type=='USER'){
        await complaintDetails.update(
            {
                reply_remark,
                upload_user_file:upload_files?.[0]?.url,
                complain_status:status

            },
            { where: { complaint_id: complaintId } }
        );
    
      }
       

        return res.status(200).send({ code: 200, message: "Complaint Updated Successfully" });

    } catch (error) {
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};


/////////////// Get By Id Complaint ///////////////

exports.getByIdComplaint = async (req, res) => {
    try {
        const complaintId = req.params.id;
        const getComplaint = await complaintDetails.findOne({ where: { complaint_id: complaintId } });
        if (getComplaint) {
            return res.status(200).send({ code: 200, message: "Fetch Data Successfully", data: getComplaint });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Gett All Complaint ///////////////

exports.getAllComplaint = async (req, res) => {
    try {
        const{entity_id,financial_year_id}=req.query;
        if(!entity_id || !financial_year_id){
            return res.status(403).send({ code: 403, message: "id Not Found" });
        }
        let [getAllData]=await db.sequelize.query(`
           SELECT EC.complaint_id, EC.createdAt,EC.complain_status,EC.complaint_code,EC.type,
            CONCAT(HRU.first_name, ' ', HRU.last_name) AS full_name,HRU.employee_code,MD.department_name,
            CONCAT(HR.first_name, ' ', HR.last_name) AS employee_name
            FROM ESS_COMPLAINT AS EC LEFT JOIN MASTER_DEPARTMENT AS MD
            ON EC.dept_id=MD.dept_id INNER JOIN HRMS_REGISTERED_USER AS HRU ON
            EC.created_by=HRU.employee_id LEFT JOIN HRMS_REGISTERED_USER AS HR ON
            EC.employee_id=HR.employee_id
            WHERE EC.entity_id=${entity_id} AND EC.financial_year_id=${financial_year_id}`)
        if (getAllData) {
            getAllData.sort().reverse()
            return res.status(200).send({ code: 200, message: "Fetch All Complaint Data Successfully", data: getAllData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

exports.getAllMyComplaint = async (req, res) => {
    try {
        const { entity_id, financial_year_id, employee_id } = req.query;
        if (!entity_id || !financial_year_id) {
            return res.status(403).send({ code: 403, message: "id Not Found" });
        }
        let [emp_data]=await db.sequelize.query(`
            SELECT HRU.role_master_name FROM HRMS_REGISTERED_USER AS HRU WHERE HRU.employee_id=${employee_id}`);
         if(emp_data[0]?.role_master_name=='Super Admin'){
            let [getAllData] = await db.sequelize.query(`
                SELECT EC.complaint_id, EC.createdAt,EC.complain_status,EC.complaint_code,EC.type,
                 CONCAT(HRU.first_name, ' ', HRU.last_name) AS full_name,HRU.employee_code,MD.department_name,
                 CONCAT(HR.first_name, ' ', HR.last_name) AS employee_name
                 FROM ESS_COMPLAINT AS EC LEFT JOIN MASTER_DEPARTMENT AS MD
                 ON EC.dept_id=MD.dept_id INNER JOIN HRMS_REGISTERED_USER AS HRU ON
                 EC.created_by=HRU.employee_id LEFT JOIN HRMS_REGISTERED_USER AS HR ON
                 EC.employee_id=HR.employee_id
                 WHERE EC.entity_id=${entity_id} AND EC.financial_year_id=${financial_year_id}`)
             if (getAllData) {
                 getAllData.sort().reverse()
                 return res.status(200).send({ code: 200, message: "Fetch All Complaint Data Successfully", data: getAllData });
             } else {
                 return res.status(403).send({ code: 403, message: "Record Not Found" });
             };
         }
         else{
            let [getAllData] = await db.sequelize.query(`
                SELECT EC.complaint_id, EC.createdAt,EC.complain_status,EC.complaint_code,EC.type,
                 CONCAT(HRU.first_name, ' ', HRU.last_name) AS full_name,HRU.employee_code,MD.department_name,
                 CONCAT(HR.first_name, ' ', HR.last_name) AS employee_name
                 FROM ESS_COMPLAINT AS EC LEFT JOIN MASTER_DEPARTMENT AS MD
                 ON EC.dept_id=MD.dept_id INNER JOIN HRMS_REGISTERED_USER AS HRU ON
                 EC.created_by=HRU.employee_id LEFT JOIN HRMS_REGISTERED_USER AS HR ON
                 EC.employee_id=HR.employee_id
                 WHERE EC.entity_id=${entity_id} AND EC.financial_year_id=${financial_year_id} AND EC.created_by = ${employee_id}`)
             if (getAllData) {
                 getAllData.sort().reverse()
                 return res.status(200).send({ code: 200, message: "Fetch All Complaint Data Successfully", data: getAllData });
             } else {
                 return res.status(403).send({ code: 403, message: "Record Not Found" });
             };
         }
       
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};
exports.getAll_against_complaint = async (req, res) => {
    try {
        const{emp_id}=req.query;
        if(!emp_id){
            return res.status(403).send({ code: 403, message: "id Not Found" });
        }
        let [getAllData]=await db.sequelize.query(`
           SELECT EC.complaint_id, EC.createdAt,EC.complain_status,EC.complaint_code,EC.type,
            CONCAT(HRU.first_name, ' ', HRU.last_name) AS full_name,HRU.employee_code,MD.department_name,
            CONCAT(HR.first_name, ' ', HR.last_name) AS employee_name
            FROM ESS_COMPLAINT AS EC LEFT JOIN MASTER_DEPARTMENT AS MD
            ON EC.dept_id=MD.dept_id INNER JOIN HRMS_REGISTERED_USER AS HRU ON
            EC.created_by=HRU.employee_id LEFT JOIN HRMS_REGISTERED_USER AS HR ON
            EC.employee_id=HR.employee_id
            WHERE EC.employee_id=${emp_id}`)
        if (getAllData) {
            getAllData.sort().reverse()
            return res.status(200).send({ code: 200, message: "Fetch All Complaint Data Successfully", data: getAllData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};
exports.getAll_assigned_complaint = async (req, res) => {
    try {
        const{emp_id}=req.query;
        if(!emp_id){
            return res.status(403).send({ code: 403, message: "id Not Found" });
        }
        let [getAllData]=await db.sequelize.query(`
           SELECT EC.complaint_id, EC.createdAt,EC.complain_status,EC.complaint_code,EC.type,
            CONCAT(HRU.first_name, ' ', HRU.last_name) AS full_name,HRU.employee_code,MD.department_name,
            CONCAT(HR.first_name, ' ', HR.last_name) AS employee_name
            FROM ESS_COMPLAINT AS EC LEFT JOIN MASTER_DEPARTMENT AS MD
            ON EC.dept_id=MD.dept_id INNER JOIN HRMS_REGISTERED_USER AS HRU ON
            EC.created_by=HRU.employee_id LEFT JOIN HRMS_REGISTERED_USER AS HR ON
            EC.employee_id=HR.employee_id
            WHERE EC.allocate_emp_id=${emp_id}`)
        if (getAllData) {
            getAllData.sort().reverse()
            return res.status(200).send({ code: 200, message: "Fetch All Complaint Data Successfully", data: getAllData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};



exports.getByIdAllComplaint = async (req, res) => {
    
    try {
         const id = req.params.id;
        const [getAllData] =await db.sequelize.query(`
            select * from ESS_COMPLAINT where complaint_id=${id}`) 
        if (getAllData) {
            let all_Docs=await db.complaint_doc.findAll({where:{complaint_id:id}});
            getAllData.sort().reverse()

            return res.status(200).send({ code: 200, message: "Fetch All Complaint Data Successfully", data: getAllData,docs:all_Docs });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message||"Server Error" });
    };
};


exports.getcomplaintuser = async (req, res) => {
    try {
        const id = req.params.id;

        var employeeDetail = await User.findOne({
            where: { employee_id: id },
            include: [{
                model: db.department, 
                required: true, 
                attributes: ['department_name'],  
            }]
        });

        if (!employeeDetail) {
            return res.status(404).send({ code: 404, message: "Employee not found" });
        }

        const departmentName = employeeDetail.department ? employeeDetail.department.department_name : null;

        return res.status(200).send({
            code: 200,
            message: "Employee details retrieved successfully",
            data: {
                employee: employeeDetail,
                department_name: departmentName  
            }
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};



/////////////// Delete Complaint ///////////////

exports.deleteComplaint = async (req, res) => {
    try {
        const complaintId = req.params.id;
        const deleteData = await complaintDetails.findOne({ where: { complaint_id: complaintId } })
        if (deleteData) {
            const updateStatus = await complaintDetails.update({ status: "INACTIVE" }, { where: { complaint_id: complaintId } })
            return res.status(200).send({ code: 200, message: "Complaint Data is Deleted Successfully!", data: updateStatus })
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};
exports.getall_employeeby_dept_id = async (req, res) => {
    try {
        const id = req.params.id;
        const [data] = await db.sequelize.query(`
            SELECT HRU.employee_id,HRU.employee_code,HRU.first_name,HRU.last_name 
       FROM HRMS_REGISTERED_USER AS HRU WHERE HRU.department_id=${id}`)
        if (data) {
            return res.status(200).send({ code: 200, message: "Complaint Data is Deleted Successfully!", data    })
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};