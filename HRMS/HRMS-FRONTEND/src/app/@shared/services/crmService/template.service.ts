import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { BehaviorSubject } from 'rxjs';
const databaseKey: any = environment.serverUrl;

const routes = {
  template: {
        getAllTemplates: () => `${databaseKey}/api/v1/fetch_Template`,
        createTemplate: () => `${databaseKey}/api/v1/create_Template`,
        updateTemplate: () => `${databaseKey}/api/v1/update_Template`,
        filterTemplate: () => `${databaseKey}/api/v1/filter_Template`,
        create_Template:()=> `${databaseKey}/api/v1/create_Template`,
        get_all_pax_type:()=> `${databaseKey}/api/v1/get_all_pax_type`,
        get_day_all_type_data:()=> `${databaseKey}/api/v1/get_day_all_type_data`,
        template_By_Id:(id:any)=> `${databaseKey}/api/v1/template_By_Id?template_id=${id}`,
        update_Template:()=> `${databaseKey}/api/v1/update_Template`,
        all_supplier_list:()=> `${databaseKey}/api/v1/all_supplier_list`,
        update_data:(templateId: any,dayIds:any) =>`${databaseKey}/api/v1/get_all_data__for_particular_templet?templateId=${templateId}&dayIds=${dayIds}`,
        addDayInTemplate: () => `${databaseKey}/api/v1/add_in_template`,
        saveQuatation: () => `${databaseKey}/api/v1/saveQuatation`,
        getTemplateDayDetails: (templateId:number) => `${databaseKey}/api/v1/get_template_day/${templateId}`,
        generateTemplatePdf: () => `${databaseKey}/api/v1/generateTemplatePdf`,
        generateQuotationPdf: () => `${databaseKey}/api/v1/generateQuotationPdf`,
        getTemplateDayDetail: (templateId:number) => `${databaseKey}/api/v1/getSupplierDataForTemplate/${templateId}`,
        updateTemplateDayDetails: () => `${databaseKey}/api/v1/update_day`,
        getQuatationSummaryDetails: (templateId:number) => `${databaseKey}/api/v1/get_template_summary_data/${templateId}`,
        getQuatationSummaryDetailsnew: (templateId:number) => `${databaseKey}/api/v1/getCostDataForTemplate/${templateId}`,
        createQuatationSummary:()=>`${databaseKey}/api/v1/create_summary_final_data`,
        getPricesDetails:(templateId:number)=>`${databaseKey}/api/v1/getbytemplateId/${templateId}`,
        createTemplateQuatationPrice:()=>`${databaseKey}/api/v1/create_temp_quotation_price`,
        getIncludeSelfExclude:(temp_id: any)=>`${databaseKey}/api/v1/getIncludeSelfPayExcludeData/${temp_id}`,
        deletetemplateById: (id: any) =>`${databaseKey}/api/v1/deletetemplateById/${id}`,
  },

  media: {
    getMedia: () => `${databaseKey}/api/v1/all_media_list`,
  },
};

@Injectable({
  providedIn: 'root',
})

export class TemplateService {
  subject = new BehaviorSubject(0);
  private templateDataSubject = new BehaviorSubject<any>('');
  templateData$ = this.templateDataSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Method to update quotation data
  updateTemplateData(data: any) {
    this.templateDataSubject.next(data);
  }

  // Method to get the current value of quotationData
  getTemplateData() {
    return this.templateDataSubject.getValue();
  }

  getTemplatesList(): Observable<any> {
    return this.http.get<any>(routes.template.getAllTemplates());
  }
  createTemplate(data: any) {
    return this.http.post(routes.template.createTemplate(), data);
  }
  addDayInTemplate(data: any) {
    return this.http.post(routes.template.addDayInTemplate(), data);
  }
  getTemplateDayDetails(templateId: number) {
    return this.http.get(routes.template.getTemplateDayDetails(templateId));
  }
  generateTemplatePdf(templateData: any) {
    return this.http.post(routes.template.generateTemplatePdf(),templateData);
  }
  generateQuotationPdf(templateData: any) {
    return this.http.post(routes.template.generateQuotationPdf(),templateData);
  }
  getTemplateDayDetail(templateId: number) {
    return this.http.get(routes.template.getTemplateDayDetail(templateId));
  }
  updateTemplate(data: any) {
    return this.http.post(routes.template.updateTemplate(), data);
  }
  updateTemplateDayDetails(data: any) {
    return this.http.put(routes.template.updateTemplateDayDetails(), data);
  }
  getQuatationSummaryDetails(templateId: number) {
    return this.http.get(routes.template.getQuatationSummaryDetailsnew(templateId));
  }
  createQuatationSummary(data:any){
    return this.http.post(routes.template.createQuatationSummary(), data);
  }
  getPricesDetails(templateId: number) {
    return this.http.get(routes.template.getPricesDetails(templateId));
  }

  createTemplateQuatationPrice(data:any){
    return this.http.post(routes.template.createTemplateQuatationPrice(), data);
  }

  getIncludesExcludeSelfPay(temp_id: any){
    return this.http.get(routes.template.getIncludeSelfExclude(temp_id));
  }

  filterOnTemplate(params: any): Observable<any> {
    let queryParams = new HttpParams();

    if (params.filter_type) {
      queryParams = queryParams.set('filter_type', params.filter_type);
    }
    if (params.filter_value) {
      queryParams = queryParams.set('filter_value', params.filter_value);
    }
    if (params.trip_type) {
      queryParams = queryParams.set('trip_type', params.trip_type);
    }

    return this.http.get(routes.template.filterTemplate(), {
      params: queryParams,
    });
  }

  //media

  all_media_list() {
    return this.http.get(routes.media.getMedia());
  }

  create_Template(data: any) {
    return this.http.post(routes.template.create_Template(), data);
  }
  get_all_pax_type() {
    return this.http.get(routes.template.get_all_pax_type());
  }

  getAllDay() {
    return this.http.get(routes.template.get_day_all_type_data());
  }

  template_By_Id(id: any) {
    return this.http.get(routes.template.template_By_Id(id));
  }

  update_Template(data: any) {
    return this.http.post(routes.template.update_Template(), data);
  }
  all_supplier_list(){
    return this.http.get(routes.template.all_supplier_list())
  }

  quatationUpdate(templateId: any,dayIds:any){
    return this.http.get(routes.template.update_data(templateId,dayIds))
  }

  saveQuatation(template: any){
    return this.http.post(routes.template.saveQuatation(),template)
  }
  private apiKey = environment.GOOGLE_MAPS_API_KEY; // Replace with your actual API key
  private apiUrl = `https://maps.googleapis.com/maps/api/geocode/json`;

  getCoordinates(address: string): Observable<any> {
    const url = `${this.apiUrl}?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
    return this.http.get<any>(url);
  }
  templateDeleteById(id: any): Observable<any> {
    return this.http.delete(routes.template.deletetemplateById(id));
  }
}
