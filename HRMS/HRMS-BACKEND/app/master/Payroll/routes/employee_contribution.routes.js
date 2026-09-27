const EmpContributionRate = require("../controller/employee_contribution.controller");
const EmployerContributionRate = require("../controller/employer_contribution_rate.controller");
const EarningTypeController = require("../controller/earning_type_controller");
const MasterPayrollController = require("../controller/payroll_cycle_controller");

const {checkEntityAndFinancialYear} = require('../../../middleware/checkEntityAndFinancialYear');

module.exports = app => {
    
    app.post("/api/v1/createEmpContributionRate", EmpContributionRate.createEmpContributionRate );
    app.get("/api/v1/getAllEmpContributionRate", EmpContributionRate.getAllEmpContributionRate );
    
    // Earning Type
    app.post("/api/v1/createEarningType", EarningTypeController.createEarningType );
    app.get("/api/v1/getAllEarningType", EarningTypeController.getAllEarningType );

    //EMPLOYER CONTRIBUTION RATE
    app.post("/api/v1/createEmplrContributionRate", EmployerContributionRate.createEmplrContributionRate );
    app.get("/api/v1/getAllEmplrContributionRate", EmployerContributionRate.getAllEmplrContributionRate );

    //MASTER PAYROLL CYCLE
    app.post("/api/v1/createPayrollCycle", checkEntityAndFinancialYear, MasterPayrollController.createPayrollCycle);
    app.get("/api/v1/getAllPayrollCycle", checkEntityAndFinancialYear, MasterPayrollController.getAllPayrollCycle);
    app.get("/api/v1/getAllPayrollCycle_Active", checkEntityAndFinancialYear, MasterPayrollController.getAllPayrollCycle_Active);
    app.get("/api/v1/getPayrollCycleById/:id", checkEntityAndFinancialYear, MasterPayrollController.getPayrollCycleById);
    app.put("/api/v1/updatePayrollCycleStatusById/:id", checkEntityAndFinancialYear, MasterPayrollController.updatePayrollCycleById);
}