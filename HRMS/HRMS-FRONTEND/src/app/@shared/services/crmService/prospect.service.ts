import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

const databaseKey: any = environment.serverUrl;
const routes = {
  prospect: {
    
    addProspect:() => `${databaseKey}/api/v1/create_prospect`,
    get_all_prospects:() => `${databaseKey}/api/v1/get_all_prospects`,
    all_Destination:() => `${databaseKey}/api/v1/get_all_Destination`,
    deleteProspect:(id: any) => `${databaseKey}/api/v1/delete_prospect/${id}`,
    detailProspect:(id: any) =>`${databaseKey}/api/v1/get_prospect_by_id/${id}`,
    itineraryProspect:(id: any) =>`${databaseKey}/api/v1/getQuotationsByProspectID/${id}`,
    update_data:(id: any) =>`${databaseKey}/api/v1/update_prospect/${id}`,
    update_operational_data:(id: any) =>`${databaseKey}/api/v1/update_prospect_operational/${id}`,
   
   }
} 
@Injectable({
  providedIn: 'root'
})
export class ProspectService {

  constructor( private http: HttpClient) { }

  // addContact(data:any){
   
  //   return this.http.post(routes.prospect.addProspect(),data)
  // }

  addContact(data: any) {
    // Create a new FormData instance
    const formData = new FormData();
  
    // Append fields from the `data` object to FormData
    Object.keys(data).forEach(key => {
      // Check if the key is a file field (like uploadImage)
      if (Array.isArray(data[key])) {
        // Append each element in the array as a separate field with the same key
        data[key].forEach((item: any) => {
          formData.append(key, item); // Append each item in the array
        });
      }
      else if (data[key] instanceof FileList && data[key].length > 0) {
        formData.append(key, data[key][0]); // Append the file itself
      } else {
        formData.append(key, data[key]); // Append text fields
      }
    });
  
    // Send the FormData as the HTTP request body
    return this.http.post(routes.prospect.addProspect(), formData);
  }
  

  getAllDestination(){
    return this.http.get(routes.prospect.all_Destination())
  }
  deleteProspectID(id: any) {
    return this.http.delete(routes.prospect.deleteProspect(id));
  }
  detailProspectID(id: any) {
    return this.http.get(routes.prospect.detailProspect(id));
  }
  itineraryProspectID(id: any) {
    return this.http.get(routes.prospect.itineraryProspect(id));
  }
  getallaccommodation() {
    return this.http.get<any>(`${databaseKey}/api/v1/getallaccommodation`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getallTransportation() {
    return this.http.get<any>(`${databaseKey}/api/v1/getallTransportation`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getallgetallAssistance() {
    return this.http.get<any>(`${databaseKey}/api/v1/getallgetallAssistance`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  get_all_prospects() {
    return this.http.get<any>(`${databaseKey}/api/v1/get_all_prospects`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  searchContacts(data: any, type:any ) {
    return this.http.get<any>(`${databaseKey}/api/v1/searchContacts?name=${data}&Bussiness_type=${type}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  // updateProspect(id:any,data:any){
  //   const formData = new FormData();
  
  //   // Append fields from the `data` object to FormData
  //   Object.keys(data).forEach(key => {
  //     // Check if the key is a file field (like uploadImage)
  //     if (data[key] instanceof FileList && data[key].length > 0) {
  //       formData.append(key, data[key][0]); // Append the file itself
  //     } else {
  //       formData.append(key, data[key]); // Append text fields
  //     }
  //   });
  //   return this.http.put<any>(routes.prospect.update_data(id),formData).pipe(
  //     map((response: any) => {
  //       return response;
  //     })
  //   );
  // }


  updateProspect(id:any,data:any){
    const formData = new FormData();
  
    // Append fields from the `data` object to FormData
    Object.keys(data).forEach(key => {
      // Check if the key is a file field (like uploadImage)
      if (Array.isArray(data[key])) {
        // Append each element in the array as a separate field with the same key
        data[key].forEach((item: any) => {
          formData.append(key, item); // Append each item in the array
        });
      }
      else if (data[key] instanceof FileList && data[key].length > 0) {
        formData.append(key, data[key][0]); // Append the file itself
      } else {
        formData.append(key, data[key]); // Append text fields
      }
    });
  
    return this.http.put<any>(routes.prospect.update_data(id),formData).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  updateProspectOperational(id:any,data:any){
    const formData = new FormData();
  
    // Append fields from the `data` object to FormData
    Object.keys(data).forEach(key => {
      // Check if the key is a file field (like uploadImage)
      if (Array.isArray(data[key])) {
        // Append each element in the array as a separate field with the same key
        data[key].forEach((item: any) => {
          formData.append(key, item); // Append each item in the array
        });
      }
      else if (data[key] instanceof FileList && data[key].length > 0) {
        formData.append(key, data[key][0]); // Append the file itself
      } else {
        formData.append(key, data[key]); // Append text fields
      }
    });
  
    return this.http.put<any>(routes.prospect.update_operational_data(id),formData).pipe(
      map((response: any) => {
        return response;
      })
    );
  }


  getAllproduct(data:any) {
    return this.http.post<any>(`${databaseKey}/api/v1/getalldatawithstatus`,data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getAllOperational(data:any) {
    return this.http.post<any>(`${databaseKey}/api/v1/getProspectsByStatusOperational`,data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }


}
