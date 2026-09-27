const db = require('../../../models/index');
const { Op, FLOAT } = require('sequelize');
const sales_request = db.sales_request;
const leadManagment = db.LeadManagment;
const auditor_booking = db.auditor_booking;
const user = db.user
const notification_for_sales_request = db.notification_sales_request
const transport = require("../../../master/services/nodemailer");
const contactSource= db.contact_source
const logger = require('../../../../logger/index');
const newLocation = db.newLocation
const prospect_sales_request_history = db.prospect_sales_request_history
const workOrderDetails = db.workOrder
exports.create_sales_request = async (req, res) => {
    try {
        var { lead_genration_id, br_number, new_location_id, request_audit_date, site, specific_auditor, client_name, Country, status, State, City, service, program, man_days, eaCode, expected_date, remarksSale, sales_request_state, Accridation_log } = req.body;
        const data = await sales_request.findOne({
            where: { sales_request_state: sales_request_state }
        })
        if (data) {
            return res.status(400).send({ code: 400, message: `Sales Request for ${sales_request_state}is Already Exists!` })
        }
        if (data == null || data.lenght == 0) {
            {
                const response = await sales_request.create({
                    lead_genration_id: lead_genration_id,
                    br_number: br_number || " ",
                    new_location_id: new_location_id || null,
                    request_audit_date: request_audit_date || " ",
                    site: site,
                    specific_auditor: specific_auditor,
                    
                    client_name: client_name,
                    Country: Country,
                    State: State,
                    City: City,
                    service: service,
                    program: program,
                    man_days: man_days,
                    eaCode: eaCode,
                    expected_date: expected_date,
                    remarksSale: remarksSale,
                    status: status,
                    sales_request_state: sales_request_state,
                    Accridation_log: Accridation_log
                });

                const history_log = await prospect_sales_request_history.create({
                    lead_genration_id: lead_genration_id,
                    br_number: br_number || " ",
                    new_location_id: new_location_id || null,
                    request_audit_date: request_audit_date || " ",
                    site: site,
                    specific_auditor: specific_auditor,
                    client_name: client_name,
                    Country: Country,
                    State: State,
                    City: City,
                    service: service,
                    program: program,
                    man_days: man_days,
                    eaCode: eaCode,
                    expected_date: expected_date,
                    remarksSale: remarksSale,
                    status: status,
                    sales_request_state: sales_request_state,

                });

                return res.status(200).send({ code: 200, message: "Sales Request  Created Successfully!", data: response });
            }
        }
        // }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        // const data = await sales_request.findOne({where: {client_name: client_name}})
        // if(data){
        //     return res.status(400).send({code: 400, message:"Sales Request is Already Exists!"})
        // } 
        return res.status(500).send({ code: 500, message: error.message });
    };
};

exports.sales_Request_notification = async (req, res) => {
    try {
        const { lead_generation_id } = req.body;
        const finalData = await sales_request.findAll({ where: { lead_genration_id: lead_generation_id } })
        console.log(finalData)


        if (finalData.length > 0) {

            // var br_numberNotification = finalData
            //     .filter(function (el) {
            //         return el.status === "sales_request";
            //     })
            //     .map(function (el) {
            //         return el.br_number;
            //     });

            // //   console.log(br_numberNotification);

            var br_numberNotification = finalData
                .filter(function (el) {
                    return el.status === "sales_request";
                })
                .map(function (el) {
                    return el.br_number;
                });


            var message = 'Sales Request already created for these BR Numbers ' + br_numberNotification + '. on this date but auditors not assigned yet,  Please assign auditors accordingly.';

            var createNotification = await notification_for_sales_request.create({
                lead_genration_id: lead_generation_id,
                role_master_id: 10,
                br_number: br_numberNotification,
                message: message
            });

            return res.status(200).send({ code: 200, message: "Sales Request Notificattion Created Successfully!", data: createNotification });
        }
        else {
            return res.status(400).send({ code: 400, message: "Sales Request Notification not Created!", data: [] });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};


exports.updateSalesRequestbyId = async (req, res) => {
    try {
        const sales_requestId = req.params.id;
        var { lead_genration_id, br_number, new_location_id, request_audit_date, site, specific_auditor, client_name, Country, status, State, City, service, program, man_days, eaCode, expected_date, remarksSale, sales_request_state, Accridation_log, stage_for_sales_request } = req.body;

        const editData = await sales_request.findOne({ where: { sales_request_id: sales_requestId } });
        if (editData) {
            const updateData = await sales_request.update(
                {
                    lead_genration_id,
                    br_number,
                    new_location_id,
                    request_audit_date,
                    site, specific_auditor,
                    client_name, Country,
                    status, State, City,
                    service, program,
                    man_days, eaCode,
                    expected_date,
                    remarksSale,
                    sales_request_state,
                    Accridation_log,
                    stage_for_sales_request
                },
                { where: { sales_request_id: sales_requestId } }
            );
            return res.status(200).send({ code: 200, message: " Sales Request Updated Successfull!", data: updateData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};
exports.updateSalesRequestbyIdusingbrorstage = async (req, res) => {
    try {
        // const sales_requestId = req.params.id;
        var { lead_genration_id, br_number, new_location_id, request_audit_date, site, specific_auditor, client_name, Country, status, State, City, service, program, man_days, eaCode, expected_date, remarksSale, sales_request_state, Accridation_log, stage_for_sales_request } = req.body;

        const editData = await sales_request.findOne({  where: {
            [Op.and]: [
              { br_number: br_number },
              { stage_for_sales_request: stage_for_sales_request},
            ]
          }, });
        if (editData) {
            const updateData = await sales_request.update(
                {
                    lead_genration_id,
                    br_number,
                    new_location_id,
                    request_audit_date,
                    site, specific_auditor,
                    client_name, Country,
                    status, State, City,
                    service, program,
                    man_days, eaCode,
                    expected_date,
                    remarksSale,
                    sales_request_state,
                    Accridation_log,
                    stage_for_sales_request
                },
                {
                where: {
                    [Op.and]: [
                      { br_number: br_number },
                      { stage_for_sales_request: stage_for_sales_request},
                    ]
                  }
                }
            );
            return res.status(200).send({ code: 200, message: " Sales Request Updated Successfull!", data: updateData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};

// var br_numberNotification = results.map(function(el) {
//     return el.br_number;
//   });


//   var lead_genration_id1 =parseInt(req.body[0].lead_genration_id)

//   var message = 'Sales Request created for these BR Numbers ' + br_numberNotification + '. Please assign auditors accordingly';

//   var createNotification = await notification_for_sales_request.create({
//     lead_genration_id: lead_genration_id1,
//     role_master_id: 10,
//     br_number: br_numberNotification,
//     message: message
//   });

// exports.create_sales_requestone = async (req, res) => {
//     try {
//         const data = await sales_request.findOne({
//             // where: {sales_request_state: req.body[0].sales_request_state}
//             where: {
//                 [Op.and]: [
//                     { sales_request_state: req.body[0].sales_request_state },
//                     { lead_genration_id: req.body[0].lead_genration_id },
//                 ]
//             },
//         })
//         if (data) {
//             return res.status(400).send({ code: 400, message: `Sales Request for ${req.body[0].sales_request_state} is Already Exists!` })
//         }
//         if (data == null || data.lenght == 0) {

//             let results = [];
//             for (let i = 0; i < req.body.length; i++) {
//                 const stageForSalesRequest = req.body[i].stage_for_sales_request;

//                 for (let j = 0; j < stageForSalesRequest.length; j++) {
//                     var ObjSlaes_request = {
//                         lead_genration_id: req.body[i].lead_genration_id,
//                         employee_id: req.body[i].employee_id,
//                         br_number: req.body[i].br_number,
//                         new_location_id: req.body[i].new_location_id,
//                         request_audit_date: req.body[i].request_audit_date,
//                         site: req.body[i].site,
//                         specific_auditor: req.body[i].specific_auditor,
//                         client_name: req.body[i].client_name,
//                         Country: req.body[i].Country,
//                         State: req.body[i].State,
//                         City: req.body[i].City,
//                         expected_date_s2:req.body[i].expected_date || " ",
//                         man_days_S2:req.body[i].man_days_S2 || " ",
//                         service: req.body[i].service,
//                         program: req.body[i].program,
//                         man_days: req.body[i].man_days,
//                         eaCode: req.body[i].eaCode,
//                         expected_date: req.body[i].expected_date,
//                         remarksSale: req.body[i].remarksSale,
//                         status: req.body[i].status,
//                         stage_for_sales_request: stageForSalesRequest[j],
//                         sales_program: req.body[i].sales_program,
//                         sales_EACode: req.body[i].sales_EACode,
//                         sales_request_state: req.body[i].sales_request_state,
//                         Accridation_log: req.body[i].Accridation_log
//                     };

//                     var sales_request1 = await sales_request.create(ObjSlaes_request);
//                     results.push(sales_request1);
//                 }
//             }

//             // Rest of the code remains the same...


//             var br_numberNotification = results.map(function (el) {
//                 return el.br_number;
//             });

//             var lead_genration_id1 = parseInt(req.body[0].lead_genration_id)

//             var message = 'Sales Request created for these BR Numbers ' + br_numberNotification + '. Please assign auditors accordingly';

//             var createNotification = await notification_for_sales_request.create({
//                 lead_genration_id: lead_genration_id1,
//                 role_master_id: 10,
//                 br_number: br_numberNotification,
//                 message: message
//             });
//             // array
//             var data1 = await user.sequelize.query(
//                 `SELECT employee_official_email  from registered_users WHERE role_master_id = 10`, {
//                 type: user.sequelize.QueryTypes.SELECT
//             })
//             //  var arrayEmail = [];
//             //  for(i=0; i<data1.length; i++){
//             //    const Obj ={
//             //     official_email: data1[i].employee_official_email
//             //    }

//             //    arrayEmail.push(Obj)

//             //  }
//             const emailArray = data1.map(item => item.employee_official_email);

//             info = await transport.mailsend({
//                 from: "dqsindia.erp@gmail.com",
//                 to: emailArray,
//                 subject: `Saless Request Created  Succesfully for Br_number Id ${br_numberNotification})} `,
//                 html: `<p><strong>Hi &nbsp;Sales_Person &nbsp;&nbsp; </strong> <br>  
//                 Sales Request created for these BR Number ${br_numberNotification} Please assign auditors accordingly.
//                 <br></br><br></br><br></br><br></br>
//                 Thanks Regards<br></br>
//                 DQS Team
//         </p>`,
//             });

//             return res.status(200).send({ code: 200, message: "Create Successfully!", data: results });

//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({ code: 500, message: "Server Error" });
//     }
// };


// exports.create_sales_requestone = async (req, res) => {
//     try {
//         const data = await sales_request.findOne({
//             // where: {sales_request_state: req.body[0].sales_request_state}
//             where: {
//                 [Op.and]: [
//                     { sales_request_state: req.body[0].sales_request_state },
//                     { lead_genration_id: req.body[0].lead_genration_id },
//                 ]
//             },
//         })
//         if (data) {
//             return res.status(400).send({ code: 400, message: `Sales Request for ${req.body[0].sales_request_state} is Already Exists!` })
//         }
//         if (data == null || data.lenght == 0) {

//             let results = [];
//             for (let i = 0; i < req.body.length; i++) {
//                 // const stageForSalesRequest = req.body[i].stage_for_sales_request;

//                 // for (let j = 0; j < stageForSalesRequest.length; j++) {
//                     var ObjSlaes_request = {
//                         lead_genration_id: req.body[i].lead_genration_id,
//                         employee_id: req.body[i].employee_id,
//                         br_number: req.body[i].br_number,
//                         new_location_id: req.body[i].new_location_id,
//                         request_audit_date: req.body[i].request_audit_date,
//                         site: req.body[i].site,
//                         specific_auditor: req.body[i].specific_auditor,
//                         client_name: req.body[i].client_name,
//                         Country: req.body[i].Country,
//                         State: req.body[i].State,
//                         City: req.body[i].City,
//                         expected_date_s2:req.body[i].expected_date || " ",
//                         man_days_S2:req.body[i].man_days_S2 || " ",
//                         service: req.body[i].service,
//                         program: req.body[i].program,
//                         man_days: req.body[i].man_days,
//                         eaCode: req.body[i].eaCode,
//                         expected_date: req.body[i].expected_date,
//                         remarksSale: req.body[i].remarksSale,
//                         status: req.body[i].status,
//                         stage_for_sales_request: req.body[i].stage_for_sales_request,
//                         sales_program: req.body[i].sales_program,
//                         sales_EACode: req.body[i].sales_EACode,
//                         sales_request_state: req.body[i].sales_request_state,
//                         Accridation_log: req.body[i].Accridation_log
//                     };

//                     var sales_request1 = await sales_request.create(ObjSlaes_request);
//                     results.push(sales_request1);
//                 }
//             // }

//             // Rest of the code remains the same...



//             var br_numberNotification = results.map(function (el) {
//                 return el.br_number;
//             });


//             var lead_genration_id1 = parseInt(req.body[0].lead_genration_id)

//             var message = 'Sales Request created for these BR Numbers ' + br_numberNotification + '. Please assign auditors accordingly';

//             var createNotification = await notification_for_sales_request.create({
//                 lead_genration_id: lead_genration_id1,
//                 role_master_id: 10,
//                 br_number: br_numberNotification,
//                 message: message
//             });
//             // array
//             var data1 = await user.sequelize.query(
//                 `SELECT employee_official_email  from registered_users WHERE role_master_id = 10`, {
//                 type: user.sequelize.QueryTypes.SELECT
//             })
//             //  var arrayEmail = [];
//             //  for(i=0; i<data1.length; i++){
//             //    const Obj ={
//             //     official_email: data1[i].employee_official_email
//             //    }

//             //    arrayEmail.push(Obj)

//             //  }
//             const emailArray = data1.map(item => item.employee_official_email);

//             info = await transport.mailsend({
//                 from: "dqsindia.erp@gmail.com",
//                 to: emailArray,
//                 subject: `Saless Request Created  Succesfully for Br_number Id ${br_numberNotification})} `,
//                 html: `<p><strong>Hi &nbsp;Sales_Person &nbsp;&nbsp; </strong> <br>  
//                 Sales Request created for these BR Number ${br_numberNotification} Please assign auditors accordingly.
//                 <br></br><br></br><br></br><br></br>
//                 Thanks Regards<br></br>
//                 DQS Team
//         </p>`,
//             });

//             return res.status(200).send({ code: 200, message: "Create Successfully!", data: results });

//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({ code: 500, message: "Server Error" });
//     }
// };




// update code for sale request
exports.create_sales_requestone = async (req, res) => {
    try {
        const data = await sales_request.findOne({
            where: {
                [Op.and]: [
                    { sales_request_state: req.body[0].sales_request_state },
                    { lead_genration_id: req.body[0].lead_genration_id },
                ]
            },
        })
        if (data) {
            return res.status(400).send({ code: 400, message: `Sales Request for ${req.body[0].sales_request_state} is Already Exists!` })
        }
        if (data == null || data.lenght == 0) {
            let results = [];
            let tempraryarrS1=[];
            let tempraryarrS2=[];
            for (let i = 0; i < req.body.length; i++) {
                const stageForSalesRequest = req.body[i].stage_for_sales_request;  // s1

                var ObjSlaes_request = {
                    lead_genration_id: req.body[i].lead_genration_id,
                    employee_id: req.body[i].employee_id,
                    br_number: req.body[i].br_number,
                    new_location_id: req.body[i].new_location_id,
                    request_audit_date: req.body[i].request_audit_date,
                    site: req.body[i].site,
                    specific_auditor: req.body[i].specific_auditor,
                    client_name: req.body[i].client_name,
                    Country: req.body[i].Country,
                    State: req.body[i].State,
                    City: req.body[i].City,
                    expected_date_s2:req.body[i].expected_date || " ",
                    man_days_S2:req.body[i].man_days_S2 || " ",
                    service: req.body[i].service,
                    program: req.body[i].program,
                    man_days: req.body[i].man_days,
                    eaCode: req.body[i].eaCode,
                    expected_date: req.body[i].expected_date,
                    remarksSale: req.body[i].remarksSale,
                    status: req.body[i].status,
                    stage_for_sales_request: stageForSalesRequest[i],
                    sales_program: req.body[i].sales_program,
                    sales_EACode: req.body[i].sales_EACode,
                    sales_request_state: req.body[i].sales_request_state,
                    Accridation_log: req.body[i].Accridation_log
                };
            
                if(stageForSalesRequest.includes("S1") && stageForSalesRequest.includes("S2")){
                    tempraryarrS2.push(ObjSlaes_request);
                    tempraryarrS1.push(ObjSlaes_request);
                }
                else if(stageForSalesRequest.includes("S2") && !stageForSalesRequest.includes("S1")){
                    tempraryarrS2.push(ObjSlaes_request)
                }
                else if(stageForSalesRequest.includes("S1") && !stageForSalesRequest.includes("S2")){
                    tempraryarrS1.push(ObjSlaes_request)
                }
            }

            var lead_genration_id1 = parseInt(req.body[0].lead_genration_id)

            let leadInfo=await leadManagment.findOne({
                where: {lead_genration_id: lead_genration_id1},
                attributes: ["lead_genration_id", "customer_type", "associated_company", "br_number", "first_name", "last_name", "lead_created_date", "country_name", "state_name", "city_name", "lead_assgn_contact_owner","dqs_contact_source"]
            })

            if(leadInfo){
                let contactInfo= await contactSource.findOne({
                    where: {contact_source_id: parseInt(leadInfo.dqs_contact_source)},
                    attributes: ["contact_source_name"]
                })

                let UserInfo= await user.findOne({
                    where: {employee_id: parseInt(leadInfo.lead_assgn_contact_owner)},
                    attributes: ["first_name"]
                })

                leadInfo["lead_assgn_contact_owner"]=UserInfo.first_name
                leadInfo["dqs_contact_source"]=contactInfo.contact_source_name
            }


            if(tempraryarrS2.length>0){ 
                let objectS2={
                    saleRequest_stage:  "S2",
                    lead_data: leadInfo,
                    saleRequest_data: tempraryarrS2,
                    lead_genration_id: leadInfo.lead_genration_id,
                    site: leadInfo.site,
                    br_number: leadInfo.br_number,
                    specific_auditor: leadInfo.specific_auditor,
                    Country:leadInfo.country_name ,
                    State: leadInfo.state_name ,
                    City: leadInfo.city_name ,
                    eaCode: leadInfo.ea_code,
                    sales_request_state: req.body[0].sales_request_state
                }
                
                var sales_request2 = await sales_request.create(objectS2);
                results.push(sales_request2); 
            
            }
            if(tempraryarrS1.length>0) {
                let objectS1={
                    saleRequest_stage:  "S1",
                    lead_data: leadInfo,
                    saleRequest_data: tempraryarrS1,
                    lead_genration_id: leadInfo.lead_genration_id,
                    site: leadInfo.site,
                    br_number: leadInfo.br_number,
                    specific_auditor: leadInfo.specific_auditor,
                    Country:leadInfo.country_name ,
                    State: leadInfo.state_name ,
                    City: leadInfo.city_name ,
                    eaCode: leadInfo.ea_code,
                    sales_request_state: req.body[0].sales_request_state

                }


                // objectS1["saleRequest_stage"]= "S1"
                // objectS1["lead_data"]=leadInfo
                // objectS1["saleRequest_data"]=tempraryarrS1
                // objectS1["lead_genration_id"]=leadInfo.lead_genration_id

                var sales_request1 = await sales_request.create(objectS1);
                results.push(sales_request1);
            }

            var br_numberNotification = results.map(function (el) {
                return el.br_number;
            });


            var lead_genration_id1 = parseInt(req.body[0].lead_genration_id)

            var message = 'Sales Request created for these BR Numbers ' + br_numberNotification + '. Please assign auditors accordingly';

            var createNotification = await notification_for_sales_request.create({
                lead_genration_id: lead_genration_id1,
                role_master_id: 10,
                br_number: br_numberNotification,
                message: message
            });
            // array
            var data1 = await user.sequelize.query(
                `SELECT employee_official_email  from registered_users WHERE role_master_id = 10`, {
                type: user.sequelize.QueryTypes.SELECT
            })
            //  var arrayEmail = [];
            //  for(i=0; i<data1.length; i++){
            //    const Obj ={
            //     official_email: data1[i].employee_official_email
            //    }
            //    arrayEmail.push(Obj)
            //  }
            const emailArray = data1.map(item => item.employee_official_email);

            info = await transport.mailsend({
                from: "dqsindia.erp@gmail.com",
                to: emailArray,
                subject: `Saless Request Created  Succesfully for Br_number Id ${br_numberNotification})} `,
                html: `<p><strong>Hi &nbsp;Sales_Person &nbsp;&nbsp; </strong> <br>  
                Sales Request created for these BR Number ${br_numberNotification} Please assign auditors accordingly.
                <br></br><br></br><br></br><br></br>
                Thanks Regards<br></br>
                DQS Team
        </p>`,
            });

            return res.status(200).send({ code: 200, message: "Create Successfully!", data: results });

        }
    } catch (error) {
        console.log(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};

exports.getbyleadandemployeeid_sales_requestone = async (req, res) => {
    try {
        var lead_genration_id = req.body.lead_generation_id
        var employee_id = req.body.employee_id

        const data = await sales_request.findAll({
            // where: {sales_request_state: req.body[0].sales_request_state}
            where: {
                [Op.and]: [
                    { lead_genration_id: lead_genration_id },
                    { employee_id: employee_id },
                ]
            },
        })

                const salesRequestStates = {}; // Create an object to store arrays for each state

        for (const item of data) {
            const salesRequestState = item.sales_request_state;

            if (!salesRequestStates[salesRequestState]) {
                salesRequestStates[salesRequestState] = [];
            }

            salesRequestStates[salesRequestState].push(item);
        }
        return res.status(200).send({ code: 200, message: "Create Successfully!", data: salesRequestStates });

    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
};



exports.create_auditor_booking = async (req, res) => {
    try {

        var {
            workOrdercomponentId,
            sales_request_id,
            lead_genration_id,
            new_location_id,
            leadAuditor,
            leadAuditor_bookedDate,
            co_auditorData,
            coAuditor_bookedDate,
            traineeauditorData,
            traineeAuditor_bookedDate,
            technicalAuditorData,
            technicalAuditor_bookedDate,
            candidateAuditorData,
            candidateAuditor_bookedDate,
            witnessAuditorData,
            witnessAuditor_bookedDate,
            workOrdercomponentId,
            sales_request_state, status } = req.body;
        {
            const response = await auditor_booking.create({
                sales_request_id,
                lead_genration_id,
                new_location_id,
                leadAuditor,
                leadAuditor_bookedDate,
                co_auditorData,
                coAuditor_bookedDate,
                traineeauditorData,
                traineeAuditor_bookedDate,
                technicalAuditorData,
                technicalAuditor_bookedDate,
                candidateAuditorData,
                candidateAuditor_bookedDate,
                witnessAuditorData,
                witnessAuditor_bookedDate,
                sales_request_state,
                status,
                workOrdercomponentId
            });

            // await workOrderDetails.update({auditor_booking_status: "raise task order"}, { where: {workOrdercomponentId: response.workOrdercomponentId}})

            // const updateData =  await sales_request.findOne
            const updateData = await sales_request.update({ status: status }, { where: { sales_request_id: parseInt(sales_request_id) } });
            const finalData = await sales_request.findAll({ where: { lead_genration_id: lead_genration_id } })
            var br_numberNotification = finalData
                .filter(function (el) {
                    return el.status === "sales_request";
                })
                .map(function (el) {
                    return el.br_number;
                });


            var br_numberNotificationone = finalData
                .filter(function (el) {
                    return el.status != "sales_request";
                })
                .map(function (el) {
                    return el.br_number;
                });



            //   var lead_genration_id1 =parseInt(req.body.lead_genration_id)
            // Sales Request already created for these BR Numbers on this date but auditors not assigned yet,  Please assign auditors accordingly.
            var message =
                "Auditor Booking Done for Sales Request created for these BR Numbers " +
                br_numberNotificationone.join(", ") + "... and" +
                ". Auditor Booking Not Done for Sales Request created for these BR Numbers " +
                br_numberNotification.join(", ") +
                ".";;

            var createNotification = await notification_for_sales_request.create({
                lead_genration_id: lead_genration_id,
                role_master_id: 10,
                br_number: br_numberNotification,
                message: message
            });
            return res.status(200).send({ code: 200, message: "Sales Request  Created Successfully!", data: response });
        }
        // }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        // const data = await sales_request.findOne({where: {client_name: client_name}})
        // if(data){
        //     return res.status(400).send({code: 400, message:"Sales Request is Already Exists!"})
        // } 
        return res.status(500).send({ code: 500, message: error.message });
    };
};

exports.create_auditor_bookingattaskorder = async (req, res) => {
    try {

        var {
            lead_genration_id,
            new_location_id,
            br_number,
            leadAuditor,
            leadAuditor_bookedDate,
            co_auditorData,
            coAuditor_bookedDate,
            traineeauditorData,
            traineeAuditor_bookedDate,
            technicalAuditorData,
            technicalAuditor_bookedDate,
            candidateAuditorData,
            candidateAuditor_bookedDate,
            witnessAuditorData,
            witnessAuditor_bookedDate,
            workOrdercomponentId,
            workOrder,
            sales_request_state, status } = req.body;
        {
            const response = await auditor_booking.create({
                lead_genration_id,
                br_number,
                new_location_id,
                leadAuditor,
                leadAuditor_bookedDate,
                co_auditorData,
                coAuditor_bookedDate,
                traineeauditorData,
                traineeAuditor_bookedDate,
                technicalAuditorData,
                technicalAuditor_bookedDate,
                candidateAuditorData,
                candidateAuditor_bookedDate,
                witnessAuditorData,
                witnessAuditor_bookedDate,
                sales_request_state,
                workOrdercomponentId,
                workOrder,
                status,
            });

            // const updateData =  await sales_request.findOne
            // const updateData = await sales_request.update({ status:status }, { where: { sales_request_id: sales_request_id } });
            return res.status(200).send({ code: 200, message: "Sales Request  Created Successfully!", data: response });
        }
        // }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        // const data = await sales_request.findOne({where: {client_name: client_name}})
        // if(data){
        //     return res.status(400).send({code: 400, message:"Sales Request is Already Exists!"})
        // } 
        return res.status(500).send({ code: 500, message: error.message });
    };
};


exports.getAll_salesrequest = async (req, res) => {
    try {
        var getAllData = await sales_request.findAll({})

        // var Lead_data = [];   //no need loop requirement
        // var req_with_lead = [];
        // for (var i = 0; i < getAllData.length; i++) {
        //     const Obj = {
        //         lead_genration_id: getAllData[i].lead_genration_id
        //     }
        //     Lead_data.push(Obj)
        //     console.log(Lead_data, "Lead_data")
        // }
        // for (var j = 0; j < Lead_data.length; j++) {
        //     var AllData = await leadManagment.findOne({ where: { lead_genration_id: Lead_data[j].lead_genration_id } })
        //     console.log(AllData, "AllData")
        //     var LeadData = {
        //         "sales_request": getAllData[j],
        //         "customer_type": AllData.customer_type,
        //         "associated_company": AllData.associated_company,
        //         "contact_owner": AllData.contact_owner,
        //         "lead_assgn_contact_owner": AllData.lead_assgn_contact_owner,
        //         "dqs_Contact_name": AllData.dqs_Contact_name,
        //         "lead_created_by": AllData.lead_created_by,
        //         "lead_created_date": AllData.lead_created_date,
        //         "state_name": AllData.state_name,
        //         "region_name": AllData.region_name,
        //         "regional_bussiness_lead_name": AllData.lead_lead_name,
        //         "validated_by": AllData.validated,
        //         "lead_validated_date": AllData.lead_validated_date,
        //         "contact_owner": AllData.contact_owner,
        //         "assigned_by": AllData.assigned_by,
        //         "assigned_date": AllData.assigned_date

        //     }
        //     req_with_lead.push(LeadData)

        // }



        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All rating Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(403).send({ code: 403, message: "Server Error" });
    };
};

exports.getbyId_salesrequest = async (req, res) => {
    try {
        var sales_request_id = req.params.sales_request_id;
        var getAllData = await sales_request.findOne({ where: { sales_request_id: sales_request_id } });

        var req_with_lead = []
        var lead_genration_id = getAllData.lead_genration_id
        // for(var j=0; j<Lead_data.length; j++) {
        var AllData = await leadManagment.findOne({ where: { lead_genration_id: lead_genration_id } })
        var LeadData = {
            "sales_request": getAllData,
            "customer_type": AllData.customer_type,
            "associated_company": AllData.associated_company,
            "contact_owner": AllData.contact_owner,
            "lead_assgn_contact_owner": AllData.lead_assgn_contact_owner,
            "dqs_Contact_name": AllData.dqs_Contact_name,
            "lead_created_by": AllData.lead_created_by,
            "lead_created_date": AllData.lead_created_date,
            "country_name": AllData.country_name,
            "state_name": AllData.state_name,
            "region_name": AllData.region_name,
            "regional_bussiness_lead_name": AllData.lead_lead_name,
            "validated_by": AllData.validated,
            "lead_validated_date": AllData.lead_validated_date,
            "contact_owner": AllData.contact_owner,
            "assigned_by": AllData.assigned_by,
            "assigned_date": AllData.assigned_date

        }
        req_with_lead.push(LeadData)

        // }



        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All rating Data Successfully", data: req_with_lead });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};
// getbyid_salesrequest_location

exports.getbyid_salesrequest_location = async (req, res) => {
    try {
        var sales_request_id = req.params.sales_request_id;
        var getAllData = await sales_request.findOne({ where: { sales_request_id: sales_request_id } });
        var new_location_id = getAllData.new_location_id
        var lead_genration_id = getAllData.lead_genration_id
        if (new_location_id != null) {
            var getAllData = await db.newLocation.findOne({ where: { new_location_id: new_location_id } })
            locationData = `${getAllData.country_name}- ${getAllData.state_name}- ${getAllData.city_name}`
            return res.status(200).send({ code: 200, message: "Fetch All rating Data Successfully", data: locationData });
        }
        if (new_location_id == null) {

            var getAllData = await leadManagment.findOne({ where: { lead_genration_id: lead_genration_id } })
            locationData = `${getAllData.country_name}- ${getAllData.state_name}- ${getAllData.city_name}`

            return res.status(200).send({ code: 200, message: "Fetch All rating Data Successfully", data: locationData });
        }

        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All rating Data Successfully", data: req_with_lead });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
};
// getByidauditorbookingtaskorder

// const { auditor_booking } = require('path-to-your-models'); // Replace with the actual path


// const { auditor_booking } = require('path-to-your-models'); // Replace with the actual path

exports.getByidauditorbookingtaskorder = async (req, res) => {
    try {
        var br_number = req.params.br_number;
        var getAllData = await auditor_booking.findAll({ where: { br_number: br_number } });

        var accumulator = [];

        getAllData.forEach(item => {
            const auditorTypes = [
                "leadAuditor",
                "co_auditorData",
                "traineeauditorData",
                "technicalAuditorData",
                "candidateAuditorData",
                "witnessAuditorData"
            ];

            auditorTypes.forEach(auditorType => {
                if (item[auditorType]) {
                    item[auditorType].forEach(auditor => {
                        if (auditor.audit_qualification_id && auditor.auditor_first_name) {
                            var obj = {
                                "audit_qualification_id": auditor.audit_qualification_id,
                                "auditor_first_name": auditor.auditor_first_name,
                                "booking_data": auditor.Select_Date_
                            };
                            accumulator.push(obj);
                        }
                    });
                }
            });
        });


        if (accumulator.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetch All rating Data Successfully", data: accumulator });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
}


exports.getByidauditorbooking = async (req, res) => {
    try {
        var lead_genration_id = req.params.lead_genration_id;
        var getAllData = await auditor_booking.findAll({ where: { lead_genration_id: lead_genration_id } });

        const lead_data = await leadManagment.findOne({ where: { lead_genration_id: lead_genration_id } })
        const country_name = lead_data.country_name;
        const state_name = lead_data.state_name;
        const city_name = lead_data.city_name;
        var data = [];
        for (var i = 0; i < getAllData.length; i++) {
            const allData = {
                "country_name": country_name,
                "state_name": state_name,
                "city_name": city_name,
                "data": getAllData[i]

            }
            data.push(allData)
        }


        if (getAllData) {
            return res.status(200).send({ code: 200, message: "Fetch All rating Data Successfully", data: data });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
}


// exports.auditors_Data=async(req,res)=>{
//     try{
//         const auditer_booking_id=req.params.id
//         const auditor_data=await auditor_booking.findOne({where:{auditer_booking_id:auditer_booking_id}})
//         let lead_id=auditor_data.lead_genration_id;
//         const lead_data=await leadManagment.findOne({where:{lead_genration_id:lead_id}})
//         let street_Address=lead_data.street_address;
//         let Arr=[]
//         if(auditor_data && lead_data){
//         const obj={
//             "leadAuditor_bookedDate":auditor_data.leadAuditor_bookedDate,
//             "location":street_Address
//         }

//         const obj2={
//             "co_auditorData":auditor_data.co_auditorData,
//             "location":street_Address
//         }

//         const obj3={
//             "coAuditor_bookedDate":auditor_data.coAuditor_bookedDate,
//             "location":street_Address
//         }

//         const obj4={
//             "traineeauditorData":auditor_data.traineeauditorData,
//             "location":street_Address
//         }

//         const obj5={
//             "traineeAuditor_bookedDate":auditor_data.traineeAuditor_bookedDate,
//             "location":street_Address
//         }

//         const obj6={
//             "technicalAuditorData":auditor_data.technicalAuditorData,
//             "location":street_Address
//         }

//         const obj7={
//             "technicalAuditor_bookedDate":auditor_data.technicalAuditor_bookedDate,
//             "location":street_Address
//         }
//        Arr.push(obj,obj2,obj3,obj4,obj5,obj6, obj7)
//         return res.status(200).send({code: 200, message:"Data Fetched successfully",data:Arr})
//     }
//      else{
//         return res.status(404).send({code:"404",message:"NO Dates Found"})
//      }   
//     }
//     catch(error){
//         console.log(error)
//         return res.status(500).send({ code: 500, message: "Invalid Server Error" });
//     }
// }


exports.auditors_Data = async (req, res) => {
    try {
        const inputData = await auditor_booking.findAll({})
        var targetAuditQualificationId = req.params.id;
        function searchAndPushData(obj, targetId, newArray) {
            for (const key in obj) {
                if (obj[key] !== null && typeof obj[key] === 'object') {

                    searchAndPushData(obj[key], targetId, newArray);
                } else if (0 === 'audit_qualification_id' && obj[key] === targetId) {

                    newArray.push(obj);
                }
            }
        }

        // Create a new array to store the matching data
        const matchingDataArray = [];
        // Iterate through the inputData and search for the target data
        inputData.forEach((item) => {
            searchAndPushData(item, parseInt(targetAuditQualificationId), matchingDataArray);
        });

        return res.status(200).send({ code: 200, message: "Data Fetched successfully", data: matchingDataArray })
    }
    catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error)
        return res.status(500).send({ code: 500, message: "Invalid Server Error" });
    }
}


exports.getByidchildauditorbooking = async (req, res) => {
    try {
        var lead_genration_id = req.params.lead_genration_id;
        var getAllData = await auditor_booking.findAll({ where: { lead_genration_id: lead_genration_id } });
        var mainArr = [];
        let parentArr = [];
        let childArr = [];
        let allData;
        for (var item of getAllData) {

            if (item.new_location_id) {
                allData = {
                    "newlocationId": item.new_location_id,
                    "no_of_auditor": item.co_auditorData.length,
                    "co_auditorData": item.co_auditorData,
                    "traineeauditorData": item.traineeauditorData,
                    "technicalAuditorData": item.technicalAuditorData,
                    "candidateAuditorData": item.candidateAuditorData,
                    "witnessAuditorData": item.witnessAuditorData,
                }
                childArr.push(allData)
            }
            else {
                allData = {
                    "leadlocationId": item.new_location_id,
                    "no_of_auditor": item.co_auditorData.length,
                    "co_auditorData": item.co_auditorData,
                    "traineeauditorData": item.traineeauditorData,
                    "technicalAuditorData": item.technicalAuditorData,
                    "candidateAuditorData": item.candidateAuditorData,
                    "witnessAuditorData": item.witnessAuditorData,
                }
                parentArr.push(allData)
            }
        }

        let mainObj = {}
        mainObj["parentdata"] = parentArr
        mainObj["childdata"] = childArr

        if (mainObj) {
            return res.status(200).send({ code: 200, message: "Fetch All rating Data Successfully", data: mainObj });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        logger.error(`Error ${error.message}`, { error });
        console.log(error);
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
}


exports.auditor_bookingtaskorderList = async (req, res) => {
    try {
        let { lead_genration_id, br_number } = req.body;
        var getAllData = await auditor_booking.findAll({ where: { br_number: br_number, lead_genration_id: lead_genration_id } });
        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetch All rating Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error);
        logger.error(`Error ${error.message}`, { error });
        return res.status(500).send({ code: 500, message: "Server Error" });
    }
}