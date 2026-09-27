
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FGListService {
  baseUrl = environment.servralUrl;

  constructor(private http: HttpClient) {
  }

  getAllStocksByStatus(status: "All" | "PENDING" | "ALLOCATED" | "REJECTED") {
    return this.http.get<any>(`${this.baseUrl}/api/v1/getAllStocksByStatus?status=${status}`)
  }

  updateStockStatus(data: any) {
    return this.http.put<any>(`${this.baseUrl}/api/v1/updateStockStatus`, data)
  }

}
