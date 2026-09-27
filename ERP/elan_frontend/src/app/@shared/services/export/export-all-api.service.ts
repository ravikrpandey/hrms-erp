import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import {Subject} from 'rxjs'
const databaseKey: any = environment.servralUrl;
const routes = {
  ExportData: {
    list: () => `${databaseKey}/api/v1/getAllleadmanagmentDatesManaged`,
    getStatus: () => `${databaseKey}/api/v1/getalluniqueleadstatus`,
    getDatabasedOnStatus:()=>`${databaseKey}/api/v1/exportallDatafromleadonbehalfstatusdate`,
  }
}

@Injectable({
  providedIn: 'root'
})
export class ExportAllApiService {


  
  public formFolder:any=new Subject<any>();
   
  setFolderFormData(data:any){
    this.formFolder.next(data)
  }
  getFolderFormData(){
  return this.formFolder;
  }
  
 
   constructor(private http: HttpClient) { }
  

  getList():Observable<any>{
    return this.http.get<any>(routes.ExportData.list());
  }

  getStatusList():Observable<any>{
    return this.http.get<any>(routes.ExportData.getStatus());
  }
  
  getDatabasedOnStatusAndDate(data:any):Observable<any>{
    return this.http.post<any>(routes.ExportData.getDatabasedOnStatus(),data);
  }
  }