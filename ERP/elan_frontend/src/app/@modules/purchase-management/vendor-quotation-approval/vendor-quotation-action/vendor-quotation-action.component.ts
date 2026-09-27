import { AfterViewInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ModuleAction } from 'src/app/@shared/interface/core.interface';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-vendor-quotation-action',
  templateUrl: './vendor-quotation-action.component.html',
  styleUrls: ['./vendor-quotation-action.component.scss'],
})
export class VendorQuotationActionComponent implements AfterViewInit {
  assignAction: ModuleAction;
  cellData: any;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private _rbackService: RbacMasterService,
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
      console.log(this.assignAction);
    }, 200);
  }

  agInit(params: ICellRendererParams): void {
    this.cellData = params.data;
  }

  approve(e: any) {
    e.stopPropagation();
    this.router.navigate(
      ['master/purchase-management/vendor-quotation/pending-approval-update'],
      {
        queryParams: {
          pr_id: this.cellData.id,
          type: 'Approval',
          pr_category: this.cellData.pr_category,
          rfp_approval_id:
            this.cellData.rfp_approval_id || this.cellData.quotation_code,
          level: this.cellData.level,
        },
      },
    );
  }

  view(e: any) {
    e.stopPropagation();
    this.router.navigate(
      ['master/purchase-management/vendor-quotation/pending-approval-update'],
      {
        queryParams: {
          pr_id: this.cellData.id,
          type: 'View',
          pr_category: this.cellData.pr_category,
          rfp_approval_id:
            this.cellData.rfp_approval_id || this.cellData.quotation_code,
          level: this.cellData.level,
        },
      },
    );
  }
}
