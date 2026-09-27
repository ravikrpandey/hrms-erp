const db = require('../../../models/index');
const EarningTypeModel = db.earning_type;
const { validateFields } = require('../../../utils/inputValidator');

exports.createEarningType = async (req, res) => {
    try {
        const requiredFields = ['earning_type_name'];
        const validation = await validateFields(req.body, requiredFields);
        if (!validation.isValid) {
            return res.status(400).send({
                code: 400,
                message: validation.message
            });
        }
        let { earning_type_name } = req.body;
        let croppedName = earning_type_name.substring(0, Math.min(earning_type_name.length, 4));
        croppedName = croppedName.toUpperCase();
        let [unfilteredList] = await db.sequelize.query('SELECT * FROM MASTER_EARNING_TYPE met');
        let listLength = unfilteredList.length;
        let earning_type_code = croppedName + (listLength + 1);
        const response = await EarningTypeModel.create({ ...req.body, earning_type_code });
        return res.status(200).send({code: 200,message: "Created Successfully!",data: response});
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({code: 500,message: error.message || "Server Error"});
    }
};

exports.getAllEarningType = async (req, res) => {
    try {
        let [list] = await db.sequelize.query(`SELECT * FROM MASTER_EARNING_TYPE met WHERE is_deleted = FALSE;`);
        if (list.length <= 0) {
            return res.status(400).send({
                code: 400,
                message: "Record Not found"
            });
        }
        return res.status(200).send({
            code: 200,
            message: "Fetched Successfully!",
            data: list
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};
