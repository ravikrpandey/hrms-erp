import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeliveryServicesService {

  databaseKey;
  constructor(private http: HttpClient) {
    this.databaseKey = environment.servralUrl;   
  }

  getDeliveryList() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getDeliveryList`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  
  updatePodStatus(data: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/updatePodStatus`,data);
  }
 


}


