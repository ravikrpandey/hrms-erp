import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ExportAllApiService } from 'src/app/@shared/services/export/export-all-api.service';
import { ExportService } from 'src/app/@shared/services/export/export.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-export', 
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
  checkValue: void;
  exportDatas: any;
  name = 'Plexfom';
  statusList:any;
  filesArray: any[] = [];
  exportForm:FormGroup;

  // title(title: any) {
  //   throw new Error('Method not implemented.');
  // }


  constructor(
    private fb: FormBuilder,
    private downloadService: ExportService,
    private _exportAllApi:ExportAllApiService
  ) {
    this.exportForm = this.fb.group({
      fromDate: new FormControl(null,[Validators.required]),
      endDate: new FormControl(null,[Validators.required]),
      status: new FormControl(null,[Validators.required]),
    });
  }

 ngOnInit(): void {
   this.getStatusList();
 }
  exportData(){
    this._exportAllApi.getList().subscribe((res:any)=>{
      this.exportDatas=res.result
      this.ExportDataInExcelFormate( this.exportDatas)

    })
  }
  ExportDataInExcelFormate(jsonData: any) {
    const filename = 'SalesAndMarketing.xlsx';
  
    // Function to truncate or handle long text fields
    const handleLongText = (text: string) => {
      const maxLength = 32767;
      return text.length > maxLength ? text.substring(0, maxLength) : text;
    };
  
    // Apply the handling function to each item in the data
    const data = jsonData.map((item: any) => {
      for (const key in item) {
        if (item.hasOwnProperty(key) && typeof item[key] === 'string') {
          item[key] = handleLongText(item[key]);
        }
      }
      return item;
    });
  
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'People');
    XLSX.writeFile(wb, filename);
  }
  


  downloadFile() {
    if (this.exportForm.valid) {
      console.log(this.exportForm.value,'kkkkkkkkkkkkkkkkkkkk');
      this._exportAllApi.getDatabasedOnStatusAndDate(this.exportForm.value).subscribe((res:any) =>{
        console.log(res,"hhhhhhhhhhhhhhhhhhhh");
        if(res && res.data){
          this.ExportDataInExcelFormate(res.data);
        }
        
      })
    }
    // this.downloadService.createZip(
    //   this.filesArray?.map((c) => c.filePath),
    //   'DQS_Project_Folder'
    // );
  }

  // change(e:any){
  //   this.departments=e.value
  //   this._SubjectService.department.next(e.value);
  //   if(this.department==="Lead_Mangagement"){
  //     this. exportData();

  //   }

  // }

  getStatusList(){
    this._exportAllApi.getStatusList().subscribe(res =>{
      console.log(res,"lllllllllllllll");
      if(res && res.data){
        this.statusList = res.data;
      }
    })
  }
}
