import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
const databaseKey: any = environment.servralUrl;
const routes = {
  getnotificationlist: (id:any) => `${databaseKey}/api/v1/getnotificationlist/${id}`,
  removeNotification: (id:any) => `${databaseKey}/api/v1/removenotificationlist/${id}`,

}
@Injectable({
  providedIn: 'root'
})
export class MyPendingTaskService {
  constructor(private http: HttpClient) { }
  getnotificationlist(id: any):Observable<any> {
    return this.http.get(routes.getnotificationlist(id));
  }
  removeNotification(id:any,data:any):Observable<any>{
    return this.http.post(routes.removeNotification(id),data)
  }
}
