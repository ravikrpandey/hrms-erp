import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.servralUrl;
const routes = {
  store_Management: {
    getInventory_mng: () => ` ${databaseKey}/api/v1/inventory_mng/store/list`,
    save_store: () => `${databaseKey}/api/v1/inventory_mng/store/save-store`,
    branchSetup_get: () => `${databaseKey}/api/v1/branchSetup_get`,
    getStoreByID: (id: any) => `${databaseKey}/api/v1/inventory_mng/store/single?id=${id}`,
    update_store: () => `${databaseKey}/api/v1/inventory_mng/store/update-store`
  }
}

@Injectable({
  providedIn: 'root'
})
export class StoreManagementService {
  constructor(private http: HttpClient) { }

  getInventory_mng() {
    return this.http.get(routes.store_Management.getInventory_mng());
  }
  save_store(data: any) {
    return this.http.post(routes.store_Management.save_store(), data);
  }
  update_store(data: any) {
    return this.http.put(routes.store_Management.update_store(), data);
  }
  branchSetup_get() {
    return this.http.get(routes.store_Management.branchSetup_get());
  }
  getStoreByID(id: any) {
    return this.http.get(routes.store_Management.getStoreByID(id))

  }
}
