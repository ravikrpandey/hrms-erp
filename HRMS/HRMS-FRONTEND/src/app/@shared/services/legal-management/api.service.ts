import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) { };

  get(url:string, params?:any){
     return this.http.get(`${this.serverUrl}/api/v1/${url}`, {params})
  }
  post(url:string, body:any){
     return this.http.post(`${this.serverUrl}/api/v1/${url}`, body)
  }
  put(url:string, body:any){
     return this.http.put(`${this.serverUrl}/api/v1/${url}`, body)
  }
  patch(url:string, body:any){
     return this.http.patch(`${this.serverUrl}/api/v1/${url}`, body)
  }
  delete(url:string, params?:any){
     return this.http.delete(`${this.serverUrl}/api/v1/${url}`, {params})
  }
  
  
}
     
