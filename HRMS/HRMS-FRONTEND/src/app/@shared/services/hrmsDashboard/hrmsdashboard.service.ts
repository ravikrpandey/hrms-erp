import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HrmsdashboardService {
  private databaseKey: any = environment.serverUrl;

  constructor(private httpclient: HttpClient) {}

  getAllEmployeeLeavedata(entity_id: any) {
    return this.httpclient.get(
      `${this.databaseKey}/api/v1/getAllLeaveEmployeeData/${entity_id}`
    );
  }

  getAllEmployeeAppliedLeave(entity_id: any) {
    return this.httpclient.get(
      `${this.databaseKey}/api/v1/getAllattendanceEmployeedata/${entity_id}`
    );
  }

  get_AllBirthDayAndOtherAnnouncementdata(entity_id: any){
    return this.httpclient.get(
      `${this.databaseKey}/api/v1/getAllNewJoinandOtherData/${entity_id}`
    );
  }


  getOnlyWFHEmployeeList(entity_id: any){
    return this.httpclient.get(
      `${this.databaseKey}/api/v1/getOnlyWFHEmployeeRecord/${entity_id}`
    );
  }


  getAllHolidayView(entity_id: any){
    return this.httpclient.get(
      `${this.databaseKey}/api/v1/getAllUpcomingHoliday/${entity_id}`
    );
  }
}
