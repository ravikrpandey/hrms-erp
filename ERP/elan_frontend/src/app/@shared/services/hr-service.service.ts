import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
const databaseKey: any = environment.servralUrl;

const routes = {
  bonus:{
    createBonus: () => `${databaseKey}/api/v1/create_employee_bonus`,
    getBonusByID: (id:any) => `${databaseKey}/api/v1/get_Employee_bonus/${id}`,
    updateBonus: (bonus_id:any) => `${databaseKey}/api/v1/update_employee_bonus/${bonus_id}`,
    deleteBonus: (bonus_id:any) => `${databaseKey}/api/v1/remove_Bonus/${bonus_id}`,


    //
  },
  advancePayment:{
    createAdvancePayment: () => `${databaseKey}/api/v1/create_Advance_Payment`,
    //getAllAdvPayment   
    getAllAdvPayment: () => `${databaseKey}/api/v1/get_All_Advance_Payment`,
    getById_AdvPayment: (adv_id:any) => `${databaseKey}/api/v1/get_ById_Advance_Payment/${adv_id}`,
    deleteAdvancePayment: (adv_id:any) => `${databaseKey}/api/v1/delete_Advance_Payment/${adv_id}`,
  },
  hrDeskboard: {
    list: () => `${databaseKey}/api/v1/getAllCandidateProfile`,
    getById: (candidate_id: any) => `${databaseKey}/api/v1/getByIdCandidate/${candidate_id}`,
    addFormula: (component_id: any) => `${databaseKey}/api/v1/update_formula_status/${component_id}`,

    //addFormula
    // create: () => `${databaseKey}/api/test/createGrievance`,
    // getById: (employee_grievance_id: any) => `${databaseKey}/api/test/editGrievance/${employee_grievance_id}`,
    // userGetById: (employee_grievance_id: any) => `${databaseKey}/api/test/grievancyGetById/${employee_grievance_id}`,
    // deletegrievave: (employee_grievance_id: any) => `${databaseKey}/api/test/grievancyDelete/${employee_grievance_id}`,
  },

  attendence: {
    get_Attendance: (id: any) => `${databaseKey}/api/v1/get_ById_Attendance/${id}`,
    getAll_screen_On_Off: (id: any) => `${databaseKey}/api/v1/get_ById_Screen_On_Off/${id}`,
    get_All_InOut_Attendance: () => `${databaseKey}/api/v1/get_All_InOut_Attendance`,
  },

  addType: {
    addTypelist: () => `${databaseKey}/api/v1/get_All_Component_Type`,
    addTypeCreate: () => `${databaseKey}/api/v1/createComponentType`,
    getById: (componentType_id: any) => `${databaseKey}/api/v1/getComponentTypeById/${componentType_id}`,
    addTypeUpdate: (id: any) => `${databaseKey}/api/v1/editComponentTypeById/${id}`,
    codeCreate: () => `${databaseKey}/api/v1/createCodeType`
  },

  add: {
    addlist: () => `${databaseKey}/api/v1/getAllComponent`,
    addCreate: () => `${databaseKey}/api/v1/create_Component_Type`,
    getById: (componentType_id: any) => `${databaseKey}/api/v1/get_ById_Component_Type/${componentType_id}`,
    addUpdate: (id: any) => `${databaseKey}/api/v1/edit_Component_Type/${id}`,
    deleteComponent: (id: any) => `${databaseKey}/api/v1/delete_Component_Type/${id}`,

    //
    addCode: () => `${databaseKey}/api/v1/getAllCodeType`
  },

  pf: {
    pflist: () => `${databaseKey}/api/v1/getAllPfesi`,
    addPfCreate: () => `${databaseKey}/api/v1/createPfesi`,
    getById: (pf_id: any) => `${databaseKey}/api/v1/getPfesiById/${pf_id}`,
    addUpdate: (id: any) => `${databaseKey}/api/v1/editComponent/${id}`,
    deletePf: (id: any) => `${databaseKey}/api/v1/editPfesiById/${id}`,
    updatePf: (id: any) => `${databaseKey}/api/v1/editPfesiById/${id}`,
    getGroup: () => `${databaseKey}/api/v1/getAllAddGroup`,
    getState: () => `${databaseKey}/api/v1/getAllPfEsiState`,
    getGroupById: (id: any) => `${databaseKey}getPfesiGroupMasterById/${id}`,
    getForntComp: () => `${databaseKey}/api/v1/getAllFrontComponetType`,
    getBackComp: () => `${databaseKey}/api/v1/getAllBackComponent`,
  },

  leaveMaster: {
    leaveList: () => `${databaseKey}/api/v1/getAllLeavePolicy`,
    leaveMasterCreate: () => `${databaseKey}/api/v1/createLeavePolicy`,
    getAllLeaveTypes: () => `${databaseKey}/api/v1/getAllLeaveTypes`,
    getById: (id: any) => `${databaseKey}/api/v1/getLeavePolicyById/${id}`,
    deleteLeave: (id: any) => `${databaseKey}/api/v1/deleteLeavePolicyById/${id}`,
    updateLeave: (id: any) => `${databaseKey}/api/v1/editLeavePolicy/${id}`,
    leaveEmpList: () => `${databaseKey}/api/auth/registrationallName`,
    payrollEmpList: () => `${databaseKey}/api/v1/Get_All_CTC`,


    //
    leaveRoleList: () => `${databaseKey}/api/v1/getAllRoleMaster`,
    leaveDepList: () => `${databaseKey}/api/v1/getAllLeavePolicyEmployee`,
    getDepList: () => `${databaseKey}/api/v1/getAllDepartment`,
    getAllCompany: () => `${databaseKey}/api/v1/getAllAddCompany`,
    createAttendance: () => `${databaseKey}/api/v1/create_attendance`,
    getById_attendance: (id: any) => `${databaseKey}/api/v1/getById_attendance/${id}`,
    getAllGrade: () => `${databaseKey}/api/v1/gradelist`
  },

  holiday: {
    holidayList: () => `${databaseKey}/api/v1/get_All_holiday`,
    holidayCreate: () => `${databaseKey}/api/v1/create_holiday`,
    getById: (id: any) => `${databaseKey}/api/v1/get_ById_holiday/${id}`,
    updateHoliday: (id: any) => `${databaseKey}/api/v1/edit_holiday/${id}`,
    deleteHoliday: (id: any) => `${databaseKey}/api/v1/delete_holiday/${id}`,
    upload_Holiday_By_file: () => `${databaseKey}/api/v1/upload_Holiday_By_file`
  },
  leaveApply: {
    leaveCode_dropdown: () => `${databaseKey}/api/v1/get_All_Leave_Code`,
    leaveCode_details: (id:any) => `${databaseKey}/api/v1/get_ById_Leave_Code/${id}`,
    emp_Leave_Details: (id:any) => `${databaseKey}/api/v1/get_Leave_Details_By_EmployeeId/${id}`,
    leaveApply_create: () => `${databaseKey}/api/v1/create_Leave_Apply`,
    leaveApply_update: (id: any) => `${databaseKey}/api/v1/edit_Leave_Apply/${id}`,
    leaveApply_delete: (id: any) => `${databaseKey}/api/v1/delete_Leave_Apply/${id}`,

    getSingle_leaveApply: (id: any) => `${databaseKey}/api/v1/get_ById_Leave_Apply/${id}`,
    getAll_leaveApply: (id:any) => `${databaseKey}/api/v1/get_All_Leave_Apply/${id}`,
    get_Manager_Name: (id:any) => `${databaseKey}/api/v1/get_ById_Manager_Name/${id}`,

    get_All_Manager: () => `${databaseKey}/api/v1/get_All_Manager`,
    getAll_AppliedLeaveBy_Manager: (id:any) => `${databaseKey}/api/v1/get_All_Applied_LeaveBy_Manager/${id}`,
    getAll_ApprovedLeaveBy_Manager: (id:any) => `${databaseKey}/api/v1/get_All_Approved_LeaveBy_Manager/${id}`,
    getAll_RjectedLeaveBy_Manager: (id:any) => `${databaseKey}/api/v1/get_All_Rejected_LeaveBy_Manager/${id}`,
    appliedLeaveStatus_update: (id:any) => `${databaseKey}/api/v1/edit_Applied_Leave_Status/${id}`,
    singleLeaveType_details: (id:any) => `${databaseKey}/api/v1/get_ById_Leave_Type/${id}`,

    check_Leave_Details: (id:any) => `${databaseKey}/api/v1/check_Leave_Detail/${id}`,

    get_All_Employee_Attendance: () => `${databaseKey}/api/v1/get_All_Employee_Attendance`,
  },

  config: {
    geatAllConfig: () => `${databaseKey}/api/v1/getAllConfig`,
    createCongfigure: () => `${databaseKey}/api/v1/createConfig`,
    configGetById: (id: any) => `${databaseKey}/api/v1/getConfigById/${id}`,
    updatePayroll: (id: any) => `${databaseKey}/api/v1/updateGet_All_CTC/${id}`,

    //
    payrollGetBYID: (id: any) => `${databaseKey}/api/v1/getbyGet_All_CTC/${id}`

 //
 
  },

  bonusConfig: {
    getAllBonus: () => `${databaseKey}/api/v1/get_Emp_bonus`,
    getAllBonusConfig: () => `${databaseKey}/api/v1/getAll_bonusConfigure`,
    bonusConfigGetById: (id: any) => `${databaseKey}/api/v1/get_ById_bonusConfigure/${id}`,
    addBonusConfig: () => `${databaseKey}/api/v1/create_bonusConfigure`,
    updateBonusConfig: (id: any) => `${databaseKey}/api/v1/edit_bonusConfigure/${id}`,
    empBonusGetById: (id: any) => `${databaseKey}/api/v1/get_Employee_bonus/${id}`,
    addEmpBonus: () => `${databaseKey}/api/v1/create_employeebonuse`,
    updateEmpBonus: (id: any) => `${databaseKey}/api/v1/edit_employeebonus/${id}`,
  },

  itr: {
    getAllItr: () => `${databaseKey}/api/v1/getAll_itr_deduction`,
    getAllOtherDeduc: () => `${databaseKey}/api/v1/getAll_Other_deduction`,
    getAllOtherAllow: () => `${databaseKey}/api/v1/getAll_other_allowance`,
    getAllVariable: () => `${databaseKey}/api/v1/getAll_other_variable`,
    updateItrDeduct: (id: any) => `${databaseKey}/api/v1/edit_itr_deduction/${id}`,
    updateItrOtherDeduct: (id: any) => `${databaseKey}/api/v1/edit_other_deduction/${id}`,
    updateItrOtherAllow: (id: any) => `${databaseKey}/api/v1/edit_other_allowance/${id}`,
    updateItrOtherVar: (id: any) => `${databaseKey}/api/v1/edit_other_variable/${id}`,
    getitrDeducById: (id: any) => `${databaseKey}/api/v1/get_ById_itr_deduction/${id}`,
    getitrOtherDeducById: (id: any) => `${databaseKey}/api/v1/get_ById_get_Other_deduction/${id}`,
    getitrAllowById: (id: any) => `${databaseKey}/api/v1/get_ById_get_other_allowance/${id}`,
    getitrVarById: (id: any) => `${databaseKey}/api/v1/get_ById_get_other_variable/${id}`,
  },

  salaryProcess: {
    paySlipById: (id: any) => `${databaseKey}/api/v1/getAllSalaryPayslip/${id}`,
    getAllsalaryList: () => `${databaseKey}/api/auth/v1/get_All_SalaryList`,
    getEmpByDepId: (id: any) => `${databaseKey}/api/auth/v1/getAllSalaryprocess/${id}`,
    getAllSalaryIncrement: () => `${databaseKey}/api/v1/get_All_SalaryIncrement`,
    getSalaryIncrementById: (id: any) => `${databaseKey}/api/v1/getByID_SalaryIncrement/${id}`,

  },

  report: {
    reportGenerate: (id: any) => `${databaseKey}/api/v1/getAllSalaryPayslip/${id}`,
  }


}
@Injectable({
  providedIn: 'root'
})
export class HrServiceService {
  addTypeId: any = new BehaviorSubject(null);
  myObject: any;
  // urlHR="https://dqsapi.elitetraveltech.in/api/test/getAllCondidateProfile";
  // sendData(){
  //   return this.http.get<any>('urlHR');
  // }
  //HR-Api
  constructor(private http: HttpClient) { }

//advance payment 
createAdvancePayment(data:any){
  return this.http.post(routes.advancePayment.createAdvancePayment(),data);
}
deleteAdvancePayment(ad_id:any){
  return this.http.delete(routes.advancePayment.deleteAdvancePayment(ad_id));

}


// Bonus//

deleteBonus(bonusID:any){
  return this.http.delete(routes.bonus.deleteBonus(bonusID));

}
createBonus(data:any) {
  return this.http.post(routes.bonus.createBonus(),data);
}
getBonusByID(id:any) {
  return this.http.get(routes.bonus.getBonusByID(id));
}
updateBonus(bonus_id:any,data:any) {
  return this.http.put(routes.bonus.updateBonus(bonus_id),data);
}
//

  getList() {
    return this.http.get(routes.hrDeskboard.list());
  }
  CandidateAddById(candidate_id: any): Observable<any> {
    return this.http.get<any>(routes.hrDeskboard.getById(candidate_id));
  }

  get_Attendance(id: any): Observable<any> {
    return this.http.get<any>(routes.attendence.get_Attendance(id));
  };

  getAll_screen_On_Off(id: any): Observable<any> {
    return this.http.get<any>(routes.attendence.getAll_screen_On_Off(id));
  };

  get_All_InOut_Attendance(): Observable<any> {
    return this.http.get<any>(routes.attendence.get_All_InOut_Attendance());
  };

  // //Add component type

  //addFormula
  addFormula(component_id:any,data: any): Observable<any> {
    return this.http.patch(routes.hrDeskboard.addFormula(component_id), data);
  }

  getAddTypeList() {
    return this.http.get(routes.addType.addTypelist());
  }

  addTypeCreate(data: any): Observable<any> {
    return this.http.post(routes.addType.addTypeCreate(), data);
  }

  addTypeGetById(componentType_id: any): Observable<any> {
    return this.http.get<any>(routes.addType.getById(componentType_id));
  }

  updateAddType(componentType_id: any, data: any): Observable<any> {
    return this.http.put<any>(routes.addType.addTypeUpdate(componentType_id), data);
  }

  codeTypeCreate(data: any): Observable<any> {
    return this.http.post(routes.addType.codeCreate(), data);
  }




  //Add component

  getAddList() {
    return this.http.get(routes.add.addlist());
  }

  addCreate(data: any): Observable<any> {
    return this.http.post(routes.add.addCreate(), data);
  }

  addGetById(component_id: any): Observable<any> {
    return this.http.get<any>(routes.add.getById(component_id));
  }

  addCodeGet() {
    return this.http.get(routes.add.addCode());
  }


  updateAdd(component_id: any, data: any): Observable<any> {
    return this.http.put<any>(routes.add.addUpdate(component_id), data);
  }
  deleteComponent(component_id: any): Observable<any> {
    return this.http.delete<any>(routes.add.deleteComponent(component_id));
  }


  //deleteComponent
  //pf api

  getAllPfList() {
    return this.http.get(routes.pf.pflist());
  }

  getPfById(pfesi_id: any) {
    return this.http.get(routes.pf.getById(pfesi_id));
  }

  deleteSinglePf(pf_id: any, data: any) {
    return this.http.put(routes.pf.deletePf(pf_id), data);
  }

  addPfCreate(data: any): Observable<any> {
    return this.http.post(routes.pf.addPfCreate(), data);
  }

  updatePf(pf_id: any, data: any): Observable<any> {
    return this.http.put<any>(routes.pf.updatePf(pf_id), data);
  }

  getGroup() {
    return this.http.get(routes.pf.getGroup());
  }

  getGroupById(id: any) {
    return this.http.get(routes.pf.getGroupById(id));
  }

  getState() {
    return this.http.get(routes.pf.getState());
  }

  getFrontComp() {
    return this.http.get(routes.pf.getForntComp())
  }

  getBackComp() {
    return this.http.get(routes.pf.getBackComp())
  }


  //leave Master

  getAllLeave() {
    return this.http.get(routes.leaveMaster.leaveList());
  }

  leaveMasterCreate(data: any): Observable<any> {
    return this.http.post(routes.leaveMaster.leaveMasterCreate(), data);
  }
  getAllLeaveTypes(): Observable<any> {
    return this.http.get(routes.leaveMaster.getAllLeaveTypes());
  }

  leaveGetById(id: any) {
    return this.http.get(routes.leaveMaster.getById(id));
  }

  leaveDelete(id: any, data: any): Observable<any> {
    return this.http.put<any>(routes.leaveMaster.deleteLeave(id), data);
  }

  leaveUpdate(id: any, data: any): Observable<any> {
    return this.http.put<any>(routes.leaveMaster.updateLeave(id), data);
  }

  getAllEmp() {
    return this.http.get(routes.leaveMaster.leaveEmpList());
  }
  payrollAllEmp() {
    return this.http.get(routes.leaveMaster.payrollEmpList());
  }

  getRole() {
    return this.http.get(routes.leaveMaster.leaveRoleList());
  }

  getDepList() {
    return this.http.get(routes.leaveMaster.getDepList());
  }

  getAllCompany() {
    return this.http.get(routes.leaveMaster.getAllCompany());
  }

  getAllGrade() {
    return this.http.get(routes.leaveMaster.getAllGrade());
  }



  //holiday

  getAllHoliday() {
    return this.http.get(routes.holiday.holidayList());
  }

  holidayCreate(data: any): Observable<any> {
    return this.http.post(routes.holiday.holidayCreate(), data);
  }

  holidayGetById(id: any) {
    return this.http.get(routes.holiday.getById(id));
  }

  updateHoliday(id: any, data: any): Observable<any> {
    return this.http.put<any>(routes.holiday.updateHoliday(id), data);
  }

  deleteSingleHoliday(id: any) {
    return this.http.delete(routes.holiday.deleteHoliday(id));
  }
  upload_Holiday_By_file(file:File) {
    const formData:FormData = new FormData();
    formData.append('file',file, file.name)
    return this.http.post(routes.holiday.upload_Holiday_By_file(),formData);
  }


  // leave apply
  leaveCode_dropdown() {
    return this.http.get<any>(routes.leaveApply.leaveCode_dropdown());
  };
  
  leaveCode_details(id:any) {
    return this.http.get<any>(routes.leaveApply.leaveCode_details(id));
  };

  leaveApply_create(data:any) {
    const formData = new FormData();
    for (let key in data) {
      if(key === 'leave_doc'){
        let file:File = data[key];
        formData.append(key, file, file.name);
      }else{
        formData.append(key, data[key]);
      }
    };
    return this.http.post<any>(routes.leaveApply.leaveApply_create(),formData);
  };
  
  leaveApply_update(id:any,data:any) {
    const formData = new FormData();
    for (let key in data) {
      if(key === 'leave_doc'){
        let file:File = data[key];
        formData.append(key, file, file.name);
      }else{
        formData.append(key, data[key]);
      }
    };
    return this.http.put<any>(routes.leaveApply.leaveApply_update(id),formData);
  };
  
  leaveApply_delete(id:any) {
    return this.http.delete<any>(routes.leaveApply.leaveApply_delete(id));
  };
  
  emp_Leave_Details(id:any,data:any) {
    return this.http.put<any>(routes.leaveApply.emp_Leave_Details(id),data);
  };

  getSingle_leaveApply(id:any) {
    return this.http.get<any>(routes.leaveApply.getSingle_leaveApply(id));
  };

  getAll_leaveApply(id:any) {
    return this.http.get<any>(routes.leaveApply.getAll_leaveApply(id));
  };
  get_Manager_Name(id:any) {
    return this.http.get<any>(routes.leaveApply.get_Manager_Name(id));
  };

  get_All_Manager() {
    return this.http.get<any>(routes.leaveApply.get_All_Manager());
  };

  getAll_AppliedLeaveBy_Manager(id:any) {
    return this.http.get<any>(routes.leaveApply.getAll_AppliedLeaveBy_Manager(id));
  };

  getAll_ApprovedLeaveBy_Manager(id:any) {
    return this.http.get<any>(routes.leaveApply.getAll_ApprovedLeaveBy_Manager(id));
  };
  
  getAll_RjectedLeaveBy_Manager(id:any) {
    return this.http.get<any>(routes.leaveApply.getAll_RjectedLeaveBy_Manager(id));
  };
  
  appliedLeaveStatus_update(id:any,data:any) {
    return this.http.put<any>(routes.leaveApply.appliedLeaveStatus_update(id),data);
  };
  
  singleLeaveType_details(id:any) {
    return this.http.get<any>(routes.leaveApply.singleLeaveType_details(id));
  };

  check_Leave_Details(id:any, data:any) {
    return this.http.put<any>(routes.leaveApply.check_Leave_Details(id),data);
  };
  get_All_Employee_Attendance() {
    return this.http.get<any>(routes.leaveApply.get_All_Employee_Attendance());
  };
  
  //config

  geatAllConfig() {
    return this.http.get(routes.config.geatAllConfig());
  }

  createCongfigure(data: any) {
    return this.http.post(routes.config.createCongfigure(), data);
  }

  createAttendance(data: any) {
    return this.http.post(routes.leaveMaster.createAttendance(), data);
  };

  getById_Attendance(id: any) {
    return this.http.get(routes.leaveMaster.getById_attendance(id));
  }

  configGetById(id: any) {
    return this.http.get(routes.config.configGetById(id));
  }
  updatePayroll(id: any,data:any) {
    return this.http.patch(routes.config.updatePayroll(id),data);
  }
  payrollGetBYID(id: any) {
    return this.http.get(routes.config.payrollGetBYID(id));
  }

  getAllEmpBonus() {
    return this.http.get(routes.bonusConfig.getAllBonus());
  }
  getAllEmpAdvPayment() {
    return this.http.get(routes.advancePayment.getAllAdvPayment());
  }
  getById_AdvPayment(adv_id:any) {
    return this.http.get(routes.advancePayment.getById_AdvPayment(adv_id));
  }

  //

  getAllBonusConfig() {
    return this.http.get(routes.bonusConfig.getAllBonusConfig());
  }

  bonusConfigGetById(id: any) {
    return this.http.get(routes.bonusConfig.bonusConfigGetById(id));
  }

  addBonusConfig(data: any) {
    return this.http.post(routes.bonusConfig.addBonusConfig(), data);
  }

  updateBonusConfig(id: any, data: any): Observable<any> {
    return this.http.put<any>(routes.bonusConfig.updateBonusConfig(id), data);
  }

  empBonusGetById(id: any) {
    return this.http.get(routes.bonusConfig.empBonusGetById(id))
  }

  addEmpBonus(data: any) {
    return this.http.post(routes.bonusConfig.addEmpBonus(), data);
  }

  updateEmpBonus(id: any, data: any): Observable<any> {
    return this.http.put(routes.bonusConfig.updateEmpBonus(id), data);
  }

  //iter
  getAllItr() {
    return this.http.get(routes.itr.getAllItr())
  }

  getAllOtherDeduc() {
    return this.http.get(routes.itr.getAllOtherDeduc())
  }

  getAllOtherAllow() {
    return this.http.get(routes.itr.getAllOtherAllow())
  }

  getAllVariable() {
    return this.http.get(routes.itr.getAllVariable())
  }

  updateItrDeduct(id: any, data: any): Observable<any> {
    return this.http.put(routes.itr.updateItrDeduct(id), data);
  }

  updateItrOtherDeduct(id: any, data: any): Observable<any> {
    return this.http.put(routes.itr.updateItrOtherDeduct(id), data);
  }

  updateItrOtherAllow(id: any, data: any): Observable<any> {
    return this.http.put(routes.itr.updateItrOtherAllow(id), data);
  }

  updateItrOtherVar(id: any, data: any): Observable<any> {
    return this.http.put(routes.itr.updateItrOtherVar(id), data);
  }

  getitrDeduc(id: any) {
    return this.http.get(routes.itr.getitrDeducById(id))
  }

  getitrOtherDeduc(id: any) {
    return this.http.get(routes.itr.getitrOtherDeducById(id))
  }

  getitrAllow(id: any) {
    return this.http.get(routes.itr.getitrAllowById(id))
  }

  getitrVar(id: any) {
    return this.http.get(routes.itr.getitrVarById(id))
  }

  paySlipById(id: any) {
    return this.http.get(routes.salaryProcess.paySlipById(id))
  }

  getAllsalaryList() {
    return this.http.get(routes.salaryProcess.getAllsalaryList())

  }

  getEmpByDepId(data: any) {
    return this.http.get(routes.salaryProcess.getEmpByDepId(data))
  }

  getAllSalaryIncrement() {
    return this.http.get(routes.salaryProcess.getAllSalaryIncrement())
  }

  reportGenerate(id: any) {
    return this.http.get(routes.report.reportGenerate(id))
  }

  getSalaryIncrementById(id: any) {
    return this.http.get(routes.salaryProcess.getSalaryIncrementById(id))
  }




 
}
