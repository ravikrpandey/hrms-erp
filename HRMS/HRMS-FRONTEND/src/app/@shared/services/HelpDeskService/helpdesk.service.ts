import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HelpdeskService {
  private databaseKey: any = environment.serverUrl;

  constructor(private httpclient: HttpClient) {}

  getDepertmentdata() {
    return this.httpclient.get(
      `${this.databaseKey}/api/v1/get_Department_Help_Desk`
    );
  }

  getUniquecategoryCode() {
    return this.httpclient.get(`${this.databaseKey}/api/v1/category_code`);
  }

  saveDataTicketcategoryMaster(data: any) {
    return this.httpclient.post(
      `${this.databaseKey}/api/v1/create_ticket_category`,
      data
    );
  }

  getAllticketcategorydata() {
    return this.httpclient.get(
      `${this.databaseKey}/api/v1/all_category_master_data`
    );
  }

  TikcetcategorystatusUpdated(id: any, body: any) {
    return this.httpclient
      .put<any>(`${this.databaseKey}/api/v1/CHECKLISTStatus/${id}`, body)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  deleteTheTicketCategory(id: any) {
    return this.httpclient
      .delete<any>(`${this.databaseKey}/api/v1/deletedTikcetCategorydata/${id}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getTheSingleDatabasedOnid(id: any) {
    return this.httpclient.get(
      `${this.databaseKey}/api/v1/get_single_user_ticketcategory/${id}`
    );
  }

  TicketCategoryUpdate(id: any, body: any) {
    return this.httpclient
      .put<any>(`${this.databaseKey}/api/v1/updateTicketCategory/${id}`, body)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  /////////////////////////////
  createTicket(data: any) {
    return this.httpclient.post(
      `${this.databaseKey}/api/v1/create_myticket_allocatedTicket`,
      data
    );
  }

  
  getTicketList(employee_id: any) {
    return this.httpclient.get(
      `${this.databaseKey}/api/v1/ticket_list${
        employee_id ? '?employee_id=' + employee_id : ''
      }`
    );
  }


  get_allocated_ticket_LIST(employee_id: any) {
    return this.httpclient.get(
      `${this.databaseKey}/api/v1/get_allocated_ticket_LIST${
        employee_id ? '?employee_id=' + employee_id : ''
      }`
    );
  }


  getticketById(id: any) {
    return this.httpclient.get(
      `${this.databaseKey}/api/v1/getAllocateddataById/${id}`
    );
  }


  update_ticket_status(body: any) {
    return this.httpclient.post(
      `${this.databaseKey}/api/v1/update_ticket_status`,
      body
    );
  }


  updateTicket(id: any, data: any) {
    return this.httpclient.put(
      `${this.databaseKey}/api/v1/update_Record_alloacted_ticket/${id}`,
      data
    );
  }


  employeList(data: any) {
    return this.httpclient.post(
      `${this.databaseKey}/api/v1/employe-list-ticket`,
      data
    );
  }
  create_allocated_ticket(data: any) {
    return this.httpclient.post(
      `${this.databaseKey}/api/v1/create_allocated_ticket`,
      data
    );
  }

  getAlloacteddataList() {
    return this.httpclient.get(
      `${this.databaseKey}/api/v1/getallocatedListingdata`
    );
  }



  getAllTicketOpenOrclose() {
    return this.httpclient.get(
      `${this.databaseKey}/api/v1/getStatusWiseOpenOrCloseddata`
    );
  }
}
