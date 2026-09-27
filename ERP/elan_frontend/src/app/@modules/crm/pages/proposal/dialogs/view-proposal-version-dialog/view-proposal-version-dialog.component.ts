import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { environment } from 'src/app/environments/environment';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AssignUserService } from 'src/app/@shared/services/crm/assign-user.service';
import { ToastrService } from 'ngx-toastr';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ScheduleProposalVersionComponent } from '../schedule-proposal-version/schedule-proposal-version.component';
import { SendEmailComponent } from 'src/app/@modules/sales/production-list/send-email/send-email.component';
// import { RecruitService } from 'src/app/@service/recruitment.service';
@Component({
  selector: 'app-view-proposal-version-dialog',
  templateUrl: './view-proposal-version-dialog.component.html',
  styleUrls: ['./view-proposal-version-dialog.component.scss'],
})
export class ViewProposalVersionDialogComponent {
  userLoginId: any;
  rowData: any = [];
  singleData: any;

  constructor(
    private router: Router,
    private $proposal: ProposalService,
    private toast: ToastrService,
    private matDialog: MatDialog,
    public dialog: MatDialogRef<ViewProposalVersionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.singleData = data?.id;
    console.log(data, this.singleData);
  }

  ngOnInit(): void {
    this.userLoginId = localStorage.getItem('EmpMainId');
    if (this.userLoginId) {
      this.getProposalList();
    }
  }

  // Get version list start
  getProposalList() {
    try {
      let status:any;
      if(this.data?.isSalesBooking){

        status= 'sales booking';
      }else if (this.data?.piVersion){
        status=true
      }
      
      this.$proposal.proposalVersionList(this.singleData?.id, status).subscribe(
        (response: any) => {
          if (response) {
            this.rowData = response.data;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  // GGet version list end

  // View proposal start
  viewProposal(data: any) {
    this.dialog.close();
    this.router.navigate(['master/sales/create-proposal'], {
      queryParams: {
        version_id: data?.id,
        proposalId: data?.proposal_id,
        proposal_list_id: data?.proposal_list_id,
        actionType: 'view',
      },
    });
  }
  sendProposal(data: any) {
    let frmData = {
      is_so_created: true,
    };
    this.$proposal.updateProposalVersion(data.id, frmData).subscribe({
      next: (res: any) => {
        this.toast.success(res.message);
        this.dialog.close();
      },
      error: (err) => {
        console.log(err);
        this.toast.error(err.error.message);
        this.dialog.close();
      },
    });
  }

  sendPermonceInvoice(data: any) {
    // if(data?.customer_profile_status === "Pending"){
    // if (
    //   data?.customer_type_id === null ||
    //   data?.customer_category_id === null
    // ) {
    //   // this.toast.warning("Customer not yet approved. You can't process for PI.");
    //   this.router.navigate(['/master/sales/customer-details/profile'], {
    //     queryParams: {
    //       id: this.rowData[0]?.customer_id,
    //       action_type: 'edit',
    //       new_customer: 'NO',
    //       // lead_id: this.lead_id,
    //       status: 'Pending',
    //       type: 'New',
    //     },
    //   });
    //   this.dialog.close();

    //   return;
    // }
    this.router.navigate(['master/sales/create-proposal'], {
      queryParams: {
        proposalId: this.singleData?.id,
        actionType: 'edit',
        version_id: this.singleData.version_id,
        status: 'performance',
      },
    });
    this.dialog.close();
  }

  cloneProposal(data: any) {
    this.dialog.close();
    this.router.navigate(['master/sales/create-proposal'], {
      queryParams: {
        version_id: data?.id,
        proposalId: data?.proposal_id,
        proposal_list_id: data?.proposal_list_id,
        actionType: 'view',
        status: 'clone',
      },
    });
  }

  open(data: any) {
    let dialogRef = this.matDialog.open(ScheduleProposalVersionComponent, {
      data: data,
      width: '800px',
      height: '400px',
    });
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        this.dialog.close();
      },
      error: (err) => {
        this.toast.error(err.error.message);
        this.dialog.close();
      },
    });
  }

  downloadPDF(data: any) {
    console.log(data);

    this.$proposal
      .download_qoutationProforma_pdf(
        data.proposal_id,
        data.id,
        this.singleData.pi_status ? 'pi' : 'quotation'
      )
      .subscribe(
        (res: any) => {
          // Check if the response is a Blob (PDF)
          const blob = new Blob([res], { type: 'application/pdf' });

          // Create a temporary link element to trigger the download
          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;

          // Set the file name with PO_id or any other suitable name
          const filename = `${
            this.singleData.pi_status ? 'ProformaInvoice_' : 'Quotation_'
          }${
            this.singleData.pi_status
              ? this.singleData.pi_number
              : this.singleData.proposal_no
          }.pdf`;
          link.download = filename;

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

  ////////////////////////////////////////////////////
  ///////////////////////
  //////////////////here code for send mail option
  ///////////
  emailSend() {
    const dialogRef = this.matDialog.open(SendEmailComponent, {
      width: '40%',
      height: '70%',
      position: { bottom: '10px', right: '10px' },
      panelClass: 'full-screen-modal',
      data: { id: this.singleData },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result, 'this is ');
      if (result) {
        result?.formData.forEach((value: any, key: any) => {
          console.log(`${key}:`, value);
        });
        // const payload = {
        //   mailObject: result.mailObject,
        //   proposal_id:this.singleData.id,
        //   version_id:this.singleData.version_id,
        // }
        // this.$common.showLoader();
        if (result.formData) {
          result.formData.append('proposal_id', this.singleData.id);
          result.formData.append('version_id', this.singleData.version_id);
          this.$proposal.pdfQuotationVersionMail(result.formData).subscribe(
            (res: any) => {
              console.log(res, 'tis is tesa redess');
              if (res) {
                this.toast.success(res.message);
                // this.$common.hideLoader();
              }
            },
            (error) => {
              console.error('Error occurred:', error);
              this.toast.error('An error occurred while sending the mail.');
              // this.$common.hideLoader();
            }
          );
        }
      }
    });
  }
}
