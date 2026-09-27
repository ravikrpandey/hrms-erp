const { body } = require("express-validator");
const db = require("../../../models/index");
const User = db.user;
const helpDeskDetails = db.helpDesk;
const op = db.sequelize.op;
const logger = require('../../../../logger/index');


/////////////// Create Help Desk ///////////////

exports.createHelpDesk = async (req, res) => {

    try {
        const { requester, subject, assignee, field_title, request_for, priority, type_of_document, request_no, description, employee_id,status1 } = req.body
        const req_name=await User.findOne({where:{employee_id:requester}})
        const response = await helpDeskDetails.create({
            status1,
            requester,
            requester_name:req_name.first_name+ " "+req_name.last_name,
            subject,
            assignee,
            field_title,
            request_for,
            priority,
            type_of_document,
            request_no,
            description,
            employee_id
        });
        console.log(response)
        // const update_request=await helpDeskDetails.update({request_no:response.employee_helpDesk_id},{where:{employee_helpDesk_id:response.employee_helpDesk_id}})
        return res.status(200).send({ code: 200, message: "Help Desk Created Successfully!", data: response })
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Edit Help Desk ///////////////

exports.editHelpDesk = async (req, res) => {
    try {
        const helpDeskId = req.params.id;
        console.log(body)
        const helpData = await helpDeskDetails.findOne({ where: { employee_helpDesk_id: helpDeskId } });
        if (helpData) {
            const req_name=await User.findOne({where:{employee_id:req.body.requester}})
            req.body.requester_name=req_name.first_name+ " "+req_name.last_name;
            const updateData = await helpDeskDetails.update(req.body, { where: { employee_helpDesk_id: helpDeskId } });
            return res.status(200).send({ code: 200, message: "Help Desk Updated Successfully", data: updateData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } 
    catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Get All Help Desk ///////////////

exports.getAllHelpDesk = async (req, res) => {
    try {
        const Data = await User.findOne({ attributes: ['first_name', 'employee_id'] })
        let candidateone = Data.employee_id
        const getAllData = await helpDeskDetails.findAll({
            // where: {employee_id: candidateone},
            where: { status: "ACTIVE" },
            include: [{
                model: User,
                attributes: ["first_name"]
            }]
        })
        getAllData.sort().reverse()
        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All Help Desk Data Successfully", data: getAllData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};




exports.getByIdAllHelpDesk = async (req, res) => {
    try {
        let employee_id = req.params.id;
        const getAllData = await helpDeskDetails.findAll({
            
            where: { status: "ACTIVE" , employee_id: employee_id},
            include: [{
                model: User,
                attributes: ["first_name"]
            }]
        })
        
        if (getAllData.length > 0) {
            getAllData.sort().reverse()
            return res.status(200).send({ code: 200, message: "Fetch All Help Desk Data Successfully", data: getAllData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        };
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};



/////////////// GetById Help Desk ///////////////

exports.getByIdHelpDesk = async (req, res) => {
    try {
        const employee_helpDesk_id = req.params.id;
      
        const getData = await helpDeskDetails.findOne({ where: { employee_helpDesk_id: employee_helpDesk_id } });
       
        
        if (getData) {
            return res.status(200).send({ code: 200, message: "Fetch data Successfully", data: getData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

/////////////// Delete Help Desk ///////////////

exports.deleteHelpDesk = async (req, res) => {
    try {
        const helpDeskId = req.params.id;
        const dltHelpDesk = await helpDeskDetails.findOne({ where: { employee_helpDesk_id: helpDeskId } });
            if (dltHelpDesk) {
            const deleteData = await helpDeskDetails.update({ status: "INACTIVE" }, { where: { employee_helpDesk_id: helpDeskId } });
            return res.status(200).send({ code: 200, message: "Help Desk Data is Deleted Successfully!", data: deleteData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


exports.get_Unique_Req_No = async  (req,res)=>{
    try {
        // const employee_helpDesk_id = req.params.id;
        const req_no = await helpDeskDetails.findAll({ 
            // limit: 1
            // where : {employee_helpDesk_id:employee_helpDesk_id},
            order: [['createdAt', 'DESC']],
            attributes : ["employee_helpDesk_id"]
           });
        const last_digit = req_no[0].employee_helpDesk_id
        // const request_no = Math.floor(10000 + Math.random() * 90000);
           const result = last_digit + 1
        if(result){
            return res.status(200).send({ code: 200, message: "Unique Request Number has been Generated", data: result });
        }else{
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
}




exports.get_Unique_Req_No_Patch = async  (req,res)=>{
    try {
        const employee_helpDesk_id = req.params.id;
        const req_no = await helpDeskDetails.findAll({ 
            // limit: 1
            where : {employee_helpDesk_id:employee_helpDesk_id},
            order: [['createdAt', 'DESC']],
            attributes : ["employee_helpDesk_id"]
           });
           console.log("hello word")
        //    console.log(req_no);
        const last_digit = req_no[0].employee_helpDesk_id
        // const request_no = Math.floor(10000 + Math.random() * 90000);
           const result = last_digit
        if(result){
            return res.status(200).send({ code: 200, message: "Unique Request Number has been Generated", data: result });
        }else{
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
}

