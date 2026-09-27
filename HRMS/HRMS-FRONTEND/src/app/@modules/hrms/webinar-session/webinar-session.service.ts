import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError, map, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../../@shared/loading/loading.service';
import { environment } from 'src/app/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WebinarSessionService {
   databaseKey: any = '';

  constructor(
    private http: HttpClient,
    private toast: ToastrService,
    private loading: LoadingService
  ) {
     this.databaseKey = environment.serverUrl;
  }

 
  createSession(data: any): Observable<any> {
    this.loading.show();
    return this.http.post(`${this.databaseKey}/api/v1/createWebinarSession`, data).pipe(
      tap((res: any) => {
        this.loading.hide();
        this.toast.success('Webinar session created successfully!');
      }),
      catchError((err: any) => {
        this.loading.hide();
        this.toast.error('Failed to create session');
        return throwError(()=>err);
      })
    );
  }
  getSessions(entity_id:any): Observable<any> {
    this.loading.show();
    return this.http.get(`${this.databaseKey}/api/v1/getAllWebinarSessions/${entity_id}`).pipe(
      tap(() => this.loading.hide()),
      catchError((err: any) => {
        this.loading.hide();
        this.toast.error('Failed to fetch sessions');
        return throwError(()=>err);
      })
    );
  }
  getSessionById(id: string): Observable<any> {
    this.loading.show();
    return this.http.get(`${this.databaseKey}/api/v1/getWebinarSessionById/${id}`).pipe(
      tap(() => this.loading.hide()),
      catchError((err: any) => {
        this.loading.hide();
        this.toast.error('Failed to fetch session');
        return throwError(()=>err);
      })
    );
  }
  updateSession(id: string, data: any): Observable<any> {
    this.loading.show();
    return this.http.put(`${this.databaseKey}/api/v1/updateWebinarSession/${id}`, data).pipe(
      tap(() => {
        this.loading.hide();
        this.toast.success('Webinar session updated successfully!');
      }),
      catchError((err: any) => {
        this.loading.hide();
        this.toast.error('Failed to update session');
        return throwError(()=>err);
      })
    );
  }
  deleteSession(id: string): Observable<any> {
    this.loading.show();
    return this.http.delete(`/webinar-sessions/${id}`).pipe(
      tap(() => {
        this.loading.hide();
        this.toast.success('Webinar session deleted successfully!');
      }),
      catchError((err: any) => {
        this.loading.hide();
        this.toast.error('Failed to delete session');
        return throwError(()=>err);
      })
    );
  }

    getSessionLearners(sessionId: string): Observable<any> {
    if (!sessionId) return of([]);
    this.loading.show();
    return this.http.get(`/webinar-session/learners/${sessionId}`).pipe(
      tap(() => this.loading.hide()),
      catchError((err: any) => {
        this.loading.hide();
        this.toast.error('Failed to fetch session learners');
        return of([]);
      })
    );
  }


generateMeetLink(): Observable<{
  meeting_id: string;
  join_url: string;
  topic: string;
  start_time: string;
  end_time: string;
  duration: number;
  platform: string;
}> {
  this.loading.show();

  return this.http.post<any>(`${this.databaseKey}/api/v1/generateGoogleMeet`, {}).pipe(
    map(response => {
      const data = response.data;
      return {
        meeting_id: data.meeting_id,
        join_url: data.join_url,
        topic: data.topic,
        start_time: data.start_time,
        end_time: data.end_time,
        duration: data.duration,
        platform: data.platform,
      };
    }),
    tap(meeting => {
      console.log('Full Google Meet response mapped:', meeting);
    }),
    catchError(err => {
      console.error('Error generating Google Meet:', err);
      this.toast.error('Failed to generate Google Meet link');
      return throwError(() => err);
    }),
    finalize(() => this.loading.hide())
  );
}



generateZoomMeeting(payload: {
  topic: string;
  startTime: string;
  timezone: string;
}): Observable<{
  id: string;
  join_url: string;
  start_url: string;
  password: string;
  topic: string;
  start_time: string;
  duration: number;
}> {
  this.loading.show();

  return this.http.post<any>(`${this.databaseKey}/api/v1/generateZoomMeeting`, payload).pipe(
    map(zoomResponse => {
      const data = zoomResponse.data;
      return {
        id: data.meeting_id,        // rename to 'id' for easier patching
        join_url: data.join_url,
        start_url: data.start_url,
        password: data.password,
        topic: data.topic,
        start_time: data.start_time,
        duration: data.duration,
      };
    }),
    tap(meeting => {
      console.log('Full Zoom meeting response mapped:', meeting);
    }),
    catchError(err => {
      this.toast.error('Failed to generate Zoom meeting');
      return throwError(() => err);
    }),
    finalize(() => this.loading.hide())
  );
}


}





