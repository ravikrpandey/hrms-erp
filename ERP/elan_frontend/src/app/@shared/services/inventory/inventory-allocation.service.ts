import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';


const databaseKey: any = environment.servralUrl;
const routes = {
  inventory_allocation: {
    getProductionData:() => `${databaseKey}/api/v1/getProductionData`,
    getProductionbyId:() => `${databaseKey}/api/v1/getProductionbyId`,
  
  }
}


@Injectable({
  providedIn: 'root'
})
export class InventoryAllocationService {

  constructor(private http: HttpClient) { }

  getProductionData() {
    return this.http.get(routes.inventory_allocation.getProductionData());
  }

  getProductionbyId(data:any) {
    return this.http.post(routes.inventory_allocation.getProductionbyId(),data);
  }


}

