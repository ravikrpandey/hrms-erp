import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';

const databaseKey: string = environment.serverUrl;

const routes = {
  contact: {
    getSuppliers: () => `${databaseKey}/api/v1/all_supplier_list`,
    getVerifiedSuppliers: (id: any) => `${databaseKey}/api/v1/verified_supplier_list/${id}`,
    getUnverifiedSuppliers: () =>
      `${databaseKey}/api/v1/unverified_supplier_list`,
    addSuppliers: (menu_id: any) => `${databaseKey}/api/v1/add_Supplier/${menu_id}`,
    getSuppliersDetail: (id: any) =>
      `${databaseKey}/api/v1/supplier_details?supplierId=${id}`,
    getAllContentType: () => `${databaseKey}/api/v1/get_all_content_type`,
    editSupplier: (id: any, menu_id: any) => `${databaseKey}/api/v1/update_Supplier/${id}/${menu_id}`,
    deleteSupplier: (id: any) =>
      `${databaseKey}/api/v1/delete_supplier?id=${id}`,
    // all_activity_list: () => `${databaseKey}/api/v1/all_activity_list`,
    // all_food_and_beverage_list: () => `${databaseKey}/api/v1/all_food_and_beverage_list`,
    all_location_list: () => `${databaseKey}/api/v1/all_location_list`,
    all_media_list: () => `${databaseKey}/api/v1/all_media_list`,
    getDashboardCount: () =>
      `${databaseKey}/api/v1/get_All_Dashboard_Card_Count`,
    getAllActivityLibrary: (text: any) => `${databaseKey}/api/v1/getAllActivityLibrary/${text}`,
    getAllFoodAndBeverageLibrary: (text: any) => `${databaseKey}/api/v1/getAllFoodAndBeverageLibrary/${text}`,
    getAllAccomodationLibrary: (text: any) => `${databaseKey}/api/v1/getAllAccomodationLibrary/${text}`,
    getAllTransportationLibrary: (text: any) => `${databaseKey}/api/v1/getAllTransportationLibrary/${text}`,
    getAdditionalServicesLibrary: (text: any) => `${databaseKey}/api/v1/getAdditionalServicesLibrary/${text}`,
    getAllActivityLibraryList: () => `${databaseKey}/api/v1/getAllActivityLibraryList`,
    getAllFoodAndBeverageLibraryList: () => `${databaseKey}/api/v1/getAllFoodAndBeverageLibraryList`,
    getAllAccomodationLibraryList: () => `${databaseKey}/api/v1/getAllAccomodationLibraryList`,
    getAllTransportationLibraryList: () => `${databaseKey}/api/v1/getAllTransportationLibraryList`,
    getAdditionalServicesLibraryList: () => `${databaseKey}/api/v1/getAdditionalServicesLibraryList`,
    getSupplierCoverageAreaById: (id: any) => `${databaseKey}/api/v1/getSupplierCoverageAreaById/${id}`,
    getSupplyTypeById: (id: any) => `${databaseKey}/api/v1/getSupplyTypeById/${id}`,
    getSupplierCategoryOptions: (id: any) => `${databaseKey}/api/v1/getSupplierCategoryOptions/${id}`,
    getActivityImagesById: (id: any) => `${databaseKey}/api/v1/get_activity_by_id/${id}`,

    getAccomodationImagesById: (id: any) => `${databaseKey}/api/v1/get_accommodation_by_id/${id}`,
    getFBImagesById: (id: any) => `${databaseKey}/api/v1/get_food_and_beverage_by_id/${id}`,
    getAddServiceImagesById: (id: any) => `${databaseKey}/api/v1/get_additional_service_by_id/${id}`,
    getTransportationImagesById: (id: any) => `${databaseKey}/api/v1/get_transportation_service_by_id/${id}`,
    getDayImagesById: (id: any) => `${databaseKey}/api/v1/getDayById/${id}`,
    // all_transportation_service_list: () => `${databaseKey}/api/v1/all_transportation_service_list`,
  },
};
@Injectable({
  providedIn: 'root',
})
export class SuppliersService {
  constructor(private http: HttpClient) { }
  getServerUrl() {
    return databaseKey;
  }
  getlist() {
    return this.http.get(routes.contact.getSuppliers());
  }

  getActivityImagesById(id: any) {
    return this.http.get(routes.contact.getActivityImagesById(id));
  }

  getAccomodationImagesById(id: any) {
    return this.http.get(routes.contact.getAccomodationImagesById(id));
  }

  getFBImagesById(id: any) {
    return this.http.get(routes.contact.getFBImagesById(id));
  }

  getAddServiceImagesById(id: any) {
    return this.http.get(routes.contact.getAddServiceImagesById(id));
  }

  getTransportationImagesById(id: any) {
    return this.http.get(routes.contact.getTransportationImagesById(id));
  }

  getDayImagesById(id: any) {
    return this.http.get(routes.contact.getDayImagesById(id));
  }

  getDashboardCount() {
    return this.http.get(routes.contact.getDashboardCount());
  }
  getverifiedlist(id: any) {
    return this.http.get(routes.contact.getVerifiedSuppliers(id));
  }
  getunverifiedlist() {
    return this.http.get(routes.contact.getUnverifiedSuppliers());
  }
  getDetailSupplier(id: any) {
    return this.http.get(routes.contact.getSuppliersDetail(id));
  }

  addSupplier(data: any, menu_id: any) {
    delete data['selectedItems'];
    return this.http.post(routes.contact.addSuppliers(menu_id), data);
  }
  getAllContent() {
    return this.http.get(routes.contact.getAllContentType());
  }
  editSupplier(data: any, id: any, menu_id: any) {
    delete data['selectedItems'];
    return this.http.post(routes.contact.editSupplier(id, menu_id), data);
  }
  deleteSupplierbyID(id: any) {
    return this.http.delete(routes.contact.deleteSupplier(id));
  }
  accessAssignAction() {
    let a: any = localStorage?.getItem('local');
    if (a) {
      let b: any = window?.atob(a);
      return JSON?.parse(b);
    }
  }

  getAllActivityLibrary(text: any) {
    return this.http.get(routes.contact.getAllActivityLibrary(text));
  }

  getAllFoodAndBeverageLibrary(text: any) {
    return this.http.get(routes.contact.getAllFoodAndBeverageLibrary(text));
  }

  getAllAccomodationLibrary(text: any) {
    return this.http.get(routes.contact.getAllAccomodationLibrary(text));
  }

  getAllTransportationLibrary(text: any) {
    return this.http.get(routes.contact.getAllTransportationLibrary(text));
  }

  getAdditionalServicesLibrary(text: any) {
    return this.http.get(routes.contact.getAdditionalServicesLibrary(text));
  }

  getAllActivityLibraryList() {
    return this.http.get(routes.contact.getAllActivityLibraryList());
  }

  getAllFoodAndBeverageLibraryList() {
    return this.http.get(routes.contact.getAllFoodAndBeverageLibraryList());
  }

  getAllAccomodationLibraryList() {
    return this.http.get(routes.contact.getAllAccomodationLibraryList());
  }

  getAllTransportationLibraryList() {
    return this.http.get(routes.contact.getAllTransportationLibraryList());
  }

  getAdditionalServicesLibraryList() {
    return this.http.get(routes.contact.getAdditionalServicesLibraryList());
  }
  getSupplierCoverageAreaById(id: any) {
    return this.http.get(routes.contact.getSupplierCoverageAreaById(id));
  }

  getSupplyTypeById(id: any) {
    return this.http.get(routes.contact.getSupplyTypeById(id));
  }

  getSupplierCategoryOptions(id: any) {
    return this.http.get(routes.contact.getSupplierCategoryOptions(id));
  }

}

// http://localhost:4000/api/v1/delete_supplier?id=15
// method ==> delete
