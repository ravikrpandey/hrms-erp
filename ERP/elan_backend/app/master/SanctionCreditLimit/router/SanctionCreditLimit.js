const creditLimit = require('../controllers/SanctionCreditLimitController');

module.exports = app => {
    app.post("/api/v1/createSanction_CreditLimit", creditLimit.createSanction_CreditLimit);
    app.get("/api/v1/getAllSanction_CreditLimits", creditLimit.getAllSanction_CreditLimits);
    app.put("/api/v1/updateSanction_CreditLimit", creditLimit.updateSanction_CreditLimit);
}