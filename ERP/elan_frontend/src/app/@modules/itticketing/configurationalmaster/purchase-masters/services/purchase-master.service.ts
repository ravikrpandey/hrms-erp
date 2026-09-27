import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseMasterService {
  baseUrl = environment.servralUrl;

  constructor(private http: HttpClient) { }

  // Port Master
  getAllPorts() {
    return this.http.get(`${this.baseUrl}/api/v1/getAll_port`);
  }

  getPortById(id: string) {
    return this.http.get(`${this.baseUrl}/api/v1/get_port_by_id/${id}`);
  }

  createPort(port: any) {
    return this.http.post(`${this.baseUrl}/api/v1/create_port`, port);
  }

  updatePort(id: string, port: any) {
    return this.http.put(`${this.baseUrl}/api/v1/update_port/${id}`, port);
  }

  deletePort(id: string) {
    return this.http.delete(`${this.baseUrl}/api/v1/delete_port/${id}`);
  }

  // INCOTERM Master
  getAllIncoterms() {
    return this.http.get(`${this.baseUrl}/api/v1/getAll_incoterm`);
  }

  getIncotermById(id: string) {
    return this.http.get(`${this.baseUrl}/api/v1/get_incoterm_by_id/${id}`);
  }

  createIncoterm(port: any) {
    return this.http.post(`${this.baseUrl}/api/v1/create_incoterm`, port);
  }

  updateIncoterm(id: string, port: any) {
    return this.http.put(`${this.baseUrl}/api/v1/update_incoterm/${id}`, port);
  }

  deleteIncoterm(id: string) {
    return this.http.delete(`${this.baseUrl}/api/v1/delete_incoterm/${id}`);
  }
}
