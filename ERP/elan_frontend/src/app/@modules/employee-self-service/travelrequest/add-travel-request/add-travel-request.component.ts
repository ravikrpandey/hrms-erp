import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * ================================================================
 * Component Name : AddTravelRequestComponent
 * File Name      : app-add-travel-request.ts
 * Module         : Travel & Reimbursement
 * Description    :
 *   - Component for handling Travel Requests from Dashboard.
 *
 * Developed By   : Gyan Prakash
 * Created On     : 05-Sep-2025
 * Last Modified  : 13-Sep-2025
 * Version        : 1.0.0
 * ================================================================
 */
@Component({
  selector: 'app-add-travel-request',
  templateUrl: './add-travel-request.component.html',
  styleUrls: ['./add-travel-request.component.scss']
})
export class AddTravelRequestComponent {
  Type: any;
  travereqid: any;
  location: any;

  constructor(
    public dialog: MatDialog,
    public travelService: TravelRequestService,
    private route: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((res: any) => {
      if (res.id) {
        this.travereqid = res.id;
        switch (res.Type) {
          case 'view':
            this.Type = 'view';
            break;
          case 'edit':
            this.Type = 'edit';
            break;
          case 'process-approval':
            this.Type = 'approvalprocess';
            break;
          case 'book-advance':
            this.Type = 'bookadvance';
            break;
          case 'upload':
            this.Type = 'upload';
            break;
        }
      }
    });
  }

  close() {
    if (this.location == 'adv') {
      this.route.navigate([
        '/master/finance/advance-booking/advance-booking-list',
      ]);
    } else if (this.location == 'upld') {
      this.route.navigate([
        '/master/travel-management/upload-tickets/uploaded-tickets-list',
      ]);
    } else if (this.location) {
      this.route.navigate([
        '/master/ess/approve-travel-request/travel-request-approval-list',
      ]);
    } else {
      this.route.navigate(['/master/ess/travel-request/travel-request-list']);
    }
  }
}