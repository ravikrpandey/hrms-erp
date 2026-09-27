import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import moment from 'moment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.serverUrl;
// const databaseKey= 'http://192.168.20.157:7000';
const url = `${databaseKey}/api/v1/campaign/contacts/attributes`

@Injectable({
  providedIn: 'root'
})
export class CampaignContactAttributesService {
  constructor(private http: HttpClient) { }

  getAttributes(params?:any){
    return this.http.get( `${url}`, {params} )
  }
  getAttributesById(attr_Id:string){
    return this.http.get(`${url}/${attr_Id}`)
  }
  updateAttribute(attr_Id:string, body:any){
    return this.http.put( `${url}/${attr_Id}`, body )
  }
  deleteAttribute(attr_Id:string){
    return this.http.delete( `${url}/${attr_Id}` )
  }
  getAttributesByCategory(category:string, params?:any){
    return this.http.get( `${url}/${category}`, {params} )
  }
  getAttributesByAttributeName(category:string, attr_name:string, params?:any){
    return this.http.get( `${url}/${category}/${attr_name}`, {params} )
  }
  
}
