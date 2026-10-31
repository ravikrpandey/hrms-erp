import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private baseUrl = `${environment.serverUrl}/api/v1/expense`;

  constructor(private http: HttpClient) {}

  getUserRoleInfo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user-role`);
  }

  getProjects(): Observable<any> {
    return this.http.get(`${this.baseUrl}/projects`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories`);
  }

  getExpenses(filter: {
    tab?: string;
    search?: string;
    project_id?: any;
    expense_type?: string;
    page?: number;
    limit?: number;
  }): Observable<any> {
    let params = new HttpParams();
    if (filter.tab) params = params.set('tab', filter.tab);
    if (filter.search) params = params.set('search', filter.search);
    if (filter.project_id && filter.project_id !== 'All') {
      params = params.set('project_id', filter.project_id.toString());
    }
    if (filter.expense_type && filter.expense_type !== 'All') {
      params = params.set('expense_type', filter.expense_type);
    }
    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.limit) params = params.set('limit', filter.limit.toString());

    return this.http.get(this.baseUrl, { params });
  }

  getExpenseById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createExpense(formData: FormData): Observable<any> {
    return this.http.post(this.baseUrl, formData);
  }

  updateExpense(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, formData);
  }

  approveExpense(id: number, comments: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/approve`, { comments });
  }

  rejectExpense(id: number, rejection_reason: string, comments: string = ''): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/reject`, { rejection_reason, comments });
  }

  deleteExpense(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getFileUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const clean = path.replace(/\\/g, '/');
    return `${environment.serverUrl}/${clean}`;
  }
}

