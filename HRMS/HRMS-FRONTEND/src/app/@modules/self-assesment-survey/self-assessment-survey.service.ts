import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { LoadingService } from '../../@shared/loading/loading.service';
import { environment } from 'src/app/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SelfAssessmentSurveyService {
  databaseKey: any = '';

  constructor(private http: HttpClient, private toast: ToastrService, private loading: LoadingService) {
    this.databaseKey = environment.serverUrl;

  }
  getRoleList(role: any): Observable<any> {
    this.loading.show();
    return this.http
      .get(`${this.databaseKey}/api/v1/getAllRoleMaster/${role}`)
      .pipe(
        tap((res: any) => {
          this.loading.hide();
        }),
        catchError((err: any) => {
          this.loading.hide();
          this.toast.error('Something went wrong');
          return throwError(() => err);
        })
      );
  }

  getdepartmentList(entity_id: any): Observable<any> {
    this.loading.show();
    return this.http
      .get(`${this.databaseKey}/api/v1/getAllDepartment_all?entity_id=${entity_id}`)
      .pipe(
        tap((res: any) => {
          this.loading.hide();
        }),
        catchError((err: any) => {
          this.loading.hide();
          this.toast.error('Something went wrong');
          return throwError(() => err);
        })
      );
  }

  getskillList(): Observable<any> {
    this.loading.show()
    return this.http.get('/skill-master/getAllSkill').pipe(tap((res: any) => {
      this.loading.hide()
    }), catchError((err: any) => {
      this.loading.hide()
      this.toast.error('Something went wrong')
      return throwError(() => err)
    }))
  }

  getemployeeList(): Observable<any> {
    this.loading.show()
    return this.http.get('/getEmployeeList').pipe(tap((res: any) => {
      this.loading.hide()
    }), catchError((err: any) => {
      this.loading.hide()
      this.toast.error('Something went wrong')
      return throwError(() => err)
    }))
  }

  getSurveyById(id: any): Observable<any> {
    this.loading.show()
    return this.http.get(`/create-survey/${id}`).pipe(tap((res: any) => {
      this.loading.hide()
    }), catchError((err: any) => {
      this.loading.hide()
      this.toast.error('Something went wrong')
      return throwError(() => err)
    }))
  }


  createsurveyform(data: any): Observable<any> {
    this.loading.show();
    return this.http.post(`/create-survey`, data).pipe(
      tap(() => {
        this.loading.hide();
        this.toast.success('Survey Created Successfully!');
      }),
      catchError((err) => {
        this.loading.hide();
        const errorMsg = err?.error?.message || 'Failed to create manually';
        this.toast.error(errorMsg);
        return throwError(() => err);
      })
    );
  }

  updatesurvey(id: string, data: any): Observable<any> {
    this.loading.show();
    return this.http.patch(`/create-survey/${id}`, data).pipe(
      tap(() => {
        this.loading.hide();
        this.toast.success('Survey Updated Successfully!');
      }),
      catchError((err) => {
        this.loading.hide();
        const errorMsg = err?.error?.message || 'Failed to update survey';
        this.toast.error(errorMsg);
        return throwError(() => err);
      })
    );
  }



  Assignsurvey(data: any): Observable<any> {
    this.loading.show();
    return this.http.post(`/assign-survey`, data).pipe(
      tap(() => {
        this.loading.hide();
        this.toast.success('Assign Survey Successfully!');
      }),
      catchError((err) => {
        this.loading.hide();
        const errorMsg = err?.error?.message || 'Failed to create manually';
        this.toast.error(errorMsg);
        return throwError(() => err);
      })
    );
  }

  updateAssignedSurvey(id: string, data: any): Observable<any> {
    this.loading.show();
    return this.http.patch(`/assign-survey/survey/${id}`, data).pipe(
      tap(() => {
        this.loading.hide();
        this.toast.success('Survey assignment updated successfully!');
      }),
      catchError((err) => {
        this.loading.hide();
        const errorMsg = err?.error?.message || 'Failed to update assignment';
        this.toast.error(errorMsg);
        return throwError(() => err);
      })
    );
  }

  submitSetTimeline(data: any): Observable<any> {
    this.loading.show();
    return this.http.post(`/set-timeline-survey`, data).pipe(
      tap(() => {
        this.loading.hide();
        this.toast.success('SetTimeline Created Successfully!');
      }),
      catchError((err) => {
        this.loading.hide();
        const errorMsg = err?.error?.message || 'Failed to create manually';
        this.toast.error(errorMsg);
        return throwError(() => err);
      })
    );
  }
  updateSetTimeline(id: string, data: any): Observable<any> {
    this.loading.show();
    return this.http.patch(`/set-timeline-survey/timeline/${id}`, data).pipe(
      tap(() => {
        this.loading.hide();
        this.toast.success('Timeline updated successfully!');
      }),
      catchError((err) => {
        this.loading.hide();
        const errorMsg = err?.error?.message || 'Failed to update timeline';
        this.toast.error(errorMsg);
        return throwError(() => err);
      })
    );
  }
  getsurveyList(): Observable<any> {
    this.loading.show()
    return this.http.get('/create-survey').pipe(tap((res: any) => {
      this.loading.hide()
    }), catchError((err: any) => {
      this.loading.hide()
      this.toast.error('Something went wrong')
      return throwError(() => err)
    }))
  }

  updateSurveyStatus(id: string, data: any): Observable<any> {
    this.loading.show();
    return this.http.put(`/Create-Survey/surveyStatus/${id}`, data).pipe(
      tap((res: any) => {
        this.loading.hide();
        this.toast.success('Survey Status Updated Successfully!');
      }),
      catchError((err) => {
        this.loading.hide();
        const errorMsg = err?.error?.message || 'Something went wrong';
        this.toast.error(errorMsg);
        return throwError(() => err);
      })
    );
  }

}
