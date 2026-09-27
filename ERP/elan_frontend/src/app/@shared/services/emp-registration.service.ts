import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.servralUrl;
// const databaseKey1: any = environment.servralUrl1;

const routes = {
  signUp: {
    empCode: () => `${databaseKey}/api/auth/generateEmpCode`,
    BasicSignUp: () => `${databaseKey}/api/auth/signup`,
    regionList: () => `${databaseKey}/api/v1/regionlist`,
    userGetById: (employee_id: any) =>
      `${databaseKey}/api/WL/userbyid/${employee_id}`,
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
    getAllUserByCountryStateCity: () =>
      `${databaseKey}/api/v1/getAllUserByCountryStateCity`,
    getLoginHistory: () => `${databaseKey}/api/auth/login_history`,
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
    getAllStatesData: () => `${databaseKey}/api/v1/getAllStatesData`,
    getAllcountry: () => `${databaseKey}/api/WL/getAllcountry`,
    getAllActivecountry: () => `${databaseKey}/api/v1/getAllActivecountry`,
    getAllstate: () => `${databaseKey}/api/v1/getallstatescontroller`,
    getStateByCountry: (id: any) =>
      `${databaseKey}/api/WL/getstatesbycountryid/${id}`,
    getCityByState: (id: any) => `${databaseKey}/api/WL/getcitybystateid/${id}`,
    getPincodeByCity: (id: any) =>
      `${databaseKey}/api/v1/getpincodebycityid/${id}`,
    get_all_active_grade: (entity_id: any) =>
      `${databaseKey}/api/v1/get_all_active_grade?entity_id=${entity_id}`,
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
  allotShift: () => `${databaseKey}/api/v1/create_allot_shift`,
  signUpList: {
    employList: (entity_id: any, role_master_name: any) =>
      `${databaseKey}/api/auth/registrationall?entity_id=${entity_id}&role_master_name=${role_master_name}`,
    warehouseemployeeList: () =>
      `${databaseKey}/api/v1/get_all_user_warehouse_roles`,
    deleteSingleEmployee: (id: any) =>
      `${databaseKey}/api/auth/updateEmpDetail/${id}`,
    deleteAuditor: (id: any) =>
      `${databaseKey}/api/v1/deleted_auditorbyid/${id}`,
    updateUserStatusOrDelete: () =>
      `${databaseKey}/api/auth/updateUserStatusOrDelete`,
  },
  getSingleEmp: (id: any) => `${databaseKey}/api/WL/userbyid/${id}`,
  getAllRoleMaster: (role: any) =>
    `${databaseKey}/api/v1/getAllRoleMaster/${role}`,

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
    getAllBanks: (entity_id: any) =>
      `${databaseKey}/api/v1/bankdetails/getall/${entity_id}`,
    getAll_Active_BANK: (entity_id: any) =>
      `${databaseKey}/api/WL/getAll_Active_BANK/${entity_id}`,
    get_Active_ContractTypes: () =>
      `${databaseKey}/api/WL/get_Active_ContractTypes`,
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

  locationDetails: {
    saveLocation: () => `${databaseKey}/api/v1/saveCityLocation`,
    getAllLocation: () => `${databaseKey}/api/v1/getAllCityLocation`,
    getLocation: (id: any) => `${databaseKey}/api/v1/getCityLocation/${id}`,
    updateLocation: (id: any) => `${databaseKey}/api/v1/updateLocation/${id}`,
    //  deleteLocation: (id: any) => `${databaseKey}/api/v1/deletedCityLocation/${id}`,
  },

  // finance
  getAllFinance: () => `${databaseKey}/api/v1/getAllfinancedetail`,
  getRegion_PMS: () => `${databaseKey}/api/v1/getAll_new_noduplicate_region`,

  //All Managers List
  getManagerList: () => `${databaseKey}/api/v1/get_all_managers`,

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
    getSalaryTemplateByGradeId: (id: any) =>
      `${databaseKey}/api/v1/getTemplateByGradeId/${id}`,
    salaryTemplateByGradeId: (req: any) =>
      `${databaseKey}/api/v1/getSalaryTemplateByGradeId/${req?.id}?entityType=${req?.entityType}&financialYear=${req?.financialYear}`,
    getAllSaleryTemplate: (req: any) =>
      `${databaseKey}/api/v1/getAllActiveSalaryTemplate?entityType=${req?.entityType}?financialYear=${req?.financialYear}`,
    getBySaleryTemplate: (id: any) =>
      `${databaseKey}/api/v1/getSalaryTemplateById/${id}`,
    getSalaryTempEmploye: (id: any) =>
      `${databaseKey}/api/v1/getSalaryTemplateByEmployeeId/${id}`,
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

  constructor(private httpclient: HttpClient) { }
  basicSignUp(data: any): Observable<any> {
    return this.httpclient.post(routes.signUp.BasicSignUp(), data);
  }
  getEmpCode(): Observable<any> {
    return this.httpclient.post(routes.signUp.empCode(), { title: 'test' });
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

  warehouseEmployeeList() {
    return this.httpclient.get(
      routes.signUpList.warehouseemployeeList()
    );
  }

  getAllManagersList() {
    return this.httpclient.get(routes.getManagerList());
  }

  deleteSingleEmployee(id: any, data: any) {
    return this.httpclient.put(
      routes.signUpList.deleteSingleEmployee(id),
      data
    );
  }

  updateUserStatusOrDelete(data: any) {
    return this.httpclient.put(
      routes.signUpList.updateUserStatusOrDelete(),
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
  getRegionList(): Observable<any> {
    return this.httpclient.get(routes.signUp.regionList());
  }

  //basic n personal by id
  getByUserId(employee_id: any): Observable<any> {
    return this.httpclient.get(routes.signUp.userGetById(employee_id));
  }
  getAutoGenerateById(data: any) {
    return this.httpclient.post(routes.signUp.getemployeeCode(), data);
  }
  getAllUserByCountryStateCity(data: any) {
    return this.httpclient.post(
      routes.signUp.getAllUserByCountryStateCity(),
      data
    );
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
  getAllStatesData(): Observable<any> {
    return this.httpclient.get<any>(routes.dropDownList.getAllStatesData());
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

  searchCities(searchText: string, limit: number): Observable<any> {
    return this.httpclient.get<any>(
      `${environment.servralUrl}/api/WL/cities/search?searchText=${searchText}&limit=${limit}`
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

  //Location master
  saveLocation(data: any): Observable<any> {
    return this.httpclient.post(routes.locationDetails.saveLocation(), data);
  }
  updateLocation(data: any, id: number): Observable<any> {
    return this.httpclient.patch(
      routes.locationDetails.updateLocation(id),
      data
    );
  }

  getAllLocation(): Observable<any> {
    return this.httpclient.get(routes.locationDetails.getAllLocation());
  }
  getLocation(id: number): Observable<any> {
    return this.httpclient.get(routes.locationDetails.getLocation(id));
  }

  deleteLocation(id: any) {
    return this.httpclient
      .delete<any>(`${databaseKey}/api/v1/deletedCityLocation/${id}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
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

  getAllBanks(entity_id: any): Observable<any> {
    return this.httpclient.get<any>(
      routes.paymentsDetails.getAllBanks(entity_id)
    );
  }
  getAll_Active_BANK(entity_id: any): Observable<any> {
    return this.httpclient.get<any>(
      routes.paymentsDetails.getAll_Active_BANK(entity_id)
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

  allotShift(data: any) {
    return this.httpclient.post(routes.allotShift(), data);
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
  getSalaryTempEmploye(id: any): Observable<any> {
    return this.httpclient.get(routes.salaryTemplate.getSalaryTempEmploye(id));
  }
  get_all_active_grade(entity_id: any): Observable<any> {
    return this.httpclient.get<any>(
      routes.dropDownList.get_all_active_grade(entity_id)
    );
  }

  getChildEmployee(employee_id: string) {
    return this.httpclient.get(`${databaseKey}/api/v1/getChildEmployee/${employee_id}`);
  }

  getLoginHistory(data: any) {
    return this.httpclient.post(routes.signUp.getLoginHistory(), data);
  }

  downloadLoginHistory(payload: any) {
    return this.httpclient.post(`${databaseKey}/api/export-login-history`, payload, {
      responseType: 'blob',
    });
  }

  getCustomerByIDForPanel(id: any) {
    return this.httpclient.get(`${databaseKey}/api/v1/getCustomerByIDForPanel/${id}`);
  }

  getSOListForCustomer(id: any, type?: any) {
    return this.httpclient.get(`${databaseKey}/api/v1/getSOListForCustomer/${id}/${type}`);
  }

  getCustomerContactAddress(id: any) {
    return this.httpclient.get(`${databaseKey}/api/v1/getCustomerContactAddress/${id}`);
  }

  getCustomerDashboard(id: any) {
    return this.httpclient.get(`${databaseKey}/api/v1/getCustomerDashboard/${id}`);
  }
}
