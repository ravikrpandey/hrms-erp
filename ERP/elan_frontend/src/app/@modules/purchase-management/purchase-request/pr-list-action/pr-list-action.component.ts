import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ModuleAction } from 'src/app/@shared/interface/core.interface';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-pr-list-action',
  templateUrl: './pr-list-action.component.html',
  styleUrls: ['./pr-list-action.component.scss'],
})
export class PrListActionComponent implements AfterViewInit {
  public cellValue: any;
  assignAction: ModuleAction;
  idPr: any;
  paramsData: any;
  serviceType: string;
  getdataCopy: any;
  approvedCondi: boolean = false;
  tab: string;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private _rbackService: RbacMasterService,
    private prService: PurchaseRequestService,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe((params: any) => {
      this.tab = params['tab'];
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 200);
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.idPr = params?.data?.id;
    this.paramsData = params?.data;
    // this.approveLeavel()
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  onCellClicked(e: any) {
    e.stopPropagation();
    let flag = 0;
    if (
      this.cellValue.final_status == 'APPROVED' ||
      this.cellValue.final_status == 'REJECTED'
    ) {
      flag = 1;
    }
    this.router.navigate(
      ['master/purchase-management/purchase-request/create-pr'],
      {
        queryParams: {
          id: this.idPr,
          type: 'View',
          status: this.cellValue?.pr_category,
          flag: flag,
        },
      },
    );
  }

  edit(e: any) {
    e.stopPropagation();
    this.router.navigate(
      ['master/purchase-management/purchase-request/create-pr'],
      {
        queryParams: {
          id: this.idPr,
          type: 'Edit',
          status: this.cellValue?.pr_category,
        },
      },
    );
  }

  approveLeavel() {
    if (this.paramsData?.pr_category == 'Item') {
      this.serviceType = 'Item';
    }

    let data = {
      dep_id: this.paramsData?.department_id,
      workflow_type: this.serviceType,
    };
    this.prService
      .levelsShowPR(this.paramsData?.id, data)
      .subscribe((res: any) => {
        this.getdataCopy = res.data;
        const isApproved = res.data.some(
          (item: any) =>
            item.status === 'APPROVED' || item.status === 'REJECTED',
        );
        this.approvedCondi = isApproved;
      });
  }

  proceedToApp(e: any) {
    e.stopPropagation();
    this.router.navigate(
      ['master/purchase-management/purchase-request/create-pr'],
      {
        queryParams: {
          id: this.paramsData.id,
          status: this.cellValue.data?.pr_category,
          type: 'Approval',
        },
      },
    );
  }

  downloadPDF(e: Event) {
    e.stopPropagation();
    this.prService.downloadPRById(this.paramsData.id).subscribe(
      (res: any) => {
        const blob = new Blob([res], { type: 'application/pdf' });
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = `PR_${this.paramsData.pr_number}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      (err: any) => {
        console.log(err);
        if (err.status == 400) {
        }
      },
    );
  }
}
