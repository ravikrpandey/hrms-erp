import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.serverUrl;



const routes = {
  CompanyMaster: {
    AddCompany: () => `${databaseKey}/api/v1/createCompanyMaster`,
   getAllCompany:()=>`${databaseKey}/api/v1/getAll_companyMaster`,
   deletecompanyData:(id:any)=>`${databaseKey}/api/v1/delete_companyMaster/${id}`,
   getByIdCompany:(id:any)=>`${databaseKey}/api/v1/getById_companyMaster/${id}`,
   updateById:(id:any)=>`${databaseKey}/api/v1/update_companyMaster/${id}`
  },

}


@Injectable({
  providedIn: 'root'
})
export class CompanyMasterService {

  constructor(private httpclient:HttpClient) { }


  addCompanyData(data:any): Observable<any> {
    return this.httpclient.post<any>(routes.CompanyMaster.AddCompany(),data);
  }
  getAllCompanyData(): Observable<any> {
    return this.httpclient.get<any>(routes.CompanyMaster.getAllCompany());
  }
  deleteCompanyData(id:any): Observable<any> {
    return this.httpclient.delete<any>(routes.CompanyMaster.deletecompanyData(id));
  }
  getByIDCompany(id:any): Observable<any> {
    return this.httpclient.get<any>(routes.CompanyMaster.getByIdCompany(id));
  }
  updateByIdCompany(id:any,data:any): Observable<any> {
    return this.httpclient.put<any>(routes.CompanyMaster.updateById(id),data);
  }


}
