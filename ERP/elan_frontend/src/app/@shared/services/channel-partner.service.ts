import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.servralUrl;
const routes = {
  cp_list: {
    create_CP: () => `${databaseKey}/api/v1/create_Channel_Partner`,
    update_CP: (id:any) => `${databaseKey}/api/v1/update_Channel_PartnersId/${id}`,
    create_CP_documents: (id: any) => `${databaseKey}/api/v1/Document_ChannelPartner/${id}`,
    verify_cp: (id: any) => `${databaseKey}/api/v1/verify/${id}`,
    delete_cp: (id: any) => `${databaseKey}/api/v1/Delete_Channel_PartnersId/${id}`,
    update_CP_documents: (id: any) => `${databaseKey}/api/v1/Update_Document_ChannelPartnerId/${id}`,
    create_outher_document: (id: any) => `${databaseKey}/api/v1/Others_Document_ChannelPartner/${id}`,
    update_outher_document: (id: any) => `${databaseKey}/api/v1/Update_Other_Document_ChannelPartner/${id}`,
    get_Other_Documents: (id: any) => `${databaseKey}/api/v1/Read_Other_DocumentsId/${id}`,
    Delete_Others_Docs: (id: any) => `${databaseKey}/api/v1/Delete_Others_Docs/${id}`,
    getAll_CP: (id:any) => `${databaseKey}/api/v1/Read_Channel_Partners/${id}`,
    getAll_CP_HR: () => `${databaseKey}/api/v1/read_Channel_Partner_ByIdApproved`,
    getSingle_CP: (id:any) => `${databaseKey}/api/v1/Read_Channel_PartnersId/${id}`,
    getDocuments_CP: (id:any) => `${databaseKey}/api/v1/Read_Document_ChannelPartnerId/${id}`,
    Get_All_States_CP: () => `${databaseKey}/api/v1/Get_All_States_CP`,
    get_All_SP_Employee_List: () => `${databaseKey}/api/v1/get_All_SP_Employee_List`,
    get_All_CP_Registration_Approver_List: () => `${databaseKey}/api/v1/get_All_CP_Registration_Approver_List`,
  },
  dropdowns: {
    approverList: () => `${databaseKey}/api/v1/get_NAME_EmpID`,
  },

  provision_details:{
    provision_details: (id:any) => `${databaseKey}/api/v1/get_All_Provision_Details_List/${id}`,
    Create_Provision: (id:any) => `${databaseKey}/api/v1/create_Provision/${id}`,
    getSingle_provisionDetails: (id:any) => `${databaseKey}/api/v1/get_Single_Provision_Details/${id}`,
    get_Last_Created_Provision: (id:any) => `${databaseKey}/api/v1/get_Last_Created_Provision_On_Provision_Details/${id}`,
    CreatedCP_Provision_Details_List: (id:any) => `${databaseKey}/api/v1/get_All_Created_Provision_List/${id}`,
    CreatedCP_Provision_Details_single: (id:any) => `${databaseKey}/api/v1/get_ById_Created_Provision_List/${id}`,
    sendTo_RBH_And_Verified_Provision_Details: (id:any) => `${databaseKey}/api/v1/send_To_RBH_And_Verified_Provision_Details/${id}`,
    get_All_RBH_Provision_List: (id:any) => `${databaseKey}/api/v1/get_All_RBH_Provision_List/${id}`,
    get_ById_RBH_Provision_List: (id:any) => `${databaseKey}/api/v1/get_ById_RBH_Provision_List/${id}`,
    provision_RBH_Approval: (id:any) => `${databaseKey}/api/v1/provision_RBH_Approval/${id}`,
    get_All_CP_Payment_List: () => `${databaseKey}/api/v1/get_All_CP_Payment_List`,
  }
}

@Injectable({
  providedIn: 'root'
})
export class ChannelPartnerService {

  constructor(private http: HttpClient) { }

  create_CP(data: any): Observable<any> {
    return this.http.post<any>(routes.cp_list.create_CP(), data);
  };

  update_CP(id:any, data: any): Observable<any> {
    return this.http.put<any>(routes.cp_list.update_CP(id), data);
  };

  verify_cp(id:any, data: any): Observable<any> {
    return this.http.patch<any>(routes.cp_list.verify_cp(id), data);
  };
  delete_cp(id:any, data: any): Observable<any> {
    return this.http.delete(routes.cp_list.delete_cp(id), data);
  };
  create_CP_documents(id: any, data: any, remarks: any): Observable<any> {
    const formData = new FormData();
    for (let doc of data) {
      let file: File = doc.file
      formData.append(doc.c_name, file, file.name);
    };
    formData.append('document_remark', remarks);

    return this.http.post<any>(routes.cp_list.create_CP_documents(id), formData);
  };

  update_CP_documents(id: any, data: any, remarks: any): Observable<any> {
    const formData = new FormData();
    for (let doc of data) {
      let file: File = doc.file
      formData.append(doc.c_name, file, file.name);
    };
    formData.append('document_remark', remarks);

    return this.http.patch<any>(routes.cp_list.update_CP_documents(id), formData);
  };

  create_outher_document(id: any, data: any): Observable<any> {
    const formData = new FormData();
    let file: File = data.other
    formData.append('other', file, file.name);
    formData.append('file_name', data.file_name);

    return this.http.post<any>(routes.cp_list.create_outher_document(id), formData);
  };

  update_outher_document(id: any, data: any): Observable<any> {
    const formData = new FormData();
    let file: File = data.other
    formData.append('other', file, file.name);
    formData.append('file_name', data.file_name);

    return this.http.patch<any>(routes.cp_list.update_outher_document(id), formData);
  };

  getAll_CP(id:any) {
    return this.http.get(routes.cp_list.getAll_CP(id));
  };

  getAll_CP_HR() {
    return this.http.get(routes.cp_list.getAll_CP_HR());
  };


  get_Other_Documents(id:any) {
    return this.http.get(routes.cp_list.get_Other_Documents(id));
  };

  Delete_Others_Docs(id:any) {
    return this.http.delete(routes.cp_list.Delete_Others_Docs(id));
  };

  getSingle_CP(id:any) {
    return this.http.get(routes.cp_list.getSingle_CP(id));
  };

  getDocuments_CP(id:any) {
    return this.http.get(routes.cp_list.getDocuments_CP(id));
  };

  Get_All_States_CP() {
    return this.http.get(routes.cp_list.Get_All_States_CP());
  };

  get_All_SP_Employee_List() {
    return this.http.get(routes.cp_list.get_All_SP_Employee_List());
  };

  get_All_CP_Registration_Approver_List() {
    return this.http.get(routes.cp_list.get_All_CP_Registration_Approver_List());
  };

  approverList() {
    return this.http.get(routes.dropdowns.approverList());
  };

  provision_details(id:any) {
    return this.http.get(routes.provision_details.provision_details(id));
  };

  getSingle_provisionDetails(id:any, data:any) {
    console.log(id);
    console.log(data);

    return this.http.post(routes.provision_details.getSingle_provisionDetails(data),id);
  };

  get_Last_Created_Provision(id:any) {
    return this.http.get(routes.provision_details.get_Last_Created_Provision(id));
  };

  Create_Provision(id:any, data:any) {
    return this.http.post(routes.provision_details.Create_Provision(id),data);
  };

  CreatedCP_Provision_Details_List(id:any) {
    return this.http.get(routes.provision_details.CreatedCP_Provision_Details_List(id));
  };

  single_createdCP_Provision_Details(id:any) {
    return this.http.get(routes.provision_details.CreatedCP_Provision_Details_single(id));
  };

  sendTo_RBH_And_Verified_Provision_Details(id:any,data:any) {
    return this.http.put(routes.provision_details.sendTo_RBH_And_Verified_Provision_Details(id),data);
  };

  get_All_RBH_Provision_List(id:any) {
    return this.http.get(routes.provision_details.get_All_RBH_Provision_List(id));
  };

  get_ById_RBH_Provision(id:any) {
    return this.http.get(routes.provision_details.get_ById_RBH_Provision_List(id));
  };
  provision_RBH_Approval(id:any,data:any) {
    return this.http.put<any>(routes.provision_details.provision_RBH_Approval(id),data);
  };

  get_All_CP_Payment_List() {
    return this.http.get<any>(routes.provision_details.get_All_CP_Payment_List());
  };
}
