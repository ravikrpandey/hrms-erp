import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.serverUrl;

const routes = {
  product: {
    getProductCampaign: () => `${databaseKey}/api/v1/getAllProducts`,
    getProductCampaignById: (id: any) => `${databaseKey}/api/v1/getProductById/${id}`,
    createProductCampaign: () => `${databaseKey}/api/v1/createProduct`,
    updateProductCampaign: (id: any) => `${databaseKey}/api/v1/updateProduct/${id}`,
    deleteProductCampaign: (id: any) => `${databaseKey}/api/v1/deleteProduct/${id}`,
  }
}
@Injectable({
  providedIn: 'root'
})
export class ProductCampaignService {
  constructor(private http: HttpClient) { }

  getProductList() {
    return this.http.get(routes.product.getProductCampaign(),
    );
  }
  getProductCampaignById(id: any) {
    return this.http.get(routes.product.getProductCampaignById(id),
    );
  }
  createProductCompaign(data: any) {
    return this.http.post(routes.product.createProductCampaign(),data);
  }
  updateProductCompaign(id: any, data: any) {
    return this.http.put(routes.product.updateProductCampaign(id),data);
  }
  deleteProductCompaign(id: any) {
    return this.http.delete(routes.product.deleteProductCampaign(id),
    );
  }
}
