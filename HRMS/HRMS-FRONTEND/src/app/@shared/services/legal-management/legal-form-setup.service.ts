import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey = environment.serverUrl;

const routes = {
  legalFormField:'/api/v1/legal-form-setup',
  legalFormValue: "/api/v1/legal-form-setup-field-value",
  legalForm:"/api/v1/Legalform"
}
@Injectable({
  providedIn: 'root'
})
export class LegalFormSetupService {

  constructor(private http:HttpClient) { }

  get employee_id(){
    return localStorage.getItem("EmpMainId");
   }

  getLegalFormSetup(params?:any) {
    return this.http.get<any>(`${databaseKey}/api/v1/legal-form-setup`, {params})
  }
  createLegalFormSetup(body: any) {
    return this.http.post<any>(`${databaseKey}/api/v1/legal-form-setup`, body)
  }
  updateLegalFormSetup(body: any) {
    return this.http.patch<any>(`${databaseKey}/api/v1/legal-form-setup`, body)
  }
  deleteFormSetupField(field_id:string){
    return this.http.delete<any>(`${databaseKey}/api/v1/legal-form-setup/${field_id}`)
  }


  // formfieldType
  getFormFieldType() {
    return this.http.get<any>(`${databaseKey}/api/v1/formfieldtype`)
  }
  addFormFieldType(body: any) {
    return this.http.post<any>(`${databaseKey}/api/v1/formfieldtype`, body)
  }
  updateFormFieldType(id: string, body: any) {
    return this.http.patch<any>(`${databaseKey}/api/v1/formfieldtype/${id}`, body)
  }
  deleteFormFieldType(field_id:string){
    return this.http.delete<any>(`${databaseKey}/api/v1/formfieldtype/${field_id}`)
  }

  // formfieldValue
  createFormFieldValue(body: any, query: any) {
    return this.http.post<any>(`${databaseKey}/api/v1/legal-form-setup-field-value?legal_form_id=${query}`, body)
  }
  getFormFieldValue(field_id: any) {
    return this.http.get<any>(`${databaseKey}/api/v1/legal-form-setup-field-value/${field_id}`)
  }

  getFieldType() {
    return this.http.get<any>(`${databaseKey}/api/v1/getFieldType`)
  }


  sendFormRequest(data: any) {
    const formData = new FormData();
    // Append each property to the FormData object
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
      })

      return this.http.post<any>(`${databaseKey}/api/v1/contract-requestform`, formData)
    }
    getLegalFormRequestDetails(form_req_id: string|number) {
      return this.http.get<any>(`${databaseKey}/api/v1/contract-requestform/${form_req_id}`)

    }
    updateFormRequest(form_req_id: string, body: any) {
      return this.http.put<any>(`${databaseKey}/api/v1/contract-requestform/${form_req_id}`, body)

    }
    deleteFormRequest(form_req_id: string) {
      return this.http.delete<any>(`${databaseKey}/api/v1/delete-contract-requestform/${form_req_id}`)
      // return this.http.delete<any>(`${databaseKey}/api/v1/Legalform/${form_req_id}`)
    }
    getLegalFormRequest(params?:any){
      // return this.http.get<any>(`${databaseKey}/api/v1/Legalformlist`, {params:params})
      return this.http.get<any>(`${databaseKey}/api/v1/contract-requestform`, {params:params})
    }

    uploadDoc(body: any) {
      return this.http.post<any>(`${databaseKey}/uploadDoc`, body)

    }
    getComplienceOfficer(){
      return this.http.get<any>(`${databaseKey}/api/v1/contracts-complience-officer`)
    }
    raiseDisputeOnLegalForm(reportId:string, body:any){
      return this.http.put<any>(`${databaseKey}/api/v1/update-legalform-status/${reportId}`, body)
    }

    updateStatusWithComment(reportId: string, data: any){
      const formData = new FormData();
      // Append each property to the FormData object
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      })

      return this.http.post<any>(`${databaseKey}/api/v1/update-request-status/${reportId}`, formData)
    }
    updateInternalStatusWithComment(reportId: string, data: any){
      const formData = new FormData();
      // Append each property to the FormData object
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      })
      return this.http.post<any>(`${databaseKey}/api/v1/update_request_internal/${reportId}`, formData)
    }


    createSignatureContract(payload: any, crmUrl: string) {
      const formData = new FormData();

      Object.keys(payload).forEach((key) => {
        if (key === "files" && payload[key] instanceof File) {
          // ✅ Append the file correctly
          formData.append(key, payload[key]);
        } else if (Array.isArray(payload[key])) {
          payload[key].forEach((item: any, index: number) => {
            formData.append(`${key}[${index}]`, JSON.stringify(item));
          });
        } else {
          formData.append(key, payload[key] instanceof Object ? JSON.stringify(payload[key]) : payload[key]);
        }
      });

      // ✅ Debugging: Log FormData contents correctly
      console.log("🔹 FormData Contents:");
      formData.forEach((value, key) => {
        console.log(key, value instanceof Blob ? "Blob Data (File)" : value);
      });

      // ✅ Send HTTP POST request
      return this.http.post<any>(`${databaseKey}/api/v1/createSignatureContract`, formData);
    }

    sendContractToEmployee(payload: any){
      return this.http.post<any>(`${databaseKey}/api/v1/sendContractToEmployee`, payload )
    }

    employeeContractSignature(payload: any, crmUrl: string) {
      const formData = new FormData();

      Object.keys(payload).forEach((key) => {
        if (key === "files" && payload[key] instanceof File) {
          // ✅ Append the file correctly
          formData.append(key, payload[key]);
        } else if (Array.isArray(payload[key])) {
          payload[key].forEach((item: any, index: number) => {
            formData.append(`${key}[${index}]`, JSON.stringify(item));
          });
        } else {
          formData.append(key, payload[key] instanceof Object ? JSON.stringify(payload[key]) : payload[key]);
        }
      });

      // ✅ Debugging: Log FormData contents correctly
      console.log("🔹 FormData Contents:");
      formData.forEach((value, key) => {
        console.log(key, value instanceof Blob ? "Blob Data (File)" : value);
      });

      // ✅ Send HTTP POST request
      return this.http.post<any>(`${databaseKey}/api/v1/employeeContractSignature`, formData);
    }


    getInternalUpdateComments(requestId: string|number){
      return this.http.get<any>(`${databaseKey}/api/v1/get_internal_document_comment/${requestId}`)
    }

    getUpdateComments(reportId: string|number){
      return this.http.get<any>(`${databaseKey}/api/v1/contract-requestform/${reportId}/legal-action-comments`)
    }
    // getUpdateComments(reportId: string|number){
    //   return this.http.get<any>(`${databaseKey}/api/v1/get-legal-action-comments/${reportId}`)
    // }

    getAllEmployees(){
      const u:any = localStorage.getItem('loginUserDetails');
      const user = u ? JSON.parse(u) : {};

      const params = {
        entity_id:1,
        role_master_name: user?.roles
      }
      return this.http.get<any>(`${databaseKey}/api/auth/registrationall`, {params})

    }

    private enquiryTypeSubject = new BehaviorSubject<string>('');  // To hold the enquiryType
    enquiryType$ = this.enquiryTypeSubject.asObservable();  // Observable to listen for changes



    // Method to transfer the selected enquiry type to the service
    tranferformselectiontype(enquiryType: string): void {
      this.enquiryTypeSubject.next(enquiryType);  // Update the enquiry type in the BehaviorSubject
    }

    // Method to get the current enquiry type
    getEnquiryType(): string {
      return this.enquiryTypeSubject.getValue();
    }

    saveDataInternal(data:any){
      const formData = new FormData();
      // Append each property to the FormData object
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      })
      return this.http.post<any>(`${databaseKey}/api/v1/internal_aggrement`, formData)
    }


    getDataInternal(){
      return this.http.get(`${databaseKey}/api/v1/internal_aggrement`)
    }
    getInternalDataForDepartmentOfficer(params?:any){
      return this.http.get(`${databaseKey}/api/v1/getInternalStatsOfDeptOfficer/${this.employee_id}`, {params})
    }
    getComplianceOfficerContractsInternal(params?:any){
      return this.http.get(`${databaseKey}/api/v1/getInternalCompliance/${this.employee_id}`, {params})
    }
    getDataInternalRequestDetails(id:any|null){
      return this.http.get(`${databaseKey}/api/v1/internal_agreement/${id}`)
    }

    DeleteInternal(id:any){
      return this.http.delete(`${databaseKey}/api/v1/internal_agreement/${id}`)
    }
    updateInternalFormRequest(id: string|number|null, body: any) {
      return this.http.put<any>(`${databaseKey}/api/v1/internal_agreement/${id}`, body)
    }
    raiseDisputeOnInternalLegalForm(reportId:string, body:any){
      return this.http.put<any>(`${databaseKey}/api/v1/internal_update_form_status/${reportId}`, body)
    }
  }
