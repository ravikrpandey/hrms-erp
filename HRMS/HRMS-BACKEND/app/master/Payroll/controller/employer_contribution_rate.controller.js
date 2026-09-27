const db = require("../../../models/index");
const Op = db.Sequelize.Op;
const EmplrContributionRateModel = db.emplrContributionRate;
const {validateFields} = require('../../../utils/inputValidator');


exports.createEmplrContributionRate = async (req, res) => {
    try {
        const requiredFields = ['contribution_type', 'contribution_rate'];
        const validation = await validateFields(req.body, requiredFields);

        const {contribution_rate,contribution_type,effective_date,effective_end_date} = req.body;

        if (!validation.isValid) {
            return res.status(400).send({
                code: 400,
                message: validation.message
            });
        }

        const response = await EmplrContributionRateModel.create({contribution_rate,contribution_type,effective_date,effective_end_date});
        return res.status(200).send({
            code: 200,
            message: "Emplr Contribution Rate Created Successfully!",
            data: response
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};


exports.getAllEmplrContributionRate = async (req, res) => {
    try {
        let [getContributionList] = await db.sequelize.query(`
       SELECT mecr.emplr_contribution_rate_id, mecr.contribution_type,
       CASE WHEN mecr.contribution_rate = 'N/A' THEN 'N/A'
       ELSE CONCAT(mecr.contribution_rate, "% of Actual PF Wage") END AS contribution_rate, mecr.effective_date
       FROM MASTER_EMPLOYER_CONTRIBUTION_RATE mecr WHERE is_deleted = FALSE;`);
        
        if (getContributionList.length <= 0) {
            return res.status(400).send({
                code: 400,
                message: "No Employer contribution found"
            });
        }

        return res.status(200).send({
            code: 200,
            message: "Emplr Contribution Rate fetched Successfully!",
            data: getContributionList
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({
            code: 500,
            message: error.message || "Server Error"
        });
    }
};
