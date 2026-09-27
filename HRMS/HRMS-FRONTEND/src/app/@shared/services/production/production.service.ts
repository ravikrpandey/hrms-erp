import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey : any =environment.serverUrl

const routes = {
    bom:{
      bomcreate_bom: () =>
      `${databaseKey}/api/v1/createBom`,
     bomAll_List: () =>
      `${databaseKey}/api/v1/getBomAll`,
      bomAll_ListByID: (id:any) =>
      `${databaseKey}/api/v1/getBomAll/${id}`,
     bomDelete: (id: any) =>
      `${databaseKey}/api/v1/bomDelete/${id}`,
     bom_update: (id: any) =>
      `${databaseKey}/api/v1/updateBom/${id}`,
     bomStatusChange: (id: any) =>
      `${databaseKey}/api/v1/bomStatus/${id}`,
      getItemById:(id:any)=> `${databaseKey}/api/v1/BOM_get_id/${id}`,
      
  },
production:{
  create_production:()=>`${databaseKey}/api/v1/createProduction`,
  create_plant:()=>`${databaseKey}/api/v1/createPlant`,
  getAllProductionData:()=>`${databaseKey}/api/v1/getAllProductions`,
  deleteProduction:(id:any)=>`${databaseKey}/api/v1/productionsDelete/${id}`,
  changeStatus:(id:any)=>`${databaseKey}/api/v1/productionsStatus/${id}`,
  getProductionById:(id:any)=>`${databaseKey}/api/v1/getbyID/${id}`,
  updateProductionById:(id:any)=>`${databaseKey}/api/v1/updateProduction/${id}`,
  verifyProductionId:(id:any)=>`${databaseKey}/api/v1/productionsVerify/${id}`,
  getAllVerifyData:()=>`${databaseKey}/api/v1/getAllRepeat`,
  chnageScheduleStatus:(id:any)=>`${databaseKey}/api/v1/productionsStatus/${id}`
},
productVariant:{
  productVariantById:(id:any)=>`${databaseKey}/api/v1/get_variants_by_product_id/${id}`
},

getTrackingById:{
  getTrackingById:(id:any)=>`${databaseKey}/api/v1/getRepeatById/${id}`,
  updateProductionWorkstation:(id:any)=>`${databaseKey}/api/v1/updateProductionWorkstation/${id}`,
  productionTrackingMaintenance:()=>`${databaseKey}/api/v1/schedprodformaintenance`
},

viewScheduledProduction:{
  viewScheduledProduction:(id:any)=>`${databaseKey}/api/v1/scheduleproductionbyId/${id}`,
  postRaiseIndentData:()=>`${databaseKey}/api/v1/createprodRaiseIndent`
}

}

@Injectable({
  providedIn: 'root'
})
export class ProductionService {

  messageSubject = new Subject<any>();
  private scrollSubject = new Subject<void>();

  accredionId(id: any) {
    this.messageSubject.next(id);
  }

  scrollToTop(): void {
    this.scrollSubject.next();
  }

  getScrollObservable() {
    return this.scrollSubject.asObservable();
  }

  showError(error: any) {
    throw new Error('Method not implemented.');
  }
  showSuccess(message: any) {
    throw new Error('Method not implemented.');
  }

  /** country master start  */
  constructor(private http: HttpClient) { }
  //

  getBomAllList() {
    return this.http.get(routes.bom.bomAll_List())
  }
  getBomAllListByID(id:any) {
    return this.http.get(routes.bom.bomAll_ListByID(id))
  }

  createBomMaster(data: any) {
    return this.http.post(routes.bom.bomcreate_bom(), data)
  }

  updateBomMaster(id: any, data: any) {
    return this.http.put(routes.bom.bom_update(id), data)
  }
 

  deleteBomMaster(id: any) {
    return this.http.delete(routes.bom.bomDelete(id))
  }

  changeStatusById(id: any, data: any) {
    return this.http.put(routes.bom.bomStatusChange(id), data)
  }
  
  getItemById(id: any) {
    return this.http.get(routes.bom.getItemById(id))
  }
  
// add-production 

appProductionData(data:any){
  return this.http.post(routes.production.create_production(),data)
}
createPlant(data:any){
  return this.http.post(routes.production.create_plant(),data)
}
getAllProductionData(){
  return this.http.get(routes.production.getAllProductionData())
}
deleteProduction(id:any){
  return this.http.delete(routes.production.deleteProduction(id))
}
changeProductionStatus(id:any,data:any){
  return this.http.put(routes.production.changeStatus(id),data)
}
getProductionById(id:any){
  return this.http.get(routes.production.getProductionById(id))
}
updateProductionById(id:any,data:any){
  return this.http.put(routes.production.updateProductionById(id),data)
}
verifyProduction(id:any,data:any){
  return this.http.put(routes.production.verifyProductionId(id),data)
}
getAllVerifyData( ){
  return this.http.get(routes.production.getAllVerifyData())
}
getAllVerifyScheduleData(data:any){
  return this.http.post(routes.production.getAllVerifyData(),data)
}
changeStatusScheduleById(id:any,data:any){
  return this.http.put(routes.production.chnageScheduleStatus(id),data)
}
getVariantById(id:any){
  return this.http.get(routes.productVariant.productVariantById(id))
}
getTrackingById(id:any){
  return this.http.get(routes.getTrackingById.getTrackingById(id))
}

updateProductionTrackingDetails(id:any,data:any){
  return this.http.put(routes.getTrackingById.updateProductionWorkstation(id),data)
}
viewScheduledProduction(id:any){
  return this.http.get(routes.viewScheduledProduction.viewScheduledProduction(id))
}

postRaiseIndentData(data:any){
  return this.http.post(routes.viewScheduledProduction.postRaiseIndentData(),data)
}


productionMaintenance(data:any){
  return this.http.post(routes.getTrackingById.productionTrackingMaintenance(),data)
}

}
