import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.servralUrl;
const routes = {
  assetCode: {
    getBatchCode: () => `${databaseKey}/api/v1/generate_batch_code`,
    getAssetTagId: () => `${databaseKey}/api/v1/generate_asset_tagId`,
    CreateDirectAsset: (entity_id: any, financial_year_id: any, employee_id: any) => `${databaseKey}/api/v1/create_direct_asset/${entity_id}/${financial_year_id}/${employee_id}`,
    updateDirectAsset: (id: any) => `${databaseKey}/api/v1/update_direct_asset/${id}`,
  },
  list: {
    getAssetList: (id: any, id1: any) => `${databaseKey}/api/v1/getAssetList/${id}/${id1}`,
    getBasicDetailsForAsset: (id: any) => `${databaseKey}/api/v1/getBasicDetailsForAsset/${id}`,
    getAllPoDetails: (id: any) => `${databaseKey}/api/v1/getAllPoDetails/${id}`,
    getAllDocsByPO_itemId: (id: any) => `${databaseKey}/api/v1/getAllDocsByPO_itemId/${id}`,
    getAllVendorsForMaintenance: (id: any) => `${databaseKey}/api/v1/getAllVendorsForMaintenance/${id}`,
    getAllAssetsForMaintenance: (id: any) => `${databaseKey}/api/v1/getAllAssetsForMaintenance/${id}`,
    getAllMaintenanceList: (id: any) => `${databaseKey}/api/v1/getAllMaintenanceList/${id}`,
    getAssetWarranties: (id: any) => `${databaseKey}/api/v1/getAssetWarranties/${id}`,
    getAssetWarrantiesByIdForAssetView: (id: any) => `${databaseKey}/api/v1/getAssetWarrantiesByIdForAssetView/${id}`,
    getAssetWarrantiesById: (id: any) => `${databaseKey}/api/v1/getAssetWarrantiesById/${id}`,
    getMaintenanceListById: (id: any) => `${databaseKey}/api/v1/getMaintenanceListById/${id}`,
    getMaintenanceListByIdForAssetView: (id: any) => `${databaseKey}/api/v1/getMaintenanceListByIdForAssetView/${id}`,
    getAllCompanyDepreciationDetails: (id: any) => `${databaseKey}/api/v1/getAllCompanyDepreciationDetails/${id}`,
    getDepreciationForAsset: (id: any) => `${databaseKey}/api/v1/getDepreciationForAsset/${id}`,
    calculateAssetDepreciation: (id: any) => `${databaseKey}/api/v1/calculateAssetDepreciation/${id}`,
    getInvoiceDetailsForAsset: (assetId: any) => `${databaseKey}/api/v1/getInvoiceDetailsForAsset/${assetId}`,
    getAssetAllocatedEmp: (entity_id: any) => `${databaseKey}/api/v1/getAssetAllocatedEmp/${entity_id}`,
    getAssetEmployeeById: (employee_id: any) => `${databaseKey}/api/v1/getAssetEmployeeById/${employee_id}`,
    getAssetAssignList: (entity_id: any, employee_id: any) => `${databaseKey}/api/v1/getAssetAssignList/${entity_id}/${employee_id}`,
    getAllAssetHistory: (entity_id: any, employee_id: any) => `${databaseKey}/api/v1/getAllAssetHistory/${entity_id}/${employee_id}`,
    getAssetDetailsById: (grn_status_id: any) => `${databaseKey}/api/v1/getAssetDetailsById/${grn_status_id}`,
    getAssetCompanyDepriciation: (asset_id: any) => `${databaseKey}/api/v1/getAssetCompanyDepriciation/${asset_id}`,
    getAllAssetStatuses: () => `${databaseKey}/api/v1/getAllAssetStatuses`,
    getAllAsset: (id: any, id1: any) => `${databaseKey}/api/v1/getAllAsset/${id}/${id1}`,
    getNearToSalvageAssets: (entity_id: any) => `${databaseKey}/api/v1/getNearToSalvageAsset/${entity_id}`,
    getAlreadySalvageAssets: (entity_id: any) => `${databaseKey}/api/v1/getAlreadySalvageAsset/${entity_id}`,
    getAllAssetCategory: (id: any) => `${databaseKey}/api/v1/getAllAssetCategory/${id}`,
    getAssetCategoryById: (id: any) => `${databaseKey}/api/v1/getAssetCategoryById/${id}`,
    getDashboardStats: (entity_id: any) => `${databaseKey}/api/v1/getDashboardStats/${entity_id}`,
    getAssetDisposition: () => `${databaseKey}/api/v1/getAllDisposition`,
    getAssetAssetNoteList: (entity_id: any) => `${databaseKey}/api/v1/getAssetAssetNoteList/${entity_id}`,
    getRevaluedAssets: () => `${databaseKey}/api/v1/getRevaluedAssets`,
    getWriteOffAssetList: (id: any) => `${databaseKey}/api/v1/get_writeOff_assetList/${id}`,
    getWriteOffAssetById: (id: any) => `${databaseKey}/api/v1/get_writeOff_asset_byId/${id}`,
    getSoldAssetById: (id: any) => `${databaseKey}/api/v1/get_sold_asset_byId/${id}`,
    getSellAssetList: (id: any) => `${databaseKey}/api/v1/get_sold_assetList/${id}`,
  },
  create: {
    createCompanyDepreciationDocs: () => `${databaseKey}/api/v1/createCompanyDepreciationDocs`,
    createAssetMaintenance: () => `${databaseKey}/api/v1/createAssetMaintenance`,
    updateAssetMaintenance: (id: any) => `${databaseKey}/api/v1/updateAssetMaintenance/${id}`,
    createAssetWarranty: () => `${databaseKey}/api/v1/createAssetWarranty`,
    updateAssetWarranty: (id: any) => `${databaseKey}/api/v1/updateAssetWarranty/${id}`,
    allocateAssetForm: (assign_by: any, grn_item_status_id: any, grn_id: any) => `${databaseKey}/api/v1/allocate_assetForm/${assign_by}/${grn_item_status_id}/${grn_id}`,
    deallocateAsset: () => `${databaseKey}/api/v1/deallocateAsset`,
    createAssetCategory: () => `${databaseKey}/api/v1/createAssetCategory`,
    updateAssetCategory: (id: any) => `${databaseKey}/api/v1/updateAssetCategory/${id}`,
    getRepairCategoryByAssetCat: () => `${databaseKey}/api/v1/getRepairCategoryByAssetCat`,
    allocateBulkAsset: () => `${databaseKey}/api/v1/allocateBulkAsset`,
    createDisposition: () => `${databaseKey}/api/v1/createDisposition`,
    createRevaluation: () => `${databaseKey}/api/v1/createRevaluation`,
    updateDisposition: (id: any) => `${databaseKey}/api/v1/updateDisposition/${id}`,
  },
  delete: {
    deleteAssetWarranty: (id: any) => `${databaseKey}/api/v1/deleteAssetWarranty/${id}`,
    changeRepairCategoryStatus: () => `${databaseKey}/api/v1/change_repairCategory_status`,
  },
  downloadPDf: {
    downloadAssetNote: (tranfer_note_id: any) => `${databaseKey}/api/v1/download_asset_note?tranfer_note_id=${tranfer_note_id}`,
  },
}
@Injectable({
  providedIn: 'root'
})
export class AssetListService {


  constructor(private http: HttpClient) {

  }

  getBasicDetailsForAsset(id: any) {
    return this.http.get(routes.list.getBasicDetailsForAsset(id))
  }
  getAllPoDetails(id: any) {
    return this.http.get(routes.list.getAllPoDetails(id))
  }
  getAllDocsByPO_itemId(id: any) {
    return this.http.get(routes.list.getAllDocsByPO_itemId(id))
  }
  getAllVendorsForMaintenance(id: any) {
    return this.http.get(routes.list.getAllVendorsForMaintenance(id))
  }
  getAllAssetsForMaintenance(id: any) {
    return this.http.get(routes.list.getAllAssetsForMaintenance(id))
  }
  getAllMaintenanceList(id: any) {
    return this.http.get(routes.list.getAllMaintenanceList(id))
  }
  getAssetWarranties(id: any) {
    return this.http.get(routes.list.getAssetWarranties(id))
  }
  getAssetWarrantiesByIdForAssetView(id: any) {
    return this.http.get(routes.list.getAssetWarrantiesByIdForAssetView(id))
  }
  getAssetWarrantiesById(id: any) {
    return this.http.get(routes.list.getAssetWarrantiesById(id))
  }
  getMaintenanceListById(id: any) {
    return this.http.get(routes.list.getMaintenanceListById(id))
  }
  getMaintenanceListByIdForAssetView(id: any) {
    return this.http.get(routes.list.getMaintenanceListByIdForAssetView(id))
  }

  //delete
  deleteAssetWarranty(id: any) {
    return this.http.delete(routes.delete.deleteAssetWarranty(id))
  }

  ////create
  createCompanyDepreciationDocs(data: any) {
    return this.http.post(routes.create.createCompanyDepreciationDocs(), data)
  }
  createAssetMaintenance(data: any) {
    return this.http.post(routes.create.createAssetMaintenance(), data)
  }
  updateAssetMaintenance(id: any, data: any) {
    return this.http.patch(routes.create.updateAssetMaintenance(id), data)
  }
  createAssetWarranty(data: any) {
    return this.http.post(routes.create.createAssetWarranty(), data)
  }
  updateAssetWarranty(id: any, data: any) {
    return this.http.patch(routes.create.updateAssetWarranty(id), data)
  }
  getBatchCode() {
    return this.http.get(routes.assetCode.getBatchCode())
  }

  getAssetTagId() {
    return this.http.get(routes.assetCode.getAssetTagId())
  }

  CreateDirectAsset(data: any, endpoint: any) {
    return this.http.post(routes.assetCode.CreateDirectAsset(endpoint?.entity_id, endpoint?.financial_year_id, endpoint?.employee_id), data)
  }

  updateDirectAsset(data: any, id: any) {
    return this.http.put(routes.assetCode.updateDirectAsset(id), data);
  };


  allocateAssetForm(data: any, endpoint: any) {
    return this.http.post(routes.create.allocateAssetForm(endpoint?.assign_by, endpoint?.grn_item_status_id, endpoint?.grn_id), data)
  }

  allocateBulkAsset(data: any) {
    return this.http.post(routes.create.allocateBulkAsset(), data)
  }

  deallocateAsset(data: any) {
    const payload = {
      assetdeAllocate: data
    };
    return this.http.post(routes.create.deallocateAsset(), payload)
  }
  //upload asset list
  upload_assetList(data: any): Observable<any> {
    const file: File = data.file;
    const entity_id = data.entity_id;
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('entity_id', entity_id);
    return this.http.post<any>(`${databaseKey}/api/v1/upload_asset_list`, formData);
  };

  getAllAssetStatuses() {
    return this.http.get(routes.list.getAllAssetStatuses())

  }
  getAssetAllocatedEmp(entity_id: any) {
    return this.http.get(routes.list.getAssetAllocatedEmp(entity_id))
  }

  getAssetAssetNoteList(entity_id: any) {
    return this.http.get(routes.list.getAssetAssetNoteList(entity_id))
  }

  getAssetCompanyDepriciation(asset_id: any) {
    return this.http.get(routes.list.getAssetCompanyDepriciation(asset_id));
  }

  getAssetDetailsById(grn_status_id: any) {
    return this.http.get(routes.list.getAssetDetailsById(grn_status_id))
  }

  getAssetEmployeeById(employee_id: any) {
    return this.http.get(routes.list.getAssetEmployeeById(employee_id))
  }

  getAssetAssignList(entity_id: any, employee_id: any) {
    return this.http.get(routes.list.getAssetAssignList(entity_id, employee_id))
  }

  getAllAssetHistory(entity_id: any, employee_id: any) {
    return this.http.get(routes.list.getAllAssetHistory(entity_id, employee_id))
  }

  getAssetList(id: any, id1: any) {
    return this.http.get(routes.list.getAssetList(id, id1))
  }

  getAllAsset(id: any, id1: any) {
    return this.http.get(routes.list.getAllAsset(id, id1))
  }

  getWriteOffAssetList(id: any) {
    return this.http.get(routes.list.getWriteOffAssetList(id))
  }

  getSellAssetList(id: any) {
    return this.http.get(routes.list.getSellAssetList(id))
  }

  getSoldAssetById(id: any) {
    return this.http.get(routes.list.getSoldAssetById(id))
  }

  getWriteOffAssetById(id: any) {
    return this.http.get(routes.list.getWriteOffAssetById(id))
  }
  getNearToSalvageAssets(entity_id: any) {
    return this.http.get(routes.list.getNearToSalvageAssets(entity_id))
  }
  getAlreadySalvageAssets(entity_id: any) {
    return this.http.get(routes.list.getAlreadySalvageAssets(entity_id))
  }

  getAllCompanyDepreciationDetails(id: any) {
    return this.http.get(routes.list.getAllCompanyDepreciationDetails(id))
  }
  getDepreciationForAsset(id: any) {
    return this.http.get(routes.list.getDepreciationForAsset(id))
  }
  calculateAssetDepreciation(id: any) {
    return this.http.get(routes.list.calculateAssetDepreciation(id))
  }
  getInvoiceDetailsForAsset(id: any) {
    return this.http.get(routes.list.getInvoiceDetailsForAsset(id))
  }


  createAssetCategory(data: any) {
    return this.http.post(routes.create.createAssetCategory(), data)
  }
  updateAssetCategory(id: any, data: any) {
    return this.http.put(routes.create.updateAssetCategory(id), data)
  }

  getAllAssetCategory(id: any) {
    return this.http.get(routes.list.getAllAssetCategory(id))
  }

  getAssetCategoryById(id: any) {
    return this.http.get(routes.list.getAssetCategoryById(id))
  }

  changeRepairCategoryStatus(data: any): Observable<any> {
    return this.http.put(routes.delete.changeRepairCategoryStatus(), data);
  }

  getRepairCategoryByAssetCat(data: any) {
    return this.http.post(routes.create.getRepairCategoryByAssetCat(), data)
  }

  downloadAssetNote(tranfer_note_id: any) {
    return this.http.get(
      routes.downloadPDf.downloadAssetNote(tranfer_note_id),
      { responseType: 'blob' }
    );
  }

  createDisposition(data: any) {
    return this.http.post(routes.create.createDisposition(), data)
  }

  updateDisposition(id: any, data: any) {
    return this.http.put(routes.create.updateDisposition(id), data)
  }

  createRevaluation(data: any) {
    return this.http.post(routes.create.createRevaluation(), data)
  }
  getAllDisposedAssets() {
    return this.http.get(routes.list.getAssetDisposition())
  }

  getDashboardStats(entity_id: any) {
    return this.http.get(routes.list.getDashboardStats(entity_id))
  }
  getRevaluedAssets() {
    return this.http.get(routes.list.getRevaluedAssets())

  }
}
