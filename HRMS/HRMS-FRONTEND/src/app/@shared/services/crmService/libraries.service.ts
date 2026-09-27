import { HttpClient } from '@angular/common/http';
import moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Injectable } from '@angular/core';
const databaseKey: any = environment.serverUrl;

const routes = {
  common: {
    getSuppliers: () => `${databaseKey}/api/v1/all_supplier_list`,
    getContentType: () => `${databaseKey}/api/v1/get_all_content_type`,
    getType: (id: any) => `${databaseKey}/api/v1/get_type_list/${id}`,
    getFilter: () => `${databaseKey}/api/v1/library_filter_data`,
    getUnverifiedFilter: () => `${databaseKey}/api/v1/library_filter_pending_data`,
    statusUpdate: () => `${databaseKey}/api/v1/approveItinerary`,
    supplierForType: () => `${databaseKey}/api/v1/getAllTypeSupplier`,
    getSuppliersOnEachType: () => `${databaseKey}/api/v1/getSuppliersOnEachType`,
    createSupplierForType: () => `${databaseKey}/api/v1/createSupplierForLibrary`,
  },
  day: {
    addDay: () => `${databaseKey}/api/v1/add_day_activity`,
    getByIdDay: (id: any) => `${databaseKey}/api/v1/get_by_id/${id}`,
    getDayList: () => `${databaseKey}/api/v1/get_activity_by_id`,
    deleteDayById: (id: any) => `${databaseKey}/api/v1/delete_day_activity/${id}`,
  },
  activity: {
    addActivity: () => `${databaseKey}/api/v1/create_activity`,
    update_Supplier_by_category: () => `${databaseKey}/api/v1/update_Supplier_by_category`,
    getByIdActivity: (id: any) => `${databaseKey}/api/v1/get_activity_by_id/${id}`,
    getAllTypeByContentId: (id: any) => `${databaseKey}/api/v1/getAllTypeByContentId/${id}`,
    getActivityList: () => `${databaseKey}/api/v1/all_activity_list`,
    updatedActivity: (id: any) => `${databaseKey}/api/v1/day_activity/${id}`,
    updatedChiledActivity: (id: any) => `${databaseKey}/api/v1/days_activity/${id}`,
    update_activity: () => `${databaseKey}/api/v1/update_activity`,
    deleteChiledActivity: (id: any) => `${databaseKey}/api/v1/delete_activity/${id}`,


  },
  accommodation: {
    addAccommodation: () => `${databaseKey}/api/v1/create_accommodation`,
    getByIdAccommodation: (id: any) => `${databaseKey}/api/v1/get_accommodation_by_id/${id}`,
    getAccommodationList: () => `${databaseKey}/api/v1/all_accommodation_list`,
    updateAccommodation: (id: any) => `${databaseKey}/api/v1/day_accommodation/${id}`,
    update_accommodation: () => `${databaseKey}/api/v1/update_accommodation`,
    deletedAccommodation: (id: any) => `${databaseKey}/api/v1/delete_accommodation/${id}`,
  },
  foodAndBeverage: {
    addFoodAndBeverage: () => `${databaseKey}/api/v1/add_new_food_and_beverage`,
    getByIdFoodAndBeverage: (id: any) => `${databaseKey}/api/v1/get_food_and_beverage_by_id/${id}`,
    getFoodAndBeverageList: () => `${databaseKey}/api/v1/all_food_and_beverage_list`,

    updateFoodAndBeverage: (id: any) => `${databaseKey}/api/v1/day_food/${id}`,
    update_food_and_beverage: () => `${databaseKey}/api/v1/update_food_and_beverage`,
    deleteFoodAndBeverage: (id: any) => `${databaseKey}/api/v1/delete_food_services/${id}`,


  },
  transportation: {
    addTransportation: () => `${databaseKey}/api/v1/create_transportation_service`,
    getByIdTransportation: (id: any) => `${databaseKey}/api/v1/get_transportation_service_by_id/${id}`,
    getTransportationList: () => `${databaseKey}/api/v1/all_transportation_service_list`,
    updateTransportation: (id: any) => `${databaseKey}/api/v1/day_transportation/${id}`,
    update_transportation_service: () => `${databaseKey}/api/v1/update_transportation_service`,
    deleteTransportation: (id: any) => `${databaseKey}/api/v1/delete_transportation/${id}`,

  },
  service: {
    addService: () => `${databaseKey}/api/v1/create_additional_service`,
    getByIdService: (id: any) => `${databaseKey}/api/v1/get_additional_service_by_id/${id}`,
    getServiceList: () => `${databaseKey}/api/v1/all_additional_service_list`,
    updatedService: (id: any) => `${databaseKey}/api/v1/day_service/${id}`,
    update_additional_service: () => `${databaseKey}/api/v1/update_additional_service`,
    deleteService: (id: any) => `${databaseKey}/api/v1/delete_services/${id}`,


  },

  media: {
    addMedia: () => `${databaseKey}/api/v1/create_media`,
    getallMedia: () => `${databaseKey}/api/v1/all_media_list`,
    deleteMedia: (id: any) => `${databaseKey}/api/v1/delete_media/${id}`,
    updatedMedia: (id: any) => `${databaseKey}/api/v1/update_media/${id}`,
    getDetailsById: (id: any) => `${databaseKey}/api/v1/all_media_id/${id}`,

  },
}
//  /api/v1/download-excel'  2.  "/api/v1/searchMedia  3 ./api/v1/Pagination
// /api/v1/media?page=1&limit=7
@Injectable({
  providedIn: 'root'
})
export class LibrariesService {

  private apiUrl = 'https://api.unsplash.com/photos/random';
  private accessKey = 'ac6ZF3Hkz9kyVI2zuWbntsJjXoczqmzP5z8xStZIyzk'; // Replace with your Unsplash Access Key

  constructor(private http: HttpClient) { }
  private buttonClickSubject = new Subject<void>();

  buttonClick$ = this.buttonClickSubject.asObservable();

  triggerButtonClick() {
    this.buttonClickSubject.next();
  }
  /////////// start common ///////////////
  getlist() {
    return this.http.get(routes.common.getSuppliers(),
    );
  }

  getSupplierForType(data: any) {
    return this.http.post(routes.common.supplierForType(), data);
  }

  getSuppliersOnEachType(data: any) {
    return this.http.post(routes.common.getSuppliersOnEachType(), data);
  }

  createSupplierForType(data: any) {
    return this.http.post(routes.common.createSupplierForType(), data);
  }

  getContentType() {
    return this.http.get(routes.common.getContentType(),
    );
  }

  getTypeList(id: any) {
    return this.http.get(routes.common.getType(id),);
  }

  getFilterList(data: any) {
    return this.http.post(routes.common.getFilter(), data);
  }

  getUnverifiedFilterList(data: any) {
    return this.http.post(routes.common.getUnverifiedFilter(), data);
  }

  statusUpdateVerification(data: any) {
    return this.http.post(routes.common.statusUpdate(), data);
  }
  /////////// end common ///////////////

  ////////// start day //////////////
  addDay(data: any): Observable<any> {
    return this.http.post(routes.day.addDay(), data);
  }
  dayGetById(id: any): Observable<any> {
    return this.http.get(routes.day.getByIdDay(id));
  }
  dayList(): Observable<any> {
    return this.http.get(routes.day.getDayList());
  }
  deleteDay(id: any, data: any): Observable<any> {
    return this.http.put(routes.day.deleteDayById(id), data);
  }
  ////////// end day //////////////

  ////////// start activity //////////////
  addActivity(data: any): Observable<any> {
    return this.http.post(routes.activity.addActivity(), data);
  }

  update_Supplier_by_category(data: any): Observable<any> {
    return this.http.put(routes.activity.update_Supplier_by_category(), data);
  }

  getAllTypeByContentId(contentId: any): Observable<any> {
    return this.http.get(routes.activity.getAllTypeByContentId(contentId));
  }

  activityGetById(id: any): Observable<any> {
    return this.http.get(routes.activity.getByIdActivity(id));
  }

  activityList(): Observable<any> {
    return this.http.get(routes.activity.getActivityList());
  }

  updateActivity(id: any, data: any): Observable<any> {
    return this.http.put(routes.activity.updatedActivity(id), data)
  }
  updatedChiledActivity(id: any, data: any): Observable<any> {
    return this.http.put(routes.activity.updatedChiledActivity(id), data)
  }
  update_activity(data: any): Observable<any> {
    return this.http.put(routes.activity.update_activity(), data)
  }
  deleteChiledActivity(id: any): Observable<any> {
    return this.http.delete(routes.activity.deleteChiledActivity(id))
  }
  ///////// end activity ///////////////////

  ///////// start accommodation ////////////
  addAccommodation(data: any): Observable<any> {
    return this.http.post(routes.accommodation.addAccommodation(), data);
  }
  accommodationList(): Observable<any> {
    return this.http.get(routes.accommodation.getAccommodationList());
  }
  updateAccommodation(id: any, data: any): Observable<any> {
    return this.http.put(routes.accommodation.updateAccommodation(id), data);
  }
  update_accommodation(data: any): Observable<any> {
    return this.http.put(routes.accommodation.update_accommodation(), data);
  }
  deletedAccommodation(id: any): Observable<any> {
    return this.http.delete(routes.accommodation.deletedAccommodation(id));
  }
  ////////  end accommodation /////////////

  ///////// start foodAndBeverage ////////////
  addFoodAndBeverage(data: any): Observable<any> {
    return this.http.post(routes.foodAndBeverage.addFoodAndBeverage(), data);
  }
  updateFoodAndBeverage(id: any, data: any): Observable<any> {
    return this.http.put(routes.foodAndBeverage.updateFoodAndBeverage(id), data);
  }
  update_food_and_beverage(data: any): Observable<any> {
    return this.http.put(routes.foodAndBeverage.update_food_and_beverage(), data);
  }
  foodAndBeverageList(): Observable<any> {
    return this.http.get(routes.foodAndBeverage.getFoodAndBeverageList());
  }
  deleteFoodAndBeverage(id: any): Observable<any> {
    return this.http.delete(routes.foodAndBeverage.deleteFoodAndBeverage(id));
  }
  ////////  end foodAndBeverage /////////////

  ///////// start transportation ////////////
  addTransportation(data: any): Observable<any> {
    return this.http.post(routes.transportation.addTransportation(), data);
  }
  transportationList(): Observable<any> {
    return this.http.get(routes.transportation.getTransportationList());
  }
  updateTransportation(id: any, data: any): Observable<any> {
    return this.http.put(routes.transportation.updateTransportation(id), data);
  }
  update_transportation_service(data: any): Observable<any> {
    return this.http.put(routes.transportation.update_transportation_service(), data);
  }
  deleteTransportation(id: any): Observable<any> {
    return this.http.delete(routes.transportation.deleteTransportation(id));
  }
  ////////  end transportation /////////////

  ///////// start service ////////////
  addService(data: any): Observable<any> {
    return this.http.post(routes.service.addService(), data);
  }

  serviceList(): Observable<any> {
    return this.http.get(routes.service.getServiceList());
  }
  updatedService(id: any, data: any): Observable<any> {
    return this.http.put(routes.service.updatedService(id), data);
  }
  update_additional_service(data: any): Observable<any> {
    return this.http.put(routes.service.update_additional_service(), data);
  }
  deleteService(id: any): Observable<any> {
    return this.http.delete(routes.service.deleteService(id));
  }
  ////////  end service /////////////
  // uploadDoc(body: any) {
  //   return this.http.post<any>(`${this.databaseKey}/uploadDoc`, body).pipe(
  //     map((response: any) => {
  //       return response;
  //     })
  //   );
  // }

  createMedia(mediaData: any): Observable<any> {
    return this.http.post(routes.media.addMedia(), mediaData);
  }
  allMediaList(): Observable<any> {
    return this.http.get(routes.media.getallMedia());
  }
  deleteMediaByID(id: any): Observable<any> {
    return this.http.delete(routes.media.deleteMedia(id));
  }
  updateMedia(id: any, data: any): Observable<any> {
    return this.http.put(routes.media.updatedMedia(id), data);
  }
  getMediaById(id: any): Observable<any> {
    return this.http.get(routes.media.getDetailsById(id));
  }
  getLibraryCategoryData(id: any): Observable<any> {
    return this.http.get(`${databaseKey}/api/v1/library/category/${id}/data`);
  }
  getMultipleRandomImages(count: number): Observable<any> {
    const url = `${this.apiUrl}?client_id=${this.accessKey}&count=${count}`;
    return this.http.get<any>(url);
  }
  getSearchImages(textValue: any, pageSize: any, pageIndex: any): Observable<any> {
    const url = `https://api.unsplash.com/search/photos?page=${pageIndex}&per_page=${pageSize}&query=${textValue}&client_id=${this.accessKey}`;
    // const url = `https://unsplash.com/napi/search/photos?client_id=${this.accessKey}&page=${pageSize}&per_page=10&query=${textValue}`;
    return this.http.get<any>(url);
  }
}
