const { attribute } = require('@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js')
const db = require('../../../models/index')
const moment = require('moment')
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const axios = require('axios');
const { sendDynamicMail } = require('../../../Recruitment/utils/mail/mail')
const logger = require('../../../../logger/index');

exports.createTimeSheet = async (req, res) => {
    try {
        const { employee_id, project_id, task_id, timesheet_date, start_time, end_time, total_hour, timesheet_type,remarks } = req.body;

        if (!employee_id || !project_id || !task_id || !timesheet_date || !start_time || !end_time || !total_hour) {
            return res.status(400).send({
                code: 400,
                message: 'All fields are required.'
            });
        }
        const count = await db.timeSheet_request.count();
        const newRequestId = `REQ${(count + 1).toString().padStart(3, '0')}`;

        const newTimeSheet = await db.timeSheet_request.create({
            timesheet_request_code: newRequestId, 
            employee_id,
            project_id,
            task_id,
            timesheet_date,
            start_time,
            end_time,
            total_hour,
            timesheet_type: timesheet_type || "NON-BILLABLE", 
            timesheet_approval_status:"PENDING",
            remarks
        });
        return res.status(201).send({
            code: 201,
            message: 'Timesheet created successfully.',
            data: newTimeSheet
        });
    } catch (error) {
        logger.error(`Error creating timesheet: ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({
            code: 500,
            message: error.message || 'Server Error'
        });
    }
};

exports.getAllProjectsForUser = async(req,res) =>{
    try{
        const{login_id} =req.params
        const projects = await db.taskManagementList.findAll({
            where:{
                assigned_to:login_id
            }
        })
        const projectIds=projects.map(data=>data.project_id);
        const projectNames =await db.projectList.findAll({
            attributes:["id","project_name"],
            where:{
                id:projectIds
            }
        })
        return res.status(201).send({
            code: 201,
            message: 'Project Names Fetched successfully.',
            data: projectNames
        });

       } catch (error) {
        logger.error(`Error creating timesheet: ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({
            code: 500,
            message: error.message || 'Server Error'
        });
    }
}


exports.getAllTasksForUser = async(req,res) =>{
    try{
        const{project_id,assigned_to} =req.params
        const allTasks = await db.taskManagementList.findAll({
            attributes:["id","project_id","task_name"],
            where:{
                project_id:project_id,
                assigned_to:assigned_to
            }
        })
       
        return res.status(201).send({
            code: 201,
            message: 'Project Names Fetched successfully.',
            data: allTasks
        });

       } catch (error) {
        logger.error(`Error creating timesheet: ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({
            code: 500,
            message: error.message || 'Server Error'
        });
    }
}

exports.getTimesheetDataonMonth = async (req, res) => {
    try {
        let { employee_id } = req.params;
        let { month_id, start_date, end_date} = req.body;
        month_id = parseInt(month_id);
        const startMonth = new Date(start_date).getMonth() + 1;
        
        const endMonth = new Date(end_date).getMonth() + 1;
        
        if (month_id !== startMonth || month_id !== endMonth) {
            return res.status(400).send({
                code: 400,
                message: "Provided month_id does not match the month of start_date or end_date."
            });
        }

        const timesheetData = await db.timeSheet_request.findAll({
            where: {
                timesheet_date: {
                    [db.Sequelize.Op.between]: [start_date, end_date]  ,
                    
                },
                employee_id:employee_id
            }
        });

        if (timesheetData.length === 0) {
            return res.status(404).send({
                code: 404,
                message: "No timesheet data found for the given month and date range."
            });
        }

        let billable_total_hours = 0;
        let non_billable_total_hours = 0;
        let totalHours =0

        timesheetData.forEach((timesheet) => {
            const total_hour = timesheet.total_hour ? parseFloat(timesheet.total_hour) : 0;
            if (timesheet.timesheet_type === "BILLABLE" && timesheet.timesheet_approval_status==="APPROVED") {
                billable_total_hours += total_hour;
            } else if (timesheet.timesheet_type === "NON-BILLABLE" && timesheet.timesheet_approval_status==="APPROVED") {
                non_billable_total_hours += total_hour;
            }
        });

        totalHours =(billable_total_hours+non_billable_total_hours).toFixed(2)

        res.status(200).send({
            code: 200,
            message: "Timesheet data fetched successfully",
            data: {
                billable_total_hours: billable_total_hours.toFixed(2),  
                non_billable_total_hours: non_billable_total_hours.toFixed(2) ,
                totalHours 
            }
        });

    } catch (error) {
        logger.error(`Error fetching timesheet data: ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({
            code: 500,
            message: error.message || 'Server Error'
        });
    }
};



