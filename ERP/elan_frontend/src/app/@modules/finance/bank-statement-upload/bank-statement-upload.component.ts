import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-bank-statement-upload',
  templateUrl: './bank-statement-upload.component.html',
  styleUrls: ['./bank-statement-upload.component.scss']
})
export class BankStatementUploadComponent {
  showLoader:boolean = false;
  form:FormGroup;
  filePath:any;
  selectedFileExc:any = null;
  allowedExtensions: string[] = ['xlsx', 'csv','xls'];
  sourceList:any[];
  entity_id: any;
  bankAccount:any;
  chart_account_id:any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toaster: ToastrService,
    private finance_service:FinaceService,
    public dialog: MatDialogRef<BankStatementUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.bankAccount = data.bankAccount;
    this.chart_account_id = data.chart_account_id;
    this.form = this.fb.group({
      file: new FormControl(null,[Validators.required]),
    })
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    };

    acceptFile(event: any): void {
  const file = event.target.files[0];

  console.log('Selected File:', file); // 👈 MUST show File object

  if (file) {
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (this.allowedExtensions.includes(ext || '')) {
      this.filePath = file;  // ✅ MUST be File object
      this.selectedFileExc = null;

      this.form.patchValue({
        file: file
      });

      this.form.get('file')?.updateValueAndValidity();
    } else {
      this.filePath = null;
      this.selectedFileExc = ext;
      this.form.get('file')?.setErrors({ notAllowed: true });
    }
  }
}

    Upload(){
      
    
      if(this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }
    
      const data = {
        file:this.filePath,
        entity_id:this.entity_id,
        chart_account_id:this.chart_account_id
      };
    
      this.uploadBankStatement(data);
    }

  uploadBankStatement(data:any){
    this.showLoader = true;
    this.finance_service.uploadBankStatement(data).subscribe(
      (res)=>{
       
        this.form.reset();
        this.toaster.success(res.message);
        this.dialog.close(res);
      },(err)=>{
      
        this.toaster.error( err?.error?.message);
      }
    )
  };

  downloadSample() {
    const sampleData = [
      {
        id:'',
        refrence_no: '',
        clearence_date: '',
        amount: '',
      }
    ];
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Sample': worksheet },
      SheetNames: ['Sample']
    };
  
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
  
    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream'
    });
  
    FileSaver.saveAs(blob, 'Bank_Statement_Sample.xlsx');
  }


}
