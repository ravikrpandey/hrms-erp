
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class BuisnessIntelligenceService {

    databaseKey;
    constructor(private http: HttpClient) {
        this.databaseKey = environment.servralUrl;
    }

    // Forecast Revenue
    createForecastRevenue(body: any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/create_forcast_revenue`, body).pipe(
            map((response: any) => { return response })
        );
    }

    updateForecastRevenue(id:any,body: any) {
        return this.http.put<any>(`${this.databaseKey}/api/v1/update_forcast_revenue/${id}`, body).pipe(
            map((response: any) => { return response })
        );
    }

    deleteForecastRevenue(id:any) {
        return this.http.delete<any>(`${this.databaseKey}/api/v1/delete_forcast_revenue/${id}`).pipe(
            map((response: any) => { return response })
        );
    }

    getAllForecastRevenue(entity_id:any,fid:any,filter_fy:any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_active_forcast_revenue?entity_id=${entity_id}&fid=${fid}&filter_fy=${filter_fy}`).pipe(
            map((response: any) => { return response })
        );
    }

    getByIdForecastRevenue(id:any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getbyId_forcast_revenue/${id}`).pipe(
            map((response: any) => { return response })
        );
    }

    bulkCreateSetup(body:any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/bulkCreate_forcast_revenue`, body).pipe(
            map((response: any) => { return response })
        ); 
    }

      //Depreciation Forecast
    createDepreciation(body: any,entity_id:any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/create_asset_depreciation`, body).pipe(
            map((response: any) => { return response })
        );
    }
}
