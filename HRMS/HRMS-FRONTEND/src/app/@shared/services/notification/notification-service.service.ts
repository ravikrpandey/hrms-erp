import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { Observable, Subject } from 'rxjs'
const databaseKey: any = environment.serverUrl;
const routes = {
  notification_count: {
    notification_count: (id: any) => `${databaseKey}/api/v1/get_notification_count/${id}`,
  },
  notification: {
    get_all_user_notification: () => `${databaseKey}/api/v1/get_all_user_notification`,
    update_all_notif_read_status: (emp_id: any,entity_id:any) => `${databaseKey}/api/v1/update_all_notif_read_status?employee_id=${emp_id}&entity_id=${entity_id}`,
    update_notif_read_status: (notification_id: any) => `${databaseKey}/api/v1/update_notif_read_status?notification_id=${notification_id}`,
  },
  LMS_notification: {
    create_notification: () => `${databaseKey}/api/v1/LMS_notification`,
    get_EmployeeDetails: (id: any) => `${databaseKey}/api/auth/userbyid/${id}`,
    getAll_EmployeeDetails: () => `${databaseKey}/api/auth/registrationall`,
    edit_notification: (id: any) => `${databaseKey}/api/v1/edit_LMS_notification/${id}`,
    get_notification: (id: any) => `${databaseKey}/api/v1/getLMS_notification/${id}`,
    delete_notification: () => `${databaseKey}/api/v1/delete_LMS_notification`,
  },
  CP_notification: {
    create_notificationCP: () => `${databaseKey}/api/v1/cp_notification`,
    edit_notificationCP: (id: any) => `${databaseKey}/api/v1/edit_cp_notification/${id}`,
    get_notificationCP: (id: any) => `${databaseKey}/api/v1/getcp_notification/${id}`,
    delete_notificationCP: () => `${databaseKey}/api/v1/delete_cp_notification`,
  }
}
@Injectable({
  providedIn: 'root'
})
export class NotificationServiceService {
  constructor(private http: HttpClient) { }
  //notification (LMS)
  create_notification(data: any): Observable<any> {
    return this.http.post<any>(routes.LMS_notification.create_notification(), data);
  }
  get_EmployeeDetails(id: any): Observable<any> {
    return this.http.get<any>(routes.LMS_notification.get_EmployeeDetails(id));
  }
  getAll_EmployeeDetails(): Observable<any> {
    return this.http.get<any>(routes.LMS_notification.getAll_EmployeeDetails());
  }
  edit_notification(id: any, data: any): Observable<any> {
    return this.http.put<any>(routes.LMS_notification.edit_notification(id), data);
  }
  get_notification(id: any): Observable<any> {
    return this.http.get<any>(routes.LMS_notification.get_notification(id));
  }
  delete_notification(data: any): Observable<any> {
    return this.http.put<any>(routes.LMS_notification.delete_notification(), data);
  }
  //notification (CP)
  create_notificationCP(data: any): Observable<any> {
    return this.http.post<any>(routes.CP_notification.create_notificationCP(), data);
  }
  edit_notificationCP(id: any, data: any): Observable<any> {
    return this.http.put<any>(routes.CP_notification.edit_notificationCP(id), data);
  }
  get_notificationCP(id: any): Observable<any> {
    return this.http.get<any>(routes.CP_notification.get_notificationCP(id));
  }
  delete_notificationCP(data: any): Observable<any> {
    return this.http.put<any>(routes.CP_notification.delete_notificationCP(), data);
  }
  //
  notification_count(id: any): Observable<any> {
    return this.http.get<any>(routes.notification_count.notification_count(id));
  }
  ///////////////////////////////////New////////////////////////////////////////////////////
  get_all_user_notification(data: any): Observable<any> {
    return this.http.post<any>(routes.notification.get_all_user_notification(),data);
  }
  update_all_notif_read_status(emp_id: any,entity_id:any): Observable<any> {
    return this.http.put<any>(routes.notification.update_all_notif_read_status(emp_id,entity_id),{});
  }
  update_notif_read_status(notification_id: any): Observable<any> {
    return this.http.put<any>(routes.notification.update_notif_read_status(notification_id),{});
  }

} 
