import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';


const databaseKey: any = environment.servralUrl;

const routes = {
  dashboard: {
    getAllUserProfileSuperadmin: (id:any) => `${databaseKey}/api/v1/get_AllUserProfile?entity_id=${id}`,
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
}
