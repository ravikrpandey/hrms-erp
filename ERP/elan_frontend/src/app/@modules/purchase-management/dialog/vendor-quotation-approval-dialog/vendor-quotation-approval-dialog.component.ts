import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-quotation-approval-dialog',
  templateUrl: './vendor-quotation-approval-dialog.component.html',
  styleUrls: ['./vendor-quotation-approval-dialog.component.scss'],
})
export class VendorQuotationApprovalDialogComponent {
  getdataCopy: any;
  notCreatedFlow: boolean;
  ans: any = [];

  constructor(
    private prService: PurchaseRequestService,
    public dialog: MatDialogRef<VendorQuotationApprovalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route: Router,
    private toast: ToastrService,
  ) {}

  ngOnInit(): void {
    this.getLevelApprovel();
  }

  getNthRepeatingSet = (data: any, n: any) => {
    let levelOccurrences: any = []; // To track the levels in sequence
    let levelCount: any = {}; // To track how many times each level occurs
    let repeatingSets: any = []; // To store all repeating sets' indexes

    // Step 1: Track the occurrences of each level in sequence
    for (let i = 0; i < data.length; i++) {
      const level = data[i].level;
      if (!levelCount[level]) {
        levelCount[level] = 1;
        levelOccurrences.push(level);
      } else {
        levelCount[level]++;
      }
    }

    // Step 2: Identify all repeating sets based on levels
    let levelSetLength = levelOccurrences.length;
    let repeatingSet = [];

    // Step 3: Loop through the data and collect repeating sets
    for (let i = data.length - 1; i >= 0; i--) {
      const level = data[i].level;
      if (repeatingSet.length < levelSetLength) {
        repeatingSet.push(i);
        levelCount[level]--;
      }

      if (repeatingSet.length === levelSetLength) {
        // Store the repeating set (reverse to maintain the correct order)
        repeatingSets.unshift(repeatingSet.reverse());
        repeatingSet = []; // Reset for the next potential set
      }
    }

    // Step 4: Return the nth repeating set, if it exists
    return repeatingSets[n - 1] || []; // Return an empty array if the nth set does not exist
  };

  getLevelApprovel() {
    const data = {
      dep_id: this.data?.department_id,
      workflow_type: this.data.approval_for,
      approval_for: this.data?.approval_for,
    };
    this.prService
      .getLevelApprovel(
        this.data?.id || this.data?.pr_id || this.data?.purchase_request_id,
        data,
      )
      .subscribe((res: any) => {
        this.getdataCopy = res.data;
        if (this.data?.approval_for == 'ReNegotiation') {
          let x = this.getNthRepeatingSet(this.getdataCopy, this.data?.index);
          for (let i = 0; i < x.length; i++) {
            this.ans[i] = this.getdataCopy[x[i]];
          }
          this.getdataCopy = this.ans;
        }
      });
  }

  closeDialog() {
    this.dialog.close();
  }
}
