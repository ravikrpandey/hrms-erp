import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FnfserviceServiceTsService } from 'src/app/@shared/services/fnfservice.service.ts.service';


@Component({
  selector: 'app-summary-approval',
  templateUrl: './summary-approval.component.html',
  styleUrls: ['./summary-approval.component.scss']
})
export class SummaryApprovalComponent {
  summaryForm: FormGroup;
  employee_id: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activeroute: ActivatedRoute,
    private toaster: ToastrService,
    private fnfService: FnfserviceServiceTsService
  ) { }

  ngOnInit(): void {

    this.activeroute.queryParamMap.subscribe(params => {
  this.employee_id = params.get('employee_id') || '';
  if (this.employee_id) {
    this.getSummaryDataById(this.employee_id);
  }
});
    this.summaryForm = this.fb.group({
      total_earnings: [''],
      total_deductions: [''],
      net_fnf_payable: [''],
      tax_deductions: [''],
      final_amount_payable: [''],
      hr_approval: ['', Validators.required],
      finance_approval: ['', Validators.required],
      date_of_approval: ['', Validators.required],
      timestamp_log: [''],
      comments: ['']
    });

   
  }

  getSummaryDataById(employee_id: string) {
  this.fnfService.getFnfFullDataById(employee_id).subscribe({
    next: (res: any) => {
      const data = res?.data?.summary_details
      console.log("-------------------------log data",data )
      if (data) {
        this.summaryForm.patchValue({
          total_earnings: data.total_earnings ?? '',
          total_deductions: data.total_deductions ?? '',
          net_fnf_payable: data.net_fnf_payable ?? '',
          tax_deductions: data.tds_tax_deductions ?? '',            
          final_amount_payable: data.final_amount_payable ?? '',
          hr_approval: data.hr_approval ?? '',
          finance_approval: data.finance_approval ?? '',
          date_of_approval: data.hr_approval_date ?? data.date_of_approval ?? '',
          timestamp_log: data.audit_log ?? '',
          comments: data.comments ?? ''
        });
      } else {
        this.toaster.warning('No summary data found.');
      }
    },
    error: () => this.toaster.error('Error fetching summary data')
  });
}


  handleSubmit() {
    if (this.summaryForm.invalid) {
      this.toaster.warning('Please fill all required fields');
      return;
    }

    const payload = {
      employee_id: this.employee_id,
      summary_details: this.summaryForm.value
    };

    this.fnfService.updateFnfFullData(this.employee_id,payload).subscribe({
      next: (res: any) => {
        this.toaster.success('Summary Details Saved');
        this.router.navigate(['/master/ess/fnf-settlement/common/documantation-payment'], {
          queryParams: { employee_id: this.employee_id }
        });
      },
      error: () => {
        this.toaster.error('Error saving summary details');
      }
    });
  }
}
