const db = require("../../models/index");
exports.createCompanyMaster = async (req,res)=>{
try {
    const {
        abbreviation, company_name
    } = req.body;

    const saveCompany = await db.company_master.create({
        abbreviation:abbreviation, 
        company_name: company_name  
    });
    return res.status(200).send({ code: 200, message: "Company Created Successfully" , data: saveCompany });
} catch (error) {
    return res.status(500).send({ code: 500, message: error.message || "Server Error" });
}
}

exports.getAllCompanyList = async (req,res)=>{
    try {

        let { entity_id } = req.query;
        entity_id = parseInt(entity_id)

        const getAllData = await db.company_master.findAll({ where: { isDeleted: false }
            ,order: [['id', 'DESC']],})
        if (getAllData.length > 0) {
            return res.status(200).send({ code: 200, message: "Fetch All Company Data Successfully", data: getAllData });
        } else {
            return res.status(404).send({ code: 404, message: "Record Not Found" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).send({ code: 500, message: error.message || "Server Error" });
    }

}
exports.deletecompanyData = async (req,res)=>{
    try {
        const comp_id = parseInt(req.params.comp_id);
        const deleteCompany = await db.company_master.findOne({ where: { id: comp_id } });
        if (deleteCompany) {
            const deleteData = await db.company_master.update({ isDeleted: true }, { where: { id: comp_id } });
            return res.status(200).send({ code: 200, message: "Company is Deleted Successfully!", data: deleteData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ code: 500, message: "Server Error" });
    };
}
exports.getByIdCompany = async (req,res)=>{
    try {
        const company_id = parseInt(req.params.comp_id);
        console.log(req.params,'body')
        const getData = await db.company_master.findOne({ where: { id: company_id } });
        if (getData) {
            return res.status(200).send({ code: 200, message: "Fetch data by ID Successfully", data: getData });
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error,'err');

        return res.status(500).send({ code: 500, message: "Server Error" ,err: error});
    };
}
exports.updateById = async (req,res)=>{
    try {
        const company_id = parseInt(req.params.comp_id);
        const {
            abbreviation, company_name
        } = req.body;
        const dltStage = await db.company_master.findOne({ where: { id: company_id } });
        if (dltStage) {
            const companyInfo = await db.company_master.findOne({ where: { company_name: company_name,isDeleted:false,id: { [db.Sequelize.Op.ne]: company_id } }});
            if (companyInfo) {
                return res.status(409).send({ code: 409, message: "Company Name is Already Exists!" });
            } else {
                const updateData = await db.company_master.update(req.body, { where: { id: company_id } });
                return res.status(200).send({ code: 200, message: "Data is Update Successfully!", data: updateData });
            }
        } else {
            return res.status(403).send({ code: 403, message: "Record Not Found" });
        }
    } catch (error) {
        console.log(error,'errup')
        return res.status(500).send({ code: 500, message: error });
    };
}