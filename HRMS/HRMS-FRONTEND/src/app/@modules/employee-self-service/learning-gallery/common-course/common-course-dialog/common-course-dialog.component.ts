import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { LmsService } from 'src/app/@shared/services/lms/lms.service';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import { environment } from 'src/app/environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-common-course-dialog',
  templateUrl: './common-course-dialog.component.html',
  styleUrls: ['./common-course-dialog.component.scss']
})
export class CommonCourseDialogComponent {
  view: boolean = false;
  formModel: FormGroup;
  expenseType: any;
    file_path: any;
// baseUrl : any
sanitizedUrl: SafeResourceUrl | null = null;
baseUrl = environment.serverUrl
fileContent: any;  // Holds the parsed Excel data
isExcelFile: boolean = false; 
fileContentHeaders: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private travelRequest: TravelRequestService,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private $common: CommonService,
    private lmsService : LmsService,
    private sanitizer: DomSanitizer
  ) {

    console.log(data)
    this.formInitialization();
    if (this.data?.view) {
      this.view = this.data.view;
    }
    if (this.data?.id) {
      this.formModel.patchValue(this.data.tableData);
    }
    if (this.data.tableData.content_file_type === 'pdf') {
      this.sanitizedUrl = this.sanitizeUrl(this.baseUrl+'/'+this.data.tableData.content_file_path);
    }
    if (data.tableData.content_file_type === 'xlsx') {
      this.isExcelFile = true;
      this.loadExcelFile(this.baseUrl+'/'+this.data.tableData.content_file_path);
    }
    
  }

  formInitialization() {
    this.formModel = this.fb.group({
      content_file_type: [null],
      content_file_link: [null],
      content_file_path: [null, ],
      content_name: [null]
    });
  }
  sanitizeUrl(filePath: string): SafeResourceUrl {
    // const fullUrl = `baseUrl/${filePath}`; 
    return this.sanitizer.bypassSecurityTrustResourceUrl(filePath);
  }
  ngOnInit() {
   
    if (this.data?.id) {
      const tableData = this.data.tableData;
      this.formModel.patchValue(tableData);
      console.log(tableData,"ttt")
    }
  }

  ngAfterViewInit() {
    if (this.view) {
      this.disableInteraction();
    }
  }
  togglePlayPause(video: HTMLVideoElement) {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }
  
  changeTime(event: Event, video: HTMLVideoElement) {
    const input = event.target as HTMLInputElement;
    video.currentTime = parseFloat(input.value);
  }
  
  mute(video: HTMLVideoElement) {
    video.muted = !video.muted;
  }
  loadExcelFile(fileUrl: string) {
    fetch(fileUrl)
      .then((response) => response.arrayBuffer())
      .then((data) => {

        console.log(data,"data")
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Array of arrays
        if (jsonData.length > 0) {
          this.fileContentHeaders = (jsonData[0] as string[]).map((header) =>
      
            header?.toString().trim() || ''
          ); // Clean headers
          console.log("jsonData[0] ",jsonData[0] )
          this.fileContentHeaders = this.fileContentHeaders.filter((header:any) => header); // Remove empty headers
  
          this.fileContent = jsonData.slice(1).map((row: any=[]) => {
            const rowObj: { [key: string]: any } = {};
            this.fileContentHeaders.forEach((header: string, index: number) => {
              rowObj[header] = row[index] || ''; // Map data to headers
            });
            return rowObj;
          });
        }
      })
      .catch((error) => {
        console.error('Error loading Excel file:', error);
      });
  }
  
  
  
  
  disableInteraction() {
    const formElements = this.elRef.nativeElement.querySelectorAll('.form_set .row *');

    formElements.forEach((element: HTMLElement) => {
      this.renderer.addClass(element, 'disable-interaction');
      this.renderer.setAttribute(element, 'tabindex', '-1');
      element.addEventListener('focus', (event) => {
        (event.target as HTMLElement).blur();
      });
    });
  }




  sevralUrl() {
    return environment.serverUrl + '/uploaded_files/';
  }

  openFileInNewTab(url: string) {
    window.open(this.sevralUrl() + url, '_blank');
  }



}
