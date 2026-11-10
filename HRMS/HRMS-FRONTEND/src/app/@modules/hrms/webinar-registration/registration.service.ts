import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = `${environment.serverUrl}/api/v1/webinar-session`; // backend base URL

  constructor(private http: HttpClient) {}

  // API call for registration
  register(sessionId: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${sessionId}/register`, data);
  }
}
