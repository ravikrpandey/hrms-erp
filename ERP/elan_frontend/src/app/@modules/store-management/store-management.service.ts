import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { data } from 'jquery';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.servralUrl;

const routes = {
  inventoryManagement: {
    getTargetStockList: (entity_id:any,finance_id:any)=> `${databaseKey}/api/v1/get_target_store_list/${entity_id}/${finance_id}`,
    getAssignedStoreList: (entity_id:any,finance_id:any,employee_id:any,role:any)=> `${databaseKey}/api/v1/get_assigned_store_list/${entity_id}/${finance_id}/${employee_id}/${role}`,
    getAllStockList: (entity_id:any,id:any,employee_id:any,role:any)=> `${databaseKey}/api/v1/get_all_store_list/${entity_id}/${id}?employee_id=${employee_id}&role=${role}`,
    storeMasterList: (entity_id:any)=> `${databaseKey}/api/v1/store_masterList/${entity_id}`,
    createStock: (entity_id:any)=> `${databaseKey}/api/v1/create_store/${entity_id}`,
    getItemMasterList: () => `${databaseKey}/api/v1/getAllItem`,
    createGoodsInventory: (entity_id:any)=> `${databaseKey}/api/v1/create_store_goodsInventory/${entity_id}`,
    getAllGoodsInventory: (entity_id:any,employee_id:any,role:any)=> `${databaseKey}/api/v1/get_goodsInventory_list/${entity_id}/${employee_id}?role=${role}`,
    generateBatchNumber: ()=> `${databaseKey}/api/v1/generate_grn_number`,
    generateWareHouseCode: ()=> `${databaseKey}/api/v1/get_store_code`,
    getStockDashoard: (entity_id:any,employee_id:any,role:any)=> `${databaseKey}/api/v1/get_stock_dashboard/${entity_id}/${employee_id}?role=${role}`,
    GrnByItem: (store_id:any,item_id:any,goodInventoryStatus:any)=> `${databaseKey}/api/v1/get_inventoryItem_bygrnid/${store_id}?item_id=${item_id}&goodInventoryStatus=${goodInventoryStatus}`,
    updateStoreStatus: (entity_id:any)=> `${databaseKey}/api/v1/update-store-status/${entity_id}`,
    getWarehouseById:(warehouseId:any)=> `${databaseKey}/api/v1/get_storeById/${warehouseId}`,
    editWarehouse:(entity_id:any,warehouseId:any)=>`${databaseKey}/api/v1/update_storeById/${entity_id}/${warehouseId}`,
    getItemByCategory: (entity_id:any)=> `${databaseKey}/api/v1/getItem_byCategory/${entity_id}`,
    getAllStockTransfer: (entity_id:any,employee_id:any,role:any)=> `${databaseKey}/api/v1/getstore_stockTransfer_List?entity_id=${entity_id}&employee_id=${employee_id}&role=${role}`,
    createStockTransfer: (entity_id:any)=> `${databaseKey}/api/v1/create_store_stockTransfer/${entity_id}`,
    generateRandomStockId: ()=> `${databaseKey}/api/v1/random_store_stockId`,
    getAllStockTransferById:(id:any)=> `${databaseKey}/api/v1/get_store_stockTransfer_byId/${id}`,
    getAllReceiveStockTransferById:(id:any)=> `${databaseKey}/api/v1/get_received_store_stockTransfer_byId/${id}`,
    createReceivedStockTransfer: (entity_id:any)=> `${databaseKey}/api/v1/create_received_stockTransfer/${entity_id}`,
    createReceivedStoreStockTransfer: (entity_id:any)=> `${databaseKey}/api/v1/create_rec_store_stockTransfer/${entity_id}`,
    getAllReceiveTransfer: (entity_id:any,employee_id:any,role:any)=> `${databaseKey}/api/v1/getAllRecieveStockTransfer?entity_id=${entity_id}&employee_id=${employee_id}&role=${role}`,
    getAllStoreTransferList: (entity_id:any,employee_id:any,role:any,status:any)=> `${databaseKey}/api/v1/getAll_Store_transferList/${entity_id}/${status}?employee_id=${employee_id}&role=${role}`,
    stockTransferApprover: (store_id:any,stock_transfer_id:any)=> `${databaseKey}/api/v1/stockTransferApprover/${store_id}/${stock_transfer_id}`,
  },
}
@Injectable({
  providedIn: 'root'
})
export class StoreManagementService {
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();
  updateData(newData: any) {
    this.dataSubject.next(newData);
  }
  constructor(private httpclient: HttpClient) { 

  }
  
stringSubject = new BehaviorSubject(null);
   passValue(data:any) {
    console.log(data,'data idddd');
    //passing the data as the next observable
    this.stringSubject.next(data);
    console.log(this.stringSubject,'this.stringSubject');
  }

  getEmpTitle(){
    return this.stringSubject;
  }
  
  // inventory-managment start
  getAllStockList(entity_id:any,id:any,employee_id:any,role:any){
    return this.httpclient.get(routes.inventoryManagement.getAllStockList(entity_id,id,employee_id,role))
  }

  storeMasterList(entity_id:any){
    return this.httpclient.get(routes.inventoryManagement.storeMasterList(entity_id))
  }

  getTargetStockList(entity_id:any,finance_id:any,itemId:any){
    return this.httpclient.post(routes.inventoryManagement.getTargetStockList(entity_id,finance_id),itemId)
  }

  getAssignedStoreList(entity_id:any,finance_id:any,employee_id:any,role:any){
    return this.httpclient.get(routes.inventoryManagement.getAssignedStoreList(entity_id,finance_id,employee_id,role))
  }

  createStock(data: any,entity_id:any){
    return this.httpclient.post(routes.inventoryManagement.createStock(entity_id), data)
  }
  
  getItemMasterList(){
    return this.httpclient.get(routes.inventoryManagement.getItemMasterList())
  }

  createGoodsInventory(data: any,entity_id:any){
    return this.httpclient.post(routes.inventoryManagement.createGoodsInventory(entity_id), data)
  }
  
  getAllGoodsInventory(entity_id:any,employee_id:any,role:any){
    return this.httpclient.get(routes.inventoryManagement.getAllGoodsInventory(entity_id,employee_id,role))
  }

  generateBatchNumber(){
    return this.httpclient.get(routes.inventoryManagement.generateBatchNumber())
  }

  generateWareHouseCode(){
    return this.httpclient.get(routes.inventoryManagement.generateWareHouseCode())
  }
  // dashboard
  getStockDashoard(entity_id:any,employee_id:any,role:any){
    return this.httpclient.get(routes.inventoryManagement.getStockDashoard(entity_id,employee_id,role))
  }

  GrnByItem(store_id:any,item_id:any,goodInventoryStatus:any){
    return this.httpclient.get(routes.inventoryManagement.GrnByItem(store_id,item_id,goodInventoryStatus))
  }
  updateStoreStatus(entity_id:any,data:any){
    return this.httpclient.put(routes.inventoryManagement.updateStoreStatus(entity_id),data)

  }
  getWarehouseById(warehouseId:any){
    return this.httpclient.get(routes.inventoryManagement.getWarehouseById(warehouseId))
  }
  editWarehouse(data:any,entity_id:any,warehouseId:any){
    return this.httpclient.put(routes.inventoryManagement.editWarehouse(entity_id,warehouseId),data)
  }

  getItemByCategory(entity_id:any){
    return this.httpclient.get(routes.inventoryManagement.getItemByCategory(entity_id))
  }

  getAllStockTransfer(entity_id:any,employee_id:any,role:any){
    return this.httpclient.get(routes.inventoryManagement.getAllStockTransfer(entity_id,employee_id,role))
  }
  
  createStockTransfer(data: any,entity_id:any){
    return this.httpclient.post(routes.inventoryManagement.createStockTransfer(entity_id), data)
  }
  generateRandomStockId(){
    return this.httpclient.get(routes.inventoryManagement.generateRandomStockId())
  }
  getAllStockTransferById(id:any){
    return this.httpclient.get(routes.inventoryManagement.getAllStockTransferById(id))
  } 
  getAllReceiveStockTransferById(id:any){
    return this.httpclient.get(routes.inventoryManagement.getAllReceiveStockTransferById(id))
  } 
  
  createReceivedStockTransfer(data: any,entity_id:any){
    return this.httpclient.post(routes.inventoryManagement.createReceivedStockTransfer(entity_id), data)
  }
  
  createReceivedStoreStockTransfer(data: any,entity_id:any){
    return this.httpclient.post(routes.inventoryManagement.createReceivedStoreStockTransfer(entity_id), data)
  }

  getAllReceiveTransfer(entity_id:any,employee_id:any,role:any){
    return this.httpclient.get(routes.inventoryManagement.getAllReceiveTransfer(entity_id,employee_id,role))
  }

  getAllStoreTransferList(entity_id:any,employee_id:any,role:any,status:any){
    return this.httpclient.get(routes.inventoryManagement.getAllStoreTransferList(entity_id,employee_id,role,status))
  }

  stockTransferApprover(store_id:any,stock_transfer_id:any){
    return this.httpclient.get(routes.inventoryManagement.stockTransferApprover(store_id,stock_transfer_id))
  }

  stockActionRequest(stockReq:any) {
    return this.httpclient.put<any>(`${databaseKey}/api/v1/storeStockRequest`,stockReq).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
