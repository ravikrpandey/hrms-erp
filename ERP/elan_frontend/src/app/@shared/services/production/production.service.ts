import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey : any =environment.servralUrl

const routes = {
    bom:{
      bomcreate_bom: () =>
      `${databaseKey}/api/v1/createBom`,
     bomAll_List: (id:any,id1:any) =>
      `${databaseKey}/api/v1/getBomAll/${id}/${id1}`,
     getAllCetegory: (id:any) =>
      `${databaseKey}/api/v1/getAllActiveCategory/${id}`,
     getAllItemType: () =>
      `${databaseKey}/api/v1/getItemType`,
     getBomDetailsById: (id:any) =>
      `${databaseKey}/api/v1/getBomDetailById/${id}`,
     getAllActiveProduct: (id:any,id1:any) =>
      `${databaseKey}/api/v1/getAllActiveProduct/${id}/${id1}`,
     getSubCategory: (id:any) =>
      `${databaseKey}/api/v1/getSubCategory/${id}`,
     getItemsBySubCategory: (id:any,subCategory:any) =>
      `${databaseKey}/api/v1/getItemsBySubCategory/${id}/${subCategory}`,
     getItemListForCustomer: (id:any,category:any,customer_id:any) =>
      `${databaseKey}/api/v1/getItemListForCustomer?category_id=${category}&sub_category_id=${id}&customer_id=${customer_id}`,
     getCustomerItems: (customer_id:any) =>
      `${databaseKey}/api/v1/getCustomerItems?customer_id=${customer_id}`,
     getAllProductOncetegory: (categoryId:any,subcategoryId:any) =>
      `${databaseKey}/api/v1/getProductByCatAndSubcatId/${categoryId}/${subcategoryId}`,
      bomAll_ListByID: (id:any) =>
      `${databaseKey}/api/v1/getBomAll/${id}`,
     bomDelete: (id: any) =>
      `${databaseKey}/api/v1/bomDelete/${id}`,
     bom_update: (id: any) =>
      `${databaseKey}/api/v1/updateBom/${id}`,
     bomStatusChange: (id: any) =>
      `${databaseKey}/api/v1/bomStatus/${id}`,
      getItemById:(id:any)=> `${databaseKey}/api/v1/BOM_get_id/${id}`,
      getSfgDetailsByID:()=> `${databaseKey}/api/v1/getSfgDetail`,
      
  },
production:{
  create_production:()=>`${databaseKey}/api/v1/createProduction`,
  create_plant:()=>`${databaseKey}/api/v1/createPlant`,
  getAllProductionData:()=>`${databaseKey}/api/v1/getAllProductions`,
  deleteProduction:(id:any)=>`${databaseKey}/api/v1/productionsDelete/${id}`,
  changeStatus:(id:any)=>`${databaseKey}/api/v1/productionsStatus/${id}`,
  getProductionById:(id:any)=>`${databaseKey}/api/v1/getbyID/${id}`,
  getProductionScheduleData:()=>`${databaseKey}/api/v1/orderList`,
  updateProductionById:(id:any)=>`${databaseKey}/api/v1/updateProduction/${id}`,
  verifyProductionId:(id:any)=>`${databaseKey}/api/v1/productionsVerify/${id}`,
  getAllVerifyData:()=>`${databaseKey}/api/v1/getAllRepeat`,
  getAllStartProduction:()=>`${databaseKey}/api/v1/getAllStartProduction`,
  chnageScheduleStatus:(id:any)=>`${databaseKey}/api/v1/productionsStatus/${id}`,
  getScheduleProduction:(id:any,doItem_id:any)=>`${databaseKey}/api/v1/orderListById?id=${id}&doItem_id=${doItem_id}`,
  getAllsheduleProductionData:()=>`${databaseKey}/api/v1/listData`,
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
  viewScheduledProduction:(id:any)=>`${databaseKey}/api/v1/plantData/${id}`,
  postRaiseIndentData:()=>`${databaseKey}/api/v1/createprodRaiseIndent`
},
downloadPDf:{
  downloadPDf: (id:any,do_id:any,entity_id:any,urlData:any) => `${databaseKey}/api/v1/pdfSalesOrder?proposal_id=${id}&do_id=${do_id}&entity_id=${entity_id}&urlData=${urlData}`,
  viewPDfData: (name:any) => `${databaseKey}/api/v1/salesOrderDownload/${name}`,
   
},
downloadInvoicePDf:{
  
  downloadInvoicePDf: (id:any,do_id:any,entity_id:any,urlData:any) => `${databaseKey}/api/v1/pdfSalesInvoiceData?proposal_id=${id}&do_id=${do_id}&entity_id=${entity_id}&urlData=${urlData}`,   
  downloadEwayPDf: (invoice_id:any,entity_id:any,financial_year_id:any,urlData:any) => `${databaseKey}/api/v1/downloadEway?invoice_id=${invoice_id}&entity_id=${entity_id}&financial_year_id=${financial_year_id}&urlData=${urlData}`, 
  downloadDirectEway: (eway_id:any,entity_id:any,financial_year_id:any,urlData:any) => `${databaseKey}/api/v1/downloadDirectEway?eway_id=${eway_id}&entity_id=${entity_id}&financial_year_id=${financial_year_id}&urlData=${urlData}`, 
},

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

  getBomAllList(id:any,id1:any) {
    return this.http.get(routes.bom.bomAll_List(id,id1))
  }
  getBomAllListByID(id:any) {
    return this.http.get(routes.bom.bomAll_ListByID(id))
  }
  getAllCetegory(id:any) {
    return this.http.get(routes.bom.getAllCetegory(id))
  }
  getAllActiveProduct(id:any,id1:any) {
    return this.http.get(routes.bom.getAllActiveProduct(id,id1))
  }
  getSubCategory(id:any) {
    return this.http.get(routes.bom.getSubCategory(id))
  }
  getItemsBySubCategory(id:any,subCategory:any) {
    return this.http.get(routes.bom.getItemsBySubCategory(id,subCategory))
  }
  getItemListForCustomer(id:any,subCategory:any,customer_id:any) {
    return this.http.get(routes.bom.getItemListForCustomer(id,subCategory,customer_id))
  }
  getCustomerItems(customer_id:any) {
    return this.http.get(routes.bom.getCustomerItems(customer_id))
  }
  getAllProductOncetegory(categoryId  :any,subcategoryId:any) {
    return this.http.get(routes.bom.getAllProductOncetegory(categoryId,subcategoryId))
  }
  getAllItemType() {
    return this.http.get(routes.bom.getAllItemType())
  }

  createBomMaster(data: any) {
    return this.http.post(routes.bom.bomcreate_bom(), data)
  }
getBomDetailsById(id:any){
  return this.http.get(routes.bom.getBomDetailsById(id))
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
  getSfgDetailsByID(data: any) {
    return this.http.post(routes.bom.getSfgDetailsByID(),data)
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
getAllsheduleProductionDatalist(){
  return this.http.get(routes.production.getAllsheduleProductionData())
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
getProductionScheduleData(){
  return this.http.get(routes.production.getProductionScheduleData())
}
getforScheduleProduction(id:any,doItem_id:any) {
  return this.http.get(
    routes.production.getScheduleProduction(id, doItem_id),
     
  );
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
getAllStartProduction(data:any){
  return this.http.post(routes.production.getAllStartProduction(),data)
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
downloadPDf(id: any,do_id:any,entity_id:any,urlData:any) {
  return this.http.get(
    routes.downloadPDf.downloadPDf(id,do_id,entity_id,urlData),
     
  );
}
downloadInvoicePDf(id: any,do_id:any,entity_id:any,urlData:any) {
  
  return this.http.get(
    routes.downloadInvoicePDf.downloadInvoicePDf(id,do_id,entity_id,urlData),
     
  );
}



/////// view eway direct 
downloadEwayPDf(invoice_id:any,entity_id:any,financial_year_id:any,urlData:any) {
  return this.http.get(
    routes.downloadInvoicePDf.downloadEwayPDf(invoice_id,entity_id,financial_year_id,urlData),
  );
}

downloadDirectEwayPDf(eway_id:any,entity_id:any,financial_year_id:any,urlData:any) {
  return this.http.get(
    routes.downloadInvoicePDf.downloadDirectEway(eway_id,entity_id,financial_year_id,urlData),
  );
}
}
