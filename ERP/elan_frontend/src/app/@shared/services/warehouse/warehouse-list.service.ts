
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class warehouseListService {
  databaseKey;
  constructor(private http: HttpClient) {
    this.databaseKey = environment.servralUrl;
  }

  getAllPlants() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/plant_getAll`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }


  getAllRolesByName(query: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAllRoleMaster/${query}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getAllEmployeesByRole(query: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/get_all_employeeBy_User_role/${query}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  createWarehouse(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createWarehouse`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  createBlock(body: any) {
    console.log("BODY ",body);

      return this.http.post<any>(`${this.databaseKey}/api/v1/createBlock`, body).pipe(
        map((response: any) => {
          return response;
        })
      );
  }


  saveBlock(body: any) {
    return this.http.post(`${this.databaseKey}/api/v1/saveBlock`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }



  getAllWarehouse(employee_id:any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getWarehouseList/${employee_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  editWarehouse(body: any) {
    return this.http.put<any>(`${this.databaseKey}/api/v1/editWarehouse`,body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getWarehouseById(query:any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getWarehouseById/${query}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateWarehouseStatus(query:any,body:any) {
    return this.http.put<any>(`${this.databaseKey}/api/v1/warehouseStatus/${query}`,body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  deleteWarehouse(query:any){
    return this.http.delete<any>(`${this.databaseKey}/api/v1/deleteWarehouse/${query}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  
  getAllGateInwardOutwardList(type:any,activeLabel:any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getGateInwardOutwardList/?type=${type}&activeLabel=${activeLabel}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateGateInwardOutward(body:any) {
    return this.http.put<any>(`${this.databaseKey}/api/v1/updateGateInwardOutward`,body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getPickList(type:any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getPickList/?type=${type}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  
  updatePickData(body:any) {
    return this.http.put<any>(`${this.databaseKey}/api/v1/updatePickData`,body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getLRList(type:any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getLRList/?type=${type}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateLRData(vpId: string, data: any) {
    return this.http.put<any>(`${this.databaseKey}/api/v1/updateLRData/${vpId}`, data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  
  getInvoiceList() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getInvoiceList`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  genratePdfinvoice(data: any) {
    return this.http.post<any>(
      `${this.databaseKey}/api/v1/genratePdfinvoice`,
      data
    );
  }
  getEinvoiceList() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getEinvoiceList`).pipe(
      map((response: any) => {
        return response;
      })
    );
  } 
  genratePdfEwayinvoice(data: any) {
    return this.http.post<any>(
      `${this.databaseKey}/api/v1/genratePdfEwayinvoice`,
      data
    );
  }

  downloadDispatchPickList(id:number) {
    return this.http.get(`${this.databaseKey}/api/v1/downloadDispatchPickList/${id}`, {
      responseType: 'blob'
    });
  }
  downloadGateOutWard(id:any,type:any) {
    return this.http.get(`${this.databaseKey}/api/v1/downloadGateOutWordPdf/${id}?pdfName=${type}`, {
      responseType: 'blob'
    });
  }

}
