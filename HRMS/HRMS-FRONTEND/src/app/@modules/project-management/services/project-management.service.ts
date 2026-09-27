import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectManagementService {
  private apiUrl = `${environment.serverUrl}/api/v1/pm`;

  constructor(private http: HttpClient) {}

  getAllProjects(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get(`${this.apiUrl}/projects`, { params: httpParams });
  }

  getProjectById(id: number | string): Observable<any> {
    return this.http.get(`${this.apiUrl}/projects/${id}`);
  }

  getNextProjectCode(): Observable<any> {
    return this.http.get(`${this.apiUrl}/projects/next-code`);
  }

  createProject(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects`, data);
  }

  updateProject(id: number | string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/projects/${id}`, data);
  }

  deleteProject(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/projects/${id}`);
  }

  getProjectMembers(projectId: number | string): Observable<any> {
    return this.http.get(`${this.apiUrl}/projects/${projectId}/members`);
  }

  addProjectMember(projectId: number | string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects/${projectId}/members`, data);
  }

  removeProjectMember(projectId: number | string, memberId: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/projects/${projectId}/members/${memberId}`);
  }

  getAllTasks(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get(`${this.apiUrl}/tasks`, { params: httpParams });
  }

  getTaskById(id: number | string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tasks/${id}`);
  }

  createTask(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/tasks`, data);
  }

  updateTask(id: number | string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/tasks/${id}`, data);
  }

  reviewTask(id: number | string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/tasks/${id}/review`, data);
  }

  deleteTask(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tasks/${id}`);
  }

  getEmployees(): Observable<any> {
    return this.http.get(`${this.apiUrl}/employees`);
  }

  getDepartments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/departments`);
  }
}

