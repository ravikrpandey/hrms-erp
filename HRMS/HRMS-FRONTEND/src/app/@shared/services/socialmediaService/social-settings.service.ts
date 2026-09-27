import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

export interface SocialClientSettings { client_id: string, secret: string };

@Injectable({
  providedIn: 'root'
})

export class SocialSettingsService {
  private INQ_API = `${environment.INQ_API}/v1`;
  private BASE_API = `${environment.serverUrl}/api/v1`;

  constructor(private http: HttpClient) { }

  getApiCredentials(): Observable<any> {
    return this.http.get(`${this.BASE_API}/iq-settings/client-credentials`);
  }
  setSocialSettings(socialCLientSettings: { client_id: string, secret: string }): Observable<any> {
    return this.http.post(`${this.BASE_API}/iq-settings/client-credentials`, socialCLientSettings)
  }
  getIqAccounts(): Observable<any> {
    return this.http.get(`${this.BASE_API}/social-media/accounts`);
  }
  addNewAccount(body: { user_id: string, products: any, name: string, external_id: string }): Observable<any> {
    return this.http.post(`${this.BASE_API}/social-media/add-accounts`, body);
  }
  getIqUserList(): Observable<any> {
    return this.http.get(`${this.INQ_API}/users`);
  }
  getIqWebhookList(): Observable<any> {
    return this.http.get(`${this.BASE_API}/webhooks`);
  }
  updateWebhook(hook_id:string, body:{url?:string, events?:string[], name?:string}): Observable<any> {
    return this.http.put(`${this.BASE_API}/webhooks/${hook_id}`, body);
  }
  createWebhook( body:{url?:string, events?:string[], name?:string} ): Observable<any> {
    return this.http.post(`${this.BASE_API}/webhooks`, body);
  }

}
