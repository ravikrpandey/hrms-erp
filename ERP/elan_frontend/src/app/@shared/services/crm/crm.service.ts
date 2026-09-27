import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class CrmService {
  databaseKey;
  constructor(private http: HttpClient) {
    this.databaseKey = environment.servralUrl;
  }

  getCreateModule() {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/getCreateModule`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getChallaData(doid:any) {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/getDeliveryChallanById/${doid}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getCustomerDetailsById(id:any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getCustomerDetailsById/${id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  generateEwayWithoutIrn(entity_id:any,financial_id:any, doId:any,customer_id:any,reqData:any) {
    return this.http
      .post<any>(`${this.databaseKey}/api/v1/eway/generateEwayWithoutIrn/${entity_id}/${financial_id}/${doId}/${customer_id}`,reqData)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  cancelIRN(entity_id:any, doId:any,reqData:any) {
    return this.http
      .post<any>(`${this.databaseKey}/api/v1/cancelIRNforSalesInvoice/${entity_id}/${doId}`,reqData)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getLeadFormSetup(entity_id: any, f_id: any) {
    return this.http
      .get<any>(
        `${this.databaseKey}/api/v1/getLeadFormSetup/${entity_id}/${f_id}`
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getFieldType() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getFieldType`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  leadFormSetup(body: any) {
    return this.http
      .post<any>(`${this.databaseKey}/api/v1/leadFormSetup`, body)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getProductName() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getProductName`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getLeadData(
    query: any,
    login_id: any,
    entity_id: any,
    financial_year_id: any
  ) {
    let queryTitle = '';
    if (query == 0) {
      queryTitle = 'missed_follow_up';
    } else if (query === 1) {
      queryTitle = 'today_follow_up';
    } else if (query === 2) {
      queryTitle = 'upcoming_follow_up';
    } else if (query.query == 'id') {
      queryTitle = 'id';
      query = query?.id;
    }
    return this.http
      .get<any>(
        `${this.databaseKey}/api/v1/getLeadData?${queryTitle}=${query}&login_id=${login_id}&entity_id=${entity_id}&financial_year_id=${financial_year_id}`
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getStatusData() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getStatusData`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  // getByCutomeusedLead(id:any) {
  //   return this.http.get<any>(`${this.databaseKey}/api/v1/getByCutomeusedLead/${id}`).pipe(
  //     map((response: any) => {
  //       return response;
  //     })
  //   );
  // }

  getFieldName() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getFiledName`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  createLead(body: any) {
    return this.http
      .post<any>(`${this.databaseKey}/api/v1/createLead`, body)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  uploadDoc(body: any) {
    return this.http.post<any>(`${this.databaseKey}/WL/documents`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateLeadFormSetup(body: any) {
    return this.http
      .patch<any>(`${this.databaseKey}/api/v1/updateLeadFormSetup`, body)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  createFormFieldValue(body: any, query: any) {
    return this.http
      .post<any>(
        `${this.databaseKey}/api/v1/createFormFieldValue?lead_form_id=${query}`,
        body
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getStatusName(query: any) {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/getStatusName/${query}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getFormDetails(entity_id:any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getFormDetails?entity_id=${entity_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  registrationall(entity_id: any, role: any) {
    return this.http
      .get<any>(
        `${this.databaseKey}/api/auth/registrationall?entity_id=${entity_id}&role_master_name=${role}`
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  viewDescription(query: any) {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/viewDescription/${query}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  updateLeadData(query: any, body: any) {
    return this.http
      .patch<any>(`${this.databaseKey}/api/v1/updateLeadData/${query}`, body)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getLeadSummaryData(data: any, login_id: any) {
    let url = '';
    let user_id = `${data?.user_id ? `user_id=${data?.user_id}&` : ''}`;
    let form_date = `${
      data?.from_date && data?.from_date != 'Invalid date'
        ? `from_date=${data?.from_date}&`
        : ''
    }`;
    let to_date = `${
      data?.to_date && data?.to_date != 'Invalid date'
        ? `to_date=${data?.to_date}&`
        : ''
    }`;
    let status = `${data?.status ? `status=${data?.status}&` : ''}`;
    url = user_id + form_date + to_date + status;
    return this.http
      .get<any>(
        `${this.databaseKey}/api/v1/getLeadSummaryData?${url.slice(
          0,
          -1
        )}&login_id=${login_id}`
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getLeadStatusData() {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/getLeadStatusData`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  createLeadSummary(body: any) {
    return this.http
      .post<any>(`${this.databaseKey}/api/v1/createLeadSummary`, body)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getAllActiveTransType() {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/getAllActiveTransType`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getSupplyType() {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/getSupplyType`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getDocumentType() {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/getDocumentType`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getDoData(doid:any, invoice_mode:any) {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/getDeliveryChallanDataById/${doid}/${invoice_mode}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  getCDKData(entity_id:any) {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/getCdkDataByEntityId/${entity_id}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  generateIRN(entity_id:any,financial_id:any, doId:any,reqData:any,invoice_id:any) {
    return this.http
      .post<any>(`${this.databaseKey}/api/v1/generateIRNforSalesInvoice/${entity_id}/${financial_id}/${doId}/${invoice_id}`,reqData)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  generateEwaybill(entity_id:any,financial_id:any, doId:any,reqData:any,invoiceMode:any) {
    return this.http
      .post<any>(`${this.databaseKey}/api/v1/generateEwayByIrn/${entity_id}/${financial_id}/${doId}/${invoiceMode}`,reqData)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  branchSetup_get() {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/branchSetup_get`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  branchSetup_get_billing() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getBranch`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getByBranchIdroleMaster(query: any) {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/getByBranchIdroleMaster/${query}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getAllproduct() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAllproduct`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getComplaintById(query: any) {
    return this.http
      .get<any>(`${this.databaseKey}/api/v1/getComplaintById/${query}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  addcustomize(data:any) {
    return this.http
      .post<any>(`${this.databaseKey}/api/v1/add_customisation_branding`,data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  addcustomizeVersion(data:any) {
    return this.http
      .post<any>(`${this.databaseKey}/api/v1/add_proposal_customisation_branding`,data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getByCustomize(id:any,data:any){
    return this.http
    .post<any>(`${this.databaseKey}/api/v1/get_customisation_branding/${id}`,data)
    .pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getByCustomizeExisting(id:any,data:any){
    return this.http
    .post<any>(`${this.databaseKey}/api/v1/get_customisation_branding_existing_client/${id}`,data)
    .pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getByCustomizeVersion(id:any,data:any){
    return this.http
    .post<any>(`${this.databaseKey}/api/v1/get_proposal_customisation_branding/${id}`,data)
    .pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getAllTranspostName(entity_id:any,financial_year_id:any,role:any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getAll_transport?entity_id=${entity_id}&financial_year_id=${financial_year_id}&role=${role}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  private messageSource = new BehaviorSubject<string>('null');
  currentMessage = this.messageSource.asObservable();

  updateMessage(message: string) {
    this.messageSource.next(message);
  }

  getAccessoriesBySubCategory(id:any,id2:any){
    return this.http
    .get<any>(`${this.databaseKey}/api/v1/getAccessoriesBySubCategory/${id}/${id2}`)
    .pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getWarehouseByBranch(branch_id:any){
    return this.http.get<any>(`${this.databaseKey}/api/v1/getWarehouseByBranch/${branch_id}`).pipe(map((response: any) => {return response;}));
  }

  getWarehouseByLocation(location:any){
    return this.http.get<any>(`${this.databaseKey}/api/v1/getWarehouseByLocation/${location}`).pipe(map((response: any) => {return response;}));
  }

  reportingManegerExist(id:any){
    return this.http.get(`${this.databaseKey}/api/v1/reportingManager_ExistinWorkflow/${id}`)
  }
}
