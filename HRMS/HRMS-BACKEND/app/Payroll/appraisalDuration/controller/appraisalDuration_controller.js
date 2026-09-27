const db = require("../../../models/index");

const appraisalDuration = db.appraisalDuration;
const { Op } = require('sequelize');

/////////////// Create appraisal Duration ///////////////

exports.createApprisalDuration = async (req, res) => {
    try {
        const { period, effective_after } = req.body;

            let isExist = await appraisalDuration.findOne({where: {period, effective_after, isDeleted: false}})
            if(isExist) {
               return res.status(400).send({code: 400, message: "Appraisal data already exist!" }) 
            }

            await appraisalDuration.update(
                { status: 'Inactive'},
                { where: {} }
            );

            const response = await appraisalDuration.create({
                period, effective_after
            });
            return res.status(200).send({code: 200, message: "Appraisal Duration Created Successfully", data: response })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message||"Server Error" });
    };
};


///////////// get Appraisal Duration  //////////

exports.getAllAppraisalDuration = async (req, res) => {
    try {
        const getAllData = await appraisalDuration.findAll({
            where:{
                isDeleted: false 
            }
        });

        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetch All Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};


//////////// get By Appraisal Duration  ///////// 

exports.getByIdAppraisalDuration = async (req, res) => {
    try {
        const id = req.params.id;
        const getappraisalDuration = await appraisalDuration.findOne({ where: { id:id } });
        if (getappraisalDuration) {
            return res.status(200).send({ code: 200, message: "Fetch Data Successfully", data: getappraisalDuration });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


///////////  edit Apprisal Duration  ////////////// 

exports.editAppraisalDuration = async (req, res) => {
    try {
        const id = req.params.id;
        const conflictingData = await appraisalDuration.findOne({ 
            where: { 
                id: {[Op.ne]: id } ,
                period: req.body.period,
                effective_after: req.body.effective_after,
            }
        });

        if (conflictingData) {
            return res.status(400).send({ code: 400, message: "Data already exists" });
        }

        const appraisalData = await appraisalDuration.findOne({ where: { id: id } });
        if (appraisalData) {

            await appraisalDuration.update(req.body, { where: { id: id } });
            return res.status(200).send({ code: 200, message: "Updated Successfully", data: req.body });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};  



exports.updateAppraisalStatus = async (req, res) => {
    try {
        const id = req.params.id;
        let status = req.body.status;

        const existing = await appraisalDuration.findOne({ where: { id} });
        if (!existing) {
            return res.status(404).send({ status: false, message: "Record not found" });
        }
        
        await appraisalDuration.update(
            { status: 'Inactive' }, 
            { where: {} }
        );

        await appraisalDuration.update(
            { status: status }, 
            { where: { id: existing.id } }
        );

        return res.status(200).send({ status: true, message: "Appraisal status updated successfully", data: existing });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Server Error' });
    }
};


exports.deleteAppraisalDuration = async (req , res) =>{
    try {
            const id =  parseInt(req.params.id);
            const isExist = await appraisalDuration.findOne({ where: { id: id } });
            if (isExist) {
                await appraisalDuration.update({ isDeleted: true }, { where: { id: id } });
                return res.status(200).send({ code: 200, message: "Data is Deleted Successfully!", });
            } else {
                return res.status(403).send({ code: 403, message: "Record Not Found" });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({ code: 500, message: "Server Error" });
        }
    };
