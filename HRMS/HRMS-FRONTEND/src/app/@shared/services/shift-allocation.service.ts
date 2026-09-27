import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShiftAllocationService {
  databaseKey: any = '';

  constructor(private http: HttpClient) {
    this.databaseKey = environment.serverUrl;
  }

  getAllDepartmentData(entity_id: any) {
    return this.http
      .get<any>(
        `${this.databaseKey}/api/v1/get_department_data_shift_Allocation/${entity_id}`
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getAllShiftMasterdata(entity_id: any) {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/getshiftMaster/${entity_id}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  CreateShiftAllocationData(data: any): Observable<any> {
    return this.http
      .post<any>(
        `${this.databaseKey}/api/v1/created_Data_shift_Allocation`,
        data
      )
      .pipe(map((response: any) => response));
  }

  getAllShiftMasterListData(entity_id: any) {
    return this.http
      .get<any>(
        `${this.databaseKey}/api/v1/getshiftAllocationListData/${entity_id}`
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }



  ShiftAllocationstatusUpdate(dept_id: any, body: any): Observable<any> {
    return this.http
      .put<any>(
        `${this.databaseKey}/api/v1/statusUpateShiftAllocation/${dept_id}`,
        body
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  DeleteShiftAllocationRecord(dept_id: any) {
    return this.http
      .delete<any>(`${this.databaseKey}/api/v1/deleteshiftAllocated/${dept_id}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getSingleUserDataInShiftAllocation(id: any, shift_id: any) {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/get_single_shiftAllocatedata`, {
        params: { dept_id: id, shift_id: shift_id },
      })
      .pipe(map((response: any) => response));
  }

  ShiftAllocationUpdateTheRecord(id: any, body: any): Observable<any> {
    return this.http
      .put<any>(
        `${this.databaseKey}/api/v1/update_shift_Allocation_Data/${id}`,
        body
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
 
}
