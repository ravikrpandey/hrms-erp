import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/app/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TransportManagementService {

  databaseKey;
  constructor(private http: HttpClient) {
    this.databaseKey = environment.servralUrl;
  }
  //...........vehical Category
  getAll_vehical_category(entity_id: any, financial_year_id: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_vehical_category?entity_id=${entity_id}&financial_year_id=${financial_year_id}`,).pipe(
      map((response: any) => { return response })
    );
  }
  get_vehical_category_Active(entity_id: any, financial_year_id: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/get_vehical_category_Active?entity_id=${entity_id}&financial_year_id=${financial_year_id}`,).pipe(
      map((response: any) => { return response })
    );
  }

  create_vehical_category(data: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/create_vehical_category`, data).pipe(
      map((res: any) => { return res })
    )
  }
  update_vehical_category(data: any) {
    return this.http.put<any>(`${this.databaseKey}/api/v1/update_vehical_category`, data).pipe(
      map((res: any) => { return res })
    )
  }
  get_vehical_category_byId(id: any): Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/get_vehical_category_byId?id=${id}`).pipe(
      map((res: any) => res)
    );
  }


  ///..............vehicle master
  create_vehicle(data: any): Observable<any> {
    return this.http.post<any>(`${this.databaseKey}/api/v1/create_vehicle`, data).pipe(
      map((res: any) => res)
    );
  }
  update_vehicle(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.databaseKey}/api/v1/update_vehicle?id=${id}`, data).pipe(
      map((res: any) => res)
    );
  }

  getAll_vehicleMaster(entity_id: any): Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_vehicleMaster?entity_id=${entity_id}`).pipe(
      map((res: any) => res)
    );
  }

  get_vehicle_master_byId(id: any): Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/get_vehicle_master_byId?id=${id}`).pipe(
      map((res: any) => res)
    );
  }
  getsTransAdminApprovel(id: any): Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getsTransAdminApprovel/${id}`).pipe(
      map((res: any) => res)
    );
  }
  getsRateAgreementByTransporter(transporter_id:number,vehicle_type_id:number,soList:any): Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getsRateAgreementByTransporter?transporter_id=${transporter_id}&vehicle_type_id=${vehicle_type_id}&soList=${soList}`).pipe(
      map((res: any) => res)
    );
  }
  updateTransporterAdminStatus(data:any): Observable<any> {
    return this.http.patch<any>(`${this.databaseKey}/api/v1/updateTransporterAdminStatus`,data).pipe(
      map((res: any) => res)
    );
  }
  approvedVehiclePlanning(data:any): Observable<any> {
    return this.http.patch<any>(`${this.databaseKey}/api/v1/approvedVehiclePlanning`,data).pipe(
      map((res: any) => res)
    );
  }

  //////////..................vehicle driver
  create_vehicle_driver(data: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/create_vehicle_driver`, data).pipe(
      map((res: any) => res)
    )
  }
  getAll_Vehicle_driver(entity_id: any, financial_year_id: any, role: any, emp_id: any): Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_Vehicle_driver?entity_id=${entity_id}&financial_year_id=${financial_year_id}&role=${role}&emp_id=${emp_id}`).pipe(
      map((res: any) => res)
    );
  }
  get_vehicle_driver_by_id(driver_id: any,): Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/get_vehicle_driver_by_id?driver_id=${driver_id}`).pipe(
      map((res: any) => res)
    );
  }
  getVehiclesByVendor(vendorId: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/get_vehicles_by_VendorId/${vendorId}`).pipe(
      map((res: any) => res)
    )
  }
  getTransportRequest(entity_id: any, financial_year_id: any, login_id: any): Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_TransportRequest/${entity_id}/${financial_year_id}/${login_id}`);
  }
  getAllVehicleVendor(entity_id: any, financial_year_id: any, employee_id: any) {
    return this.http.get(`${this.databaseKey}/api/v1/getAll_vendor?entity_id=${entity_id}&financial_year_id=${financial_year_id}&employee_id=${employee_id}`)
  }
  getTransportRequestById(id: String): Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getTransportRequestById/${id}`).pipe(
      map((res: any) => res)
    );
  }
  getAll_SelfvehicleMaster(entity_id: any, financial_year_id: any, employee_id: any): Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_vehicleMaster?entity_id=${entity_id}&financial_year_id=${financial_year_id}&employee_id=${employee_id}`).pipe(
      map((res: any) => res)
    );
  }
  createTransportRequest(payload: any): Observable<any> {
    return this.http.post<any>(`${this.databaseKey}/api/v1/create_transport_request`, payload).pipe(
      map((res: any) => res)
    );
  }
  updateRequest(id: any, data: any) {
    return this.http.put(`${this.databaseKey}/api/v1/editTransportRequest/${id}`, data)
  }
  getLevel(transport_id: any,): Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_Approvals_level/${transport_id}`).pipe(
      map((res: any) => res)
    );
  }
  DeleteTransportRequestById(id: string): Observable<any> {
    return this.http.delete<any>(`${this.databaseKey}/api/v1/delete_transport_request/${id}`).pipe(
      map((res: any) => res)
    );
  }
  updateStatus(id: any, data: any) {
    return this.http.put(`${this.databaseKey}/api/v1/approvedRequestById/${id}`, data)
  }
  ////vehical vendor 
  deleteVehicleVendorById(vid: any) {
    return this.http.delete(`${this.databaseKey}/api/v1/delete_vendor/${vid}`);
  }
  getVehicleVendorById(vid: any) {
    return this.http.get(`${this.databaseKey}/api/v1/getAll_vendor_byId/${vid}`);
  }
  editVehicleVendorById(data: any) {
    return this.http.put(`${this.databaseKey}/api/v1/edit_vehicle_vendor`, data);
  }
  createVendor(data: any) {
    return this.http.post(`${this.databaseKey}/api/v1/create_vendor`, data)
  }
  //// all trip
  private tripRefreshSubject = new BehaviorSubject<boolean>(false);
  public tripRefresh$ = this.tripRefreshSubject.asObservable();
  notifyTripRefresh() {
    this.tripRefreshSubject.next(true);
  }
  getScheduleTrip(entity_id: any) {
    return this.http.get(`${this.databaseKey}/api/v1/get_scheduled_trip/${entity_id}`)
  }
  get_vehicles_by_vehcle_catId(vehicle_category_id: any, entity_id: any | null) {
    return this.http.get(`${this.databaseKey}/api/v1/get_vehicles_by_vehicle_categoryId/${vehicle_category_id}/${entity_id} `)
  }

  get_vehicles_by_vehcle_catIdAndVendorId(vehicle_category_id: any, vendor_id: any, entity_id: any) {
    return this.http.get(`${this.databaseKey}/api/v1/get_vehicles_by_vehcle_catIdAndVendorId/${vehicle_category_id}/${vendor_id}/${entity_id} `)
  }

  getApprovedProductItemData(id: any, status: any) {
    return this.http.get(`${this.databaseKey}/api/v1/getApprovedProductItemData/${id}?status=${status}`)
  }

  createScheduleTrip(data: any) {
    return this.http.post(`${this.databaseKey}/api/v1/createScheduleTrip`, data)
  }


  getliveTripInfo(tripId: any) {
    return this.http.get(`${this.databaseKey}/api/v1/get_live_trips_by_id/${tripId}`)
  }
  createExpenseTripInfo(tripDta: any) {
    return this.http.post(`${this.databaseKey}/api/v1/create_expense_info`, tripDta)
  }
  getScheduledTripById(id: any, statusData: string) {
    return this.http.get(`${this.databaseKey}/api/v1/get_scheduled_trip_by_Id?id=${id}&statusData=${statusData}`)
  }
  allExpensesInfo(tripId: any) {
    return this.http.get(`${this.databaseKey}/api/v1/all-expenses-info/${tripId}`)
  }

  deleteExpense(id: any) {
    return this.http.delete(`${this.databaseKey}/api/v1/delete_expenses_info/${id}`)
  }

  changeTripStatus(id: any, data: any) {
    return this.http.put(`${this.databaseKey}/api/v1/status_change/${id}`, data)
  }

  getLiveTrips(entity_id: any) {
    return this.http.get(`${this.databaseKey}/api/v1/get_live_trips/${entity_id}`)
  }
  get_vendor_vehicleCategory(vid: any) {
    return this.http.get(`${this.databaseKey}/api/v1/get_vendor_vehicleCategory/${vid}`);
  }
  getApprovedTransportRequest(entity_id: any) {
    return this.http.get(`${this.databaseKey}/api/v1/approvedTransportRequest/${entity_id}`,)
  }
  getCompleteTrips(entity_id: any) {
    return this.http.get(`${this.databaseKey}/api/v1/getCompletedTrip/${entity_id}`)
  }
  completeTrip(formData: any) {
    return this.http.post(`${this.databaseKey}/api/v1/complete_trip`, formData)
  }
  getCompletedTripsById(trip_id: any) {
    return this.http.get(`${this.databaseKey}/api/v1/getCompletedTrip_By_id/${trip_id}`)
  }
  getLiveTripData(trip_id: any, status: any) {
    return this.http.get(`${this.databaseKey}/api/v1/get_live_tripData?id=${trip_id}&status=${status}`)
  }

  ////////////////// Common Documents Upload API
  uploaddocuments(data: any, folderName: any, originalFileName: boolean=false) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/uploadDoc?folderName=${folderName}&originalFileName=${originalFileName}`, data);
  }

  ////////////////// Fuel Type Master API
  getAll_fuelType(entity_id: any, status?: string) {
    let url = `${this.databaseKey}/api/v1/getAll_fuelType?entity_id=${entity_id}`;

    // status bind
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get<any>(url);
  }

  cu_fueltype(data: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/cu_fueltype`, data);
  }

  ////////////////// Vehicle Type Master API
  getAll_vehicleType(entity_id: any, status?: string) {
    let url = `${this.databaseKey}/api/v1/getAll_vehicleType?entity_id=${entity_id}`;

    // status bind
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get<any>(url);
  }
  // getAll_transporterType(entity_id: any, status?: string) {
  //   let url = `${this.databaseKey}/api/v1/getAll_transporterType?entity_id=${entity_id}`;

    
  //   if (status) {
  //     url += `&status=${status}`;
  //   }
  //   return this.http.get<any>(url);
  // }
  // getAll_transportType(entity_id: any, status?: string) {
  //   let url = `${this.databaseKey}/api/v1/getAll_transportType?entity_id=${entity_id}`;

    
  //   if (status) {
  //     url += `&status=${status}`;
  //   }
  //   return this.http.get<any>(url);
  // }

  createUpdate_vehicleType(data: any): Observable<any> {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createUpdate_vehicleType`, data);
  }

  getVehicleTypebyId(id: any): Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getVehicleTypebyId?vehicle_type_id=${id}`);
  }
  getPlanningByTransporter(planning_id: any,transporter_id:any): Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getPlanningByTransporter?planning_id=${planning_id}&transporter_id=${transporter_id}`);
  }

  getPlanningByTransporterForRFQ(planning_id: any,transporter_id:any): Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getPlanningByTransporterForRFQ?planning_id=${planning_id}&transporter_id=${transporter_id}`);
  }
  
  transporterAcceptance(transporter_req_id:any,data:any): Observable<any> {
    return this.http.patch<any>(`${this.databaseKey}/api/v1/transporterAcceptance/${transporter_req_id}`,data);
  }

  deleteVehicleType(id: any) {
    return this.http.delete(`${this.databaseKey}/api/v1/deleteVehicleType/${id}`);
  }

  ////////////////// Vehicle Master
  getAllVehicleMaster(entity_id: any, status?: string) {
    let url = `${this.databaseKey}/api/v1/getAllVehicleMaster?entity_id=${entity_id}`;

    // status bind
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get<any>(url);
  }

  createUpdate_vehicleMaster(data: any): Observable<any> {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createUpdate_vehicleMaster`, data);
  }

  deleteVehicleMaster(id: any) {
    return this.http.delete(`${this.databaseKey}/api/v1/deleteVehicleMaster/${id}`);
  }

  ////////////////// Driver Master API
  getAllDriverMaster(entity_id: any, status?: string) {
    let url = `${this.databaseKey}/api/v1/getAllDriverMaster?entity_id=${entity_id}`;

    // status bind
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get<any>(url);
  }

  createUpdate_driverMaster(data: any): Observable<any> {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createUpdate_driverMaster`, data);
  }

  deleteDriverMaster(id: any) {
    return this.http.delete(`${this.databaseKey}/api/v1/deleteDriverMaster/${id}`);
  }

  ////////////////// Transporter Type Master API
  getAll_transporterType(entity_id: any, status?: string) {
    let url = `${this.databaseKey}/api/v1/getAll_transporterType?entity_id=${entity_id}`;

    // status bind
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get<any>(url);
  }

  createUpdate_transporterType(data: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createUpdate_transporterType`, data);
  }

  ////////////////// Transport Type Master API
  getAll_transportType(entity_id: any, status?: string) {
    let url = `${this.databaseKey}/api/v1/getAll_transportType?entity_id=${entity_id}`;

    // status bind
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get<any>(url);
  }

  createUpdate_transportType(data: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createUpdate_transportType`, data);
  }

  ////////////////// Transporter Master
  getAllTransporterMaster(entity_id: any, status?: string) {
    let url = `${this.databaseKey}/api/v1/getAllTransporterMaster?entity_id=${entity_id}`;

    // status bind
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get<any>(url);
  }

  createUpdate_transporterMaster(data: any): Observable<any> {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createUpdate_transporterMaster`, data);
  }

  getTransporterMasterById(id: any,): Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getTransporterMasterById?id=${id}`);
  } 
  getTranportDataList(entity_id: any,): Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getTranportDataList?entity_id=${entity_id}`);
  }

  deleteTransporterMaster(id: any) {
    return this.http.delete(`${this.databaseKey}/api/v1/deleteTransporterMaster/${id}`);
  }

  getTransporterMasterListByTransporterTypeId(transporter_type_id: any,): Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getTransporterMasterListByTransporterTypeId?id=${transporter_type_id}`);
  }

  createDriverVehicleMapping(data: any): Observable<any> {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createDriverVehicleMapping`, data);
  }

  getAllDriverVehicleMapping(entity_id: any) {
    let url = `${this.databaseKey}/api/v1/getAllDriverVehicleMapping?entity_id=${entity_id}`;
    return this.http.get<any>(url);
  }
  
  getAllDriverVehicleMappingList(transporter_id: any) {
    let url = `${this.databaseKey}/api/v1/getAllDriverVehicleMappingList?transporter_id=${transporter_id}`;
    return this.http.get<any>(url);
  }
  
  getAllDriverListUnlinked(entity_id: any) {
    let url = `${this.databaseKey}/api/v1/getAllDriverListUnlinked?entity_id=${entity_id}`;
    return this.http.get<any>(url);
  }

  getAllVehicleListUnlinked(entity_id: any) {
    let url = `${this.databaseKey}/api/v1/getAllVehicleListUnlinked?entity_id=${entity_id}`;
    return this.http.get<any>(url);
  }

  delinkDriverVehicleMapping(data: any): Observable<any> {
    return this.http.post<any>(`${this.databaseKey}/api/v1/delinkDriverVehicleMapping`, data);
  }

  ////////////////// Rate Agreement Master
  createUpdate_rateAgreementMaster(data: any): Observable<any> {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createUpdate_rateAgreementMaster`, data);
  }

  getAllRateAgreementList(entity_id: any) {
    let url = `${this.databaseKey}/api/v1/getAllRateAgreementList?entity_id=${entity_id}`;
    return this.http.get<any>(url);
  }

  getRateAgreementById(id: any,): Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getRateAgreementById?id=${id}`);
  }

  deleteRateAgreement(id: any) {
    return this.http.delete(`${this.databaseKey}/api/v1/deleteRateAgreement/${id}`);
  }
 
  createUpdate_rateAgreementdetails(data: any): Observable<any> {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createUpdate_rateAgreementdetails`, data);
  }

  getRateAgreementDetailsById(id: any,): Observable<any> {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getRateAgreementDetailsById?rate_agreement_id=${id}`);
  }

  deleteRateAgreementDetails(id: any) {
    return this.http.delete(`${this.databaseKey}/api/v1/deleteRateAgreementDetails/${id}`);
  }

  ////////////////// Transporter RFQ List
  getAllRFQList(entity_id: any, status: any) {
    let url = `${this.databaseKey}/api/v1/getAllRFQList?entity_id=${entity_id}&status=${status}`;
    return this.http.get<any>(url);
  }

  ////////////////// Transporter Vehicle Dispatch Planning List
  getAllVehicleDispatchPlannigList(entity_id: any, status: any) {
    let url = `${this.databaseKey}/api/v1/getAllVehicleDispatchPlannigList?entity_id=${entity_id}&status=${status}`;
    return this.http.get<any>(url);
  }

  getVehicleListForDispatch(entity_id: any, vehicleTypeId?: string, vehicle_id?: any) {
    let url = `${this.databaseKey}/api/v1/getVehicleListForDispatch?entity_id=${entity_id}&vehicleTypeId=${vehicleTypeId}&vehicle_id=${vehicle_id}`;
    return this.http.get<any>(url);
  }

  getDriverListForDispatch(entity_id: any, driver_id?: any) {
    let url = `${this.databaseKey}/api/v1/getDriverListForDispatch?entity_id=${entity_id}&driver_id=${driver_id}`;
    return this.http.get<any>(url);
  }

  assignDriverVehicleForDispatch(data: any): Observable<any> {
    return this.http.post<any>(`${this.databaseKey}/api/v1/assignDriverVehicleForDispatch`, data);
  }
  

uploadDocument(data: FormData): Observable<HttpEvent<any>> {
  return this.http.post<any>(
    `${this.databaseKey}/api/v1/upload-documents`,
    data,
    {
      reportProgress: true,
      observe: 'events'
    }
  );
}
}