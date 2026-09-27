import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OvertimeMasterService {
  databaseKey: any = '';

  constructor(private http: HttpClient) {
    this.databaseKey = environment.serverUrl;
  }

  saveOverTimeMaster(data: any) {
    return this.http.post(
      `${this.databaseKey}/api/v1/hrms/createOvertime`,
      data
    );
  }

  getOverTimeMaster(entity_id: any) {
    return this.http.get(
      `${this.databaseKey}/api/v1/hrms/getAllOvertimeData/${entity_id}`
    );
  }

  updateOverTimeMaster(data: any, entity_id: any) {
    return this.http.put(
      `${this.databaseKey}/api/v1/hrms/updateOverTime/${entity_id}`,
      data
    );
  }
  
}
