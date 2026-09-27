import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';

import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-deduction-charge-create',
  templateUrl: './deduction-charge-create.html',
  styleUrls: ['./deduction-charge-create.scss']
})
export class DeductionChargeCreate {
  groupedData: { [key: string]: any[] } = {};
  sortedSections: any[] = [];
  loading: boolean = true;
  employee_id: any;
  baseUrl: string = ''; // Set environment URL if needed
  limitWarnings: { [key: string]: boolean } = {};

  constructor(
    private payrollService: PayrollService,
    private $miscellaneousService: MiscellaneousService,
    private $common: CommonService,
    private toastr: ToastrService,
    private router: Router
  ) {
     this.baseUrl = environment.serverUrl;
   }

  ngOnInit() {
    this.employee_id = JSON.parse(localStorage.getItem('loginUserDetails') || '{}')?.employee_id || null;
    this.fetchData();
    this.getAllDeductionChapter();
  }

  fetchData() {
    this.loading = true;
    this.payrollService.getAllDeclaration().subscribe({
      next: (res: any) => {
        this.groupedData = res?.data
          ? res.data.reduce((acc: any, item: any) => {
            (acc[item.section] = acc[item.section] || []).push(item);
            // Initialize document field per row
            item.document = item.document || null;
            return acc;
          }, {})
          : {};
        this.sortSections();
        this.loading = false;
      },
      error: () => {
        this.groupedData = {};
        this.sortSections();
        this.loading = false;
      }
    });
  }

  getAllDeductionChapter() {
    this.payrollService.getAllDeductionChapter(this.employee_id).subscribe({
      next: (res: any) => {
        if (res.code === 200 && res.data) {
          this.groupedData = res.data;
          this.sortedSections = Object.keys(this.groupedData).map(k => ({
            key: k,
            value: this.groupedData[k].map(item => ({
              ...item,
              document: item?.document || null
            }))
          }));
        }
      },
      error: (err) => console.error('Error fetching deduction chapters', err)
    });
  }

  sortSections() {
    const order = ['Section 80C, 80CCC, 80CCD', 'Section 80D', 'Other Section'];
    const others = Object.keys(this.groupedData).filter(k => !order.includes(k));
    this.sortedSections = [
      ...order.filter(k => this.groupedData[k]).map(k => ({ key: k, value: this.groupedData[k] })),
      ...others.map(k => ({ key: k, value: this.groupedData[k] }))
    ];
  }

  onAmountChange(sectionKey: string, changedItem: any, newValue: number) {
    const items = this.groupedData[sectionKey];
    if (!items || items.length === 0) return;

    const maxLimit = items[0]?.maxLimit || 0;
    const total = this.getSectionTotal(sectionKey);

    if (total > maxLimit) {
      const excess = total - maxLimit;
      changedItem.amount = newValue - excess;

      if (!this.limitWarnings[sectionKey]) {
        this.toastr.warning(
          `Total for "${sectionKey}" cannot exceed Max Limit of ${maxLimit}.`,
          'Warning'
        );
        this.limitWarnings[sectionKey] = true;
        setTimeout(() => this.limitWarnings[sectionKey] = false, 3000);
      }
    }
  }

  getSectionTotal(sectionKey: string): number {
    return this.groupedData[sectionKey]?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  }

  getRemainingLimit(sectionKey: string): number {
    const items = this.groupedData[sectionKey];
    const maxLimit = items?.[0]?.maxLimit || 0;
    return Math.max(maxLimit - this.getSectionTotal(sectionKey), 0);
  }

  // ------------------- DOCUMENT FUNCTIONS -------------------

  uploadDoc(event: any, item: any) {
    try {
      const isValidExtension = this.$common.checkForValidFile(event, false, true, false);
      if (!isValidExtension) return item.document = null;

      const formData = new FormData();
      if (event.target.files && event.target.files[0]) {
        formData.append('file', event.target.files[0]);
      }

      this.$miscellaneousService.documents(formData).subscribe((res: any) => {
        if (res) {
          item.document = `uploaded_files/${res?.url}`;
        }
      }, (err: any) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }

  viewDocument(url: string) {
    if (!url) return;
    window.open(this.baseUrl + '/' + url, '_blank');
  }
  viewImage(url: any) {

    window.open(this.baseUrl + '/' + url, '_blank');
  }

  // ------------------- SUBMIT -------------------

onSubmit() {
  if (!this.employee_id) {
    this.toastr.error('Employee ID not found', 'Error');
    return;
  }

  
  for (const section of this.sortedSections) {
    for (const item of section.value) {
      if ((item.amount ?? 0) > 0 && !item.document && !(item.file instanceof File)) {
        this.toastr.warning(
          `Please upload document for "${item.declaration_type || 'Unknown'}" in section "${section.key}"`,
          'Document Required'
        );
        return; 
      }
    }
  }

  
  const payloadData = this.sortedSections.map(section => ({
    section: section.key,
    items: section.value.map((item: any) => ({
      declaration_type: item.declaration_type || '',
      amount: item.amount || 0,
      age: item.age || null,
      maxLimit: item.maxLimit || 0,
      document: item.document || '',
    }))
  }));

  const formData = new FormData();
  formData.append('employee_id', this.employee_id);
  formData.append('data', JSON.stringify(payloadData));

  
  this.sortedSections.forEach((section, sIndex) => {
    section.value.forEach((item: any, i: number) => {
      if (item.file instanceof File) {
        const fieldName = `data[${section.key}][items][${i}][document]`;
        formData.append(fieldName, item.file);
      }
    });
  });

 
  this.payrollService.createDeclarations(formData).subscribe({
    next: (res: any) => {
      this.toastr.success(res.message || 'Data submitted successfully');
      this.router.navigate(['/master/ess/upload-declaration/exemptions']);
    },
    error: (err: any) => {
      const message = err?.error?.message || 'Error submitting data';
      this.toastr.error(message, 'Error');
    }
  });
}

}
