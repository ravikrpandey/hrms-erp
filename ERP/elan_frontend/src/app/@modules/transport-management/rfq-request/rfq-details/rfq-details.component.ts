import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';

@Component({
  selector: 'app-rfq-details',
  templateUrl: './rfq-details.component.html',
  styleUrls: ['./rfq-details.component.scss']
})
export class RfqDetailsComponent {
  planningList: any = [];

  constructor(public dialog: MatDialogRef<RfqDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
     private transport_service: TransportManagementService
    ) {
    
  }

  ngOnInit(): void {
    this.allDataDetails();
  }

  allDataDetails() {
    this.transport_service.getPlanningByTransporterForRFQ(this.data.id,this.data.pt_id).subscribe((res:any)=>{
      this.planningList=res.data
    },
    ((err:any)=>{
      this.planningList=[];
    })
    )
  }

  closePopup() {
    this.dialog.close();
  }

  getTotalCharges(): number {
    return (this.planningList?.charges || []).reduce(
      (sum: number, item: any) => sum + Number(item.amount || 0),
      0
    );
  }

}