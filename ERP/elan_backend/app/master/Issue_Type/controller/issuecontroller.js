const db = require("../../../models/index");
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const logger = require('../../../../logger/index');
const fs = require('fs');
const path = require('path');
const issueMaster = db.issueMaster;

exports.create_issueType = async (req, res) => {
    try {
        const { issue_Type, entity_id, financial_year_id } = req.body;
        const IssueData = await issueMaster.findOne({ where: { issue_type: issue_Type, isDeleted: false, status:'ACTIVE' } });
        if (IssueData) {
            return res.status(201).send({ code: 201, message: "Issue Type is Already Exits!" });
        }
        const issue_code = btoa(Math.random()).slice(0, 10).toUpperCase();
        const response = await issueMaster.create({
            issue_type: issue_Type, entity_id, financial_year_id,
            issue_code: issue_code
        });
        return res.status(200).send({ code: 200, message: "Issue created successfully", data: response })
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.getAll_IssueType = async (req, res) => {
    const { entity_id, financial_year_id } = req.query;
    try {

        if (entity_id & financial_year_id) {
            let [getAllIssue] = await db.sequelize.query(`select * from MASTER_ISSUE where entity_id=${entity_id} and financial_year_id=${financial_year_id} and isDeleted=0 and status='ACTIVE' order by id desc`);
            return res.status(200).send({ code: 200, message: "Issue fetch successfully", data: getAllIssue })
        }
        else {
            return res.status(201).send({ code: 200, message: "Id not found!", data: [] })
        }

    }
    catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.Issue_changeStatus = async (req, res) => {
    const { id, status, isDeleted } = req.body
    try {
        if (id) {
            const response = await issueMaster.update(
                {
                    status: status,
                    isDeleted: isDeleted,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );

            return res.status(200).send({ code: 200, message: "Issue status Updated successfully", data: response })
        }
        else {
            return res.status(201).send({ code: 200, message: "data  not found!", data: [] })
        }
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.getIssueby_Id = async (req, res) => {
    const { id } = req.query;
    try {
        if (id) {
            let [data] = await db.sequelize.query(
                `Select * from MASTER_ISSUE where id=${id}`
            )
            return res.status(200).send({ code: 200, message: "Issue get successfully", data: data })
        }
        else {
            return res.status(201).send({ code: 200, message: "Id  not found!", data: [] })
        }
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}

exports.update_Issue = async (req, res) => {
    const { issue_Type, entity_id, financial_year_id } = req.body;
    const { id } = req.query;
    try {
        const IssueData = await issueMaster.findOne({ where: { issue_type: issue_Type, isDeleted: false, status: 'ACTIVE' } });
        if (IssueData) {
            return res.status(201).send({ code: 201, message: "Issue Type is Already Exits!" });
        }
        if (id) {
            const response = await issueMaster.update(
                {
                    issue_type: issue_Type,
                    entity_id: entity_id,
                    financial_year_id: financial_year_id,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );
            return res.status(200).send({ code: 200, message: "Issue Update successfully", data: response })
        }
        else {
            return res.status(201).send({ code: 200, message: "Id  not found!", data: [] })
        }
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}
exports.getActive_IssueType = async (req, res) => {
    const { entity_id, financial_year_id } = req.query;
    try {

        if (entity_id & financial_year_id) {
            let [getAllIssue] = await db.sequelize.query(`select * from MASTER_ISSUE where entity_id=${entity_id} and financial_year_id=${financial_year_id} and isDeleted=0 and status='ACTIVE'`);
            return res.status(200).send({ code: 200, message: "Issue fetch successfully", data: getAllIssue })
        }
        else {
            return res.status(201).send({ code: 200, message: "Id not found!", data: [] })
        }

    }
    catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.error("Error:", error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }
}