import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ViewProposalVersionDialogComponent } from '../../dialogs/view-proposal-version-dialog/view-proposal-version-dialog.component';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { environment } from 'src/app/environments/environment';
@Component({
  selector: 'app-action-view-proposal-version',
  templateUrl: './action-view-proposal-version.component.html',
  styleUrls: ['./action-view-proposal-version.component.scss'],
})
export class ActionViewProposalVersionComponent implements OnInit {
  assignAction: any;
  singleData: any = {};
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private _rbackService: RbacMasterService,
    private proposal: ProposalService
  ) {}

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
    console.log("++++",this.singleData)
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted
      ? params.valueFormatted
      : params.data.employee_id;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  // Ag grid end

  viewProposalVersion() {
    const dialogRef = this.dialog.open(ViewProposalVersionDialogComponent, {
      width: '90%',
      data: { id: this.singleData },
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  editProposal() {
    let pageMode = this.singleData?.actionStatus;
    let tab = this.singleData?.pending_list;
    if (tab === 'pending') {
      pageMode = 'approved';
    }
    this.route.navigate(['master/sales/create-proposal'], {
      queryParams: {
        proposalId: this.singleData?.id,
        actionType: 'edit',
        version_id: this.singleData.version_id,
        pageMode: pageMode,
      },
    });
  }

  
  downloadPDF(e: Event) {
    // pi
    this.proposal.download_qoutationProforma_pdf(this.singleData.id, this.singleData.version_id, "quotation").subscribe(
      (res: any) => {
        // Check if the response is a Blob (PDF)
        const blob = new Blob([res], { type: 'application/pdf' });

        // Create a temporary link element to trigger the download
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;

        // Set the file name with PO_id or any other suitable name
        link.download = `Quotation_${this.singleData.proposal_no}.pdf`;

        // Append the link to the document and trigger a click event to download the file
        link.click();

        // Clean up the object URL after triggering the download
        window.URL.revokeObjectURL(url);
      },
      (err: any) => {
        console.log(err);
        // this._toaster.error('Something Went To Wrong');
        if (err.status == 400) {
        }
      }
    );
  }
}