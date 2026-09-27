
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';


@Injectable({
  providedIn: 'root'
})


export class bayManagementListService {
  databaseKey;
  constructor(private http: HttpClient) {
    this.databaseKey = environment.servralUrl;
    // this.databaseKey = "https://emerpapi.elitetraveltech.in"
    // this.databaseKey = 'http://localhost:5000'
    // this.databaseKey = "http://192.168.20.232:5000";
  }

  getAllBlocks(query:any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getBayBlockList/${query}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  createBlockList(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/getBayBlockList`,body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  createBay(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createBayManagement`,body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateBay(body: any,bay_id:any=null,block_id:any=null) {
    if ( block_id && bay_id ) {
      return this.http.put<any>(`${this.databaseKey}/api/v1/updateBayManagement?block_id=${block_id}&bay_id=${bay_id}`,body).pipe(
        map((response: any) => {
          return response;
        })
      );
    }else {
      return this.http.put<any>(`${this.databaseKey}/api/v1/updateBayManagement?bay_id=${bay_id}`,body).pipe(
        map((response: any) => {
          return response;
        })
      );
    }
  }

  getBlocksForWarehouse(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/getBlocksForWarehouse`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getBayList(query:any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getBayBlockBayList/${query}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getBlockById(body:any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/getBayBlock`,body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  editBlock(body:any) {
    return this.http.put<any>(`${this.databaseKey}/api/v1/editBayBlock`,body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getBayById(query:any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getBayBlockBay/${query}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  editBayBlockBay(query:any, body:any) {
    return this.http.put<any>(`${this.databaseKey}/api/v1/editBayBlockBay/${query}`,body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  createBlockBays(body:any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createBlockBays`,body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  createBayRacks(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createBayRacks`,body).pipe(
      map((response: any) => {
        return response;
      })
    );

  }

  // /api/v1/getBayManagementList
  getBayManagementList(employee_id:any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getBayManagementList/${employee_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getWarehouseByPlant(query:any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getWarehouseByPlant/${query}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getWarehouseList(employee_id:any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getWarehouseList/${employee_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getBayManagementByPlantAndWarehouse(warehouse_id:any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getBayManagementByPlantAndWarehouse?warehouse_id=${warehouse_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getRackByBayId(bay_id:any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getRackByBayId/${bay_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getBayBlockByBlockId(block_id:any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getBlockBayByBlockId/${block_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  deleteRack(rack_id:any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/deleteRack/${rack_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getBay(bay_id:any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getBay/${bay_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

}
