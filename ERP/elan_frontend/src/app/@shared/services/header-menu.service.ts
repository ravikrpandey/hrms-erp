import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.servralUrl;
const routes = {
  pendingTask: {
    list: () => `${databaseKey}/api/v1/getAllPendingTask`,
    // listById:(id)=>`${}//api/v1/get_ById_Pending_Task/${id}`
    listById: (e: any) => `${databaseKey}/api/v1/get_emp_by_emp_id/${e}`,
  },
}
@Injectable({
  providedIn: 'root'
})
export class HeaderMenuService {

  constructor(private http: HttpClient) { }
    //Grievance-Api
    pengingList() {
      return this.http.get(routes.pendingTask.list())
    }
    pendingListById(e: any): Observable<any> {
      return this.http.get<any>(routes.pendingTask.listById(e));
    }
}
