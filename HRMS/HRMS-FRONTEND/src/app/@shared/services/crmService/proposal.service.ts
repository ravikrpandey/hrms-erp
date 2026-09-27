
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProposalService {

  databaseKey;
  status: any;
  actionType: any;
  newVersionStatus: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {
    this.databaseKey = environment.serverUrl;

    this.route.queryParams.subscribe((params: any) => {
      this.actionType = params?.actionType;
      this.status = params?.status;
      this.newVersionStatus = params?.newVersionStatus;
    })
  }

  createProposal(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createProposal`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  uploadDoc(body: any) {
    return this.http.post<any>(`${this.databaseKey}/uploadDoc`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getProposalCompanyData(query: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getProposalCompanyData/${query}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getProposalList(query: any, type: any, login_id: any) {
    
    let url = ""
    if (query && type == "status") url = `status=${query}`;
    if (query && type == "proposal_no") url = `id=${query}`;

    let status = '';
    if (this.newVersionStatus == 'pending') {
      status = `&status=0`;
    }
    if (this.actionType == 'approval' && this.newVersionStatus != 'pending') {
      status = `&status=${this.status}`;
    }
    return this.http.get<any>(`${this.databaseKey}/api/v1/getProposalList?${url}${url ? '&' : ''}login_id=${login_id}${status}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateProposalStatus(body: any) {
    return this.http.patch<any>(`${this.databaseKey}/api/v1/updateProposalStatus`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  createProposalPayment(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createProposalPayment`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateProposalPayment(body: any) {
    return this.http.patch<any>(`${this.databaseKey}/api/v1/updateProposalPayment`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  deleteProposalPayment(body: any) {
    return this.http.delete<any>(`${this.databaseKey}/api/v1/deleteProposalPayment?id=${body?.id}&proposal_id=${body?.proposal_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getProposalPaymentList(query: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getProposalPaymentList/${query}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  createBilling(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createBilling`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  createInvoice(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createInvoice`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getInvoiceList(query: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getInvoiceList/${query}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getUpdatedAddress() {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getUpdatedAddress`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  proposalVersionList(proposal_id: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/proposalVersionList?id=${proposal_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  dealCloseVersionByLeadId(lead_id: any, login_id: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/dealCloseVersionByLeadId?lead_id=${lead_id}&login_id=${login_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  createDealClosed(body: any) {
    return this.http.post<any>(`${this.databaseKey}/api/v1/createDealClosed`, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getDealClosedList(login_id: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getDealClosedList?login_id=${login_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getApprovedContractList(login_id: any) {
    console.log("ds", login_id)
    return this.http.get<any>(`${this.databaseKey}/api/v1/getContractList?login_id="ds"`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  dealClosedViewById(id: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/getDealClosedList?dealClosedViewById=${id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  proposalVersionListById(version_id: any, proposal_id: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/proposalVersionListById?id=${version_id}&proposal_id=${proposal_id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getDealClosedById(dealClosedId: AnalyserOptions) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/dealClosedViewById/${dealClosedId}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getDealClosedViewByIdData(dealClosedId: AnalyserOptions) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/deliveryNodeViewById/${dealClosedId}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getDealCLosedByIdData(dealClosedId: AnalyserOptions) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/dealClosedById/${dealClosedId}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  createProposalNo(actionType: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/createProposalNo`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  createDirectDN(id: any) {
    return this.http.get<any>(`${this.databaseKey}/api/v1/direct/${id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

}
