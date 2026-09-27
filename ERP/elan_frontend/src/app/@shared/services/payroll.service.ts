import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/app/environments/environment';


const databaseKey: any = environment.servralUrl;

const routes = {
  epf: {
    get_Employee_contibutation: () => `${databaseKey}/api/v1/getAllEmpContributionRate`,
    get_Employer_contibutation: () => `${databaseKey}/api/v1/getAllEmplrContributionRate`,
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
    get_statutoryBonus_byId: (id: any) => `${databaseKey}/api/v1/getStatutoryById/${id}`,
    update_statutoryBonus: (id: any) => `${databaseKey}/api/v1/updateStatutory/${id}`,
  },

  earningComponents: {
    create_EarningComponent: () => `${databaseKey}/api/v1/createSalaryComponentEarning`,
    created_EarningComponent_list: () => `${databaseKey}/api/v1/getAllSlryCompEarning`,
    get_EarningComponent_byId: (id: any) => `${databaseKey}/api/v1/getSlryCompEarningById/${id}`,
    update_EarningComponent: (id: any) => `${databaseKey}/api/v1/updateSlryCompEarning/${id}`,
    update_status_byId: (id: any) => `${databaseKey}/api/v1/updateSlryCompEarningStatus/${id}`,
    getAllCreateComp: () => `${databaseKey}/api/v1/getAllCreatedSlryCompEarning`,
    getAllEarningType: () => `${databaseKey}/api/v1/getAllEarningType`,
  },

  reiembursement: {
    create_reiembursement: () => `${databaseKey}/api/v1/createSalaryComponentReimbursement`,
    created_reiembursement_list: () => `${databaseKey}/api/v1/getAllSlryCompReimbursement`,
    get_reiembursement_byId: (id: any) => `${databaseKey}/api/v1/getSlryCompReimbursementById/${id}`,
    update_reiembursement: (id: any) => `${databaseKey}/api/v1/updateSlryCompReimbursement/${id}`,
    update_status_byId: (id: any) => `${databaseKey}/api/v1/updateSlryCompReimbursementStatus/${id}`,
    getAllOtherAllowance:()=>`${databaseKey}/api/v1/getAll_otherAllowance`,
    getAll_percentageList:()=>`${databaseKey}/api/v1/getAll_percentageList`

  },

  deduction: {
    create_deduction: () => `${databaseKey}/api/v1/createSalaryComponentDeduction`,
    created_deduction_list: () => `${databaseKey}/api/v1/getAllSlryCompDeduction`,
    get_deduction_byId: (id: any) => `${databaseKey}/api/v1/getSlryCompDeductionById/${id}`,
    update_deduction: (id: any) => `${databaseKey}/api/v1/updateSlryCompDeduction/${id}`,
    update_status_byId: (id: any) => `${databaseKey}/api/v1/updateSlryCompDeductionStatus/${id}`,
  },

  salaryTemplate: {
    getAllEarningComp: () => `${databaseKey}/api/v1/getAllSlryCompEarningUnformatedData`,
    getAllDeductionComp: () => `${databaseKey}/api/v1/getAllSlryCompDeductionUnformatedData`,
    getAllRiembursementComp: () => `${databaseKey}/api/v1/getAllSlryCompReimbursementUnformatedData`,
    getAllEmployeeGrade: () => `${databaseKey}/api/v1/getAllGrade`,
    getCurrency: () => `${databaseKey}/api/v1/getall_currency_payroll`,

    getAllBranch: () => `${databaseKey}/api/v1/getAllActiveBranch`,
    getAllCompany: () => `${databaseKey}/api/v1/getAllActiveCompany`,
    saveSalaryTemplate: () => `${databaseKey}/api/v1/createSalaryTemplate`,
    saveSalaryTemplateUpdate: (id:any) => `${databaseKey}/api/v1/updateSalaryTemplate/${id}`,

    getAllSalaryTemplate: () => `${databaseKey}/api/v1/getAllSalaryTemplate`,
    updateTemplateStatus_byId: (id: any) => `${databaseKey}/api/v1/updateSalaryTempStatus/${id}`,
    getSalaryTemplateById: (id: any) => `${databaseKey}/api/v1/getSalaryTemplateById/${id}`,
    getAllCompanyWith:(id:any)=>`${databaseKey}/api/v1/getAllCompany_with_entity/${id}`

  },

  payroll_cycle:{
    getAllEntity:() => `${databaseKey}/api/v1/getAllEntityMaster`,
    createPayrollCycle:()=> `${databaseKey}/api/v1/createPayrollCycle`,
    getAllPayrollCycle:()=> `${databaseKey}/api/v1/getAllPayrollCycle`,
    getPayrollCycleById:(id: any) => `${databaseKey}/api/v1/getPayrollCycleById/${id}`,
    updatePayrollCycleStatus_byId: (id: any) => `${databaseKey}/api/v1/updatePayrollCycleStatusById/${id}`,
    getAllPayrollCycleActive: () => `${databaseKey}/api/v1/getAllPayrollCycle_Active`
  },

  Upload_declaration:{
    getAllUploaddeclaration:(query:any) => `${databaseKey}/api/v1/getAllDeclarationForm_by_loginId?loginId=${query?.login_id}&entity_id=${query?.entity_id}&financial_year_id=${query?.financial_year}`,
    createUploaddeclaration:()=> `${databaseKey}/api/v1/createDeclarationForm`,
    deleteUploaddeclaration: (id: any) => `${databaseKey}/api/v1/deleteDeclarationForm/${id}`,
    getUploaddeclarationbyid:(id: any) => `${databaseKey}/api/v1/getByIdDeclarationForm/${id}`,
    updateUploaddeclaration_byId: (id: any) => `${databaseKey}/api/v1/editDeclarationForm/${id}`,
    pendingForApprovalList:()=>`${databaseKey}/api/v1/getAllDeclarationForm_pendingData`,
    updatedDeclaration:()=>`${databaseKey}/api/v1/payroll_DeclarationForm_approval_status`,
    approvedListDeclation:()=>`${databaseKey}/api/v1/getAllDeclarationForm_approvalData`,
    rejectListDeclration:()=>`${databaseKey}/api/v1/getAllDeclarationForm_rejectedData`
  }


}
@Injectable()
export class PayrollService {
  databaseKey: any;
  patchValue(arg0: { travelrequest: any; travel_request_number: any; current_date: any; from_location: any; to_location: any; advance_amt: any; }) {
    throw new Error('Method not implemented.');
  }

  constructor(private httpclient: HttpClient) { }

  getAllUploaddeclarationlist(query:any) {
    return this.httpclient.get(routes.Upload_declaration.getAllUploaddeclaration(query));
  }

  createUploaddeclaration(data: any) {
    return this.httpclient.post(routes.Upload_declaration.createUploaddeclaration(), data);
  }

  deleteUploaddeclaration(id: any) {
    return this.httpclient.delete(routes.Upload_declaration.deleteUploaddeclaration(id));
  }

  getUploaddeclarationbyid(id: any) {
    return this.httpclient.get(routes.Upload_declaration.getUploaddeclarationbyid(id));
  }

  updateUploaddeclaration(id: any, data: any) {
    return this.httpclient.put(routes.Upload_declaration.updateUploaddeclaration_byId(id), data);
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
    return this.httpclient.post(routes.statutoryBonus.create_statutoryBonus(), data);
  }

  updateStatutoryBonus(id: any, data: any) {
    return this.httpclient.put(routes.statutoryBonus.update_statutoryBonus(id), data);
  }

  getAllStatutoryBonusList() {
    return this.httpclient.get(routes.statutoryBonus.created_statutoryBonus_list());
  }

  getStatutoryBonusById(id: any) {
    return this.httpclient.get(routes.statutoryBonus.get_statutoryBonus_byId(id));
  }

  //***************** */ salart Components ///************************************

  createEarningComponent(data: any) {
    return this.httpclient.post(routes.earningComponents.create_EarningComponent(), data);
  }

  updateEarningComponent(id: any, data: any) {
    return this.httpclient.put(routes.earningComponents.update_EarningComponent(id), data);
  }

  getAllEarningComponentList() {
    return this.httpclient.get(routes.earningComponents.created_EarningComponent_list());
  }

  getAllCreatedErningComp() {
    return this.httpclient.get(routes.earningComponents.getAllCreateComp());
  }
  getAllEarningType() {
    return this.httpclient.get(routes.earningComponents.getAllEarningType());
  }



  getEarningComponentById(id: any) {
    return this.httpclient.get(routes.earningComponents.get_EarningComponent_byId(id));
  }

  updateEarningStatus(id: any, data: any) {
    return this.httpclient.put(routes.earningComponents.update_status_byId(id), data);
  }
  getAllOtherAllowance() {
    return this.httpclient.get(routes.reiembursement.getAllOtherAllowance());
  }

  getAll_percentageList(){
    return this.httpclient.get(routes.reiembursement.getAll_percentageList());
  }
  
  createReiembursementComponent(data: any) {
    return this.httpclient.post(routes.reiembursement.create_reiembursement(), data);
  }

  updateReiembursementComponent(id: any, data: any) {
    return this.httpclient.put(routes.reiembursement.update_reiembursement(id), data);
  }

  getAllReiembursementComponentList() {
    return this.httpclient.get(routes.reiembursement.created_reiembursement_list());
  }

  getReiembursementComponentById(id: any) {
    return this.httpclient.get(routes.reiembursement.get_reiembursement_byId(id));
  }

  updateReiembursementStatus(id: any, data: any) {
    return this.httpclient.put(routes.reiembursement.update_status_byId(id), data);
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
    return this.httpclient.post(routes.salaryTemplate.saveSalaryTemplate(), data);
  }

  saveSalaryTemplateUpdate(id:any,data: any) {
    return this.httpclient.put(routes.salaryTemplate.saveSalaryTemplateUpdate(id), data);
  }
  updateTemplateStatus_byId(id: any, data: any) {
    return this.httpclient.put(routes.salaryTemplate.updateTemplateStatus_byId(id), data);
  }

  getSalaryTemplateById(id:any){
    return this.httpclient.get(routes.salaryTemplate.getSalaryTemplateById(id));
  }

  getAllEntityMaster(){
    return this.httpclient.get(routes.payroll_cycle.getAllEntity());
  }

  createPayrollCycle(data:any){
    return this.httpclient.post(routes.payroll_cycle.createPayrollCycle(),data);
  }

  getAllPayrollCycle(){
    return this.httpclient.get(routes.payroll_cycle.getAllPayrollCycle());
  }

  getPayrollCycleById(id:any){
    return this.httpclient.get(routes.payroll_cycle.getPayrollCycleById(id));
  }

  updatePayrollCycleStatus_byId(id: any, data: any) {
    return this.httpclient.put(routes.payroll_cycle.updatePayrollCycleStatus_byId(id), data);
  }

  getPayrollRangeActive(entityType:any,financialYear:any) {
    return this.httpclient.get(routes.payroll_cycle.getAllPayrollCycleActive());
  }

  pendingForApprovalList(){
    return this.httpclient.get(routes.Upload_declaration.pendingForApprovalList());
  }
  updatedDeclaration(data:any){
    return this.httpclient.post(routes.Upload_declaration.updatedDeclaration(),data);
  }

  approvedListDeclation(){
    return this.httpclient.get(routes.Upload_declaration.approvedListDeclation());
  }
  rejectListDeclration(){
    return this.httpclient.get(routes.Upload_declaration.rejectListDeclration());
  }
}

