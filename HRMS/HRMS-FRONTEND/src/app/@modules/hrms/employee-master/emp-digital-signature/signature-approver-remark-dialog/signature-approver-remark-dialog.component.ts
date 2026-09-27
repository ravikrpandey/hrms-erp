import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signature-approver-remark-dialog',
  templateUrl: './signature-approver-remark-dialog.component.html',
  styleUrls: ['./signature-approver-remark-dialog.component.scss']
})
export class SignatureApproverRemarkDialogComponent {
  cellData: any;
  getData: any = [];
  serviceType: string;
  getdataCopy: any;
  notCreatedFlow: boolean=false;
  remarkshow: any;

    constructor(public dialog: MatDialogRef<SignatureApproverRemarkDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any, private toast: ToastrService,
      private _commonService : CommonService, 
      private route: Router,) {
      this.cellData = this.data;    
    }

}
