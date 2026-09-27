import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ThirdPartyService {
  baseUrl = environment.servralUrl;
  constructor(private http: HttpClient) { }

  createOrgTypeMaster(payload: any) {
    return this.http.post(
      `${this.baseUrl}/api/v1/third-party/createOrgTypeMaster`,
      payload
    );
  }

  updateOrgTypeMaster(id: number, payload: any) {
    return this.http.put(
      `${this.baseUrl}/api/v1/third-party/updateOrgTypeMaster/${id}`,
      payload
    );
  }

  getAllOrgTypeMasters() {
    return this.http.get(
      `${this.baseUrl}/api/v1/third-party/getAllOrgTypeMasters`
    );
  }

  deleteOrgTypeMasterById(id: number) {
    return this.http.delete(
      `${this.baseUrl}/api/v1/third-party/deleteOrgTypeMasterById/${id}`
    );
  }

  createOrgSetup(payload: any) {
    return this.http.post(
      `${this.baseUrl}/api/v1/third-party/createOrgSetup`,
      payload
    );
  }

  getAllOrgSetups() {
    return this.http.get(`${this.baseUrl}/api/v1/third-party/getAllOrgSetups`);
  }

  deleteOrgSetupById(id: number) {
    return this.http.delete(
      `${this.baseUrl}/api/v1/third-party/deleteOrgSetupById/${id}`
    );
  }

  getAllOrgUsers(orgId: number) {
    return this.http.get(
      `${this.baseUrl}/api/v1/third-party/getAllOrgUsers/${orgId}`
    );
  }

  getOrgPrimaryUser(orgId: number) {
    return this.http.get(
      `${this.baseUrl}/api/v1/third-party/getOrgPrimaryUser/${orgId}`
    );
  }

  updateOrgSetup(id: number, payload: any) {
    return this.http.put(
      `${this.baseUrl}/api/v1/third-party/updateOrgSetup/${id}`,
      payload
    );
  }

  createOrgUser(payload: any) {
    return this.http.post(
      `${this.baseUrl}/api/v1/third-party/createOrgUser`,
      payload
    );
  }

  updateOrgUser(id: number, payload: any) {
    return this.http.put(
      `${this.baseUrl}/api/v1/third-party/updateOrgUser/${id}`,
      payload
    );
  }

  deleteOrgUser(id: number) {
    return this.http.delete(
      `${this.baseUrl}/api/v1/third-party/deleteOrgUser/${id}`
    );
  }
}
