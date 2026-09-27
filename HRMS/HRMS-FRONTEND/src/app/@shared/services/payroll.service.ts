import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.serverUrl;

const routes = {
  epf: {
    get_Employee_contibutation: () =>
      `${databaseKey}/api/v1/getAllEmpContributionRate`,
    get_Employer_contibutation: () =>
      `${databaseKey}/api/v1/getAllEmplrContributionRate`,
    create_EPF: () => `${databaseKey}/api/v1/createEpf`,
    created_list: () => `${databaseKey}/api/v1/getAllEpf`,
    get_EPF_byId: (id: any) => `${databaseKey}/api/v1/getEpfById/${id}`,
    update_EPF: (id: any) => `${databaseKey}/api/v1/updateEpf/${id}`,
    update_status: (id: any) => `${databaseKey}/api/v1/updateEpfStatus/${id}`,
  },
  esi: {
    create_ESI: () => `${databaseKey}/api/v1/createEsi`,
    created_ESI_list: () => `${databaseKey}/api/v1/getAllEsi`,
    get_ESI_byId: (id: any) => `${databaseKey}/api/v1/getEsiById/${id}`,
    update_ESI: (id: any) => `${databaseKey}/api/v1/updateEsi/${id}`,
    update_status: (id: any) => `${databaseKey}/api/v1/updateEsiStatus/${id}`,
  },
  taxslab: {
    create_Taxslab: () => `${databaseKey}/api/v1/createTaxslab`,
    created_Taxslab_list: () => `${databaseKey}/api/v1/getAllTaxslab`,
    get_Taxslab_byId: (id: any) => `${databaseKey}/api/v1/getByIdTaxslab/${id}`,
    update_Taxslab: (id: any) => `${databaseKey}/api/v1/editTaxslab/${id}`,
    delete_Taxslab: (id: any) => `${databaseKey}/api/v1/deleteTaxslab/${id}`,
  },
  statutoryBonus: {
    create_statutoryBonus: () => `${databaseKey}/api/v1/createStatutory`,
    created_statutoryBonus_list: () => `${databaseKey}/api/v1/getAllStatutory`,
    get_statutoryBonus_byId: (id: any) =>
      `${databaseKey}/api/v1/getStatutoryById/${id}`,
    update_statutoryBonus: (id: any) =>
      `${databaseKey}/api/v1/updateStatutory/${id}`,
  },

  earningComponents: {
    create_EarningComponent: () =>
      `${databaseKey}/api/v1/createSalaryComponentEarning`,
    create_Variable_EarningComponent: () =>
      `${databaseKey}/api/v1/createSalaryComponentVariableEarning`,
    created_EarningComponent_list: () =>
      `${databaseKey}/api/v1/getAllSlryCompEarning`,
    get_All_Variable_Earning_list: () =>
      `${databaseKey}/api/v1/getAllCreatedSlryVariableEarning`,
    get_EarningComponent_byId: (id: any) =>
      `${databaseKey}/api/v1/getSlryCompEarningById/${id}`,
    get_Variable_EarningComponent_byId: (id: any) =>
      `${databaseKey}/api/v1/getSlryCompVariableEarningById/${id}`,
    update_EarningComponent: (id: any) =>
      `${databaseKey}/api/v1/updateSlryCompEarning/${id}`,
    update_Variable_EarningComponent: (id: any) =>
      `${databaseKey}/api/v1/updateSlryCompVariableEarning/${id}`,
    update_status_byId: (id: any) =>
      `${databaseKey}/api/v1/updateSlryCompEarningStatus/${id}`,
    update_Variable_Earning_Status_byId: (id: any) =>
      `${databaseKey}/api/v1/updateSlryCompVariableEarningStatus/${id}`,
    getAllCreateComp: () =>
      `${databaseKey}/api/v1/getAllCreatedSlryCompEarning`,
    getAllEarningType: () => `${databaseKey}/api/v1/getAllEarningType`,
  },

  reiembursement: {
    create_reiembursement: () =>
      `${databaseKey}/api/v1/createSalaryComponentReimbursement`,
    created_reiembursement_list: () =>
      `${databaseKey}/api/v1/getAllSlryCompReimbursement`,
    get_reiembursement_byId: (id: any) =>
      `${databaseKey}/api/v1/getSlryCompReimbursementById/${id}`,
    update_reiembursement: (id: any) =>
      `${databaseKey}/api/v1/updateSlryCompReimbursement/${id}`,
    update_status_byId: (id: any) =>
      `${databaseKey}/api/v1/updateSlryCompReimbursementStatus/${id}`,
    getAllOtherAllowance: () => `${databaseKey}/api/v1/getAll_otherAllowance`,
    getAll_percentageList: () => `${databaseKey}/api/v1/getAll_percentageList`,
  },

  deduction: {
    create_deduction: () =>
      `${databaseKey}/api/v1/createSalaryComponentDeduction`,
    created_deduction_list: () =>
      `${databaseKey}/api/v1/getAllSlryCompDeduction`,
    get_deduction_byId: (id: any) =>
      `${databaseKey}/api/v1/getSlryCompDeductionById/${id}`,
    update_deduction: (id: any) =>
      `${databaseKey}/api/v1/updateSlryCompDeduction/${id}`,
    update_status_byId: (id: any) =>
      `${databaseKey}/api/v1/updateSlryCompDeductionStatus/${id}`,
  },

  salaryTemplate: {
    getAllEarningComp: () =>
      `${databaseKey}/api/v1/getAllSlryCompEarningUnformatedData`,
    getAllDeductionComp: () =>
      `${databaseKey}/api/v1/getAllSlryCompDeductionUnformatedData`,
    getAllRiembursementComp: () =>
      `${databaseKey}/api/v1/getAllSlryCompReimbursementUnformatedData`,
    getAllvariableearningComp: () =>
      `${databaseKey}/api/v1/getAllActiveVariableEarning`,
    getAllEmployeeGrade: () => `${databaseKey}/api/v1/getAllGrade`,
    getCurrency: () => `${databaseKey}/api/v1/getall_currency_payroll`,

    getAllBranch: () => `${databaseKey}/api/v1/getAllActiveBranch`,
    getAllCompany: () => `${databaseKey}/api/v1/getAllActiveCompany`,
    saveSalaryTemplate: () => `${databaseKey}/api/v1/createSalaryTemplate`,
    saveSalaryTemplateUpdate: (id: any) =>
      `${databaseKey}/api/v1/updateSalaryTemplate/${id}`,

    getAllSalaryTemplate: () => `${databaseKey}/api/v1/getAllSalaryTemplate`,
    updateTemplateStatus_byId: (id: any) =>
      `${databaseKey}/api/v1/updateSalaryTempStatus/${id}`,
    getSalaryTemplateById: (id: any) =>
      `${databaseKey}/api/v1/getSalaryTemplateById/${id}`,
    getSalaryTemplateByIdDuplicate: (id: any) =>
      `${databaseKey}/api/v1/getSalaryTemplateById_update/${id}`,
    getAllCompanyWith: (id: any) =>
      `${databaseKey}/api/v1/getAllCompany_with_entity/${id}`,
  },

  payroll_cycle: {
    getAllEntity: () => `${databaseKey}/api/v1/getAllEntityMaster`,
    createPayrollCycle: () => `${databaseKey}/api/v1/createPayrollCycle`,
    getAllPayrollCycle: () => `${databaseKey}/api/v1/getAllPayrollCycle`,
    getPayrollCycleById: (id: any) =>
      `${databaseKey}/api/v1/getPayrollCycleById/${id}`,
    updatePayrollCycleStatus_byId: (id: any) =>
      `${databaseKey}/api/v1/updatePayrollCycleStatusById/${id}`,
    getAllPayrollCycleActive: () =>
      `${databaseKey}/api/v1/getAllPayrollCycle_Active`,
  },

  Upload_declaration: {
    getAllUploaddeclaration: (query: any) =>
      `${databaseKey}/api/v1/getAllDeclarationForm_by_loginId?loginId=${query?.login_id}&entity_id=${query?.entity_id}&financial_year_id=${query?.financial_year}`,
    createUploaddeclaration: () =>
      `${databaseKey}/api/v1/createDeclarationForm`,
    deleteUploaddeclaration: (id: any) =>
      `${databaseKey}/api/v1/deleteDeclarationForm/${id}`,
    getUploaddeclarationbyid: (id: any) =>
      `${databaseKey}/api/v1/getByIdDeclarationForm/${id}`,
    updateUploaddeclaration_byId: (id: any) =>
      `${databaseKey}/api/v1/editDeclarationForm/${id}`,
    pendingForApprovalList: (login_id: any) =>
      `${databaseKey}/api/v1/getAllDeclarationForm_pendingData/${login_id}`,
    updatedDeclaration: () =>
      `${databaseKey}/api/v1/payroll_DeclarationForm_approval_status`,
    approvedListDeclation: (login_id: any) =>
      `${databaseKey}/api/v1/getAllDeclarationForm_approvalData/${login_id}`,
    rejectListDeclration: (login_id: any) =>
      `${databaseKey}/api/v1/getAllDeclarationForm_rejectedData/${login_id}`,
    DeclrationType: () =>
      `${databaseKey}/api/v1/getAllDeclarationType`,
  },

  gratuity: {
    Gratuity: () => `${databaseKey}/api/v1/create_gratuity`,
    getGratuity: () => `${databaseKey}/api/v1/getAllGratuity`
  },
nps:{
GetCraProvider:()=>`${databaseKey}/api/v1/getAllCraProvider`,
createNpsScheme:()=>`${databaseKey}/api/v1/createNpsScheme`,
getAllNps:()=>`${databaseKey}/api/v1/getAllNps`
},

superannuation:{
  getAllSuperannuationProvider:()=>`${databaseKey}/api/v1/getAllsuperannuationProvider`,
  createOrupdateSuperannuation:()=>`${databaseKey}/api/v1/createOrupdateSuperannuation`,
  getAllSuperannuationScheme:()=>`${databaseKey}/api/v1/getAllSuperannuationScheme`,
},
compliance_limit:{
  createCompliance:()=>`${databaseKey}/api/v1/createComplianceFinancial`,
  getComplianceLimit:()=>`${databaseKey}/api/v1/getComplianceLimit`,
},
tax_calculation:{
  createTaxMaster:()=>`${databaseKey}/api/v1/createTaxMaster`,
  getAllTaxMasters:()=>`${databaseKey}/api/v1/getAllTaxMasters`,
},
 variable_allotment: {
    addVariablEarning: () => `${databaseKey}/api/v1/createVariableEarning`,
    deleteVariableAllotmentEarning: (id: any) => `${databaseKey}/api/v1/deleteVariableAllotmentEarning/${id}`,
     updateVariableAllotmentEarning: (id: number) =>
      `${databaseKey}/api/v1/updateVariableAllotmentEarning/${id}`,
    getAllVariableEarning: () => `${databaseKey}/api/v1/getAllVariableEarning`,
    UpdateVariableAllotmentStatusById: (id: any) => `${databaseKey}/api/v1/UpdateVariableAllotmentStatusById/${id}`,
    getVariableEarningById: (id: any) => `${databaseKey}/api/v1/getVariableEarningById/${id}`
  },
  employee_apprisal: {
    createEmpApprisal: () => `${databaseKey}/api/v1/send_appraisal_approval`,
    getLevelAproval: (id: any) =>
      `${databaseKey}/api/v1/getAll_Approval_level_appraisal/${id}`,
    getAllTobeApproved: (id: any) =>
      `${databaseKey}/api/v1/get_levels_to_be_approved_appraisal/${id}`,
    pendingToBeUpdate: (id: any) =>
      `${databaseKey}/api/v1/approved_level_of_appraisal_request/${id}`,
    getByApprisal: (id: any) =>
      `${databaseKey}/api/v1/get_requested_appraisal_data/${id}`,
    getAllRejectApprisal: (id: any) =>
      `${databaseKey}/api/v1/get_Rejected_Approvals_appraisal/${id}`,
    getAllApprovedAppraisal: (id: any) =>
      `${databaseKey}/api/v1/get_Approved_Approvals_appraisal/${id}`,
  },

  appraisal_duration: {
    createAppraisalDuration: () =>
      `${databaseKey}/api/v1/createApprisalDuration`,
    getAllAppraisalDuration: () =>
      `${databaseKey}/api/v1/getAllAppraisalDuration`,
    updateStatusDuration: (id: any) =>
      `${databaseKey}/api/v1/updateAppraisalStatus/${id}`,
    getByAppraisalDuration: (id: any) =>
      `${databaseKey}/api/v1/getByIdAppraisalDuration/${id}`,
    updateAppraisalDuration: (id: any) =>
      `${databaseKey}/api/v1/editAppraisalDuration/${id}`,
    deleteAppraisalDuration: (id: any) =>
      `${databaseKey}/api/v1/deleteAppraisalDuration/${id}`,
    getEmployeePMSRating: (query: any) =>
      `${databaseKey}/api/v1/get_user_ranking?login_id=${query?.login_id}&entity_id=${query?.entity_id}&filter_fy=${query?.filter_fy}`,
  },
  professional_tax: {
    // getEntityStateDataById: () =>
    //   `${databaseKey}/api/v1/get-entity-state-data-by-id`,
    createPt: () => `${databaseKey}/api/v1/create-pt`,
    getAllPt: () => `${databaseKey}/api/v1/get-all-pt`,
    updatePtStatusById: (id: any) =>
      `${databaseKey}/api/v1/update-pt-status-by-id/${id}`,
    getPtById: (id: any) => `${databaseKey}/api/v1/get-pt-by-id/${id}`,
    updatePtById: (id: any) => `${databaseKey}/api/v1/update-pt-by-id/${id}`,
  },
  labour_welfare_fund: {
    createLwf: () => `${databaseKey}/api/v1/create-lwf`,
    getAllLwf: () => `${databaseKey}/api/v1/get-all-lwf`,
    updateLwfStatusById: (id: any) =>
      `${databaseKey}/api/v1/update-lwf-status-by-id/${id}`,
    getLwfById: (id: any) => `${databaseKey}/api/v1/get-lwf-by-id/${id}`,
    updateLwfById: (id: any) => `${databaseKey}/api/v1/update-lwf-by-id/${id}`,
  },
  compliance_details: {
    getComplianceDetails: (employee_id: any) => `${databaseKey}/api/v1/get-compliance-details/${employee_id}`,
  },

  declaration:{
    getAllDeclaration:()=>`${databaseKey}/api/v1/getAllDeclarationType`,
    createDeclarations:()=>`${databaseKey}/api/v1/createDeclarations`,
    getAllDeductionChapter:(employee_id:any)=>`${databaseKey}/api/v1/getAllDeductionChapter/${employee_id}` 
  },
  housesonrent:{
    createHousesOnRent:()=>`${databaseKey}/api/v1/createHousesOnRent`,
    getHousesOnRent:(employee_id:any)=>`${databaseKey}/api/v1/getHousesOnRent/${employee_id}`,
    // getAllDeductionChapter:()=>`${databaseKey}/api/v1/getAllDeductionChapter` 
  },
  houseProperty:{
    createHouseProperty:()=>`${databaseKey}/api/v1/createHouseProperty`,
    getAllHouseProperties:(employee_id:any)=>`${databaseKey}/api/v1/getAllHouseProperties/${employee_id}`,
   getAllSectionTotal:(employee_id:any)=>`${databaseKey}/api/v1/getAllSectionTotal/${employee_id}`
  },
};
@Injectable()
export class PayrollService {
  databaseKey: any;

  constructor(private httpclient: HttpClient) { }

  getAllDeductionChapter(employee_id:any) {
    return this.httpclient.get(
      routes.declaration.getAllDeductionChapter(employee_id)
    );
  }
  getAllDeclaration() {
    return this.httpclient.get(
      routes.declaration.getAllDeclaration()
    );
  }
  createDeclarations(payload:any) {
    return this.httpclient.post(
      routes.declaration.createDeclarations(),payload
    );
  }
  getAllUploaddeclarationlist(query: any) {
    return this.httpclient.get(
      routes.Upload_declaration.getAllUploaddeclaration(query)
    );
  }

   createHousesOnRent(payload:any) {
    return this.httpclient.post(
      routes.housesonrent.createHousesOnRent(),payload
    );
  }
   getHousesOnRent(employee_id:any) {
    return this.httpclient.get(
      routes.housesonrent.getHousesOnRent(employee_id)
    );
  }

   createHouseProperty(payload:any) {
    return this.httpclient.post(
      routes.houseProperty.createHouseProperty(),payload
    );
  }
   getAllHouseProperties(employee_id:any) {
    return this.httpclient.get(
      routes.houseProperty.getAllHouseProperties(employee_id)
    );
  }
   getAllSectionTotal(employee_id:any) {
    return this.httpclient.get(
      routes.houseProperty.getAllSectionTotal(employee_id)
    );
  }
  createUploaddeclaration(data: any) {
    return this.httpclient.post(
      routes.Upload_declaration.createUploaddeclaration(),
      data
    );
  }

  deleteUploaddeclaration(id: any) {
    return this.httpclient.delete(
      routes.Upload_declaration.deleteUploaddeclaration(id)
    );
  }

  getUploaddeclarationbyid(id: any) {
    return this.httpclient.get(
      routes.Upload_declaration.getUploaddeclarationbyid(id)
    );
  }

  updateUploaddeclaration(id: any, data: any) {
    return this.httpclient.put(
      routes.Upload_declaration.updateUploaddeclaration_byId(id),
      data
    );
  }

  createTaxslab(data: any) {
    return this.httpclient.post(routes.taxslab.create_Taxslab(), data);
  }

  updateTaxslab(id: any, data: any) {
    return this.httpclient.put(routes.taxslab.update_Taxslab(id), data);
  }
  deleteTaxslab(id: any) {
    return this.httpclient.delete(routes.taxslab.delete_Taxslab(id));
  }

  getAllCreatedTaxslabList() {
    return this.httpclient.get(routes.taxslab.created_Taxslab_list());
  }

  getTaxslabbyId(id: any) {
    return this.httpclient.get(routes.taxslab.get_Taxslab_byId(id));
  }

  getEmployeeContibutation() {
    return this.httpclient.get(routes.epf.get_Employee_contibutation());
  }

  getEmployerContibutation() {
    return this.httpclient.get(routes.epf.get_Employer_contibutation());
  }

  createEPF(data: any) {
    return this.httpclient.post(routes.epf.create_EPF(), data);
  }

  updateEPF(id: any, data: any) {
    return this.httpclient.put(routes.epf.update_EPF(id), data);
  }

  updateESIStatus(id: any, data: any) {
    return this.httpclient.put(routes.esi.update_status(id), data);
  }

  updateEPFStatusById(id: any, data: any) {
    return this.httpclient.put(routes.epf.update_status(id), data);
  }

  getAllCreatedEPfList() {
    return this.httpclient.get(routes.epf.created_list());
  }

  getEPFbyId(id: any) {
    return this.httpclient.get(routes.epf.get_EPF_byId(id));
  }

  createESI(data: any) {
    return this.httpclient.post(routes.esi.create_ESI(), data);
  }

  updateESI(id: any, data: any) {
    return this.httpclient.put(routes.esi.update_ESI(id), data);
  }

  getAllCreatedESIList() {
    return this.httpclient.get(routes.esi.created_ESI_list());
  }

  getESIbyId(id: any) {
    return this.httpclient.get(routes.esi.get_ESI_byId(id));
  }

  createStatutoryBonus(data: any) {
    return this.httpclient.post(
      routes.statutoryBonus.create_statutoryBonus(),
      data
    );
  }

  updateStatutoryBonus(id: any, data: any) {
    return this.httpclient.put(
      routes.statutoryBonus.update_statutoryBonus(id),
      data
    );
  }

  getAllStatutoryBonusList() {
    return this.httpclient.get(
      routes.statutoryBonus.created_statutoryBonus_list()
    );
  }

  getStatutoryBonusById(id: any) {
    return this.httpclient.get(
      routes.statutoryBonus.get_statutoryBonus_byId(id)
    );
  }

  //***************** */ salart Components ///************************************

  createEarningComponent(data: any) {
    return this.httpclient.post(
      routes.earningComponents.create_EarningComponent(),
      data
    );
  }
  createVariableEarningComponent(data: any) {
    return this.httpclient.post(
      routes.earningComponents.create_Variable_EarningComponent(),
      data
    );
  }

  updateEarningComponent(id: any, data: any) {
    return this.httpclient.put(
      routes.earningComponents.update_EarningComponent(id),
      data
    );
  }
  updateVariableEarningComponent(id: any, data: any) {
    return this.httpclient.put(
      routes.earningComponents.update_Variable_EarningComponent(id),
      data
    );
  }

  getAllEarningComponentList() {
    return this.httpclient.get(
      routes.earningComponents.created_EarningComponent_list()
    );
  }
  getAllVariableEarningComponentList() {
    return this.httpclient.get(
      routes.earningComponents.get_All_Variable_Earning_list()
    );
  }

  getAllCreatedErningComp() {
    return this.httpclient.get(routes.earningComponents.getAllCreateComp());
  }
  getAllEarningType() {
    return this.httpclient.get(routes.earningComponents.getAllEarningType());
  }

  getEarningComponentById(id: any) {
    return this.httpclient.get(
      routes.earningComponents.get_EarningComponent_byId(id)
    );
  }
  getVariableEarningComponentById(id: any) {
    return this.httpclient.get(
      routes.earningComponents.get_Variable_EarningComponent_byId(id)
    );
  }

  updateEarningStatus(id: any, data: any) {
    return this.httpclient.put(
      routes.earningComponents.update_status_byId(id),
      data
    );
  }
  updateVariableEarningStatus(id: any, data: any) {
    return this.httpclient.put(
      routes.earningComponents.update_Variable_Earning_Status_byId(id),
      data
    );
  }
  getAllOtherAllowance() {
    return this.httpclient.get(routes.reiembursement.getAllOtherAllowance());
  }

  getAll_percentageList() {
    return this.httpclient.get(routes.reiembursement.getAll_percentageList());
  }

  createReiembursementComponent(data: any) {
    return this.httpclient.post(
      routes.reiembursement.create_reiembursement(),
      data
    );
  }

  updateReiembursementComponent(id: any, data: any) {
    return this.httpclient.put(
      routes.reiembursement.update_reiembursement(id),
      data
    );
  }

  getAllReiembursementComponentList() {
    return this.httpclient.get(
      routes.reiembursement.created_reiembursement_list()
    );
  }

  getReiembursementComponentById(id: any) {
    return this.httpclient.get(
      routes.reiembursement.get_reiembursement_byId(id)
    );
  }

  updateReiembursementStatus(id: any, data: any) {
    return this.httpclient.put(
      routes.reiembursement.update_status_byId(id),
      data
    );
  }

  createDeductionComponent(data: any) {
    return this.httpclient.post(routes.deduction.create_deduction(), data);
  }

  updateDeductionComponent(id: any, data: any) {
    return this.httpclient.put(routes.deduction.update_deduction(id), data);
  }

  getAllDeductionComponentList() {
    return this.httpclient.get(routes.deduction.created_deduction_list());
  }

  getDeductionComponentById(id: any) {
    return this.httpclient.get(routes.deduction.get_deduction_byId(id));
  }

  updateDeductionStatus(id: any, data: any) {
    return this.httpclient.put(routes.deduction.update_status_byId(id), data);
  }

  //***************** */ Salary Template Create ///************************************
  getAllEarningCompList() {
    return this.httpclient.get(routes.salaryTemplate.getAllEarningComp());
  }

  getAllDeductionCompList() {
    return this.httpclient.get(routes.salaryTemplate.getAllDeductionComp());
  }
  getAllRiembursementCompList() {
    return this.httpclient.get(routes.salaryTemplate.getAllRiembursementComp());
  }
  getAllVariableearningComponentList() {
    return this.httpclient.get(routes.salaryTemplate.getAllvariableearningComp());
  }
  getAllEmployeeGradeList() {
    return this.httpclient.get(routes.salaryTemplate.getAllEmployeeGrade());
  }
  getCurrency() {
    return this.httpclient.get(routes.salaryTemplate.getCurrency());
  }
  getAllBranch() {
    return this.httpclient.get(routes.salaryTemplate.getAllBranch());
  }
  getAllCompany() {
    return this.httpclient.get(routes.salaryTemplate.getAllCompany());
  }

  getAllSalaryTemplate() {
    return this.httpclient.get(routes.salaryTemplate.getAllSalaryTemplate());
  }

  saveSalaryTemplate(data: any) {
    return this.httpclient.post(
      routes.salaryTemplate.saveSalaryTemplate(),
      data
    );
  }

  saveSalaryTemplateUpdate(id: any, data: any) {
    return this.httpclient.put(
      routes.salaryTemplate.saveSalaryTemplateUpdate(id),
      data
    );
  }
  updateTemplateStatus_byId(id: any, data: any) {
    return this.httpclient.put(
      routes.salaryTemplate.updateTemplateStatus_byId(id),
      data
    );
  }

  getSalaryTemplateById(id: any) {
    return this.httpclient.get(routes.salaryTemplate.getSalaryTemplateById(id));
  }

  getSalaryTemplateByIdDuplicate(id: any) {
    return this.httpclient.get(
      routes.salaryTemplate.getSalaryTemplateByIdDuplicate(id)
    );
  }

  getAllEntityMaster() {
    return this.httpclient.get(routes.payroll_cycle.getAllEntity());
  }

  createPayrollCycle(data: any) {
    return this.httpclient.post(
      routes.payroll_cycle.createPayrollCycle(),
      data
    );
  }

  getAllPayrollCycle() {
    return this.httpclient.get(routes.payroll_cycle.getAllPayrollCycle());
  }

  getPayrollCycleById(id: any) {
    return this.httpclient.get(routes.payroll_cycle.getPayrollCycleById(id));
  }

  updatePayrollCycleStatus_byId(id: any, data: any) {
    return this.httpclient.put(
      routes.payroll_cycle.updatePayrollCycleStatus_byId(id),
      data
    );
  }

  getPayrollRangeActive(entityType: any, financialYear: any) {
    return this.httpclient.get(routes.payroll_cycle.getAllPayrollCycleActive());
  }

  pendingForApprovalList(login_id: any) {
    return this.httpclient.get(
      routes.Upload_declaration.pendingForApprovalList(login_id)
    );
  }
  updatedDeclaration(data: any) {
    return this.httpclient.post(
      routes.Upload_declaration.updatedDeclaration(),
      data
    );
  }

  approvedListDeclation(login_id: any) {
    return this.httpclient.get(
      routes.Upload_declaration.approvedListDeclation(login_id)
    );
  }
  rejectListDeclration(login_id: any) {
    return this.httpclient.get(
      routes.Upload_declaration.rejectListDeclration(login_id)
    );
  }
  DeclrationType() {
    return this.httpclient.get(
      routes.Upload_declaration.DeclrationType()
    );
  }

  createOrUpdateGratuity(payload: any) {
    return this.httpclient.post(
      routes.gratuity.Gratuity(), payload
    );
  }
  getAllGratuity() {
    return this.httpclient.get(
      routes.gratuity.getGratuity()
    );
  }
  GetCraProvider() {
    return this.httpclient.get(
      routes.nps.GetCraProvider()
    );
  }
  createNpsScheme(data: any) {
    return this.httpclient.post(
      routes.nps.createNpsScheme(), data);
  }
  getAllNps() {
    return this.httpclient.get(
      routes.nps.getAllNps());
  }
  // variable allotment
  addVariablEarning(payload: any) {
    return this.httpclient.post(
      routes.variable_allotment.addVariablEarning(),
      payload
    );
  }
  updateVariableAllotmentEarning(id: number, payload: any) {
  return this.httpclient.put(routes.variable_allotment.updateVariableAllotmentEarning(id), payload);
}


  getAllVariableEarning() {
    return this.httpclient.get(
      routes.variable_allotment.getAllVariableEarning()
    );
  }
  deleteVariableAllotmentEarning(id:any) {
    console.log("api callledddd");    
    return this.httpclient.delete(
      routes.variable_allotment.deleteVariableAllotmentEarning(id)
    );
  }
  UpdateVariableAllotmentStatusById(leaveId: any, status: any) {
    return this.httpclient.put(routes.variable_allotment.UpdateVariableAllotmentStatusById(leaveId), status)
  }

 getVariableEarningById(id: any) {
  return this.httpclient.get(routes.variable_allotment.getVariableEarningById(id));
}

getAllSuperannuationProvider(){
  return this.httpclient.get(routes.superannuation.getAllSuperannuationProvider());
}
createOrupdateSuperannuation(data:any){
  return this.httpclient.post(routes.superannuation.createOrupdateSuperannuation(),data);
}
getAllSuperannuationScheme(){
  return this.httpclient.get(routes.superannuation.getAllSuperannuationScheme());
}
createCompliance(data:any){
  return this.httpclient.post(routes.compliance_limit.createCompliance(),data);
}
getComplianceLimit(){
  return this.httpclient.get(routes.compliance_limit.getComplianceLimit());
}
createTaxMaster(data:any){
  return this.httpclient.post(routes.tax_calculation.createTaxMaster(),data);
}
getAllTaxMasters(){
  return this.httpclient.get(routes.tax_calculation.getAllTaxMasters());
}


  createEmpApprisal(data: any) {
    return this.httpclient.post(
      routes.employee_apprisal.createEmpApprisal(),
      data
    );
  }

  getLevelAproval(id: any) {
    return this.httpclient.get(routes.employee_apprisal.getLevelAproval(id));
  }

  getAllTobeApproved(id: any, data: any) {
    return this.httpclient.post(
      routes.employee_apprisal.getAllTobeApproved(id),
      data
    );
  }

  pendingToBeUpdate(id: any, data: any) {
    return this.httpclient.post(
      routes.employee_apprisal.pendingToBeUpdate(id),
      data
    );
  }

  getByApprisal(id: any) {
    return this.httpclient.get(routes.employee_apprisal.getByApprisal(id));
  }

  getAllRejectApprisal(id: any, data: any) {
    return this.httpclient.post(
      routes.employee_apprisal.getAllRejectApprisal(id),
      data
    );
  }

  getAllApprovedAppraisal(id: any) {
    return this.httpclient.get(
      routes.employee_apprisal.getAllApprovedAppraisal(id)
    );
  }

  createAppraisalDuration(data: any) {
    return this.httpclient.post(
      routes.appraisal_duration.createAppraisalDuration(),
      data
    );
  }

  getAllAppraisalDuration() {
    return this.httpclient.get(
      routes.appraisal_duration.getAllAppraisalDuration()
    );
  }

  updateStatusDuration(id: any, data: any) {
    return this.httpclient.post(
      routes.appraisal_duration.updateStatusDuration(id),
      data
    );
  }

  getByAppraisalDuration(id: any) {
    return this.httpclient.get(
      routes.appraisal_duration.getByAppraisalDuration(id)
    );
  }

  updateAppraisalDuration(id: any, data: any) {
    return this.httpclient.put(
      routes.appraisal_duration.updateAppraisalDuration(id),
      data
    );
  }
  deleteAppraisalDuration(id: any) {
    return this.httpclient.delete(
      routes.appraisal_duration.deleteAppraisalDuration(id)
    );
  }
  getEmployeePMSRating(id: any) {
    return this.httpclient.get(
      routes.appraisal_duration.getEmployeePMSRating(id)
    );
  }
  ////////////////
  // getEntityStateDataById() {
  //   return this.httpclient.get(
  //     routes.professional_tax.getEntityStateDataById()
  //  );
  // }
  createPt(data: any) {
    return this.httpclient.post(routes.professional_tax.createPt(), data);
  }
  getAllPt() {
    return this.httpclient.get(routes.professional_tax.getAllPt());
  }
  updatePtStatusById(id: any, data: any) {
    return this.httpclient.put(
      routes.professional_tax.updatePtStatusById(id),
      data
    );
  }
  getPtById(id: any) {
    return this.httpclient.get(routes.professional_tax.getPtById(id));
  }
  updatePtById(id: any, data: any) {
    return this.httpclient.put(routes.professional_tax.updatePtById(id), data);
  }
  /////////////
  createLwf(data: any) {
    return this.httpclient.post(routes.labour_welfare_fund.createLwf(), data);
  }
  getAllLwf() {
    return this.httpclient.get(routes.labour_welfare_fund.getAllLwf());
  }
  updateLwfStatusById(id: any, data: any) {
    return this.httpclient.put(
      routes.labour_welfare_fund.updateLwfStatusById(id),
      data
    );
  }
  getLwfById(id: any) {
    return this.httpclient.get(routes.labour_welfare_fund.getLwfById(id));
  }
  updateLwfById(id: any, data: any) {
    return this.httpclient.put(routes.labour_welfare_fund.updateLwfById(id), data);
  }
  //////////////
  getComplianceDetails(employee_id: any) {
    return this.httpclient.get(routes.compliance_details.getComplianceDetails(employee_id));
  }
}
