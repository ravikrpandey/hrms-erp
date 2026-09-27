
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class TaxSlabService {

    databaseKey;
    constructor(private http: HttpClient) {
        this.databaseKey = environment.serverUrl;
    }

    createtax_slab(body: any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/createtax_slab`, body).pipe(
            map((response: any) => { return response })
        );
    }

    getAll_taxslab(req: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_taxslab?financial_year_id=${req?.financial_year_id}&entity_id=${req?.entity_id}`).pipe(
            map((response: any) => { return response })
        );
    }

    gettax_slab_ById(id: any) {
        return this.http.get<any>(`${this.databaseKey}/api/v1/gettax_slab_ById/${id}`).pipe(
            map((response: any) => { return response })
        );
    }

    delete_taxslab(id: any) {
        return this.http.delete<any>(`${this.databaseKey}/api/v1/delete_taxslab ${id}`).pipe(
            map((response: any) => { return response })
        );
    }

}
