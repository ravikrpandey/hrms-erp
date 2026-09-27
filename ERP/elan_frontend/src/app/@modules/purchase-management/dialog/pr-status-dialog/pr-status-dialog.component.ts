import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pr-status-dialog',
  templateUrl: './pr-status-dialog.component.html',
  styleUrls: ['./pr-status-dialog.component.scss'],
})
export class PrStatusDialogComponent {
  getData: any = [];
  serviceType: string;
  getdataCopy: any;
  notCreatedFlow: boolean = false;
  remarkshow: any;

  constructor(
    public dialog: MatDialogRef<PrStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private prService: PurchaseRequestService,
  ) {}

  ngOnInit(): void {
    this.approveLeavel();
  }

  approveLeavel() {
    let data = {
      dep_id: this.data?.department_id,
      workflow_type: 'Purchase',
    };
    if (this.data.type !== 'po') {
      this.prService.levelsShowPR(this.data?.id, data).subscribe(
        (res: any) => {
          this.getdataCopy = res.data;
        },
        (err: any) => {
          if (err.status == 400) {
            this.notCreatedFlow = true;
          }
        },
      );
    } else {
      this.prService.getLevelPo(this.data?.PO_id, data).subscribe(
        (res: any) => {
          this.getdataCopy = res.data;
        },
        (err: any) => {
          if (err.status == 400) {
            this.notCreatedFlow = true;
          }
        },
      );
    }
  }

  view(e: any) {
    this.remarkshow = e.remark || 'No Remark Available';
  }
}
