import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';

@Component({
  selector: 'app-dash-travel-journey',
  templateUrl: './dash-travel-journey.component.html',
  styleUrls: ['./dash-travel-journey.component.scss'],
})
export class DashTravelJourneyComponent implements OnInit {
  entity_id: string;
  financialId: string;
  mainId: string;
  travelRequests: any[] = [];

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
