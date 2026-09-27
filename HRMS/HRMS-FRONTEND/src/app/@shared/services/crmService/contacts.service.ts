import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.serverUrl;

const routes = {
  contact: {
    getContacts: () => `${databaseKey}/api/v1/contact_list`,
    getContactPerson: () => `${databaseKey}/api/v1/getSeperateContactList`,
    getContactsForType: () => `${databaseKey}/api/v1/get_contact_list_for_quot`,
    addContactPerson: () => `${databaseKey}/api/v1/createSeperateContact`,
    addContact:() => `${databaseKey}/api/v1/create_contacts`,
    addAgencyContact:() => `${databaseKey}/api/v1/create_agency_contacts`,   
    getContactsById: (id:any) => `${databaseKey}/api/v1/contact_details?id=${id}`, 
    editCustomerContact:(id:any) => `${databaseKey}/api/v1/update_contact?id=${id}`,
    deleteContact:(id: any) => `${databaseKey}/api/v1/deleteContactById/${id}`,
    importContact:() => `${databaseKey}/api/v1/upload_csv_file`,
    importLead:() => `${databaseKey}/api/v1/upload_csv_file_lead`,
    // importContactB2B:() => `${databaseKey}/api/v1/upload_csv_B2B`,
    downloadSample:(file:string)=> `${databaseKey}/api/v1/download-excel?file=${file}`,
    downloadSampleLead:(file:string)=> `${databaseKey}/api/v1/download-excel-lead?file=${file}`,
    // downloadSampleB2C:()=> `${databaseKey}/api/v1/download-excelB2C`
  }
}

@Injectable({
  providedIn: 'root'
})

export class ContactsService {

  constructor(private http: HttpClient) { }

  getlist() {
    return this.http.get(routes.contact.getContacts(),
    );
  }
  getContactPersonList() {
    return this.http.get(routes.contact.getContactPerson(),
    );
  }
  getContactlistForType(type: any) {
    return this.http.post(routes.contact.getContactsForType(),type
    );
  }
  contactPersonAdd(data: any) {
    return this.http.post(routes.contact.addContactPerson(),data
    );
  }
  addContact(data:any){
    data['valid_until'] = moment(data['valid_until']).format('YYYY-MM-DD');
    return this.http.post(routes.contact.addContact(),data)
  }
  editContact(id: any, data:any){
    data['valid_until'] = moment(data['valid_until']).format('YYYY-MM-DD')
    return this.http.put(routes.contact.editCustomerContact(id),data)
  }
  getListById(id:any) {
    return this.http.get(routes.contact.getContactsById(id));
  }

  addAgency(data: any): Observable<any> {
    return this.http.post(routes.contact.addAgencyContact(), data);
  }
  deleteContactByID(id:any): Observable<any> {
    return this.http.delete(routes.contact.deleteContact(id));  // Corrected here
  }

  // deleteContactByID(contactId: string): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/${contactId}`);
  // }

  importContact(file: File, type: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name); // Append file to FormData
    formData.append('type', type);
    return this.http.post(routes.contact.importContact(), formData, {
      observe: 'response',
      responseType: 'blob'  // key part!
    }); // Send FormData in the request
  }

  importLead(file: File, type: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name); // Append file to FormData
    formData.append('type', type);
    return this.http.post(routes.contact.importLead(), formData, {
      observe: 'response',
      responseType: 'blob'  // key part!
    }); // Send FormData in the request
  }

  // importContactB2B(file: File, type:any): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('file', file, file.name); // Append file to FormData
  //   formData.append('type', type);
  //   return this.http.post(routes.contact.importContactB2B(), formData); // Send FormData in the request
  // }
  // downloadExcel(file: string): Observable<Blob> {
  //   const url = `/api/v1/download-excel?file=${file}`;
  //   return this.http.get<Blob>(url, {
  //     responseType: 'blob' as 'json',
  //   });
  // }
  
  downloadExcel(file:string) {
    
    return this.http.get(routes.contact.downloadSample(file),{
      responseType: 'blob'
    },
    );
  }
  downloadExcelLead(file:string) {
    
    return this.http.get(routes.contact.downloadSampleLead(file),{
      responseType: 'blob'
    },
    );
  }
  
}
