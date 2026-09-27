const db = require('../../../models/index')
const { Op } = require('sequelize');
const Assessment = db.assessment
const departMentAssessment = db.department_Assessment
const { QueryTypes } = require('sequelize');

exports.createAssessment = async (req, res) => {
    try {
        const {
            assessment_name,
            start_date,
            assessment_degree,
            end_date,
            filter_fy,
            entity_id,
            employee_id,
            financial_year_id,
            dept_id,
            employee
        } = req.body;
        const existingAssessment = await Assessment.findOne({
            where: {
                entity_id: entity_id,
                filter_fy: filter_fy,
                employee_id: employee_id,
                financial_year_id: financial_year_id,
                assessment_name: assessment_name,
                dept_id: dept_id,
                isDeleted: false
            }
        });

        if (existingAssessment) {
            return res.status(403).send({ code: 404, message: "Assessment Already Exists" });
        } else {

            const newAssessment = await Assessment.create({
                assessment_name,
                entity_id,
                financial_year_id,
                filter_fy,
                employee_id,
                assessment_degree,
                start_date,
                end_date,
                dept_id
            });

            const deptAssignments = await Promise.all(
                employee.map(async (empId) => {
                    return departMentAssessment.create({
                        dept_id: dept_id,
                        employee_id: empId,
                        yearly_assessment_id: newAssessment.id
                    });
                })
            );

            console.log("New Department Assignments Created:", deptAssignments);
            return res.status(200).send({
                code: 200,
                message: "Assessment Created and Department Assigned",
                data: newAssessment,
            });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};


exports.getAll_Assessment = async (req, res) => {
    try {
        const entity_id = req.params.id;
        const { filter_fy } = req.query;
        const query = `
        SELECT 
            YA.assessment_name,
            YA.start_date,
            YA.end_date,
            YA.assessment_degree,
            YA.id,
            YA.financial_year_id,
            MFY.financial_year,
            PMD.dept_id,
            PMD.employee_id,
            HRU.employee_id AS hrms_employee_id,
            HRU.first_name,
            HRU.middle_name,
            HRU.last_name,
            HRU.employee_code
        FROM 
            PM_YEARLY_ASSESSMENT_SETUP AS YA
        LEFT JOIN 
            MASTER_FINANCIAL_YEAR AS MFY ON YA.financial_year_id = MFY.id
        JOIN 
            PM_YEARLY_ASSESSMENT_DEPARTMENT AS PMD ON YA.id = PMD.yearly_assessment_id
        JOIN 
            HRMS_REGISTERED_USER AS HRU ON PMD.employee_id = HRU.employee_id 
            AND JSON_CONTAINS(PMD.dept_id, CAST(HRU.department_id AS JSON))
        WHERE 
            YA.entity_id = ${entity_id}
            AND YA.filter_fy = ${filter_fy}
            AND YA.isDeleted = false
        ORDER BY YA.id DESC
        `;
        const getAllData = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT
        });

        if (getAllData.length > 0) {
            const departments = {};
            getAllData.forEach(item => {
                const {
                    dept_id,
                    id,
                    employee_id,
                    first_name,
                    middle_name,
                    last_name,
                    employee_code,
                    assessment_name,
                    start_date,
                    end_date,
                    assessment_degree,
                    financial_year,
                    financial_year_id
                } = item;
                if (!departments[id]) {
                    departments[id] = {
                        dept_id,
                        assessment_name,
                        id,
                        start_date,
                        end_date,
                        assessment_degree,
                        financial_year,
                        financial_year_id,
                        employees: []
                    };
                }
                departments[id].employees.push({
                    employee_id,
                    first_name,
                    middle_name,
                    last_name,
                    employee_code,
                    id
                });
            });
            const formattedData = Object.values(departments);
            return res.status(200).send({
                code: 200,
                message: "All Data Get",
                data: formattedData
            });
        } else {
            return res.status(404).send({ code: 404, message: "Records not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
};


exports.getAssessmentById = async (req, res) => {
    const assessmentId = req.params.id;
    try {
        const assessment = await Assessment.findOne({ where: { id: assessmentId, isDeleted: false } });
        if (!assessment) {
            return res.status(404).send({ code: 404, message: "Assessment not found" });
        }
        return res.status(200).send({ code: 200, message: "Assessment found", data: assessment });
    } catch (error) {

        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.updateAssessmentById = async (req, res) => {
    const assessmentId = req.params.id;
    const { assessment_name, assessment_degree, financial_year_id, start_date, end_date, employee, dept_id } = req.body;
    try {
        let assessment = await Assessment.findOne({ where: { id: assessmentId, isDeleted: false } });

        if (!assessment) {
            return res.status(404).send({ code: 404, message: "Assessment Record not found" });
        }
        const existingAssessments = await Assessment.findAll({
            where: {
                assessment_name: assessment_name,
                financial_year_id: financial_year_id,
                isDeleted: false,
                id: { [Op.not]: assessmentId }
            }
        });

        if (existingAssessments.length > 0) {
            return res.status(409).send({ code: 409, data: existingAssessments, message: "Yearly Assessment Already Exist" });
        }
        const updatedAssessment = await Assessment.update({
            assessment_name: assessment_name,
            assessment_degree: assessment_degree,
            financial_year_id: financial_year_id,
            start_date: start_date,
            end_date: end_date,
        }, {
            where: {
                id: assessmentId,
                isDeleted: false
            }
        });
        if (updatedAssessment) {
            if (employee && Array.isArray(employee) && employee.length > 0) {
                let validAssessmentId = parseInt(assessmentId);
                await departMentAssessment.destroy({
                    where: { yearly_assessment_id: validAssessmentId },
                });
                const employeeRecords = employee.map((empId) => ({
                    yearly_assessment_id: assessmentId,
                    dept_id: dept_id,
                    employee_id: empId,
                }));
                await departMentAssessment.bulkCreate(employeeRecords);
                console.log("New employee records inserted.");
            }

            return res.status(200).send({ code: 200, message: "Assessment updated successfully", data: updatedAssessment });
        } else {
            return res.status(501).send({ code: 501, message: "Assessment not able to update!", data: updatedAssessment });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Internal Server Error" });
    }
};

exports.deleteAssessmentById = async (req, res) => {
    try {
        const assessmentId = req.params.id
        const dltStage = await Assessment.findOne({ where: { id: assessmentId } });
        if (dltStage) {
            const deleteData = await Assessment.update({ isDeleted: true }, { where: { id: assessmentId } });
            await db.department_Assessment.update({ isDeleted: true }, { where: { yearly_assessment_id: assessmentId } });
            return res.status(200).send({ code: 200, message: "Data Deleted Successfully!", data: deleteData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {

        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


exports.get_Assessment_financeYear = async (req, res) => {
    try {

        const getAllData = await db.financial_year.findAll({ where: { isDeleted: false } });
        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "All Data Get", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Records not found" });
        }
    } catch (error) {

        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.YrAssessmentStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const getData = await Assessment.findOne({
            where: {
                id: id,
                isDeleted: false
            }
        });
        if (getData) {
            const updated = await Assessment.update(
                { status },
                { where: { id: id } }
            );
            return res.status(200).send({
                code: 200,
                message: " Status Change Successfully!",
            });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {

        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }


}

exports.departMentSelected = async (req, res) => {
    const { entity_id } = req.query;

    try {
        const departmentsQuery = `
        SELECT * 
        FROM MASTER_DEPARTMENT 
        WHERE entity_id = :entity_id;
      `;
        const departments = await db.sequelize.query(departmentsQuery, {
            replacements: { entity_id },
            type: db.sequelize.QueryTypes.SELECT,
        });
        const employeesQuery = `
        SELECT 
          hru.employee_id, 
          hru.first_name, 
          hru.middle_name, 
          hru.last_name,
          md.dept_id,
          md.department_name  
        FROM HRMS_REGISTERED_USER AS hru
        JOIN MASTER_DEPARTMENT AS md
        ON hru.department_id = md.dept_id;
      `;
        const employees = await db.sequelize.query(employeesQuery, {
            type: db.sequelize.QueryTypes.SELECT,
        });

        return res.status(200).send({
            code: 200,
            message: 'Departments and employees fetched successfully',
            data: {
                departments,
                employees,
            },
        });
    } catch (error) {
        console.error("Error in departMentSelected:", error);
        return res.status(500).send({
            code: 500,
            message: error.message || 'Server error',
        });
    }
};







