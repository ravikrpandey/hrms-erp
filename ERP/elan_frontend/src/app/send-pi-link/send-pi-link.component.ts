import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProposalService } from '../@shared/services/crm/proposal.service';
import { ToastrService } from 'ngx-toastr';
import { PreviewQuotationComponent } from '../@modules/crm/pages/proposal/preview-quotation/preview-quotation.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-send-pi-link',
  templateUrl: './send-pi-link.component.html',
  styleUrls: ['./send-pi-link.component.scss']
})
export class SendPiLinkComponent {
  // proposal:any
  entityId: any;
  financial_year_id: any;
  userLoginId: any;
  routerParams: any;
  version_id: any;
  proposalId: any;
  actionType: any;
  getData: any;
  emailCheckBtn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _router: Router,
    private $proposal: ProposalService,
    private toast: ToastrService,
    private dialog: MatDialog

  ) { }
  ngOnInit() {
    this.entityId = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.userLoginId = localStorage.getItem('EmpMainId');

    this.route.queryParams.subscribe((params: any) => {
      this.routerParams = params;
      this.proposalId = params?.proposalId;
      this.actionType = params?.actionType;
      this.version_id = params?.version_id;
      this.previewDialog()
    });
    // this.proposalVersionListById()
  }
  proposal = {
    imageUrl: 'https://elandev.elitetraveltech.in/assets/company-logo.png',
    proposalNumber: 'PROP202506253992',
    proposalType: 'Export Customer',
    companyName: 'Bajaj',
    contactNumber: '9953025970',
    mailId: 'deepakchaudhary@elitemindz.co',
    address: 'B-5/5-100, Gurgaon, Haryana, 110097, India',
    items: [
      {
        category: 'Electronics',
        subCategory: 'Mobile',
        name: 'Smartphone X',
        code: 'MOBX123',
        description: 'Flagship mobile phone',
        uom: 'Piece',
        qty: 10,
        hsn: '85171200',
        price: 25000
      },
      {
        category: 'Appliances',
        subCategory: 'Kitchen',
        name: 'Mixer Grinder',
        code: 'MXGR456',
        description: '500W Motor Mixer',
        uom: 'Unit',
        qty: 5,
        hsn: '85094010',
        price: 3500
      }
    ],
    discount: 1000,
    gst: 2700,
    totalAmount: 285000,
    grandTotal: 286700,
    paymentTerms: '50% advance, 50% on delivery',
    followUpDate: '2025-07-05'
  };

  proposalVersionListById() {
    try {

      let action_type = true;
      let proposalApprovalId = ''
      this.$proposal
        .proformaInvoiceGetBy(
          this.version_id,
          this.proposalId,
          proposalApprovalId,
          action_type
        )
        .subscribe(
          (response: any) => {
            if (response) {
              this.getData = response.data;

              if (this.getData?.email_status === "ACCEPTED" || this.getData?.email_status === "REJECTED") {
                this.emailCheckBtn = true;

              }
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


  acceptedPI() {
    Swal.fire({
      title: 'Are you sure want to Accepted The PI?',
      // text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#063178',
      confirmButtonColor: '#f44336',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        let status: any = "ACCEPTED"
        let customer_status: any = "APPROVED"
        let booking_status: any = "APPROVED"
        this.accept(status, customer_status, booking_status)
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Swal.fire(
        //   'Cancelled',
        //   'Your imaginary file is safe :)',
        //   'error'
        // )
      }
    });
  }

  accept(status: any, customer_status: any, booking_status: any) {
    let data = {
      email_status: status,
      customer_status: customer_status,
      pi_id: this.routerParams?.idPI,
      version_id: this.version_id,
      proposal_id: this.proposalId,
      booking_status: booking_status
    }
    this.$proposal.updateAcceptPI(data).subscribe((res: any) => {
      console.log(res)
      this.toast.success(`${res?.message}`)
      // this.emailCheckBtn=true;
      this.emailCheckBtn = true;
    },
      ((err: any) => {
        this.toast.error("Something Went To Wrong")
      })
    )
  }


  rejectPI() {
    Swal.fire({
      title: 'Are you sure you want to reject this PI?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f44336', // red
      cancelButtonColor: '#063178',  // blue
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        let status: any = "REJECTED"
        let customer_status: any = "REJECTED"
        let booking_status: any = "REJECTED"

        this.accept(status, customer_status, booking_status)
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Optionally handle cancel action
        Swal.fire({
          title: 'Cancelled',
          text: 'PI rejection was cancelled.',
          icon: 'info'
        });
      }
    });
  }
  previewDialog() {

    let data: any = {
      proposal_id: this.proposalId,
      version_id: this.version_id,
      pageMode: 'piLink'
    };

    // let dialogRef = this.dialog.open(PreviewQuotationComponent, {
    //   position: { top: '0px' },
    //   width: "2000px",
    //   disableClose: true,
    //   data: data
    // })
    // dialogRef.afterClosed().subscribe({
    //   next: (res: any) => {

    //   }, error: (err: any) => {
    //     this.toast.error(err?.error?.message || 'Something went Wrong');
    //   }

    // })
  }
}

