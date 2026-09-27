import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.servralUrl;

const routes = {
  qualityCheck:{
    getQualityCheckData:(id:any)=>`${databaseKey}/api/v1/getRepeatByIDquality/${id}`,
    updateQualityCheck:(id:any)=>`${databaseKey}/api/v1/updateQuality/${id}`,
    getQualityChartData:(id:any)=>`${databaseKey}/api/v1/getRepeatByIDquality/${id}`
  },
  createCode:{
    createCode:()=>`${databaseKey}/api/v1/getSerialNumber`
    },
    getAllShift:{
      getShiftData:(id:any)=>`${databaseKey}/api/v1/getAllshiftID/${id}`
    },
    getAllGraphData:{
      getGraphData:(id:any)=>`${databaseKey}/api/v1/graphDataByRepeatId/${id}`,
      
    },
    qualityControl:{
      getQualityParameter:()=>`${databaseKey}/api/v1/getQualityParameter`,
      createQualityControl:()=>`${databaseKey}/api/v1/createQualityControl`,
      getQualityControlById:(id:any)=>`${databaseKey}/api/v1/qualityControlList/${id}`,
    }

}


@Injectable({
  providedIn: 'root'
})
export class QualityManagementService {


  constructor(private _http:HttpClient) { }


 getQualityCheckById(id:any){
  return this._http.get(routes.qualityCheck.getQualityCheckData(id))
 }
 updateQualityCheck(id:any,data:any){
  return this._http.put(routes.qualityCheck.updateQualityCheck(id),data)
 }
  

 getQualityChartData(id:any){
  return this._http.get(routes.qualityCheck.getQualityChartData(id))
 }
 createCode(){
  return this._http.get(routes.createCode.createCode())
 }
 getShiftById(id:any){
  return this._http.get(routes.getAllShift.getShiftData(id))
 }
 getGraphDataById(id:any){
  return this._http.get(routes.getAllGraphData.getGraphData(id))
 }


 getgraphDataById(id:any,data:any){
  return this._http.put(routes.qualityCheck.updateQualityCheck(id),data)
 }

//  qualitycontrol start here


 getQualityParameter(data:any){
  return this._http.post(routes.qualityControl.getQualityParameter(),data)
 }


 createQualityControl(data:any){
  return this._http.post(routes.qualityControl.createQualityControl(),data)
 }


 getQualityControlById(id:any,data:any){
  return this._http.post(routes.qualityControl.getQualityControlById(id),data)
 }



}
