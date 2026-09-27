import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ContractNotificationService {
  
  constructor(private router: Router) { }

  contractsNotificationActions(notification:any){
    debugger
    console.log(notification)
    const reportId = notification.message.split('#').slice(-1)[0].trim();
    const enquiryType = reportId.includes('EX') ? 'external' : 'internal'
    let requestId:number = 0;
    if(enquiryType=='internal'){
      requestId = parseInt(reportId.slice(-6))
    }
    switch (notification.notification_type) {
      case 'INTERNAL_CC_ACTION':
        if(notification.message.includes("request id #")){
          requestId= notification.message.split('#').slice(-1)[0].trim();
        }
      
    }
  }
   

}
