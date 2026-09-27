import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';

/**
 * ================================================================
 * Component Name : DashTravelJourneyComponent
 * File Name      : app-dash-travel-journey.ts
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
  selector: 'app-dash-travel-journey',
  templateUrl: './dash-travel-journey.component.html',
  styleUrls: ['./dash-travel-journey.component.scss'],
})
export class DashTravelJourneyComponent implements OnInit {
  entity_id: string;
  financialId: string;
  mainId: string;

  constructor(
    private dialog: MatDialogRef<DashTravelJourneyComponent>,
    public travelService: TravelRequestService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mainId = localStorage.getItem('EmpMainId')!;
    this.entity_id = localStorage.getItem('selectedEntityId')!;
    this.financialId = localStorage.getItem('financial_id')!;
  }

  ngOnInit(): void {
  }

  onClose(): () => void {
    return () => this.dialog.close(false);
  }

  onDialogClose(event: boolean): void {
    this.dialog.close(event);
  }
}
