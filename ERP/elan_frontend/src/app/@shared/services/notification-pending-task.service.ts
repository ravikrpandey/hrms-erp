import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationPendingTaskService {

  notifications: any=false;
  constructor() {
    
  }
  // addNotification(message: string): void {
  //   this.notifications.push(message);
  // }
  dummayForCheck:any=[
    {br_number:'br123',associated_company:'DQS',training_start_date:'20-03-2022',training_end_date:'20-04-2023'},
    {br_number:'br444',associated_company:'SSSP',training_start_date:'20-03-2018',training_end_date:'20-04-2019'},
    {br_number:'br555',associated_company:'Mahendra Tech',training_start_date:'20-03-2017',training_end_date:'20-04-2018'},
    {br_number:'br777',associated_company:'HCL',training_start_date:'20-03-2022',training_end_date:'20-04-2024'},
    {br_number:'br888',associated_company:'TCS',training_start_date:'20-03-2011',training_end_date:'20-04-2013'},
  ]
  dummayForCheck2:any=[
    {br_number:'br2nd',associated_company:'DQS2nd',training_start_date:'20-03-2022',training_end_date:'20-04-2023'},
    {br_number:'br4nd',associated_company:'SSSP2nd',training_start_date:'20-03-2018',training_end_date:'20-04-2019'},
    {br_number:'br5nd',associated_company:'Mahendra Tech2nd',training_start_date:'20-03-2017',training_end_date:'20-04-2018'},
    {br_number:'br7nd',associated_company:'HCL2nd',training_start_date:'20-03-2022',training_end_date:'20-04-2024'},
    {br_number:'br8nd',associated_company:'TCS2nd',training_start_date:'20-03-2011',training_end_date:'20-04-2013'},
    {br_number:'br4nd',associated_company:'SSSP2nd',training_start_date:'20-03-2018',training_end_date:'20-04-2019'},
    {br_number:'br5nd',associated_company:'Mahendra Tech2nd',training_start_date:'20-03-2017',training_end_date:'20-04-2018'},
    {br_number:'br7nd',associated_company:'HCL2nd',training_start_date:'20-03-2022',training_end_date:'20-04-2024'},
    {br_number:'br8nd',associated_company:'TCS2nd',training_start_date:'20-03-2011',training_end_date:'20-04-2013'},
  ]

}
