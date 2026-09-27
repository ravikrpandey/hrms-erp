import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { data } from 'jquery';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.servralUrl;

const routes = {
  // budgetManagement: {
  //   updateBudget: (budget_id: any)=> `${databaseKey}/api/v1/updateBudget/${budget_id}`,
  // },
  inventoryManagement: {
    getAllACtiveWarehouseList: (entity_id: any, id: any) =>
      `${databaseKey}/api/v1/get_all_active_warehouse_list/${entity_id}/${id}`,
    getAllWarehouseList: (entity_id: any, id: any) =>
      `${databaseKey}/api/v1/get_all_warehouse_list/${entity_id}/${id}`,
    getAllmainWarehouseList: (entity_id: any, vpId: any) =>
      `${databaseKey}/api/v1/getAllmainWarehouseList/${entity_id}/${vpId}`,
    getAllNewWarehouseList: (entity_id: any, id: any) =>
      `${databaseKey}/api/v1/getAllNewWarehouseList/${entity_id}/${id}`,
    getGoodsInventoryHistory: (item_id: any) =>
      `${databaseKey}/api/v1/get_goodsInventory_history/${item_id}`,
    getAllWarehouseWithoutId: (id: any) =>
      `${databaseKey}/api/v1/getAllWarehouseWithoutId/${id}`,
    createWarehouse: () => `${databaseKey}/api/v1/create_warehouse`,
    addNewRow: (entity_id: any, id: any) =>
      `${databaseKey}/api/v1/create_warehouseBifurcationRow/${entity_id}/${id}`,
    addNewSection: (entity_id: any) =>
      `${databaseKey}/api/v1/create_warehouseBifurcationSection/${entity_id}`,
    addNewSelf: (entity_id: any) =>
      `${databaseKey}/api/v1/create_warehouseBifurcationSelf/${entity_id}`,
    deleteRow: (row_id: any) =>
      `${databaseKey}/api/v1/delete_warehouseBifurcationRow/${row_id}`,
    getAllRowList: (entity_id: any, id: any, warehouseId: any) =>
      `${databaseKey}/api/v1/get_all_warehouseBifurcationRow_list/${entity_id}/${id}?warehouse_id=${warehouseId}`,
    getAllSelfList: (row_id: any) =>
      `${databaseKey}/api/v1/get_all_warehouseBifurcationSelf_list/${row_id}`,
    getAllSectionList: (self_id: any) =>
      `${databaseKey}/api/v1/get_all_warehouseBifurcationSection_list/${self_id}`,
    UpdateRow: (row_id: any) => `${databaseKey}/api/v1/update-row/${row_id}`,
    createStockTransfer: (entity_id: any) =>
      `${databaseKey}/api/v1/create_stockTransfer/${entity_id}`,
    getAllStockTransfer: (entity_id: any) =>
      `${databaseKey}/api/v1/get_StockTransfer_List/${entity_id}`,
    createReceivedStockTransfer: (entity_id: any) =>
      `${databaseKey}/api/v1/create_received_stockTransfer/${entity_id}`,
    getItemMasterList: () => `${databaseKey}/api/v1/getAllItem`,
    createGoodsInventory: (entity_id: any) =>
      `${databaseKey}/api/v1/create_goodsInventory/${entity_id}`,
    getAllGoodsInventory: (entity_id: any) =>
      `${databaseKey}/api/v1/getAll_goodsInventory/${entity_id}`,
    generateBatchNumber: () => `${databaseKey}/api/v1/generate_batch_number`,
    generateRandomStockId: () =>
      `${databaseKey}/api/v1/generate_random_stockId`,
    generateRandomReceivedStockId: () =>
      `${databaseKey}/api/v1/generate_random_receiverd_stockId`,
    getAllReceivedStockTransfer: (entity_id: any) =>
      `${databaseKey}/api/v1/get_receivedStockTransfer_List/${entity_id}`,
    generateWareHouseCode: () => `${databaseKey}/api/v1/get_warehouse_code`,
    getWarehouseDashoard: (entity_id: any) =>
      `${databaseKey}/api/v1/get_warehouse_dashboard/${entity_id}`,
    getWaewhouseSectionItem: (section_id: any) =>
      `${databaseKey}/api/v1/getAllInventoryItemListBySectionId/${section_id}`,
    deleteByIdWarehouse: (id: any) =>
      `${databaseKey}/api/v1/delete_warehouseById/${id}`,
    getByIdWarehouse: (id: any) =>
      `${databaseKey}/api/v1/getwarehouseById/${id}`,
    updateWarehouseByid: (id: any) =>
      `${databaseKey}/api/v1/updateWarehouseByid/${id}`,
    getAllStockTransferById: (id: any) =>
      `${databaseKey}/api/v1/getAllStockTransferById/${id}`,
    getDashBoardFinanceData: (entity_id: any, financial_id: any) =>
      `${databaseKey}/api/v1/getDashBoardFinanceData/${entity_id}/${financial_id}`,
    WarehouseManagementList: () =>
      `${databaseKey}/api/v1/WarehouseManagementList`,
    getWarehouseForDisatch: (item_id: any, quantity: any) =>
      `${databaseKey}/api/v1/getWarehouseForDisatch?item_id=${item_id}&quantity=${quantity}`,
    getRowForDisatch: (item_id: any, warehouse_id: any) =>
      `${databaseKey}/api/v1/getRowForDisatch?item_id=${item_id}&warehouse_id=${warehouse_id}`,
    getShelfForDisatch: (item_id: any, warehouseRow_id: any) =>
      `${databaseKey}/api/v1/getShelfForDisatch?item_id=${item_id}&warehouseRow_id=${warehouseRow_id}`,
    getSectionForDisatch: (item_id: any, self_id: any) =>
      `${databaseKey}/api/v1/getSectionForDisatch?item_id=${item_id}&warehouseShalf_id=${self_id}`,
    getsSerialNo: (grn_item_id: any) =>
      `${databaseKey}/api/v1/getsSerialNo/${grn_item_id}`,
    createStockTransferNew: (entity_id: any) =>
      `${databaseKey}/api/v1/create_stockTransfer_new/${entity_id}`,
    getAllStockTransferNew: (entity_id: any, employee_id: any) =>
      `${databaseKey}/api/v1/get_StockTransfer_List_new/${entity_id}/${employee_id}`,
    getAllRecieveStockTransferNew: (entity_id: any, employee_id: any) =>
      `${databaseKey}/api/v1/getAllRecieveStockTransfer_new?entity_id=${entity_id}&employee_id=${employee_id}`,
    updateStockTransferStatus: (id: any) =>
      `${databaseKey}/api/v1/update_stockTransfer_status/${id}`,
    getAvailableSerialsAndBatches: () =>
      `${databaseKey}/api/v1/get_available_serials_and_batches`,
    dispatchedOrder: () => `${databaseKey}/api/v1/dispatchedOrder`,
    proceedToDispatched: (id: number) =>
      `${databaseKey}/api/v1/proceedToDispatched/${id}`,
    applyCustBranding: (id: number) =>
      `${databaseKey}/api/v1/applyCustBranding/${id}`,
    viewItemSerialNo: (item_id: any, warehouse_id: any) =>
      `${databaseKey}/api/v1/viewItemSerialNo?item_id=${item_id}&warehouse_id=${warehouse_id}`,
    updateSoDate: (so_id: number) =>
      `${databaseKey}/api/v1/updateSoDate/${so_id}`,
    uploadSoDoc: (so_id: number) =>
      `${databaseKey}/api/v1/uploadSoDoc/${so_id}`,
    updateWarehouse: (id: any) =>
      `${databaseKey}/api/v1/update_warehouse/${id}`,
  },
  vehicle: {
    createVehiclePlan: () => `${databaseKey}/api/v1/createVehiclePlan`,
    getVehiclePlanList: (entity_id: any) =>
      `${databaseKey}/api/v1/getVehiclePlannedData?entity_id=${entity_id}`,
    getVehiclePlanById: (id: any) =>
      `${databaseKey}/api/v1/getVehiclePlanById/${id}`,
    updateVehiclePlanById: (id: any) =>
      `${databaseKey}/api/v1/updateVehiclePlanById/${id}`,
    updateDriverDetail: (id: any) =>
      `${databaseKey}/api/v1/updateDriverDetail/${id}`,
  },
  invoice: {
    getByInvoice: (id: any) =>
      `${databaseKey}/api/v1/getVehiclePlanningById/${id}`,
    downloadPdfinvoie: (id1: any, id2: any) =>
      `${databaseKey}/api/v1/downloadSOInvoice/${id1}/${id2}`,
  },

  warehouse: {
    getWarehouse_type: () => `${databaseKey}/api/v1/getAll_ActiveWarehouseType`,
    getAllWarehouseListNew: () => `${databaseKey}/api/v1/getAllWarehouseMst`,
    getByIdWarehouseNew: (id: any) =>
      `${databaseKey}/api/v1/getByWarehouseMst/${id}`,
    getWarehouseByIdWithBifurcation: (id: any) =>
      `${databaseKey}/api/v1/getWarehouseByIdWithBifurcation/${id}`,
    createWarehouseBifurcation: () =>
      `${databaseKey}/api/v1/create_warehouse_bifurcation`,
    getAllWarehouseBifurcation: () =>
      `${databaseKey}/api/v1/getAllWarehouseBifurcation`,
    getByWarehouseBifurcation: (id: any) =>
      `${databaseKey}/api/v1/getWarehouseBifurcationById/${id}`,
    findLocation: () => `${databaseKey}/api/v1/find_location`,
    getRecievingWarehouseData: (id: any, cat_id: any) =>
      `${databaseKey}/api/v1/getRecievingWarehouseData?id=${id}&category_id=${cat_id}`,
    getAllZonesByWarehouseId: (id: any) =>
      `${databaseKey}/api/v1/getAllZonesByWarehouseId?warehouse_bifurcation_id=${id}`,
    getAllRacksByZoneId: (id: any) =>
      `${databaseKey}/api/v1/getAllRacksByZoneId?warehouse_zone_id=${id}`,
    getAllShelfByRackId: (id: any) =>
      `${databaseKey}/api/v1/getAllShelfByRackId?warehouse_rack_id=${id}`,
    getAllBinByShelfId: (id: any) =>
      `${databaseKey}/api/v1/getAllBinByShelfId?warehouse_shelf_id=${id}`,
    allocateItemInWarehouse: () =>
      `${databaseKey}/api/v1/allocateItemInWarehouse`,
    getBulkStorageDataById: (id: any, zone_type: any) =>
      `${databaseKey}/api/v1/getBulkStorageDataById?id=${id}&zone_type=${zone_type}`,
  },
};
@Injectable({
  providedIn: 'root',
})
export class InventoryManagementService {
  constructor(private httpclient: HttpClient) {}

  stringSubject = new BehaviorSubject(null);
  passValue(data: any) {
    this.stringSubject.next(data);
  }

  getEmpTitle() {
    return this.stringSubject;
  }

  // inventory-managment start
  getAllRowList(entity_id: any, id: any, warehouseId: any) {
    return this.httpclient.get(
      routes.inventoryManagement.getAllRowList(entity_id, id, warehouseId),
    );
  }

  getAllSelfList(row_id: any) {
    return this.httpclient.get(
      routes.inventoryManagement.getAllSelfList(row_id),
    );
  }

  getAllSectionList(self_id: any) {
    return this.httpclient.get(
      routes.inventoryManagement.getAllSectionList(self_id),
    );
  }

  getAllWarehouseList(entity_id: any, id: any) {
    return this.httpclient.get(
      routes.inventoryManagement.getAllWarehouseList(entity_id, id),
    );
  }

  getAllmainWarehouseList(entity_id: any, vpId: any) {
    return this.httpclient.get(
      routes.inventoryManagement.getAllmainWarehouseList(entity_id, vpId),
    );
  }

  getAllNewWarehouseList(entity_id: any, id: any) {
    return this.httpclient.get(
      routes.inventoryManagement.getAllNewWarehouseList(entity_id, id),
    );
  }
  getsSerialNo(grn_item_id: any) {
    return this.httpclient.get(
      routes.inventoryManagement.getsSerialNo(grn_item_id),
    );
  }

  getAllWarehouseListNew() {
    return this.httpclient.get(routes.warehouse.getAllWarehouseListNew());
  }

  getGoodsInventoryHistory(item_id: any) {
    return this.httpclient.get(
      routes.inventoryManagement.getGoodsInventoryHistory(item_id),
    );
  }
  getAllWarehouseWithoutId(id: any) {
    return this.httpclient.get(
      routes.inventoryManagement.getAllWarehouseWithoutId(id),
    );
  }

  createWarehouse(data: any) {
    return this.httpclient.post(
      routes.inventoryManagement.createWarehouse(),
      data,
    );
  }

  addNewRow(data: any, entity_id: any, id: any) {
    return this.httpclient.post(
      routes.inventoryManagement.addNewRow(entity_id, id),
      data,
    );
  }

  UpdateRow(data: any, row_id: any) {
    return this.httpclient.put(
      routes.inventoryManagement.UpdateRow(row_id),
      data,
    );
  }

  addNewSection(data: any, entity_id: any) {
    return this.httpclient.post(
      routes.inventoryManagement.addNewSection(entity_id),
      data,
    );
  }

  addNewSelf(data: any, entity_id: any) {
    return this.httpclient.post(
      routes.inventoryManagement.addNewSelf(entity_id),
      data,
    );
  }

  deleteRow(row_id: any) {
    return this.httpclient.delete(routes.inventoryManagement.deleteRow(row_id));
  }

  createStockTransfer(data: any, entity_id: any) {
    return this.httpclient.post(
      routes.inventoryManagement.createStockTransfer(entity_id),
      data,
    );
  }

  createStockTransferNew(data: any, entity_id: any) {
    return this.httpclient.post(
      routes.inventoryManagement.createStockTransferNew(entity_id),
      data,
    );
  }

  getAllStockTransfer(entity_id: any) {
    return this.httpclient.get(
      routes.inventoryManagement.getAllStockTransfer(entity_id),
    );
  }

  getAllRecieveStockTransferNew(entity_id: any, employee_id: any) {
    return this.httpclient.get(
      routes.inventoryManagement.getAllRecieveStockTransferNew(
        entity_id,
        employee_id,
      ),
    );
  }

  getAllStockTransferNew(entity_id: any, employee_id: any) {
    return this.httpclient.get(
      routes.inventoryManagement.getAllStockTransferNew(entity_id, employee_id),
    );
  }

  updateStockTransferStatus(id: any, payload: any) {
    return this.httpclient.put(
      routes.inventoryManagement.updateStockTransferStatus(id),
      payload,
    );
  }

  getAvailableSerialsAndBatches(
    item_id: any,
    warehouse_id: any,
    row_id: any,
    shelf_id: any,
    section_id: any,
    exclude_transfer_id?: any,
  ) {
    const params: any = { item_id, warehouse_id, row_id, shelf_id, section_id };
    if (exclude_transfer_id) {
      params.exclude_transfer_id = exclude_transfer_id;
    }
    return this.httpclient.get(
      routes.inventoryManagement.getAvailableSerialsAndBatches(),
      { params },
    );
  }

  createReceivedStockTransfer(data: any, entity_id: any) {
    return this.httpclient.post(
      routes.inventoryManagement.createReceivedStockTransfer(entity_id),
      data,
    );
  }

  getAllReceivedStockTransfer(entity_id: any) {
    return this.httpclient.get(
      routes.inventoryManagement.getAllReceivedStockTransfer(entity_id),
    );
  }

  getItemMasterList() {
    return this.httpclient.get(routes.inventoryManagement.getItemMasterList());
  }

  createGoodsInventory(data: any, entity_id: any) {
    return this.httpclient.post(
      routes.inventoryManagement.createGoodsInventory(entity_id),
      data,
    );
  }

  getAllGoodsInventory(entity_id: any) {
    return this.httpclient.get(
      routes.inventoryManagement.getAllGoodsInventory(entity_id),
    );
  }

  generateBatchNumber() {
    return this.httpclient.get(
      routes.inventoryManagement.generateBatchNumber(),
    );
  }

  generateRandomStockId() {
    return this.httpclient.get(
      routes.inventoryManagement.generateRandomStockId(),
    );
  }

  generateRandomReceivedStockId() {
    return this.httpclient.get(
      routes.inventoryManagement.generateRandomReceivedStockId(),
    );
  }

  generateWareHouseCode() {
    return this.httpclient.get(
      routes.inventoryManagement.generateWareHouseCode(),
    );
  }
  // dashboard
  getWarehouseDashoard(entity_id: any) {
    return this.httpclient.get(
      routes.inventoryManagement.getWarehouseDashoard(entity_id),
    );
  }

  getWaewhouseSectionItem(section_id: any) {
    return this.httpclient.get(
      routes.inventoryManagement.getWaewhouseSectionItem(section_id),
    );
  }

  deleteByIdWarehouse(id: any) {
    return this.httpclient.delete(
      routes.inventoryManagement.deleteByIdWarehouse(id),
    );
  }

  getWarehouseByid(id: any) {
    return this.httpclient.get(routes.inventoryManagement.getByIdWarehouse(id));
  }

  getWarehouseByidNew(id: string) {
    return this.httpclient.get(routes.warehouse.getByIdWarehouseNew(id));
  }

  getWarehouseByIdWithBifurcation(id: string) {
    return this.httpclient.get(
      routes.warehouse.getWarehouseByIdWithBifurcation(id),
    );
  }

  updateWarehouseByid(id: any, data: any) {
    return this.httpclient.put(
      routes.inventoryManagement.updateWarehouseByid(id),
      data,
    );
  }
  getAllStockTransferById(id: any) {
    return this.httpclient.get(
      routes.inventoryManagement.getAllStockTransferById(id),
    );
  }
  getAllACtiveWarehouseList(entity_id: any, id: any) {
    return this.httpclient.get(
      routes.inventoryManagement.getAllACtiveWarehouseList(entity_id, id),
    );
  }

  getDashBoardFinanceData(entity_id: any, financial_id: any) {
    return this.httpclient.get(
      routes.inventoryManagement.getDashBoardFinanceData(
        entity_id,
        financial_id,
      ),
    );
  }

  getWarehouseManagementList() {
    return this.httpclient.get(
      routes.inventoryManagement.WarehouseManagementList(),
    );
  }
  getWarehouseForDisatch(item_id: any, quantity: any) {
    return this.httpclient.get(
      routes.inventoryManagement.getWarehouseForDisatch(item_id, quantity),
    );
  }

  getRowForDisatch(item_id: any, warehouse_id: any) {
    return this.httpclient.get(
      routes.inventoryManagement.getRowForDisatch(item_id, warehouse_id),
    );
  }
  getShelfForDisatch(item_id: any, warehouseRow_id: any) {
    return this.httpclient.get(
      routes.inventoryManagement.getShelfForDisatch(item_id, warehouseRow_id),
    );
  }
  getSectionForDisatch(item_id: any, self_id: any) {
    return this.httpclient.get(
      routes.inventoryManagement.getSectionForDisatch(item_id, self_id),
    );
  }
  // getsSerialNo(id: any, item_id: any) {
  //   return this.httpclient.get(
  //     routes.inventoryManagement.getsSerialNo(id, item_id)
  //   );
  // }
  dispatchedOrder(data: any) {
    return this.httpclient.post(
      routes.inventoryManagement.dispatchedOrder(),
      data,
    );
  }
  proceedToDispatched(data: any, id: number) {
    return this.httpclient.patch(
      routes.inventoryManagement.proceedToDispatched(id),
      data,
    );
  }
  applyCustBranding(data: any, id: number) {
    return this.httpclient.patch(
      routes.inventoryManagement.applyCustBranding(id),
      data,
    );
  }
  updateSoDate(data: any, id: number) {
    return this.httpclient.patch(
      routes.inventoryManagement.updateSoDate(id),
      data,
    );
  }
  uploadSoDoc(data: any, id: number) {
    return this.httpclient.patch(
      routes.inventoryManagement.uploadSoDoc(id),
      data,
    );
  }

  uploadPODDoc(data: any, folderName: any, originalFileName: boolean = false) {
    return this.httpclient.post<any>(
      `${databaseKey}/api/v1/uploadPODDoc?folderName=${folderName}&originalFileName=${originalFileName}`,
      data,
    );
  }

  viewItemSerialNo(item_id: any, warehouse_id: any) {
    return this.httpclient.get(
      routes.inventoryManagement.viewItemSerialNo(item_id, warehouse_id),
    );
  }

  createVehiclePlan(payload: any) {
    return this.httpclient.post(routes.vehicle.createVehiclePlan(), payload);
  }

  updateVehiclePlanById(payload: any, id: any) {
    return this.httpclient.put(
      routes.vehicle.updateVehiclePlanById(id),
      payload,
    );
  }
  getVehiclePlanList(entity_id: any) {
    return this.httpclient.get(routes.vehicle.getVehiclePlanList(entity_id));
  }

  getVehiclePlanById(id: string) {
    return this.httpclient.get(routes.vehicle.getVehiclePlanById(id));
  }

  getInvoiceById(id: any) {
    return this.httpclient.get(routes.invoice.getByInvoice(id));
  }

  // pdfDownload(id1:any,id2:any){
  //   return this.httpclient.get(routes.invoice.downloadPdfinvoie(id1,id2))
  // }
  pdfDownload(id1: any, id2: any) {
    return this.httpclient.get(routes.invoice.downloadPdfinvoie(id1, id2), {
      responseType: 'blob',
      observe: 'response',
    });
  }
  updateDriverDetail(vpId: string, data: any) {
    return this.httpclient.put(routes.vehicle.updateDriverDetail(vpId), data);
  }

  getWarehouse_type() {
    return this.httpclient.get(routes.warehouse.getWarehouse_type());
  }

  createWarehousebifurcation(data: any) {
    return this.httpclient.post(
      routes.warehouse.createWarehouseBifurcation(),
      data,
    );
  }

  getAllWarehouseBifurcations() {
    return this.httpclient.get(routes.warehouse.getAllWarehouseBifurcation());
  }

  getByWarehouseBifurcation(id: any) {
    return this.httpclient.get(routes.warehouse.getByWarehouseBifurcation(id));
  }

  findLocation(data: any) {
    return this.httpclient.post(routes.warehouse.findLocation(), data);
  }

  updateWarehouse(id: any, data: any) {
    return this.httpclient.post(
      routes.inventoryManagement.updateWarehouse(id),
      data,
    );
  }

  getRecievingWarehouseData(id: any, category_id: any) {
    return this.httpclient.get(
      routes.warehouse.getRecievingWarehouseData(id, category_id),
    );
  }

  getAllZonesByWarehouseId(id: any) {
    return this.httpclient.get(routes.warehouse.getAllZonesByWarehouseId(id));
  }

  getAllRacksByZoneId(id: any) {
    return this.httpclient.get(routes.warehouse.getAllRacksByZoneId(id));
  }

  getAllShelfByRackId(id: any) {
    return this.httpclient.get(routes.warehouse.getAllShelfByRackId(id));
  }

  getAllBinByShelfId(id: any) {
    return this.httpclient.get(routes.warehouse.getAllBinByShelfId(id));
  }

  allocateItemInWarehouse(data: any) {
    return this.httpclient.post(
      routes.warehouse.allocateItemInWarehouse(),
      data,
    );
  }
  getBulkStorageDataById(id: any, zone_type: any) {
    return this.httpclient.get(
      routes.warehouse.getBulkStorageDataById(id, zone_type),
    );
  }

  getWarehouseHierarchy(warehouse_id: number) {
    return this.httpclient.get(`${databaseKey}/api/v1/getWarehouseHierarchy`, {
      params: {
        warehouse_id: warehouse_id,
      },
    });
  }

  getAllPendingGrnAllcation(financial_year_id: any, entity_id: any) {
    return this.httpclient.get(
      `${databaseKey}/api/v1/getAllPendingGrnAllcation?financial_year_id=${financial_year_id}&entity_id=${entity_id}`,
    );
  }

  getPendingGrnAllcationById(id: number, version_id: number) {
    return this.httpclient.get(
      `${databaseKey}/api/v1/getPendingGrnAllcationById?id=${id}&version_id=${version_id}`,
    );
  }

  getWarehouseBifurcationByTypeId(
    id: number,
    warehouse_id: number,
    type: string,
    asset_id: number,
  ) {
    return this.httpclient.get(
      `${databaseKey}/api/v1/getWarehouseBifurcationByTypeId?id=${id}&warehouse_id=${warehouse_id}&type=${type}&asset_id=${asset_id}`,
    );
  }

  getInventoryDashboardData(entity_id: any, warehouse_id: any) {
    return this.httpclient.get(
      `${databaseKey}/api/v1/getInventoryDashboardData?entity_id=${entity_id}&warehouse_id=${warehouse_id}`,
    );
  }

  getInventoryStockData(entity_id: any, warehouse_id: any) {
    return this.httpclient.get(
      `${databaseKey}/api/v1/getInventoryStockData?entity_id=${entity_id}&warehouse_id=${warehouse_id}`,
    );
  }

  getInvLedgerData(entity_id: any, warehouse_id: any, item_id: any) {
    return this.httpclient.get(
      `${databaseKey}/api/v1/getInvLedgerData?entity_id=${entity_id}&warehouse_id=${warehouse_id}&item_id=${item_id}`,
    );
  }

  getStockInTransit(entity_id: any, warehouse_id?: any) {
    let url = `${databaseKey}/api/v1/getStockInTransit?entity_id=${entity_id}`;
    if (
      warehouse_id &&
      warehouse_id !== 'null' &&
      warehouse_id !== 'undefined'
    ) {
      url += `&warehouse_id=${warehouse_id}`;
    }
    return this.httpclient.get(url);
  }

  getMapItemDetailsById(id: any) {
    return this.httpclient.get(`${databaseKey}/api/v1/getMapItemDetailsById/${id}`);
  }

  saveMappedItemsSerialNo(data: any) {
    return this.httpclient.post(`${databaseKey}/api/v1/saveMappedItemsSerialNo`,data);
  }

  getMapSerialNoBySOId(id: any, planningId: any) {
    return this.httpclient.get(`${databaseKey}/api/v1/getMapSerialNoBySOId/${id}/${planningId}`);
  }

  getItemList(entity_id: any) {
    return this.httpclient.get<any>(`${databaseKey}/api/v1/getItemListForDirectInventory?entity_id=${entity_id}`);
  }

  insertDirectInventory(data: any) {
    return this.httpclient.post(`${databaseKey}/api/v1/insertDirectInventory`,data);
  }
}