import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HelpdeskService } from 'src/app/@shared/services/HelpDeskService/helpdesk.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  statusdata: any ; 

  constructor(private $helpdestService: HelpdeskService,
        private route: Router
  ) {}

  ngOnInit() {
    this.getDashBoardStatusWiseData(); 
  }

  getDashBoardStatusWiseData() {
    this.$helpdestService.getAllTicketOpenOrclose().subscribe((res: any) => {
      this.statusdata = res.data; 
      console.log(   this.statusdata,"   this.statusdata")
    });
  }

  OpenOrClose(){
    this.route.navigate(['/master/ticket-management/ticket-list'])
  }

    AllocatedTo(){
      this.route.navigate(['/master/ticket-management/allocated-ticket'])
    }

}
