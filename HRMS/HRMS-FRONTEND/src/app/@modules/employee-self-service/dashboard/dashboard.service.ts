import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';


const databaseKey: any = environment.serverUrl;

const routes = {
  dashboard: {
    getAllUserProfileSuperadmin: (id:any) => `${databaseKey}/api/v1/get_AllUserProfile?entity_id=${id}`,
     getAll_AnnouncementBy_dept: (id:any,role:any) => `${databaseKey}/api/v1/getAll_AnnouncementBy_dept?dept_id=${id}&role=${role}`,
     globalSearch: `${databaseKey}/api/v1/globalSearch`,
  }
  
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpclient: HttpClient) { }

  SuperadmingetAllUserProfile(id:any): Observable<any> {
    return this.httpclient.get(routes.dashboard.getAllUserProfileSuperadmin(id));
  }
  getAll_AnnouncementBy_dept(id:any,role:any): Observable<any> {
    return this.httpclient.get(routes.dashboard.getAll_AnnouncementBy_dept(id,role));
  }
  globalSearch(searchTerm: string): Observable<any> {
  return this.httpclient.get(
    `${routes.dashboard.globalSearch}?keyword=${encodeURIComponent(searchTerm)}`
  );
}

}
