const db = require("../../../models/index");

module.exports.getProposalPaymentList = async (req, res) => {
  try {
    const dataList = await db.proposalPayment.findAll({
      where: { proposal_id: req.params.proposal_id, payment_status:true },
      order: [['id', 'DESC']]
    });
    if (dataList) {
        return res.status(200).send({ code: 200, message: "success",data:dataList});
    } else {
      return res.status(404).send({ code: 404, message: "data not found" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, massage: error.message });
  }
};

module.exports.createProposalPayment = async (req, res) => {
  try {
    const {
      total_received,
      payment_mode,
      reference_number,
      bank_name,
      amount,
      remark,
      proposal_id,
    } = req.body;
    const createData = await db.proposalPayment.create({
      total_received,
      payment_mode,
      reference_number,
      bank_name,
      amount,
      remark,
      proposal_id,
    });
    if (createData) {
      return res
        .status(201)
        .send({ code: 201, message: "Successfully Created" });
    } else {
      return res.status(404).send({ code: 404, message: "Data Not Created" });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: error.message });
  }
};

module.exports.updateProposalPayment = async(req,res) => {
    try {
        const {total_received,payment_mode,reference_number,bank_name,amount,remark,proposal_id,id} = req.body;
        const dataExists = await db.proposalPayment.findAll({where:{proposal_id:proposal_id,id:id}});
        if(!dataExists){
            return res.status(404).send({code:404,massage:'id does not exist'})
        }
        const updateData = await db.proposalPayment.update({
            total_received,payment_mode,reference_number,bank_name,amount,remark
        },{where:{proposal_id:proposal_id,id:id}});
        if(updateData){
            return res.status(200).send({code:200,message:'Successfully Updated'});
        }else{
            return res.status(404).send({code:404,massage:'Not updated'})
        }
    } catch (error) {
       return res.status(500).send({ code: 500, message: error.massage }); 
    }
}

module.exports.deleteProposalPayment = async (req,res) => {
    try {
        const {proposal_id,id} = req.query;
        const dataExists = await db.proposalPayment.findAll({where:{proposal_id,id}});
        if(!dataExists){
            return res.status(404).send({code:404,massage:'id does not exist'})
        }
        const deleteData = await db.proposalPayment.update({
            payment_status:false
        },{where:{id,proposal_id}})
        if(deleteData){
            return res.status(200).send({ code: 200, message: 'Deleted Successfully' });
        }else{
            return res.status(404).send({ code: 404, message: 'Not Updated' });
        }
    } catch (error) {
        return res.status(500).send({ code: 500, message: error.massage });
    }
}