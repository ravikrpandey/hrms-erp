
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AssignUserService {

  databaseKey;
  constructor(private http: HttpClient) {
    this.databaseKey = environment.servralUrl;
  }


  createAssignUser(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createAssignUser`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getAssignUserListById(query: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAssignUserListById/${query}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getEmployeeByRollId(data: any) {
    let url = '';
    let role_master_id = `${data?.role_master_id ? `role_master_id=${data?.role_master_id}&` : ''}`;
    let branch_id = `${data?.branch_id ? `branch_id=${data?.branch_id}&` : ''}`;
    url = role_master_id + branch_id;
    return this.http.get<any>(`${this.databaseKey}/api/v1/getEmployeeByRollId?${url.slice(0, -1)}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getAssignUserList(branch_id: any, key: any, login_id: any) {
    let url = `${branch_id ? `?${key}=${branch_id}` : ''}`;
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAssignUserList${url}${url ? '&' : '?'}login_id=${login_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getSuperUserList() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getSuperUserList`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getEmployeeListOfBranchId(query: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getEmployeeListOfBranchId/${query}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  patchAssignUserListById(body: any, query: any) {
    return this.http.patch<any>(`${this.databaseKey}/api/v1/patchAssignUserListById/${query}`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

}
