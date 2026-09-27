import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';


const databaseKey: any = environment.serverUrl;
const routes = {
  total_inventory: {
    getAllInventory: (login_id: any) => `${databaseKey}/api/v1/getAllInventory?login_id=${login_id}`,
    registrationall: () => `${databaseKey}/api/auth/registrationall`,
    branchSetup_get: () => `${databaseKey}/api/v1/branchSetup_get`,
    createInventory: () => `${databaseKey}/api/v1/createInventory`,
    getBatchInventory: () => `${databaseKey}/api/v1/getBatchInventory`,
    getProductionbyId_Inside: () => `${databaseKey}/api/v1/getProductionbyId_Inside`,
    getFilteredInventory: (grn_date_from: any, grn_date_to: any, mfg_date_from: any, mfg_date_to: any, Item_Id: any) => `${databaseKey}/api/v1/getFilteredInventory?grn_date_from=${grn_date_from}&grn_date_to=${grn_date_to}&mfg_date_from=${mfg_date_from}&mfg_date_to=${mfg_date_to}&managed_by=S.No.Only&Item_Id=${Item_Id}`,


  }
}

@Injectable({
  providedIn: 'root'
})
export class TotalInventoryService {
  //----- this is to pass the last item of total inventory batch grid------//
  private lastSelectedBatch: any;
  //-----------//

  constructor(private http: HttpClient) { }

  //----- this is to pass the last item of total inventory batch grid------//
  setLastSelectedBatch(batch: any) {
    this.lastSelectedBatch = batch;
  }

  getLastSelectedBatch(): any {
    return this.lastSelectedBatch;
  }

  //-----------//


  getAllInventory(login_id: any) {
    return this.http.get(routes.total_inventory.getAllInventory(login_id));
  }
  getBatchInventory(data: any) {
    return this.http.post(routes.total_inventory.getBatchInventory(), data);
  }
  getProductionbyId_Inside(data: any) {
    return this.http.post(routes.total_inventory.getProductionbyId_Inside(), data);
  }
  registrationall() {
    return this.http.get(routes.total_inventory.registrationall());
  }
  branchSetup_get() {
    return this.http.get(routes.total_inventory.branchSetup_get());
  }
  createInventory(data: any) {
    return this.http.post(routes.total_inventory.createInventory(), data);
  }
  getFilteredInventory(grn_date_from: any, grn_date_to: any, mfg_date_from: any, mfg_date_to: any, Item_Id: any) {
    return this.http.get(routes.total_inventory.getFilteredInventory(grn_date_from, grn_date_to, mfg_date_from, mfg_date_to, Item_Id))
  }
}
