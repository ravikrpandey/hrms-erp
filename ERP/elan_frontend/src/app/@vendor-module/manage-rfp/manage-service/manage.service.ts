import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageRFPService {

  databaseKey;
   constructor(private http: HttpClient) {
     this.databaseKey = environment.servralUrl;
   }

   getAll_closedandLiveRfp_vendor_id(entity_id:any,vendor_id:any,status:any) {
     return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_closedandLiveRfp_vendor_id?entity_id=${entity_id}&vendor_id=${vendor_id}&status=${status}`).pipe(
       map((response: any) => {
         return response;
       })
     );
   }
}
