import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { BehaviorSubject } from 'rxjs';
const databaseKey: any = environment.serverUrl;

const routes = {
  docm: {
        getAllFolders: () => `${databaseKey}/api/v1/getAllDmsFolders`,
        getAllEmployes: (id: any) => `${databaseKey}/api/v1/getAllEmployees/${id}`,
        getAllDocuments: (id: any) => `${databaseKey}/api/v1/getFilesByFolderId/${id}`,
        getFolder: (id: any) => `${databaseKey}/api/v1/getFolderTypeById/${id}`,
        deleteFolderByIdandUserId: () => `${databaseKey}/api/v1/deleteDataByAssignedUser`,
        deleteDocmByIdandUserId: () => `${databaseKey}/api/v1/deleteDocumentByAssignedUser`,
        downloadDocmByIdandUserId: () => `${databaseKey}/api/v1/downloadFromBlob`,
        addFolders: () => `${databaseKey}/api/v1/createDmsFolder`,
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
}

@Injectable({
  providedIn: 'root'
})
export class DocmMngmtService {
  subject = new BehaviorSubject(0);
  private documentDataSubject = new BehaviorSubject<any>(''); // Holds quotation data

  templateData$ = this.documentDataSubject.asObservable(); // Observable for quotation data

  constructor(private http: HttpClient) { }

  getDocumentsList(id: any): Observable<any> {
    return this.http.get<any>(routes.docm.getAllDocuments(id));
  }
  getEmployeList(id: any): Observable<any> {
    return this.http.get<any>(routes.docm.getAllEmployes(id));
  }
  getFolderById(id: any): Observable<any> {
    return this.http.get<any>(routes.docm.getFolder(id));
  }
  folderDeleteById(data: any): Observable<any> {
    return this.http.post<any>(routes.docm.deleteFolderByIdandUserId(),data);
  }
  docmDeleteById(data: any): Observable<any> {
    return this.http.post<any>(routes.docm.deleteDocmByIdandUserId(),data);
  }
  docmDownloadById(data: any): Observable<HttpResponse<Blob>> {
    return this.http.post(routes.docm.downloadDocmByIdandUserId(), data, {
      responseType: 'blob', // Expect a binary file
      observe: 'response'   // To access response headers
    });
  }
  getFoldersList(data: any): Observable<any> {
    return this.http.post<any>(routes.docm.getAllFolders(), data);
  }
  createFolders(data: any): Observable<any> {
    return this.http.post<any>(routes.docm.addFolders(), data);
  }
}
