import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.serverUrl;

const routes = {

  meeting: {
    create_meetings: () => `${databaseKey}/api/v1/create_meetings`,
    get_all_meeting: (id:any) => `${databaseKey}/api/v1/get_all_meeting/${id}`,
    get_all_meeting_with_type: () => `${databaseKey}/api/v1/get_all_meeting_with_type`,
    },
};


@Injectable({
  providedIn: 'root'
})

export class MeetingService {
  constructor( private http: HttpClient) { }

  createMeeting(data:any){
   return this.http.post(routes.meeting.create_meetings(),data)
  }

  getAllMeeting(id:any){
    return this.http.get(routes.meeting.get_all_meeting(id))
  }

  get_all_meeting_with_type(data:any){
    return this.http.post(routes.meeting.get_all_meeting_with_type(),data)
  }
}
