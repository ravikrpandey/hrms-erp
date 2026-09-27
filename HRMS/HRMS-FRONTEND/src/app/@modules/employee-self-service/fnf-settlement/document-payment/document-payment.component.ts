import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FnfserviceServiceTsService } from 'src/app/@shared/services/fnfservice.service.ts.service';
;

@Component({
  selector: 'app-document-payment',
  templateUrl: './document-payment.component.html',
  styleUrls: ['./document-payment.component.scss']
})
export class DocumentPaymentComponent implements OnInit {

  documentForm: FormGroup;
  employee_id: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private fnfservice: FnfserviceServiceTsService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.documentForm = this.fb.group({
      final_payment_status: ['', Validators.required],
      payment_date: [''],
      payment_method: [''],
      remark: [''],
      transaction_id: ['']
    });

    this.employee_id = this.route.snapshot.queryParamMap.get('employee_id') || '';
    if (this.employee_id) {
      this.loadDocumentDetails(this.employee_id);
    }
  }

  loadDocumentDetails(employee_id: string) {
    this.fnfservice.getFnfFullDataById(employee_id).subscribe({
      next: (res: any) => {
        const docDetails = res?.data?.document_details;
        console.log("this.", docDetails)
        if (docDetails) {
          this.documentForm.patchValue({
            final_payment_status: docDetails.payment_status || '',
            payment_date: docDetails.payment_date || '',
            payment_method: docDetails.payment_method || '',
            remark: docDetails.remark || '',
            transaction_id: docDetails.transaction_id || ''
          });
        } else {
          this.toastr.info('No document/payment data found.');
        }
      },
      error: (err) => {
        console.error('Error loading document details:', err);
        this.toastr.error('Failed to load data.');
      }
    });
  }

  handleSubmit() {
    debugger
    if (this.documentForm.valid) {
      const payload = {
        employee_details: {
          employee_id: parseInt(this.employee_id)
        },
        document_details: this.documentForm.value
      };

      this.fnfservice.updateFnfFullData(this.employee_id, payload).subscribe({
        next: (res: any) => {
          this.toastr.success('Document & Payment details saved successfully');

        },
        error: (err) => {
          console.error('Error submitting document/payment data:', err);
          this.toastr.error(err?.error?.message || 'Submission failed');
        }
      });
    } else {
      this.toastr.warning('Please fill all required fields.');
    }
  }

  cancel() {
    this.router.navigate(['/master/ess/fnf-settlement']);
  }

  downloadFnf() {
    if (!this.employee_id) {
      this.toastr.warning('Employee ID not found.');
      return;
    }
    this.toastr.info('FNF Statement download started...');
    this.router.navigate(
      ['/master/ess/fnf-settlement/downlord'],
      { queryParams: { employee_id: this.employee_id } }
    );
  }


  emailForm = {
    to: '',
    subject: '',
  };

  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      this.toastr.error('Please upload a valid PDF file');
    }
  }

  sendFnfEmail() {
    if (!this.emailForm.to || !this.emailForm.subject) {
      this.toastr.warning('Please fill in all fields.');
      return;
    }

    if (!this.selectedFile) {
      this.toastr.error('Please select a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('to', this.emailForm.to);
    formData.append('sub', this.emailForm.subject); // ✅ correct key
    formData.append('html', 'FNF statement attached'); // ✅ required dummy HTML
    formData.append('pdf', this.selectedFile); // ✅ file key


    this.fnfservice.sendFnfEmail(formData).subscribe(
      (res) => {
        this.toastr.success('Email sent successfully!');
        this.closeEmailModal();
        this.emailForm = { to: '', subject: '' };
        this.selectedFile = null;
      },
      (err) => {
        console.error('Send email error:', err);
        this.toastr.error('Failed to send email.');
      }
    );
  }

  showEmailModal = false;

  openSendEmailModal() {
    this.showEmailModal = true;
  }
  closeEmailModal() {
    this.showEmailModal = false;
  }
}
