import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.servralUrl;
const routes = {
  asset_management: {
    getAllCategory: () => `${databaseKey}/api/v1/get_All_Category_Master`,
    addAssetCategory:() => `${databaseKey}/api/v1/create_Category_Master`,
    getCategoryById:(id:any)=> `${databaseKey}/api/v1/get_ById_Category_Master/${id}`
  },

  email_creation:{
   creatEmailRequest:()=> `${databaseKey}/api/v1/create_Email_Request`,
   getAllEmailList:()=> `${databaseKey}/api/v1/get_All_Email_Request`,
   getEmilById:(id:any)=> `${databaseKey}/api/v1/get_ById_Email_Request/${id}`,
   update_email_request:(id:any)=> `${databaseKey}/api/v1/edit_Email_Request/${id}`,
   getByIdData:(id:any)=> `${databaseKey}/api/v1_get_employee/${id}`
  },

  assetMaster: {
    get_All_asset_Master:()=> `${databaseKey}/api/v1/get_All_asset_Master`,
    getAssetMasterById:(id:any)=> `${databaseKey}/api/v1/get_ById_asset_Master/${id}`,
  },

  asset_product:{
    assetGetAll:()=>  `${databaseKey}/api/v1/get_All_Asset_Management`,
    creatProducAsset:()=> `${databaseKey}/api/v1/create_Asset_Management`,
    updateAsset:(id:any)=> `${databaseKey}/api/v1/edit_Asset_Management/${id}`,
    get_ById_Asset:(id:any)=> `${databaseKey}/api/v1/get_ById_Asset_Product_List/${id}`,
  },

  scrap_type_master:{
    getAllScrapType:()=> `${databaseKey}/api/v1/get_All_asset_Scrap`,
    getScrapById:(id:any)=> `${databaseKey}/api/v1/get_ById_asset_Scrap/${id}`,
    createScrap:()=> `${databaseKey}/api/v1/create_asset_Scrap`,
    editScrap:(id:any)=>`${databaseKey}/api/v1/edit_asset_Scrap/${id}`,

  },

  product_master:{
    get_product_master:()=> `${databaseKey}/api/v1/get_All_Asset_Product_List`,
    get_ById_Product_Master:(id:any)=> `${databaseKey}/api/v1/get_ById_Asset_Product_List/${id}`,
    create_product_master:()=> `${databaseKey}/api/v1/create_Asset_Product_Master`,
    edit_product_master:(id:any)=>`${databaseKey}/api/v1/edit_Asset_Product_Master/${id}`,
    delete_Product_Master:(id:any)=>`${databaseKey}/api/v1/delete_Asset_Product_List/${id}`,
  }

}


@Injectable({
  providedIn: 'root'
})
export class AssetManagementService {

 
  constructor(private http: HttpClient) { }

  getAllCategory(): Observable<any> {
    return this.http.get(routes.asset_management.getAllCategory());
  }

  addCeateAsset(data:any){
    return this.http.post(routes.asset_management.addAssetCategory(),data)
  }

  categoryGetById(id:any){
    return this.http.get(routes.asset_management.getCategoryById(id))
  }

  emailCreation(data:any){
    return this.http.post(routes.email_creation.creatEmailRequest(),data);
  }
 emailCreationGetDataByID(id:any){
  return this.http.get(routes.email_creation.getByIdData(id))
 }

    
  getAllEmailList(){
    return this.http.get(routes.email_creation.getAllEmailList());
  }

  getEmilById(id:any){
    return this.http.get(routes.email_creation.getEmilById(id));
  }

  upadteEmailRequest(id: any,data:any):Observable<any> {
    return this.http.put<any>(routes.email_creation.update_email_request(id),data);
  }

  getAllAssetMaster(){
    return this.http.get(routes.assetMaster.get_All_asset_Master());
  }

  getAssetMasterById(id:any){
    return this.http.get(routes.assetMaster.getAssetMasterById(id));
  }

  getAllAsset(){
    return this.http.get(routes.asset_product.assetGetAll())
  }

  crateProductAsset(data:any){
    return this.http.post(routes.asset_product.creatProducAsset(),data);
  }

  get_ById_Asset_Management(id:any){
    return this.http.get(routes.asset_product.get_ById_Asset(id))
  }


  updateProductAsset(id:any, data:any){
    return this.http.put(routes.asset_product.updateAsset(id), data);
  }

  getScrapType(){
    return this.http.get(routes.scrap_type_master.getAllScrapType())
  }

  getScrapById(id:any){
    return this.http.get(routes.scrap_type_master.getScrapById(id))
  }

  createScrap(data:any){
    return this.http.post(routes.scrap_type_master.createScrap(),data);

  }

  editScrap(id:any, data:any){
    return this.http.put(routes.scrap_type_master.editScrap(id), data);
  }

 // product master

 getProductMaster(){
  return this.http.get(routes.product_master.get_product_master());
}

getProductMasterById(id:any){
  return this.http.get(routes.product_master.get_ById_Product_Master(id));
}

createProductMaster(data:any){
  return this.http.post(routes.product_master.create_product_master(),data);

}

editProductMaster(id:any, data:any){
  return this.http.put(routes.product_master.edit_product_master(id), data);
}

deleteProductMaster(id:any){
  return this.http.put(routes.product_master.delete_Product_Master(id),"")
}

}
