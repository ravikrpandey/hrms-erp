import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.serverUrl;
const routes = {
  exit_form: {
    createExitForm: () => `${databaseKey}/api/v1/create_exit-form`,
    getExitFormByEmpId: (employee_id: any) =>
      `${databaseKey}/api/v1/get-exit-form-by-emp-id/${employee_id}`,
    getExitFormById: (exit_form_id: any) =>
      `${databaseKey}/api/v1/get-exit-form-by-id/${exit_form_id}`,
    getAllExitFormToBeApproved: () =>
      `${databaseKey}/api/v1/get-all-exit-form-to-be-approved`,
    approveRejExitFormStatus: () =>
      `${databaseKey}/api/v1/approve-reject-exit-form-status`,
     getExitFormDetailsById: (exit_form_id: any) =>
      `${databaseKey}/api/v1/get-exit-form-details-by-id/${exit_form_id}`,
  },

   patient: {
   
    searchByPhoto: (entity_id: any) => 
      `${databaseKey}/api/v1/patient/search-by-photo/${entity_id}`, // entity_id URL mein
  }
};

@Injectable({
  providedIn: 'root',
})
export class ExitFormService {
  databaseKey: any = '';
  constructor(private http: HttpClient) {
    this.databaseKey = environment.serverUrl;
  }
  createExitForm(data: any): Observable<any> {
    return this.http.post(routes.exit_form.createExitForm(), data);
  }
  getExitFormByEmpId(employee_id: any) {
    return this.http.get(routes.exit_form.getExitFormByEmpId(employee_id));
  }
  getExitFormById(exit_form_id: any) {
    return this.http.get(routes.exit_form.getExitFormById(exit_form_id));
  }
  getAllExitFormToBeApproved() {
    return this.http.get(routes.exit_form.getAllExitFormToBeApproved());
  }
  approveRejExitFormStatus(data: any) {
    return this.http.put(routes.exit_form.approveRejExitFormStatus(), data);
  }
  getExitFormDetailsById(exit_form_id: any) {
    return this.http.get(routes.exit_form.getExitFormDetailsById(exit_form_id));
  }

    searchPatientByPhoto(photoFile: File, entity_id: any): Observable<any> {
    const formData = new FormData();
    formData.append('photo', photoFile);
    
    return this.http.post(routes.patient.searchByPhoto(entity_id), formData);
  }
}
