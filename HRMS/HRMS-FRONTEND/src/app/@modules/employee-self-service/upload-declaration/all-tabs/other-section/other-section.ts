import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { environment } from 'src/app/environments/environment';


interface LetOutRow {
  id?: number;
  particular: string;
  showInput: boolean;
  colspan?: number;
  value?: number;
  document?: string;
}

interface IncomeRow {
  id: number;
  particular: string;
  amount: any;
  document?: string;
}

interface DeductionRow {
  id: number;
  particular: string;
  amount: any;
  document?: string;
}

@Component({
  selector: 'app-other-section',
  templateUrl: './other-section.html',
  styleUrls: ['./other-section.scss']
})
export class OtherSection {
  employee_id: any;
  housePropertyId: number | null = null;

  baseUrl: string = environment.serverUrl;

  displayedColumns: string[] = ['sno', 'particular', 'amount'];
  displayedColumnsSelf: string[] = ['sno', 'particular', 'eligible', 'amount'];

  dataSource = [
    { particular: 'Interest on Housing Loan (Self Occupied)', amount: 0.00 },
    { particular: 'Total Income/Loss From Let Out Property', amount: 0.00 },
    {
      particular: `Total Exemption <br>
                   If (a + b) is less than -200000 <br>
                   then -200000 will be exempted else c will be exempted.`,
      amount: 0.00
    }
  ];

  dataSourceSelf = [
    { particular: 'Interest on Housing Loan (Self Occupied)', eligible: 0.00, amount: 0.00, document: '' }
  ];

  lenderName: string = '';
  lenderPan: string = '';

  letOutProperties: any[] = [];
  otherRows: IncomeRow[] = [
    { id: 1, particular: '', amount: null, document: '' },
    { id: 2, particular: '', amount: null, document: '' }
  ];
  deductionRows: DeductionRow[] = [
    { id: 1, particular: 'TCS Deducted', amount: null, document: '' },
    { id: 2, particular: 'TDS Deducted', amount: null, document: '' }
  ];

  remarks: string = '';

  private baseRows: LetOutRow[] = [
    { id: 1, particular: 'Annual Letable Value/Rent Received or Receivable', showInput: true },
    { id: 2, particular: 'Less: Municipal Taxes Paid During the Year', showInput: true },
    { id: 3, particular: 'Less: Unrealized Rent', showInput: true },
    { id: 4, particular: 'Net Annual Value (1-(2+3))', showInput: false },
    { id: 5, particular: 'Less: Deductions from Net Annual Value', showInput: false, colspan: 2 },
    { particular: 'Standard Deduction @ 30% of Net Annual Value', showInput: false, colspan: 2 },
    { particular: 'Interest on Housing Loan', showInput: true, colspan: 2 },
    { id: 6, particular: 'Income/Loss from Let Out Property', showInput: false }
  ];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private PayrollService: PayrollService,
    private $miscellaneousService: MiscellaneousService,
    private $common: CommonService
  ) {
    this.addLetOutProperty();
  }

  ngOnInit(): void {
    this.employee_id = JSON.parse(localStorage.getItem('loginUserDetails') || '{}')?.employee_id || null;
    this.getHouseProperty();
  }

  getAlphabet(index: number): string {
    return String.fromCharCode(65 + index);
  }

  addLetOutProperty() {
    const newRows = JSON.parse(JSON.stringify(this.baseRows));
    this.letOutProperties.push({
      lenderName: '',
      lenderPan: '',
      rows: newRows
    });
  }

  removeLetOutProperty(index: number) {
    this.letOutProperties.splice(index, 1);
  }

  calculateLetOutProperty(property: any) {
    const rows = property.rows;
    const annualRent = +rows[0].value || 0;
    const municipalTaxes = +rows[1].value || 0;
    const unrealizedRent = +rows[2].value || 0;

    const netAnnualValue = annualRent - (municipalTaxes + unrealizedRent);
    rows[3].value = netAnnualValue;

    const standardDeduction = netAnnualValue * 0.3;
    rows[5].value = standardDeduction;

    const interest = +rows[6].value || 0;
    const incomeLoss = netAnnualValue - standardDeduction - interest;
    rows[7].value = incomeLoss;

    this.updateTotalLetOutIncome();
  }

  updateTotalLetOutIncome() {
    let total = 0;
    this.letOutProperties.forEach(prop => {
      const lastRow = prop.rows[prop.rows.length - 1];
      total += +lastRow.value || 0;
    });

    this.dataSource[1].amount = total;
    const sopInterest = +this.dataSourceSelf[0].amount || 0;
    const exemption = (sopInterest + total) < -200000 ? -200000 : sopInterest + total;
    this.dataSource[2].amount = exemption;
    this.dataSource[0].amount = sopInterest + total;
  }

  updateSelfOccupied() {
    const element = this.dataSourceSelf[0];
    let interest = +element.amount || 0;
    if (interest > 200000) interest = 200000;
    element.amount = interest;
    element.eligible = interest;
    this.updateTotalLetOutIncome();
  }

  getHouseProperty() {
    this.PayrollService.getAllHouseProperties(this.employee_id).subscribe({
      next: (res: any) => {
        if (res.success && res.data?.length) {
          const data = res.data[0];
          this.housePropertyId = data.id;

          this.lenderName = data.self_occupied_property?.lenderName || '';
          this.lenderPan = data.self_occupied_property?.lenderPan || '';
          this.dataSourceSelf = data.self_occupied_property?.details || [];

          this.letOutProperties = (data.let_out_properties || []).map((item: any) => ({
            ...item,
            isExpanded: true
          }));

          this.dataSource = data.summary_table || [];
          this.otherRows = data.other_income || [];
          this.deductionRows = data.tcs_tds_deductions || [];
          this.remarks = data.remarks || '';

          this.toastr.info('House property data loaded successfully');
        } else {
          this.housePropertyId = null;
          this.toastr.warning('No data found for this employee');
        }
      },
      error: (err: any) => {
        console.error('API Error:', err);
        this.toastr.error('Error fetching house property data!');
      }
    });
  }

  
 uploadDocument(event: any, section: string, index?: number, rowIndex?: number) {
  const file = event.target.files[0];
  if (!file) return;

  if (!this.$common.checkForValidFile(event, false, true, false)) return;

  const formData = new FormData();
  formData.append('file', file);

  this.$miscellaneousService.documents(formData).subscribe({
    next: (res: any) => {
      if (res && res.url) {
        const fileUrl = `uploaded_files/${res.url}`;

        switch (section) {
          case 'self':
            if (this.dataSourceSelf[index!]) this.dataSourceSelf[index!].document = fileUrl;
            break;
          case 'letOut':
            if (this.letOutProperties[index!]) this.letOutProperties[index!].document = fileUrl;
            break;
          case 'letOutRow':
            if (this.letOutProperties[index!]?.rows[rowIndex!])
              this.letOutProperties[index!].rows[rowIndex!].document = fileUrl;
            break;
          case 'other':
            if (this.otherRows[index!]) this.otherRows[index!].document = fileUrl;
            break;
          case 'deduction':
            if (this.deductionRows[index!]) this.deductionRows[index!].document = fileUrl;
            break;
        }

        this.toastr.success('Document uploaded successfully!');
      }
    },
    error: (err: any) => {
      console.error(err);
      this.toastr.error('Document upload failed!');
    }
  });
}


  viewDocument(url: string) {
    if (!url) return;
    window.open(this.baseUrl + '/' + url, '_blank');
  }
  viewImage(url: any) {

    window.open(this.baseUrl + '/' + url, '_blank');
  }

 
submitAllData() {
  
  for (const item of this.dataSourceSelf) {
    if ((item.amount ?? 0) > 0 && !item.document) {
      this.toastr.warning('Please upload document for Self-Occupied property with amount > 0');
      return;
    }
  }

 
  for (const prop of this.letOutProperties) {
    
    if (prop.rows.some((r: any) => (r.value ?? 0) > 0 && !r.document)) {
      this.toastr.warning('Please upload documents for Let-Out property rows with amount > 0');
      return;
    }

   
    if ((prop.rows.reduce((sum: number, r: any) => sum + (r.value ?? 0), 0)) > 0 && !prop.document) {
      this.toastr.warning('Please upload document for Let-Out property');
      return;
    }
  }

 
  for (const row of this.otherRows) {
    if ((row.amount ?? 0) > 0 && !row.document) {
      this.toastr.warning('Please upload document for Other Income with amount > 0');
      return;
    }
  }

 
  for (const row of this.deductionRows) {
    if ((row.amount ?? 0) > 0 && !row.document) {
      this.toastr.warning('Please upload document for TCS/TDS Deduction with amount > 0');
      return;
    }
  }

  const payload = {
    id: this.housePropertyId,
    employee_id: this.employee_id,
    selfOccupiedProperty: {
      lenderName: this.lenderName,
      lenderPan: this.lenderPan,
      details: this.dataSourceSelf.map(item => ({
        particular: item.particular,
        eligible: item.eligible ?? 0,
        amount: item.amount ?? 0,
        document: item.document || null
      }))
    },
    letOutProperties: this.letOutProperties.map(prop => ({
      lenderName: prop.lenderName,
      lenderPan: prop.lenderPan,
      rows: prop.rows.map((row: any) => ({
        particular: row.particular,
        value: row.value ?? 0,
        document: row.document || null
      })),
      document: prop.document || null
    })),
    summaryTable: this.dataSource,
    otherIncome: this.otherRows.map(row => ({
      particular: row.particular,
      amount: row.amount ?? 0,
      document: row.document || null
    })),
    tcsTdsDeductions: this.deductionRows.map(row => ({
      particular: row.particular,
      amount: row.amount ?? 0,
      document: row.document || null
    })),
    remarks: this.remarks
  };

  console.log('Final JSON Payload:', payload);

  this.PayrollService.createHouseProperty(payload).subscribe({
    next: (res: any) => {
      if (res.success) {
        this.housePropertyId = res.data.id;
        this.toastr.success('Data saved successfully!');
        this.router.navigate(['/master/ess/upload-declaration/it-statement']);
      } else {
        this.toastr.warning(res.message || 'Failed to save data!');
      }
    },
    error: (err: any) => {
      console.error('API Error:', err);
      this.toastr.error('Error submitting data!');
    }
  });
}


}
