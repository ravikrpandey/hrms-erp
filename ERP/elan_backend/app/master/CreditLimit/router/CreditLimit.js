const creditLimit = require('../controllers/CreditLimitController');

module.exports = app => {
    app.post("/api/v1/createCreditLimit", creditLimit.create_credit_limit);
    app.get("/api/v1/get_all_credit_limits", creditLimit.get_all_credit_limits);
    app.put("/api/v1/update_credit_limit", creditLimit.update_all_credit_limits);
}