
const deductionRulesController = require("../controllers/deduction_rules_controller");

module.exports = (app) => {
app.post("/api/v1/create_deduction_rules", deductionRulesController.createDeductionRule);
app.get("/api/v1/getAllDeductionRules", deductionRulesController.getAllDeductionRules);
app.get("/api/v1/getDeductionRuleById/:id", deductionRulesController.getDeductionRuleById);
app.put("/api/v1/updateDeductionRule/:id", deductionRulesController.updateDeductionRule);
app.put("/api/v1/updateDeductionRuleStatus/:id", deductionRulesController.updateDeductionRuleStatus);
app.delete("/api/v1/deleteDeductionRule/:id", deductionRulesController.deleteDeductionRule);
};





