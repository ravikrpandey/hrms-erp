import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.servralUrl;
const routes = {
  courier_inward: {
    inward_list: (id:any) => `${databaseKey}/api/v1/get_All_Courier_Inward/${id}`,
    user_inward_list:(id:any) => `${databaseKey}/api/v1/get_all_employee_inward/${id}`,
    singel_inward: (id: any) =>
      `${databaseKey}/api/v1/get_ById_Courier_Inward/${id}`,
    getCategoryById: (id: any) =>
      `${databaseKey}/api/v1/get_ById_Category_Master/${id}`,
    create_inward: (id:any) => `${databaseKey}/api/v1/create_Courier_Inward/${id}`,
    get_inward_ById: (id: any) =>
      `${databaseKey}/api/v1/get_ById_Courier_Inward/${id}`,
    edit_inward: (id: any) => `${databaseKey}/api/v1/edit_Courier_Inward/${id}`,
    getAll_Accepted_Data: (id: any) => `${databaseKey}/api/v1/getAll_courier_Data/${id}`,
    courier_Accept: (id: any) => `${databaseKey}/api/v1/courier_Accept/${id}`,
    courier_Reject: (id: any) => `${databaseKey}/api/v1/courier_Reject/${id}`,
    courier_redirect:(id: any) => `${databaseKey}/api/v1/courier_Redirected/${id}`,
    courier_Redirected_Byid:(id:any,name:any) => `${databaseKey}/api/v1/courier_Redirected/${id}/${name}`,

    courier_getById:(id: any) => `${databaseKey}/api/v1/courier_Redirected_Data/${id}`,

    courier_status_Admin:(id: any) => `${databaseKey}/api/v1/courier_status_Admin/${id}`,

    courier_Resend:(id:any)=>`${databaseKey}/api/v1/courier_Redirected_admin_response/${id}`,
    courier_handover_admin:(id:any)=>`${databaseKey}/api/v1/courier_handover_admin/${id}`,
  },

  courier_outward: {
    outward_list: (id:any) => `${databaseKey}/api/v1/get_All_Courier_Outward/${id}`,
    getCategoryById: (id: any) =>
      `${databaseKey}/api/v1/get_ById_Category_Master/${id}`,

    getUserOutward:(id:any)=>`${databaseKey}/api/v1/get_employee_data/${id}
    `,
    create_outward: (id:any) => `${databaseKey}/api/v1/create_Courier_Outward/${id}`,
    get_outward_ById: (id: any, emp_id:any) =>
      `${databaseKey}/api/v1/get_ById_Courier_Outward/${id}/${emp_id}`,
    edit_Courier_Outward: (id: any) =>
      `${databaseKey}/api/v1/edit_Courier_Outward/${id}`,
  },

  AMC_Agreement: {
    get_All_AMC_Agreement: () => `${databaseKey}/api/v1/get_All_AMC_Agreement`,
    creat_Amc: (id:any) => `${databaseKey}/api/v1/create_AMC_Agreement/${id}`,
    update_doc: (id: any) => `${databaseKey}/api/v1/update_AMC_Agreement/${id}`,
    edit_amc: (id: any) => `${databaseKey}/api/v1/edit_AMC_Agreement/${id}`,
    get_ById_AMC_Agreement: (id: any) =>
      `${databaseKey}/api/v1/get_ById_AMC_Agreement/${id}`,
  },

  rental_Agreement: {
    get_All_rental_Agreement: () =>
      `${databaseKey}/api/v1/get_All_Rental_Aggrement`,
    creat_rental_Agreement: () =>
      `${databaseKey}/api/v1/create_Rental_Aggrement`,

    update_rental_Agreement: (id: any) =>
      `${databaseKey}/api/v1/edit_Rental_Aggrement/${id}`,
    get_ById_rental_Agreement: (id: any) =>
      `${databaseKey}/api/v1/get_ById_Rental_Aggrement/${id}`,
    edit: (id: any) => `${databaseKey}/api/v1/update_Rental_Aggrement/${id}`,
  },

  hk: {
    get_All_Hk: () => `${databaseKey}/api/v1/get_All_Security_Agreement`,
    create_hk: () => `${databaseKey}/api/v1/create_Security_Agreement`,

    update_hk: (id: any) =>
      `${databaseKey}/api/v1/edit_Security_Agreement/${id}`,
    get_ById_hk: (id: any) =>
      `${databaseKey}/api/v1/get_ById_Security_Agreement/${id}`,
    edit_hk_doc: (id: any) =>
      `${databaseKey}/api/v1/update_house_Agreement_doc/${id}`,
  },

  insurance: {
    get_All_ins: () => `${databaseKey}/api/v1/get_All_Insurance`,
    creat_ins: () => `${databaseKey}/api/v1/create_Insurance`,

    update_ins: (id: any) => `${databaseKey}/api/v1/edit_Insurance/${id}`,
    get_ById_ins: (id: any) =>
      `${databaseKey}/api/v1/get_ById_Insurance/${id}`,
    edit_ins_doc: (id: any) =>
      `${databaseKey}/api/v1/update_Insurance_doc/${id}`,
  },

  remote: {
    get_All_remote: () => `${databaseKey}/api/v1/get_All_Facility_Remote`,
    creat_remote: () => `${databaseKey}/api/v1/create_Facility_Remote`,

    update_remote: (id: any) =>
      `${databaseKey}/api/v1/edit_Facility_Remote/${id}`,
    get_ById_remote: (id: any) =>
      `${databaseKey}/api/v1/get_ById_Facility_Remote/${id}`,
    get_All_Requested_Remote:()=>`${databaseKey}/api/v1/get_All_Requested_Facility_Remote`,
    get_All_Complaint_Remote:()=>`${databaseKey}/api/v1/get_All_Complaint_List_Facility_Remote`,
    get_count_open:()=>`${databaseKey}/api/v1/get_All_Remote_Status_Open`,
    get_count_close:()=>`${databaseKey}/api/v1/get_All_Remote_Status_Closed`,
    get_count_reject:()=>`${databaseKey}/api/v1/get_All_Remote_Status_Rejected`,
  },

  event: {
    get_All_Event: () => `${databaseKey}/api/v1/get_All_Event`,
    get_NAME_EmpID:()=>`${databaseKey}/api/v1/get_NAME_EmpID`,
    get_ById_Event:(id:any)=>`${databaseKey}/api/v1/get_ById_Event/${id}`,
    creat_event:()=>`${databaseKey}/api/v1/create_Event`,
    update_Event:(id:any)=>`${databaseKey}/api/v1/edit_Event/${id}`,
    Event_Status_Open:()=>`${databaseKey}/api/v1/get_All_Event_Status_Open`,
    Event_Status_Close:()=>`${databaseKey}/api/v1/get_All_Event_Status_Closed`,
    Event_Status_Reject:()=>`${databaseKey}/api/v1/get_All_Event_Status_Rejected`,
    Event_Status_Inprogress:()=>`${databaseKey}/api/v1/get_All_Event_Status_Inprogress`,
  },

  forexCurrency:{
    get_All_Task_order:() => `${databaseKey}/api/v1/getAll_To_list_forex_currency`,
    get_All_Return_list:() => `${databaseKey}/api/v1/getAll_return_forex_currency`,
    create_forex_currenct:()=>`${databaseKey}/api/v1/create_forex_currenct_without_t_o`,
    get_ById:(id:any)=>`${databaseKey}/api/v1/get_ById_with_Taskorder/${id}`,
    updateApprove:(id:any)=>`${databaseKey}/api/v1/approval_forex_currency/${id}`,
    updateForexCurrency:(id:any)=>`${databaseKey}/api/v1/update_To_forex_currency_rate/${id}`,
    update_Return_forex_currency:(id:any)=>`${databaseKey}/api/v1/update_Return_forex_currency/${id}`,

  },

  emp:{
    emp_id :(id:any)=>`${databaseKey}/api/v1/getById_emp/${id}`,
  }
};

@Injectable({
  providedIn: 'root',
})
export class AdminSupportService {
  constructor(private http: HttpClient) {}

  getAllInward(id:any): Observable<any> {
    return this.http.get(routes.courier_inward.inward_list(id));
  }

  getAllUserInward(id:any): Observable<any> {
    return this.http.get(routes.courier_inward.user_inward_list(id));
  }

  getSingleInward(id: any) {
    return this.http.get(routes.courier_inward.singel_inward(id));
  }

  createInward(id:any, data: any) {
    return this.http.post(routes.courier_inward.create_inward(id), data);
  }

  get_inward_ById(id: any) {
    return this.http.get(routes.courier_inward.get_inward_ById(id));
  }

  update_inward(id: any, data: any) {
    return this.http.put(routes.courier_inward.edit_inward(id), data);
  }

  getAll_Accepted(id:any){
    return this.http.get(routes.courier_inward.getAll_Accepted_Data(id));
  }

  courier_Accept(id:any, data:any){
    return this.http.patch(routes.courier_inward.courier_Accept(id),data)
  }

  courierReject(id:any, data:any){
    return this.http.patch(routes.courier_inward.courier_Reject(id),data)
  }

  courier_redirect(id:any, data:any){
    return this.http.patch(routes.courier_inward.courier_redirect(id),data)
  }

  courier_redirectByID(id:any, name:any){
    return this.http.get(routes.courier_inward.courier_Redirected_Byid(id,name))
  }

  courier_getById(id:any){
    return this.http.get(routes.courier_inward.courier_getById(id))
    
  }

  courier_status_Admin(id:any,data:any){
    return this.http.patch(routes.courier_inward.courier_status_Admin(id),data)
  }

  courier_Resend(id:any, data:any){
    return this.http.patch(routes.courier_inward.courier_Resend(id),data)
  }

  courier_handover_admin(id:any, data:any){
    return this.http.patch(routes.courier_inward.courier_handover_admin(id),data)
  }

  //outward

  getAllOutward(id:any): Observable<any> {
    return this.http.get(routes.courier_outward.outward_list(id));
  }

  create_outward(id:any,data: any) {
    return this.http.post(routes.courier_outward.create_outward(id), data);
  }

  single_outward(id: any, emp_id:any) {
    return this.http.get(routes.courier_outward.get_outward_ById(id,emp_id));
  }

  edit_Courier_Outward(id: any, data: any) {
    return this.http.patch(routes.courier_outward.edit_Courier_Outward(id), data);
  }

  //Amc

  getAllAmc() {
    return this.http.get(routes.AMC_Agreement.get_All_AMC_Agreement());
  }

  creatAmc(id:any,data: any) {
    return this.http.post(routes.AMC_Agreement.creat_Amc(id), data);
  }

  update(id: any, data: any) {
    return this.http.post(routes.AMC_Agreement.update_doc(id), data);
  }

  edit_amcupdate(id: any, data: any) {
    return this.http.put(routes.AMC_Agreement.edit_amc(id), data);
  }

  get_ById_AMC_Agreement(id: any) {
    return this.http.get(routes.AMC_Agreement.get_ById_AMC_Agreement(id));
  }

  //Rental

  creatRental(data: any) {
    return this.http.post(
      routes.rental_Agreement.creat_rental_Agreement(),
      data
    );
  }

  updateRental(id: any, data: any) {
    return this.http.put(
      routes.rental_Agreement.update_rental_Agreement(id),
      data
    );
  }

  edit_Rental(id: any, data: any) {
    return this.http.post(routes.rental_Agreement.edit(id), data);
  }
  getAllRental() {
    return this.http.get(routes.rental_Agreement.get_All_rental_Agreement());
  }

  get_ById_Rental_Agreement(id: any) {
    return this.http.get(routes.rental_Agreement.get_ById_rental_Agreement(id));
  }

  //hk
  creat_hk(data: any) {
    return this.http.post(routes.hk.create_hk(), data);
  }

  update_hk(id: any, data: any) {
    return this.http.put(routes.hk.update_hk(id), data);
  }

  edit_hk_doc(id: any, data: any) {
    return this.http.post(routes.hk.edit_hk_doc(id), data);
  }
  getAllHk() {
    return this.http.get(routes.hk.get_All_Hk());
  }

  get_ById_hk(id: any) {
    return this.http.get(routes.hk.get_ById_hk(id));
  }

  //insurance

  creat_in(data: any) {
    return this.http.post(routes.insurance.creat_ins(), data);
  }

  update_ins(id: any, data: any) {
    return this.http.put(routes.insurance.update_ins(id), data);
  }

  edit_ins_doc(id: any, data: any) {
    return this.http.post(routes.insurance.edit_ins_doc(id), data);
  }
  getAllins() {
    return this.http.get(routes.insurance.get_All_ins());
  }

  get_ById_ins(id: any) {
    return this.http.get(routes.insurance.get_ById_ins(id));
  }


  // remote

  get_All_Facility_Remote() {
    return this.http.get(routes.remote.get_All_remote());
  }

  createRemote(data:any){
    return this.http.post(routes.remote.creat_remote(), data);
  }
  getById_remote(id:any){
    return this.http.get(routes.remote.get_ById_remote(id));
  }

  edit_remote(id:any,data:any){
    return this.http.put(routes.remote.update_remote(id),data);
  }

  getAllRequest(){
    return this.http.get(routes.remote.get_All_Requested_Remote())

  }
  getAllComplain(){
    return this.http.get(routes.remote.get_All_Complaint_Remote())

  }

  remote_Status_Open(){
    return this.http.get(routes.remote.get_count_open())
  }
  remote_Status_Close(){
    return this.http.get(routes.remote.get_count_close())
  }
  remote_Status_reject(){
    return this.http.get(routes.remote.get_count_reject())
  }

  //event

  get_All_Event() {
    return this.http.get(routes.event.get_All_Event());
  }

  getAllEmp(){
    return this.http.get(routes.event.get_NAME_EmpID())
  }

  getByIdEmp(id:any){
    return this.http.get(routes.emp.emp_id(id))

  }

  get_ById_Event(id:any){
    return this.http.get(routes.event.get_ById_Event(id))

  }

  createEvent(data:any){
    return this.http.post(routes.event.creat_event(), data);
  }

  update_Event(id:any,data:any){
    return this.http.put(routes.event.update_Event(id),data)

  };

  Event_Status_Open(){
    return this.http.get(routes.event.Event_Status_Open())
  }
  Event_Status_Close(){
    return this.http.get(routes.event.Event_Status_Close())
  }
  Event_Status_Reject(){
    return this.http.get(routes.event.Event_Status_Reject())
  }
  Event_Status_Inprogress(){
    return this.http.get(routes.event.Event_Status_Inprogress())
  }

  //For exxx

  getAllTaskOrder():Observable<any>{
    return this.http.get(routes.forexCurrency.get_All_Task_order());
  }

  getAllReturnlist():Observable<any>{
    return this.http.get(routes.forexCurrency.get_All_Return_list());
  }

  createForex(data:any){
    return this.http.post(routes.forexCurrency.create_forex_currenct(), data);
  }

  getApproveById(id:any){
    return this.http.get(routes.forexCurrency.get_ById(id))
  }

  updateApprove(id:any,data:any){
    return this.http.put(routes.forexCurrency.updateApprove(id),data)
  }

  updateForexCurrency(id:any, data:any){
    return this.http.put(routes.forexCurrency.updateForexCurrency(id),data)
  }

  updateReturnForexCurrency(id:any, data:any){
    return this.http.put(routes.forexCurrency.update_Return_forex_currency(id),data)
  }

  getUserOutward(id:any){
    return this.http.get(routes.courier_outward.getUserOutward(id))
  }
}
