import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment-proposal',
  templateUrl: './payment-proposal.component.html',
  styleUrls: ['./payment-proposal.component.scss']
})
export class PaymentProposalComponent implements OnInit {
  @Input() isInvoiceSubmitted: any;
  @Input() grandTotal: any;
  @Output() setReceivedAmount = new EventEmitter();

  paymentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private $proposal: ProposalService,
  ) {
    this.paymentForm = this.fb.group({
      payment_mode: new FormControl(null, Validators.required),
      reference_number: new FormControl(null, Validators.required),
      bank_name: new FormControl(null, Validators.required),
      amount: new FormControl(null, Validators.required),
      remark: new FormControl(null, Validators.required),
    });
  }

  leadId: any;
  proposalId: any;

  paymentModeList: any = ["UPI", "Debit and Credit Cards", "Internet Banking"]
  paymentList: any = [];
  paymentId: any;
  actionType: any;

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.leadId = params?.id;
      this.proposalId = params?.proposalId;
      this.actionType = params?.actionType;
      if (this.proposalId && this.actionType) {
        this.getProposalPaymentList();
        this.getInvoiceList();
      }
    });
  }

  // Save payment start
  savePayment() {

    if (this.paymentForm.status === 'INVALID') {
      this.toast.error('Required fields should not be empty', 'Fields Error');
      return;
    }

    // Total received is always less then grand total start
    let grandTotal = 0;
    this.paymentList?.map((item: any) => {
      grandTotal = grandTotal + item?.amount;
    })
    grandTotal = grandTotal + Number(this.paymentForm?.value?.amount);
    if (grandTotal > this.grandTotal) {
      return this.toast.error('Please enter currect amount', 'Fields Error');
    }
    // Total received is always less then grand total end

    let data = {
      ...this.paymentForm?.value,
      proposal_id: this.proposalId,
      amount: Number(this.paymentForm?.value?.amount),
      total_received: Number(this.paymentForm?.value?.amount),
    }
    if (this.paymentId) {
      this.updatePayment(data);
    }
    else {
      this.submitPayment(data);
    }
  }

  // Submit payment
  submitPayment(data: any) {
    this.$proposal.createProposalPayment(data).subscribe((res: any) => {
      if (res) {
        this.toast.success(res.message);
        this.getProposalPaymentList();
        this.paymentForm.reset();
        this.paymentId = "";
      }
    },
      (err) => {
        this.toast.error(err?.message);
      }
    );
  }

  // Update payment
  updatePayment(data: any) {
    data.id = this.paymentId;
    this.$proposal.updateProposalPayment(data).subscribe((res: any) => {
      if (res) {
        this.toast.success(res.message);
        this.getProposalPaymentList();
        this.paymentForm.reset();
        this.paymentId = "";
      }
    },
      (err) => {
        this.toast.error(err?.message);
      }
    );
  }

  // Get payment start
  getProposalPaymentList() {
    this.$proposal.getProposalPaymentList(this.proposalId).subscribe((response: any) => {
      if (response) {
        console.log(response);
        this.paymentList = response?.data;
        let receivedAmt = 0;
        this.paymentList?.map((item: any) => {
          receivedAmt = receivedAmt + item?.amount;
        })
        this.setReceivedAmount.emit(receivedAmt);
      }
    },
      (err) => {
        this.toast.error(err?.message);
      }
    );
  }

  // Reset payment start
  resetPyament() {
    this.paymentForm.reset();
    this.paymentId = "";
  }

  // Edit payment start
  editPayment(data: any) {
    this.paymentForm.patchValue({ ...data });
    this.paymentId = data?.id;
  }

  // Delete payment start
  deletePayment(data: any) {
    Swal.fire({
      title: `Delete Payment`,
      text: "Are you sure to delete this payment ?",
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        let req = {
          proposal_id: this.proposalId,
          id: data?.id,
        }
        this.$proposal.deleteProposalPayment(req).subscribe((res: any) => {
          if (res) {
            this.toast.success(res.message);
            this.getProposalPaymentList();
            this.paymentForm.reset();
            this.paymentId = "";
          }
        },
          (err) => {
            this.toast.error(err?.message);
          }
        );
      };
    });
  }
  // Payment end

  // to restrict user from entering strings
  keyPress(event: Event | any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // Get invoice start
  invoiceList: any = [];
  getInvoiceList() {
    try {
      this.$proposal.getInvoiceList(this.proposalId).subscribe((response: any) => {
        if (response) {
          this.invoiceList = response?.data;
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes) return;
    if (changes['isInvoiceSubmitted'] && changes['isInvoiceSubmitted'].currentValue) {
      let isInvoiceSubmitted = changes['isInvoiceSubmitted'].currentValue;
      if (isInvoiceSubmitted) {
        this.getInvoiceList();
      }
    }
  }

}
