import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.serverUrl;
// const databaseKey1: any = environment.serverUrl1;

const routes = {
  signUp: {
    BasicSignUp: () => `${databaseKey}/api/auth/signup`,
    regionList: () => `${databaseKey}/api/v1/regionlist`,
    gradeList: () => `${databaseKey}/api/v1/gradelist`,
    userGetById: (employee_id: any) =>
      `${databaseKey}/api/auth/userbyid/${employee_id}`,
    getRegionBySegID: (certificate_type_id: any) =>
      `${databaseKey}/api/v1/get_BysegmentId_new_region/${certificate_type_id}`,
    update: (employee_id: any) =>
      `${databaseKey}/api/auth/updateByEmployee_id/${employee_id}`,
    getSinglePrasentDetails: (employee_id: any) =>
      `${databaseKey}/api/auth/get_present_Details_Single/${employee_id}`,
    updateSinglePrasentDetails: (employee_id: any) =>
      `${databaseKey}/api/auth/update_present_Details_Single/${employee_id}`,

    getById: (id: any, emp_id: any) =>
      `${databaseKey}/api/v1/get_by_id_approved_onboarding/${id}/${emp_id}`,
    outerForm: () => `${databaseKey}/api/auth/create_candidate`,
    getemployeeCode: () => `${databaseKey}/api/auth/generateEmpCode`,
    updateAttaindance: () => `${databaseKey}/api/v1/update_total_attendance`,
  },
  dropDownList: {
    getAllDesignation: () => `${databaseKey}/api/v1/getAllDesignation`,
    regionlist: () => `${databaseKey}/api/v1/getAll_new_region`,
    getAllDepartment: (id?: any) =>
      `${databaseKey}/api/v1/getAllDepartment?entity_id=${id}`,
    getAllBandtype: () => `${databaseKey}/api/v1/getAllBrand`,
    getAllBrand: () => `${databaseKey}/api/v1/getAllBrand`,
    gradelist: () => `${databaseKey}/api/v1/gradelist`,
    employmentlist: () => `${databaseKey}/api/v1/employmentlist`,
    officeLocationall: () => `${databaseKey}/api/v1/getAlllocation`,
    officePhysicalLocationall: () => `${databaseKey}/api/v1/officeLocationall`,
    getAllcountry: () => `${databaseKey}/api/v1/getAllcountry`,
    getAllActivecountry: () => `${databaseKey}/api/v1/getAllActivecountry`,
    getAllstate: () => `${databaseKey}/api/v1/getallstatescontroller`,
    getStateByCountry: (id: any) =>
      `${databaseKey}/api/v1/getstatesbycountryid/${id}`,
    getCityByState: (id: any) => `${databaseKey}/api/v1/getcitybystateid/${id}`,
    getPincodeByCity: (id: any) =>
      `${databaseKey}/api/v1/getpincodebycityid/${id}`,
    get_all_active_grade: (entity_id: any) =>
      `${databaseKey}/api/v1/get_all_active_grade?entity_id=${entity_id}`,
    get_all_active_division: (entity_id: any) =>
      `${databaseKey}/api/v1/get_all_active_division?entity_id=${entity_id}`,
    getGradeListByBranch: (req: any) =>
      `${databaseKey}/api/v1/getGradeListByBranch?entity_id=${req?.entity_id}&branch_id=${req?.branch_id}&financial_id=${req?.financial_id}`,
  },

  getSingleFamily: (id: any) => `${databaseKey}/api/v1/getfamilydetails/${id}`,
  updateSingleFamily: (id: any) =>
    `${databaseKey}/api/v1/familydetailupdate/${id}`,
  deleteSingleFamily: (id: any) =>
    `${databaseKey}/api/v1/deletefamilydetails/${id}`,

  createPreEmp: () => `${databaseKey}/api/v1/prevempdetail`,
  updatePreEmp: (id: any) =>
    `${databaseKey}/api/v1/update_previous_detail_emp/${id}`,
  getSinglePreEmp: (id: any) => `${databaseKey}/api/v1/getprevempdetails/${id}`,
  deleteSinglePreEmp: (id: any) =>
    `${databaseKey}/api/v1/deleteprevempdetails/${id}`,
  // outerForm For Condidate
  employeeForm: (id: any) => `${databaseKey}/api/v1_get_employee/${id}`,
  employeeFormSubmit: (id: any) =>
    `${databaseKey}/api/v1/sending_status_on_form_submit/${id}`,
  TrackOuterform: (id: any) =>
    `${databaseKey}/api/auth/form_submit_status/${id}`,
  getSalaryBeakup: (id: any) =>
    `${databaseKey}/api/v1/salary_calculate_by_id/${id}`,
  getEmpData: (id: any) => `${databaseKey}/api/v1/employee_data/${id}`,
  getEmplistData: (entity_id: any) =>
    `${databaseKey}/api/v1/getAll_userBY_entity/${entity_id}`,

  signUpList: {
    employList: (entity_id: any, role_master_name: any) =>
      `${databaseKey}/api/auth/registrationall?entity_id=${entity_id}&role_master_name=${role_master_name}`,
    deleteSingleEmployee: (id: any) =>
      `${databaseKey}/api/auth/updateEmpDetail/${id}`,
    deleteAuditor: (id: any) =>
      `${databaseKey}/api/v1/deleted_auditorbyid/${id}`,
    getTheEmployeeExportExcel: (entity_id: any, role_master_name: any) =>
      `${databaseKey}/api/auth/getAllUserExportInExcel?entity_id=${entity_id}&role_master_name=${role_master_name}`,
    getAutofetchBranch: (id: any) =>
      `${databaseKey}/api/auth/getAutoFetchbranchName/${id}`,
    getAllRegisterUser: () => `${databaseKey}/api/v1/allRegisterUser`,
    employListby_entity: (entity_id: any, role_master_name: any) =>
      `${databaseKey}/api/auth/all_userby_entity?entity_id=${entity_id}&role_master_name=${role_master_name}`,
  },
  getSingleEmp: (id: any) => `${databaseKey}/api/auth/userbyid/${id}`,
  getAllRoleMaster: (role: any) =>
    `${databaseKey}/api/v1/getAllRoleMaster/${role}`,
  getAllNationality: () => `${databaseKey}/api/v1/getAllNationality`,
  getAllBankData: () => `${databaseKey}/api/v1/getAllBankData`,

  salaryDetails: {
    salaryUpdate: (employee_id: any) =>
      `${databaseKey}/api/v1/salaryDetailsUpdateByemployee_id/${employee_id}`,
    salaryCreate: () => `${databaseKey}/api/v1/salaryDetails`,
  },
  paymentsDetails: {
    paymentCreate: () => `${databaseKey}/api/v1/createempbankdetails`,
    paymentUpdate: (id: any) =>
      `${databaseKey}/api/v1/empbankdetailsupdate/${id}`,
    getSinglePayment: (id: any) =>
      `${databaseKey}/api/v1/empbankdetailget/${id}`,
    getAllBanks: () => `${databaseKey}/api/v1/bankdetails/getall`,
    getAll_Active_BANK: () => `${databaseKey}/api/v1/getAll_Active_BANK`,
    get_Active_ContractTypes: () =>
      `${databaseKey}/api/v1/get_Active_ContractTypes`,
  },
  personalDetails: {
    familyDetails: () => `${databaseKey}/api/v1/familydetail`,
    priviousEmploy: () => `${databaseKey}/api/v1/prevempdetail`,
    presentDetals: (employee_id: any) =>
      `${databaseKey}/api/auth/updateEmpDetail/${employee_id}`,
    postPersonalDetails: (employee_id: any) =>
      `${databaseKey}/api/v1/userupdateEmp/${employee_id}`,
    updateemp_paymentAccount: (id: any) =>
      `${databaseKey}/api/v1/updateemp_paymentAccount/${id}`,
  },
  documentsDetails: {
    documentCreate: () => `${databaseKey}/api/v1/empdocumentdetail`,
    documentUpdate: (id: any) =>
      `${databaseKey}/api/v1/empdocumentdetailupdate/${id}`,
    getSingleDocument: (id: any) =>
      `${databaseKey}/api/v1/getdocumentdetails/${id}`,
    deleteDocument: (id: any) =>
      `${databaseKey}/api/v1/deletedocumentdetails/${id}`,
  },
  ////////////
  digitalSignature: {
    createEmpSignature: () =>
      `${databaseKey}/api/v1/create_digital_empsignature`,
    updateEmpSignature: (id: any) =>
      `${databaseKey}/api/v1/edit_digital_empsignature/${id}`,
    getAllSign: () => `${databaseKey}/api/v1/getAll_digitalempSignature`,
    getAllRegisterUser: () => `${databaseKey}/api/v1/getAll_userRecords`,
    digitalSignatureDetailById: (id: any) =>
      `${databaseKey}/api/v1/get_digitalSignature_details_by_id/${id}`,
    deleteDigitalSignature: (id: any) =>
      `${databaseKey}/api/v1/delete_digital_signature/${id}`,
    digitalSignatureApproved: (id: any) =>
      `${databaseKey}/api/v1/digital_signature_approval/${id}`,

    getProbationaryUserList: () =>
      `${databaseKey}/api/v1/getProbationaryUserList`,
    updateEmployeeProbation: (id: any) =>
      `${databaseKey}/api/v1/updateEmployeeProbation/${id}`,
  },
  ///////////

  // finance
  getAllFinance: () => `${databaseKey}/api/v1/getAllfinancedetail`,
  getRegion_PMS: () => `${databaseKey}/api/v1/getAll_new_noduplicate_region`,

  //All Managers List
  getManagerList: () => `${databaseKey}/api/v1/get_all_managers`,
  getEmployeeWithCode: () => `${databaseKey}/api/v1/getAllEmployeeWithCode`,

  empBy: {
    get_employee_by_id: (id: any) =>
      `${databaseKey}/api/auth/get_employee_by_id/${id}`,
    
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
    getSalaryTemplateByGradeId: (id: any) =>
      `${databaseKey}/api/v1/getTemplateByGradeId/${id}`,
    salaryTemplateByGradeId: (req: any) =>
      `${databaseKey}/api/v1/getSalaryTemplateByGradeId/${req?.id}?entityType=${req?.entityType}&financialYear=${req?.financialYear}`,
    getAllSaleryTemplate: (req: any) =>
      `${databaseKey}/api/v1/getAllActiveSalaryTemplate?entityType=${req?.entityType}?financialYear=${req?.financialYear}`,
    getBySaleryTemplate: (id: any) =>
      `${databaseKey}/api/v1/getSalaryTemplateById/${id}`,
    getHistorySalary: () => `${databaseKey}/api/v1/get_all_appraisal_history`,
  },
};

@Injectable({
  providedIn: 'root',
})
export class EmpRegistrationService {
  messageSubject = new Subject<any>();
  signatureId(id: any) {
    this.messageSubject.next(id);
  }
  getAchievementList() {
    throw new Error('Method not implemented.');
  }

  empId: any = new BehaviorSubject(null);
  empTitle: any = new BehaviorSubject(null);

  constructor(private httpclient: HttpClient) {}
  basicSignUp(data: any): Observable<any> {
    return this.httpclient.post(routes.signUp.BasicSignUp(), data);
  }
  get token() {
    const signInUser = localStorage.getItem('signInUser') || '';
    let loginUser;
    try {
      loginUser = JSON.parse(signInUser);
    } catch (error) {
      console.error('Failed to parse login user from localStorage:', error);
      loginUser = {};
    }
    return loginUser._token || null;
  }
  updateBasicDetails(employee_id: string, data: any): Observable<any> {
    const headers = new HttpHeaders({
      authorization: `Bearer ${this.token}`,
    });

    return this.httpclient.put(
      `${databaseKey}/api/v1/me/update-basic-details`,
      data,
      { headers }
    );
  }

  outerFormCondidate(data: any, img: File): Observable<any> {
    const formData = new FormData();
    if (img) {
      formData.append('employee_photo', img, img.name);
    } else {
      formData.append('employee_photo', 'undefined');
    }
    for (let key in data) {
      formData.append(`${key}`, data[key]);
    }

    return this.httpclient.post(routes.signUp.outerForm(), formData);
  }
  grtEmployeeList(entity_id: any, role_master_name: any) {
    return this.httpclient.get(
      routes.signUpList.employList(entity_id, role_master_name)
    );
  }

  grtEmployeeListbyentity(entity_id: any, role_master_name: any) {
    return this.httpclient.get(
      routes.signUpList.employListby_entity(entity_id, role_master_name)
    );
  }

  //getAll UserList and Export tO Excel

  exportAllUserInExcel(entity_id: any, role_master_name: any) {
    return this.httpclient.get(
      routes.signUpList.getTheEmployeeExportExcel(entity_id, role_master_name)
    );
  }

  getAllManagersList() {
    return this.httpclient.get(routes.getManagerList());
  }
  getAllEmployeeWithCode() {
    return this.httpclient.get(routes.getEmployeeWithCode());
  }

  deleteSingleEmployee(id: any, data: any) {
    return this.httpclient.put(
      routes.signUpList.deleteSingleEmployee(id),
      data
    );
  }
  deleteAuditor(id: any) {
    return this.httpclient.put(routes.signUpList.deleteAuditor(id), '');
  }
  //
  getSingleEmp(id: any): Observable<any> {
    return this.httpclient.get<any>(routes.getSingleEmp(id));
  }

  getAllRoleMaster(role: any): Observable<any> {
    return this.httpclient.get<any>(routes.getAllRoleMaster(role));
  }
  getAllNationality(): Observable<any> {
    return this.httpclient.get<any>(routes.getAllNationality());
  }
  getAllBankData(): Observable<any> {
    return this.httpclient.get<any>(routes.getAllBankData());
  }
  getRegionList(): Observable<any> {
    return this.httpclient.get(routes.signUp.regionList());
  }
  getGradeList(): Observable<any> {
    return this.httpclient.get(routes.signUp.gradeList());
  }
  //basic n personal by id
  getByUserId(employee_id: any): Observable<any> {
    return this.httpclient.get(routes.signUp.userGetById(employee_id));
  }
  getAutoGenerateById(data: any) {
    return this.httpclient.post(routes.signUp.getemployeeCode(), data);
  }

  updateAttaindance(data: any) {
    return this.httpclient.post(routes.signUp.updateAttaindance(), data);
  }
  getRegionByID(certificateId: any): Observable<any> {
    return this.httpclient.get(routes.signUp.getRegionBySegID(certificateId));
  }
  updateEmploy(employee_id: any, data: any, img: File) {
    const formData = new FormData();
    if (img) {
      formData.append('employee_photo', img, img.name);
    } else {
      formData.append('employee_photo', 'undefined');
    }
    for (let key in data) {
      formData.append(`${key}`, data[key]);
    }
    return this.httpclient.put(routes.signUp.update(employee_id), formData);
  }

  getSinglePrasentDetails(employee_id: any): Observable<any> {
    return this.httpclient.get(
      routes.signUp.getSinglePrasentDetails(employee_id)
    );
  }
  updateSinglePrasentDetails(employee_id: any, data: any): Observable<any> {
    return this.httpclient.put(
      routes.signUp.updateSinglePrasentDetails(employee_id),
      data
    );
  }

  UpdateSalary(employee_id: any, formData: any): Observable<any> {
    return this.httpclient.put(
      routes.salaryDetails.salaryUpdate(employee_id),
      formData
    );
  }

  // dropdown list
  employmentlist_dropDown(): Observable<any> {
    return this.httpclient.get<any>(routes.dropDownList.employmentlist());
  }
  getAllBandtype_dropDown(): Observable<any> {
    return this.httpclient.get<any>(routes.dropDownList.getAllBandtype());
  }

  getAllBrand_dropDown(): Observable<any> {
    return this.httpclient.get<any>(routes.dropDownList.getAllBrand());
  }

  getAllDepartment_dropDown(id?: any): Observable<any> {
    return this.httpclient.get<any>(routes.dropDownList.getAllDepartment(id));
  }

  getAllDesignation_dropDown(): Observable<any> {
    return this.httpclient.get<any>(routes.dropDownList.getAllDesignation());
  }

  gradelist_dropDown(): Observable<any> {
    return this.httpclient.get<any>(routes.dropDownList.gradelist());
  }

  officeLocationall_dropDown(): Observable<any> {
    return this.httpclient.get<any>(routes.dropDownList.officeLocationall());
  }
  physicalLocationall_dropDown(): Observable<any> {
    return this.httpclient.get<any>(
      routes.dropDownList.officePhysicalLocationall()
    );
  }

  getAllcountry(): Observable<any> {
    return this.httpclient.get<any>(routes.dropDownList.getAllcountry());
  }

  getAllActivecountry(): Observable<any> {
    return this.httpclient.get<any>(routes.dropDownList.getAllActivecountry());
  }

  getAllstate(): Observable<any> {
    return this.httpclient.get<any>(routes.dropDownList.getAllstate());
  }

  getStateByCountry(id: any): Observable<any> {
    return this.httpclient.get<any>(routes.dropDownList.getStateByCountry(id));
  }

  getCityByState(id: any): Observable<any> {
    return this.httpclient.get<any>(routes.dropDownList.getCityByState(id));
  }

  getPincodeByCity(id: any): Observable<any> {
    return this.httpclient.get<any>(routes.dropDownList.getPincodeByCity(id));
  }

  get_all_active_grade(entity_id: any): Observable<any> {
    return this.httpclient.get<any>(
      routes.dropDownList.get_all_active_grade(entity_id)
    );
  }
  get_all_active_division(entity_id: any): Observable<any> {
    return this.httpclient.get<any>(
      routes.dropDownList.get_all_active_division(entity_id)
    );
  }
  getGradeListByBranch(req: any): Observable<any> {
    return this.httpclient.get<any>(
      routes.dropDownList.getGradeListByBranch(req)
    );
  }
 searchCities(searchText: string, limit: number): Observable<any> {
    return this.httpclient.get<any>(
      `${environment.serverUrl}/api/WL/cities/search?searchText=${searchText}&limit=${limit}`
    );
  }
  // officePhysicalLocationall

  regionlist_dropDown(): Observable<any> {
    return this.httpclient.get<any>(routes.dropDownList.regionlist());
  }

  regionlist_PMS(): Observable<any> {
    return this.httpclient.get<any>(routes.getRegion_PMS());
  }

  //personal details
  familyCreate(data: any): Observable<any> {
    return this.httpclient.post(routes.personalDetails.familyDetails(), data);
  }
  priviousCreate(data: any): Observable<any> {
    return this.httpclient.post(routes.personalDetails.priviousEmploy(), data);
  }

  updateEmploypersonal(employyee_id: any, data: any): Observable<any> {
    return this.httpclient.put(
      routes.personalDetails.presentDetals(employyee_id),
      data
    );
  }

  updateEmploypersonal_2(employyee_id: any, data: any): Observable<any> {
    return this.httpclient.put(
      routes.personalDetails.postPersonalDetails(employyee_id),
      data
    );
  }

  updateemp_paymentAccount(id: any, data: any) {
    return this.httpclient.patch(
      routes.personalDetails.updateemp_paymentAccount(id),
      data
    );
  }

  getSingleFamilyDetails(id: any): Observable<any> {
    return this.httpclient.get<any>(routes.getSingleFamily(id));
  }

  updateSingleFamilyDetails(id: any, data: any): Observable<any> {
    return this.httpclient.put<any>(routes.updateSingleFamily(id), data);
  }

  deleteSingleFamily(id: any): Observable<any> {
    return this.httpclient.put<any>(routes.deleteSingleFamily(id), {});
  }

  // pre emp
  createPrevEmp(data: any): Observable<any> {
    return this.httpclient.post<any>(routes.createPreEmp(), data);
  }

  getSinglePrevEmp(id: any): Observable<any> {
    return this.httpclient.get<any>(routes.getSinglePreEmp(id));
  }

  updateSinglePrevEmp(id: any, data: any): Observable<any> {
    return this.httpclient.patch<any>(routes.updatePreEmp(id), data);
  }

  deleteSinglePrevEmp(id: any): Observable<any> {
    return this.httpclient.put<any>(routes.deleteSinglePreEmp(id), {});
  }

  //paymentdetails

  paymentdetailsCreate(data: any): Observable<any> {
    return this.httpclient.post(routes.paymentsDetails.paymentCreate(), data);
  }

  paymentdetailsUpdate(id: any, data: any): Observable<any> {
    return this.httpclient.put(routes.paymentsDetails.paymentUpdate(id), data);
  }

  getSinglePaymentDetails(id: any): Observable<any> {
    return this.httpclient.get<any>(
      routes.paymentsDetails.getSinglePayment(id)
    );
  }

  getAllBanks(): Observable<any> {
    return this.httpclient.get<any>(routes.paymentsDetails.getAllBanks());
  }
  getAll_Active_BANK(): Observable<any> {
    return this.httpclient.get<any>(
      routes.paymentsDetails.getAll_Active_BANK()
    );
  }
  get_Active_ContractTypes(): Observable<any> {
    return this.httpclient.get<any>(
      routes.paymentsDetails.get_Active_ContractTypes()
    );
  }

  //documents

  create_DocumentDetails(data: any, img: File): Observable<any> {
    const formData = new FormData();

    if (img) {
      formData.append('document_file', img, img.name);
    }
    delete data.document_file;
    for (let key in data) {
      formData.append(`${key}`, data[key]);
    }
    return this.httpclient.post(
      routes.documentsDetails.documentCreate(),
      formData
    );
  }

  update_DocumentDetails(id: any, data: any, img: File): Observable<any> {
    const formData = new FormData();

    if (img) {
      formData.append('document_file', img, img.name);
    }
    delete data.document_file;
    for (let key in data) {
      formData.append(`${key}`, data[key]);
    }

    return this.httpclient.put<any>(
      routes.documentsDetails.documentUpdate(id),
      formData
    );
  }

  getSingleDocument(id: any): Observable<any> {
    return this.httpclient.get<any>(
      routes.documentsDetails.getSingleDocument(id)
    );
  }

  deleteDocument(id: any): Observable<any> {
    return this.httpclient.put<any>(
      routes.documentsDetails.deleteDocument(id),
      ''
    );
  }

  setEmpId(id: any) {
    this.empId.next(id);
  }

  getEmpId() {
    return this.empId;
  }

  setEmpTitle(title: string) {
    this.empTitle.next(title);
  }

  getEmpTitle() {
    return this.empTitle;
  }

  getFinanceList(): Observable<any> {
    return this.httpclient.get(routes.getAllFinance());
  }

  getById(id: any, emp_id: any) {
    return this.httpclient.get(routes.signUp.getById(id, emp_id));
  }

  empGetById(id: any) {
    return this.httpclient.get(routes.empBy.get_employee_by_id(id));
  }
  employeeFormSubmit(id: any, data: any) {
    return this.httpclient.post(routes.employeeFormSubmit(id), data);
  }
  getOuterEmployeeData(id: any) {
    return this.httpclient.get(routes.employeeForm(id));
  }

  TrackOuterform(id: any) {
    return this.httpclient.get(routes.TrackOuterform(id));
  }
  getSalaryData(id: any) {
    return this.httpclient.get(routes.getSalaryBeakup(id));
  }

  getemployeeData(id: any) {
    return this.httpclient.get(routes.getEmpData(id));
  }
  getemployeeListData(entity_id: any) {
    return this.httpclient.get(routes.getEmplistData(entity_id));
  }

  getAllEarningCompList(
    entityType: number,
    financialYear: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('entityType', entityType.toString())
      .set('financialYear', financialYear.toString());

    return this.httpclient.get<any>(routes.salaryTemplate.getAllEarningComp(), {
      params,
    });
  }

  getAllDeductionCompList(
    entityType: number,
    financialYear: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('entityType', entityType.toString())
      .set('financialYear', financialYear.toString());
    return this.httpclient.get(routes.salaryTemplate.getAllDeductionComp(), {
      params,
    });
  }
  getAllRiembursementCompList(
    entityType: number,
    financialYear: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('entityType', entityType.toString())
      .set('financialYear', financialYear.toString());
    return this.httpclient.get(
      routes.salaryTemplate.getAllRiembursementComp(),
      { params }
    );
  }
getAllVariableearningComponentList(){
   return this.httpclient.get(routes.salaryTemplate.getAllvariableearningComp());
}
  getSalaryTemplateByGradeId(
    id: any,
    entityType: number,
    financialYear: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('entityType', entityType.toString())
      .set('financialYear', financialYear.toString());
    return this.httpclient.get(
      routes.salaryTemplate.getSalaryTemplateByGradeId(id),
      { params }
    );
  }

  salaryTemplateByGradeId(req: any): Observable<any> {
    return this.httpclient.get(
      routes.salaryTemplate.salaryTemplateByGradeId(req)
    );
  }

  getAllSaleryTemplate(req: any): Observable<any> {
    return this.httpclient.get(routes.salaryTemplate.getAllSaleryTemplate(req));
  }

  getBySaleryTemplate(id: any): Observable<any> {
    return this.httpclient.get(routes.salaryTemplate.getBySaleryTemplate(id));
  }

  getHistorySalary(data: any): Observable<any> {
    return this.httpclient.post(routes.salaryTemplate.getHistorySalary(), data);
  }

  getAutoFetchBranchName(id: any): Observable<any> {
    return this.httpclient.get(routes.signUpList.getAutofetchBranch(id));
  }

  getAllRegisterUser(): Observable<any> {
    return this.httpclient.get(routes.signUpList.getAllRegisterUser());
  }
  //digital signature employee
  createEmpSignature(data: any, file: File): Observable<any> {
    const formData = new FormData();
    if (file) {
      formData.append('digital_signature', file, file.name);
    } else {
      formData.append('digital_signature', 'undefined');
    }
    for (let key in data) {
      formData.append(`${key}`, data[key]);
    }

    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    return this.httpclient.post(
      routes.digitalSignature.createEmpSignature(),
      formData
    );
  }

  updateEmpSignature(id: any, data: any, file: File): Observable<any> {
    const formData = new FormData();
    if (file) {
      formData.append('digital_signature', file, file.name);
    } else {
      formData.append('digital_signature', 'undefined');
    }
    for (let key in data) {
      formData.append(`${key}`, data[key]);
    }

    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    return this.httpclient.put(
      routes.digitalSignature.updateEmpSignature(id),
      formData
    );
  }

  digitalSignatureDetailById(id: any): Observable<any> {
    return this.httpclient.get(
      routes.digitalSignature.digitalSignatureDetailById(id)
    );
  }

  getAllSignature(): Observable<any> {
    return this.httpclient.get(routes.digitalSignature.getAllSign());
  }

  getProbationaryUserList(): Observable<any> {
    return this.httpclient.get(
      routes.digitalSignature.getProbationaryUserList()
    );
  }

  getAllRegisterUserDigSign(): Observable<any> {
    return this.httpclient.get(routes.digitalSignature.getAllRegisterUser());
  }

  deleteDigitalSignature(id: any, data: any) {
    return this.httpclient.put(
      routes.digitalSignature.deleteDigitalSignature(id),
      data
    );
  }

  digitalSignatureApproved(id: any, data: any) {
    return this.httpclient.put(
      routes.digitalSignature.digitalSignatureApproved(id),
      data
    );
  }

  updateEmployeeProbation(id: string, data: any) {
    return this.httpclient.put(
      routes.digitalSignature.updateEmployeeProbation(id),
      data
    );
  }

  getChildEmployee(employee_id: string) {
    return this.httpclient.get(
      `${environment.serverUrl}/api/v1/getChildEmployee/${employee_id}`
    );
  }
  /////////////////////////////////
}
