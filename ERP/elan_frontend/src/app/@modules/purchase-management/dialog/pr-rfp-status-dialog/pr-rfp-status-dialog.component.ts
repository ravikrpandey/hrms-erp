import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';

@Component({
  selector: 'app-pr-rfp-status-dialog',
  templateUrl: './pr-rfp-status-dialog.component.html',
  styleUrls: ['./pr-rfp-status-dialog.component.scss']
})
export class PrRfpStatusDialogComponent {
  getData: any = [];
  serviceType: string;
  getdataCopy: any;
  notCreatedFlow: boolean = false;
  remarkshow: any;
  procurement_requests: any;
  createDate: any;

  constructor(
    public dialog: MatDialogRef<PrRfpStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private prService: PurchaseRequestService) {

  }

  ngOnInit(): void {
    this.getAllApproverList();
  }

  getAllApproverList() {
    let data = {
      procurementId: this.data.purchase_request_id || this.data.id,
      PR_categories: this.data.pr_category
    }
    this.prService.getByIdPR(data.procurementId, data.PR_categories).subscribe((res: any) => {
      this.getData = res.data[0];
      this.procurement_requests = res.data[0]?.PROCUREMENT_PURCHASE_REQUEST_ITEMs || res.data[0]?.PROCUREMENT_PR_REQUEST_SERVICEs;
      this.createDate = moment(new Date(this.getData.createdAt)).format('LL');
    });
  }
}
