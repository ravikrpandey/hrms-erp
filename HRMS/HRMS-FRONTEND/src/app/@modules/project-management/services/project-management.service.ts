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

  updateProjectMember(projectId: number | string, memberId: number | string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/projects/${projectId}/members/${memberId}`, data);
  }

  removeProjectMember(projectId: number | string, memberId: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/projects/${projectId}/members/${memberId}`);
  }

  getProjectMilestones(projectId: number | string): Observable<any> {
    return this.http.get(`${this.apiUrl}/projects/${projectId}/milestones`);
  }

  createProjectMilestone(projectId: number | string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects/${projectId}/milestones`, data);
  }

  updateProjectMilestone(projectId: number | string, milestoneId: number | string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/projects/${projectId}/milestones/${milestoneId}`, data);
  }

  deleteProjectMilestone(projectId: number | string, milestoneId: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/projects/${projectId}/milestones/${milestoneId}`);
  }

  reorderProjectMilestones(projectId: number | string, orders: any[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/projects/${projectId}/milestones/reorder`, { orders });
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

  getTaskActivity(taskId: number | string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tasks/${taskId}/activity`);
  }

  createTaskComment(taskId: number | string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/tasks/${taskId}/comments`, data);
  }

  updateTaskComment(taskId: number | string, commentId: number | string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/tasks/${taskId}/comments/${commentId}`, data);
  }

  deleteTaskComment(taskId: number | string, commentId: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tasks/${taskId}/comments/${commentId}`);
  }

  getEmployees(): Observable<any> {
    return this.http.get(`${this.apiUrl}/employees`);
  }

  getDepartments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/departments`);
  }

  createLog(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/timesheet/logs`, data);
  }

  getLogList(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/timesheet/logs`, { params: this.buildParams(params) });
  }

  getLogById(id: number | string): Observable<any> {
    return this.http.get(`${this.apiUrl}/timesheet/logs/${id}`);
  }

  updateLog(id: number | string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/timesheet/logs/${id}`, data);
  }

  deleteLog(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/timesheet/logs/${id}`);
  }

  getLogSummary(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/timesheet/logs/summary`, { params: this.buildParams(params) });
  }

  getJobs(employee_id: number | string): Observable<any> {
    return this.http.get(`${this.apiUrl}/timesheet/jobs`, { params: { employee_id } });
  }

  getProjectsSummary(employee_id: number | string): Observable<any> {
    return this.http.get(`${this.apiUrl}/timesheet/projects-summary`, { params: { employee_id } });
  }

  getJobSchedule(employee_id: number | string): Observable<any> {
    return this.http.get(`${this.apiUrl}/timesheet/job-schedule`, { params: { employee_id } });
  }

  submitTimesheet(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/timesheet/submissions`, data);
  }

  getSubmissions(employee_id: number | string): Observable<any> {
    return this.http.get(`${this.apiUrl}/timesheet/submissions`, { params: { employee_id } });
  }

  updateSubmissionStatus(id: number | string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/timesheet/submissions/${id}/status`, data);
  }

  getTeamSubmissions(status?: string): Observable<any> {
    const params: any = { view: 'team' };
    if (status) params.status = status;
    return this.http.get(`${this.apiUrl}/timesheet/submissions`, { params: this.buildParams(params) });
  }

  getSubmissionById(id: number | string): Observable<any> {
    return this.http.get(`${this.apiUrl}/timesheet/submissions/${id}`);
  }

  getSubmissionActivities(id: number | string): Observable<any> {
    return this.http.get(`${this.apiUrl}/timesheet/submissions/${id}/activities`);
  }

  addSubmissionComment(id: number | string, comment: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/timesheet/submissions/${id}/comments`, { comment });
  }

  getWeeklyMatrix(params: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/timesheet/weekly-matrix`, { params: this.buildParams(params) });
  }

  getExpenseReport(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/expense-report`, { params: this.buildParams(params) });
  }

  exportExpenseReport(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/expense-report/export`, { params: this.buildParams(params) });
  }

  private buildParams(params?: any): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return httpParams;
  }
}

