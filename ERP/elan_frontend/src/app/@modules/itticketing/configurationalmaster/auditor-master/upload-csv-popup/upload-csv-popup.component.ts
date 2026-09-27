
import { Component, OnInit } from '@angular/core';
import { LmsServiceService } from 'src/app/@shared/services/lms-service.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/environments/environment';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
@Component({
  selector: 'app-upload-csv-popup',
  templateUrl: './upload-csv-popup.component.html',
  styleUrls: ['./upload-csv-popup.component.scss']
})
export class UploadCsvPopupComponent implements OnInit {
   databaseKey: any = environment.servralUrl;

  selectedFile: any = null;
  CSV_file: any
  show: boolean = false;
  fileFormat: any
  setFileSize: any;
  setText: any = "no choose file";
  DemoFileUrl: string;
  constructor(private configService: ConfigurationalmasterService,
    private _location: Location,
    private router: Router,
    private toast: ToastrService) {
  }
  ngOnInit(): void {
    this.DemoFileUrl=`${this.databaseKey}/masterDocument/basic_form-1691576281204.csv`

  }
  
  uploadCsv(event: any): void {
    
    
    if (event.target.files[0].name.split('.').pop() === "csv") {
      
      this.selectedFile = event.target.files[0] ?? null;
      this.fileFormat = this.selectedFile.name.split('.').pop();
      
      
      
      
      this.CVS_file_formate();
      return
    }
    else {
      this.otherFormate();
    }
    // this._lmsService.createCSV_File(this.selectedFile).subscribe(res=>{
    //   this.CSV_file=res;
    //   
    // })
  }
  CVS_file_formate() {
      const file: any = document.querySelector('#file');
      
      this.setText = this.selectedFile.name
      // const fileSize = (size / 1000).toFixed(2);
      let filesize = (this.selectedFile.size / 1000).toFixed(2)
      this.setFileSize = `${filesize}kb`
      
      
      
    // const file: any = document.querySelector('#file');
    // 
    // file.addEventListener('change', (e: any) => {
    //   if (this.fileFormat === "csv") {
    //     let setText: any = document.querySelector('.file-name');
    //     
    //     const [file] = e.target.files;
    //     if (file) {
    //       this.show = true;
    //     } else {
    //       this.show = false;
    //       setText.textContent = ''
    //     }
    //     const { name: fileName, size } = file;
    //     const fileSize = (size / 1000).toFixed(2);
    //     const fileNameAndSize = `${fileName} - ${fileSize}kb`;
    //     setText.textContent = fileNameAndSize;
    //   }
    // });
  }
  otherFormate() {
    this.setText = "Invalid File"
    this.setFileSize = ' ';
    

  }
  upload_file() {
  
    if (this.fileFormat) {
    const formData = new FormData();
    let file: File = this.selectedFile;
    formData.append("file", file, file.name);
    if (this.selectedFile) {
      this.configService.upload_File(formData).subscribe(res => {
        this.CSV_file = res;
        
      })
      this.toast.success("File Upload Successfully.....")
      // this.router.navigate(['master/lms/lms-home/user-management']);
      // window.location.reload();
    }
  }
    else{
      this.toast.error("Invalid File .....")
    }
    
  }

}