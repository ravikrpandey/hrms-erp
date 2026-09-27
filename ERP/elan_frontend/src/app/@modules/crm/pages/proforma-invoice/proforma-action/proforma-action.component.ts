import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';
// import { EntityMasterService } from '../../../@shared/services/entity-master/entity-master.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { ViewProposalVersionDialogComponent } from '../../proposal/dialogs/view-proposal-version-dialog/view-proposal-version-dialog.component';
import { ProposalStatusDialogComponent } from '../../proposal/dialogs/proposal-status-dialog/proposal-status-dialog.component';

@Component({
  selector: 'app-proforma-action',
  templateUrl: './proforma-action.component.html',
  styleUrls: ['./proforma-action.component.scss']
})
export class ProformaActionComponent {
  assignAction: any;
  singleData: any = {};
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private _rbackService: RbacMasterService,
    private $proposal: ProposalService,
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
  viewProposalVersion() {
    this.singleData.id= this.singleData.proposal_id;
    const dialogRef = this.dialog.open(ViewProposalVersionDialogComponent, {
      width: '90%',
      data: { id: this.singleData,piVersion:true },
    });
    dialogRef.afterClosed().subscribe((result: any) => {

    });
  }
  viewProposalVersion22() {
    let pageMode = this.singleData?.actionStatus;
    let tab =  this.singleData?.pending_list;
    if(tab==='pending'){
      pageMode='approved';
    }
    this.route.navigate(["master/sales/create-proposal"], { queryParams: { proposalId: this.singleData?.proposal_id, actionType: 'view', version_id:this.singleData.version_id, pageMode:pageMode ,pi:true} })
    
  }
  
    
      statusCellClicked() {
        this.singleData.id = this.singleData.proposal_id;
         const dialogRef = this.dialog.open(ProposalStatusDialogComponent, { width: '800px', data: this.singleData });
         dialogRef.afterClosed().subscribe(result => {

         })
       }
    

  editProposal() {
    let pageMode = this.singleData?.actionStatus;
    let tab =  this.singleData?.pending_list;
    if(tab==='pending'){
      pageMode='approved';
    }
    this.route.navigate(["master/sales/create-proposal"], { queryParams: { proposalId: this.singleData?.proposal_id, actionType: 'edit', version_id:this.singleData.version_id, pageMode:pageMode , pi:true} })
    // this.route.navigate(["master/sales/create-proposal"], { queryParams: { proposalId: this.singleData?.id, actionType: 'edit', version_id: this.singleData.version_id } })
  }
  
  sendProposal(data: any) {

    console.log(this.singleData, "this.singleData");
    if (
      this.singleData?.customer_type_id === null ||
      this.singleData?.customer_category_id === null
    ) {
      // this.toast.warning("Customer not yet approved. You can't process for PI.");
      this.route.navigate(['/master/sales/customer-details/profile'], {
        queryParams: {
          id: this.singleData?.customer_id,
          action_type: 'edit',
          new_customer: 'NO',
          // lead_id: this.lead_id,
          status: 'Pending',
          type: 'New',
        },
      });
      

      return;
    }
    let frmData = {
      booking_status: "APPRVOED"
    }
    this.$proposal.updateProposalVersionBooking(this.singleData?.version_id, this.singleData?.proposal_id).subscribe({
      next: (res: any) => {
        this.toast.success(res.message);
        this.reloadCurrentRoute()

        // this.route.navigate([" master/sales/sales-booking/all-list"])
      }, error: (err) => {
        console.log(err)
        this.toast.error(err.error.message);

      },
    })
  }
}
