import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.serverUrl;

const routes = {
  budget: {
    getBudgetCampaign: () => `${databaseKey}/api/v1/getAllBudgets`,
    getBudgetApprovedCampaign: () => `${databaseKey}/api/v1/getApprovedBudget`,
    getBudgetRequest: (id: any) => `${databaseKey}/api/v1/getApprovalRecords/${id}`,
    getBudgetRequestById: (id: any) => `${databaseKey}/api/v1/getRecordByListId/${id}`,
    getRaiseBudgetRequest: () => `${databaseKey}/api/v1/getAllRecordsOfApproval`,
    getBudgetCampaignById: (id: any) => `${databaseKey}/api/v1/getBudgetById/${id}`,
    createBudgetCampaign: () => `${databaseKey}/api/v1/createBudget`,
    raiseBudget: () => `${databaseKey}/api/v1/createBudgetRequest`,
    approverActionRequest: () => `${databaseKey}/api/v1/updateStatusOfRecord`,
    manageBudget: () => `${databaseKey}/api/v1/manageBudgetHisory`,
    updateBudgetCampaign: (id: any) => `${databaseKey}/api/v1/updateBudget/${id}`,
    deleteBudgetCampaign: (id: any) => `${databaseKey}/api/v1/deleteBudget/${id}`,
    fetchBudget: (id: any) => `${databaseKey}/api/v1/getBudgetHistory/${id}`,
  }
}

@Injectable({
  providedIn: 'root'
})
export class BudgetCampaignService {
  constructor(private http: HttpClient) { }

  getBudgetList() {
    return this.http.get(routes.budget.getBudgetCampaign(),
    );
  }
  getApprovedBudgetList() {
    return this.http.get(routes.budget.getBudgetApprovedCampaign(),
    );
  }

  getBudgetRequestList(id: any) {
    return this.http.get(routes.budget.getBudgetRequest(id),
    );
  }
  getBudgetRequest(id: any) {
    return this.http.get(routes.budget.getBudgetRequestById(id),
    );
  }

  getRaiseBudgetList(data: any) {
    return this.http.post(routes.budget.getRaiseBudgetRequest(), data );
  }
  getBudgetListByStatus(data: {status: string, emp_id: string}) {
    return this.http.post(`${databaseKey}/api/v1/getRecordsOnStatus`, data );
  }
  getBudgetCampaignById(id: any) {
    return this.http.get(routes.budget.getBudgetCampaignById(id),
    );
  }
  createBudgetCompaign(data: any) {
    return this.http.post(routes.budget.createBudgetCampaign(),data);
  }
  createBudgetRequest(data: any) {
    return this.http.post(routes.budget.raiseBudget(),data);
  }
  updateBudgetCompaign(id: any, data: any) {
    return this.http.put(routes.budget.updateBudgetCampaign(id),data);
  }
  approverAction(data: any) {
    return this.http.post(routes.budget.approverActionRequest(),data);
  }
  manageBudget(data: any) {
    return this.http.post(routes.budget.manageBudget(),data);
  }
  deleteBudgetCompaign(id: any) {
    return this.http.delete(routes.budget.deleteBudgetCampaign(id),
    );
  }
  budgetHistoryCompaign(id: any) {
    return this.http.get(routes.budget.fetchBudget(id),
    );
  }
  getFinancialYears(){
    return this.http.get(`${databaseKey}/api/v1/getAllfinancial` )
  }
}
