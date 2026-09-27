import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { PreviewQuotationComponent } from 'src/app/@modules/crm/pages/proposal/preview-quotation/preview-quotation.component';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-customer-sb-action',
  templateUrl: './customer-sb-action.component.html',
  styleUrls: ['./customer-sb-action.component.scss']
})
export class CustomerSbActionComponent {
  assignAction: any;
  singleData: any = {};
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private _rbackService: RbacMasterService,
    private proposal: ProposalService,
    private toast: ToastrService

  ) {
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService?.accessAssignAction();
  }

  // Ag grid start
  public cellValue: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.singleData = params.data;
    console.log("++++", this.singleData)
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data.employee_id;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  // Ag grid end
  viewProposalVersion(): void {

    const data: any = {
      version_id: this.singleData?.versionId || null,
      proposal_id: this.singleData?.quotationId || null,
      pageMode: ''
    };

    if (this.singleData?.trackingType === 'quotation') {
      data.proposal_id = this.singleData?.quotationId
      data.version_id = this.singleData?.versionId;
      data.pageMode = 'quotation';

    } else if (this.singleData?.trackingType === 'pi') {
      data.proposal_id = this.singleData?.quotationId

      data.id = this.singleData?.versionId;
      data.pageMode = 'pi';

    } else if (this.singleData?.trackingType === 'sales_booking') {
      data.proposal_id = this.singleData?.quotationId

      data.id = this.singleData?.versionId;
      data.pageMode = 'sales_booking';

    } else {

      this.toast.error('Invalid tracking type');
      return;
    }
    data.viewSource = 'customer_pannel'
    const dialogRef = this.dialog.open(
      PreviewQuotationComponent,
      {
        position: {
          top: '0px'
        },
        width: '2000px',
        disableClose: true,
        data: {
          data
        }
      }
    );

    dialogRef.afterClosed().subscribe({
      next: (res: any) => {

        if (res?.confirmed) {
          // Your logic here
        }

      },

      error: (err: any) => {

        this.toast.error(
          err?.error?.message ||
          'Something went Wrong'
        );

      }
    });
  }
  viewProposalVersion22() {
    let pageMode = this.singleData?.actionStatus;
    let tab = this.singleData?.pending_list;
    if (tab === 'pending') {
      pageMode = 'approved';
    }
    this.route.navigate(["master/sales/create-proposal"], { queryParams: { proposalId: this.singleData?.proposal_id, actionType: 'view', version_id: this.singleData.version_id, pageMode: pageMode, pi: true } })

  }


  downloadPDF(e: Event) {
    // pi
    this.proposal.download_qoutationProforma_pdf(this.singleData?.quotationId, this.singleData?.versionId, "quotation").subscribe(
      (res: any) => {
        const blob = new Blob([res], { type: 'application/pdf' });
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = `Quotation_${this.singleData.proposalNo}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      (err: any) => {
        console.log(err);
        if (err.status == 400) {
        }
      }
    );
  }
}
