import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.serverUrl;

const routes = {
  setting: {
    addSetting: () => `${databaseKey}/api/v1/create_quotation`,
    updateSetting: (quot_id: any) =>
      `${databaseKey}/api/v1/edit_quotation/${quot_id}`,
  },
  quotation: {
    getByIdQuotation: () => `${databaseKey}/api/v1/get_day_data_by_quot_id`,
    getBranchByEmployee: (emp_id: any) => `${databaseKey}/api/v1/get_all_branches/${emp_id}`,
    getQuestionAnswer: () => `${databaseKey}/api/v1/questions-with-answers`,
    getQuestion: () => `${databaseKey}/api/v1/createQuestions`,
    getByIdQuot: (quotId: any) =>
      `${databaseKey}/api/v1/get_all_quotation_by_day/${quotId}`,
    getSupplierPrice: (supplierId: any) =>
      `${databaseKey}/api/v1/get_supplier_prices/${supplierId}`,
    getByIdTemp: (tempId: any) =>
      `${databaseKey}/api/v1/get_temp_data_for_quot/${tempId}`,
    deleteByIdQuot: (quotId: any) =>
      `${databaseKey}/api/v1/deleteQuotation/${quotId}`,
    updateByIdQuot: (quotId: any) =>
      `${databaseKey}/api/v1/updateStatus/${quotId}`,
      getByIdTempCopy: (tempId: any) =>
      `${databaseKey}/api/v1/get_temp_quotation_data/${tempId}`,
    get_template_day_data: (quotId: any) =>
      `${databaseKey}/api/v1/get_template_day_data/${quotId}`,
    getQuotationList: () => `${databaseKey}/api/v1/get_all_quotation`,
    getHotelList: () => `${databaseKey}/api/v1/get_all_hotel_types`,
    addQuotationFeedBack: () => `${databaseKey}/api/v1/addFeedback`,
    addFeedBackNotes: () => `${databaseKey}/api/v1/addFeedbackNotes`,
    getQuotationFeedBacklist: (quotation_id: number) =>
      `${databaseKey}/api/v1/feedlist?quotation_id=${quotation_id}`,
    getQuotationDetailsById: (quotId: number) =>
      `${databaseKey}/api/v1/get_quotation_byId?quotation_id=${quotId}`,

    userProfileDetails: (Id: number) =>
      `${databaseKey}/api/v1/userDetails?id=${Id}`,
    entityDetails: (Id: number) =>
      `${databaseKey}/api/v1/entityDetails?id=${Id}`,
  },

  price: {
    getByIdPrice: (quotId: any) =>
      `${databaseKey}/api/v1/get_pricetab_details_by_id/${quotId}`,
    getIncludeSelfExclude: (quotId: any) =>
      `${databaseKey}/api/v1/getExcludeIncludeDataQuotation/${quotId}`,
  },
  booking: {
    getByIdBooking: (quotId: any) =>
      `${databaseKey}/api/v1/get_quot_data_for_booking/${quotId}`,
    bookingStatusUpdate: () => `${databaseKey}/api/v1/update_booking_status`,
    bookingNotesGet: () => `${databaseKey}/api/v1/get_notes_data`,
  },
};

@Injectable({
  providedIn: 'root',
})
export class QuotationService {

  private quotationDataSubject = new BehaviorSubject<any>(''); // Holds quotation data
  private quotationDayDataSubject = new BehaviorSubject<any>(''); // Holds day-specific data
  private allDataSubject = new BehaviorSubject<any>(''); // Holds allData

  quotationData$ = this.quotationDataSubject.asObservable(); // Observable for quotation data
  quotationDayData$ = this.quotationDayDataSubject.asObservable(); // Observable for day-specific data
  allData$ = this.allDataSubject.asObservable(); // Observable for allData

  constructor(private http: HttpClient) {}

  // Method to update quotation data
  updateQuotationData(data: any) {
    this.quotationDataSubject.next(data);
  }

  // Method to get the current value of quotationData
  getQuotationData() {
    return this.quotationDataSubject.getValue();
  }

  // Method to update day-specific data
  updateQuotationDayData(data: any) {
    this.quotationDayDataSubject.next(data);
  }

  // Method to get the current value of quotationDayData
  getQuotationDayData() {
    return this.quotationDayDataSubject.getValue();
  }

  // Method to update allData
  updateAllData(data: any) {
    this.allDataSubject.next(data);
  }

  // Method to get the current value of allData
  getAllData() {
    return this.allDataSubject.getValue();
  }

  ////////// start setting //////////////
  addSetting(data: any): Observable<any> {
    return this.http.post(routes.setting.addSetting(), data);
  }
  updateSetting(id: any, data: any): Observable<any> {
    return this.http.post(routes.setting.updateSetting(id), data);
  }
  /////////// end setting ///////////

  /////////// start quotation ///////////
  quotationGetById(data: any): Observable<any> {
    return this.http.post(routes.quotation.getByIdQuotation(), data);
  }

  quotationDeleteById(quot_id: any, data: any): Observable<any> {
    return this.http.post(routes.quotation.deleteByIdQuot(quot_id), data);
  }

  quotationUpdateById(quot_id: any, data: any): Observable<any> {
    return this.http.post(routes.quotation.updateByIdQuot(quot_id), data);
  }

  getBranchByEmployee(id: number): Observable<any> {
    return this.http.get(routes.quotation.getBranchByEmployee(id));
  }
  getQuestion(data: any): Observable<any> {
    return this.http.post(routes.quotation.getQuestion(), data);
  }
  getQuestionAnswer(): Observable<any> {
    return this.http.get(routes.quotation.getQuestionAnswer());
  }

  getQuotationDetailsById(id: number): Observable<any> {
    return this.http.get(routes.quotation.getQuotationDetailsById(id));
  }

  userProfileDetails(id: number): Observable<any> {
    return this.http.get(routes.quotation.userProfileDetails(id));
  }
  entityDetails(id: number): Observable<any> {
    return this.http.get(routes.quotation.entityDetails(id));
  }
  quotationGetByIdQuot(id: any): Observable<any> {
    return this.http.get(routes.quotation.getByIdQuot(id));
  }
  supplierPriceGetById(id: any): Observable<any> {
    return this.http.get(routes.quotation.getSupplierPrice(id));
  }
  templateGetByIdTemp(id: any): Observable<any> {
    return this.http.get(routes.quotation.getByIdTemp(id));
  }
  getByIdTempCopy(id: any): Observable<any> {
    return this.http.get(routes.quotation.getByIdTempCopy(id));
  }
  getQuotationList(): Observable<any> {
    return this.http.get(routes.quotation.getQuotationList());
  }
  getHotelList(): Observable<any> {
    return this.http.get(routes.quotation.getHotelList());
  }
  /////////// end quotation ///////////

  /////////// start price ///////////
  priceGetById(id: any): Observable<any> {
    return this.http.get(routes.price.getByIdPrice(id));
  }
  getIncludesExcludeSelfPay(id: any): Observable<any> {
    return this.http.get(routes.price.getIncludeSelfExclude(id));
  }

  get_template_day_data(id: any) {
    // return this.http.get(routes.price.get_template_day_data(id));
  }
  /////////// end price ///////////

  /////////// start booking ///////////
  bookingGetById(id: any): Observable<any> {
    return this.http.get(routes.booking.getByIdBooking(id));
  }
  bookingStatus(data: any): Observable<any> {
    return this.http.post(routes.booking.bookingStatusUpdate(), data);
  }
  getBookingNotes(data: any): Observable<any> {
    return this.http.post(routes.booking.bookingNotesGet(), data);
  }

  addQuotationFeedBack(data: any): Observable<any> {
    return this.http.post(routes.quotation.addQuotationFeedBack(), data);
  }
  getQuotationFeedBacklist(id: number) {
    return this.http.get(routes.quotation.getQuotationFeedBacklist(id));
  }
  addFeedBackNotes(payload:any){
    return this.http.post(routes.quotation.addFeedBackNotes(), payload);
  }
  /////////// end booking ///////////
}
