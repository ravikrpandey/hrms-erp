
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class DepreciationService {

    databaseKey;
    constructor(private http: HttpClient) {
        this.databaseKey = environment.serverUrl;
    }

    //Depreciation Forecast
    createDepreciation(body: any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/create_asset_depreciation`, body).pipe(
            map((response: any) => { return response })
        );
    }

    updateDepreciation(id:any,body: any) {
        return this.http.put<any>(`${this.databaseKey}/api/v1/update_asset_depreciation/${id}`, body).pipe(
            map((response: any) => { return response })
        );
    }

    deleteDepreciation(id:any) {
        return this.http.delete<any>(`${this.databaseKey}/api/v1/delete_asset_depreciation/${id}`).pipe(
            map((response: any) => { return response })
        );
    }

    getAllDepreciation(entity_id:any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_asset_depreciation?entity_id=${entity_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    getByIdDepreciation(id:any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getById_asset_depreciation/${id}`).pipe(
            map((response: any) => { return response })
        );
    }

    bulkCreateSetup(body:any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/bulkCreate_asset_depreciation`, body).pipe(
            map((response: any) => { return response })
        ); 
    }
}
