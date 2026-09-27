import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { DepreciationService } from 'src/app/@shared/services/depreciation.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as Excel from "exceljs";
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { CommonService } from 'src/app/@shared/services/common.service';


@Component({
  selector: 'app-excel-setup-dialog',
  templateUrl: './excel-dialog.component.html',
  styleUrls: ['./excel-dialog.component.scss']
})
export class ExcelDialogComponent implements OnInit {

  fileFormSetupObj: FormGroup = new FormGroup({});
  config: any;
  loginUser: any;
  fileToUpload: any ;
  title:any;
  dropdownlist:any;
  header:any;
  fYears: any = [];
  monthList:any = [];
  depreciationType:any = [];
  filter_fy:any;
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private route: Router,
    private _commonService : CommonService,
    private toast: ToastrService,
    private depreciationService: DepreciationService,
    private finance: FinaceService,
    public dialog: MatDialogRef<ExcelDialogComponent>,
    public toaster: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.fileFormSetupObj = this.fb.group({
      file: new FormControl(null,[Validators.required]),
    });
  }

  ngOnInit() {
    let lg: any = localStorage.getItem('signInUser')
    this.filter_fy = localStorage.getItem('financial_id');
    this.loginUser = JSON.parse(lg);
    this.getAllFinancialYear()
  }

  getAllFinancialYear() {
    this.finance.getFinancialYearActive().subscribe((res: any) => {
      this.fYears = res.data;
      // this.generateExcel();
    })
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach((control: FormGroup<any>) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onChange(e: any) {
    const currentFile: File = e.target.files[0];
    this.fileToUpload = currentFile;
  }

  // onPanelClose() {
  //   this.filterControl.setValue('');
  // }

  // On click submit start
  saveDetails() {
    this.submitForm()
  }
  // On click submit end

  // Form save start
  submitForm() {
    try {

      this.markFormGroupTouched(this.fileFormSetupObj);
      if(this.fileFormSetupObj.invalid){
        this.toaster.error('Please upload file first','Error')
        return
      }

      const formData = new FormData();
      formData.append('file', this.fileToUpload);
      formData.append(`entity_id`, this.data.entity_id);
      formData.append(`filter_fy`, this.filter_fy);
      this._commonService?.showLoader()
      this.depreciationService.bulkCreateSetup(formData).subscribe((response: any) => {
        if (response) {
          this._commonService?.showLoader()
          this.toast.success(response.message);
          this.dialog.close();
          // this.reloadCurrentRoute();
        }
      }, err => {
        this._commonService?.showLoader()
        this.toast.error(err?.error?.message);
        console.log(err);
        this.dialog.close();
      })
    } catch (error) {
      console.log(error);
    }
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    })
  };
  // Form update end

  downloadCSV(){
    // const fileName = 'sampleCSV.xlsx'; // Name of your CSV file
    // const filePath = 'assets/sampleCSV.xlsx'; // Path to your CSV file

    // this.http.get(filePath, { responseType: 'blob' }).subscribe(response => {
    //   saveAs(response, fileName);
    // });
  }

  generateExcel() {
    this.header = ["Financial_Year", "Month_Name", "Depreciation_Type","Amount"]
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('My Sheet', {views:[{xSplit: 1,ySplit: 1}]});
    let headerRow = worksheet.addRow(this.header);
    worksheet.views = [
      {state: 'frozen',xSplit:1, ySplit: 1}
      ];
    this.dropdownlist = ["list1","list2","list3","list4"]
    this.depreciationType = ['Actual','Forecast']
    this.monthList = ['January','February','March','April','May','June','July','August','September','October','November','December']
    let fyearsArray = []
    let temp1 = ""
    this.fYears.forEach((value:any) => {
      temp1 = temp1 + value.financial_year + ",";
    })
    temp1 = temp1.slice(0,temp1.length-1)

    let monthsArray = []
    let temp2 = ""
    this.monthList.forEach((value:any) => {
      temp2 = temp2 + value + ",";
    })
    temp2 = temp2.slice(0,temp2.length-1)

    let depreciation = []
    let temp3 = ""
    this.depreciationType.forEach((value:any) => {
      temp3 = temp3 + value + ",";
    })
    temp3 = temp3.slice(0,temp3.length-1)

    
    // Set font, size and style in title row.
    // titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
    // Blank Row
    //Add Header Row
   
    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;
    headerRow.eachCell((cell, number) => {
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
    }
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });
    // Add Data and Conditional Formatting
    let joineddropdownlist = "\""+this.dropdownlist.join(',')+"\"";
    temp1 = "\""+temp1+"\"";
    temp2 = "\""+temp2+"\"";
    temp3 = "\""+temp3+"\"";
    for(let i=2;i<12;i++){
      worksheet.getCell('A'+i).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [temp1]//'"One,Two,Three,Four"'
      };

      worksheet.getCell('B'+i).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [temp2]//'"One,Two,Three,Four"'
      };

      worksheet.getCell('C'+i).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [temp3]//'"One,Two,Three,Four"'
      };

    }
    workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, 'Depreciation-Forecast.xlsx');
    });
  }

}

