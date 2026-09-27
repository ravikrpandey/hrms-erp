import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { LmsService } from 'src/app/@shared/services/lms/lms.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-add-content',
  templateUrl: './add-content.component.html',
  styleUrls: ['./add-content.component.scss']
})
export class AddContentComponent {
  view: boolean = false;
  formModel: FormGroup;
  expenseType: any;
  file_path: any;
  fileArray: any[] = [];
  baseUrl :any
  isLoading: boolean = false;
  fileType: any = [
    { id: 1, name: 'Image', value: 'image', extensions: ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'webp', 'ico'] },
    { id: 2, name: 'Video', value: 'video', extensions: ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', '3gp'] },
    { id: 3, name: 'PDF', value: 'pdf', extensions: ['pdf'] },
    { id: 4, name: 'Word Document', value: 'docx', extensions: ['doc', 'docx'] },
    { id: 5, name: 'Excel Sheet', value: 'xlsx', extensions: ['xls', 'xlsx'] },
    { id: 6, name: 'Audio', value: 'audio', extensions: ['mp3', 'wav', 'aac', 'flac', 'ogg', 'wma', 'm4a'] },
  ];
  
 

  constructor(
    public dialog: MatDialogRef<AddContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private $common: CommonService,
    private lmsService : LmsService
  ) {
    this.baseUrl =environment.serverUrl;
    this.formInitialization();    
    if (this.data?.view) {
      this.view = this.data.view;
    }
    if (this.data?.id) {

      this.file_path =this.data?.tableData?.content_file_path
      this.formModel.patchValue({
        content_file_type:this.data?.tableData?.content_file_type,
        content_file_link:this.data?.tableData?.content_file_link,
        content_file_path:this.data?.tableData?.content_file_path,
        content_name: this.data?.tableData?.content_name

        
      });
    }
    console.log(this.data)
    this.fileArray.push({ imagePath: null, url: null });
  }

  formInitialization() {
    this.formModel = this.fb.group({
      content_file_type: [null,Validators.required],
      content_file_link: [null],
      content_file_path: [null],
      content_name: [null,Validators.required]
    });
  }

  ngOnInit() {
    if (this.data?.id) {
      const tableData = this.data.tableData;
      this.formModel.patchValue(tableData);
    }
  }

  ngAfterViewInit() {
    
  }
 



  

  viewImage(e:any) {
   const url = environment.serverUrl +'/'+e
    return window.open(url);
  }
  isImage(filePath: string): boolean {
    // Simple check based on file extension
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
  }
  addFileInput(index: number) {
    this.fileArray.splice(index + 1, 0, { imagePath: null, url: null });
  }

  removeFileInput(index: number) {
    if (this.fileArray.length > 1) {
      this.fileArray.splice(index, 1);
    } else {
      this.toaster.warning("At least one file input must be present.");
    }
  }

  uploadDoc(event: any) {
    console.log(event);
    
    try {
      let isValidExtension = this.$common.checkForValidFile(event);
      if (!isValidExtension) {
        this.formModel.patchValue({ file_path: null });
        return this.file_path = ""
      }
      this.isLoading = true; 
      const formData = new FormData();
      if (event.target.files && event.target.files[0]) {
        formData.append('file', event.target.files[0]);
      }
      this.lmsService.documents(formData).subscribe((response: any) => {
        if (response) {
          this.file_path = `uploaded_files/${response?.url}`;
          this.isLoading = false;
        }
      }, err => {
        console.log(err);
        this.isLoading = false;
      })
    } catch (error) {
      console.log(error);
      this.isLoading = false;
    }
  }

  onSubmit(): void {
    Object.values(this.formModel.controls).forEach(control => {
      control.markAsTouched();
    });

    if (this.formModel.invalid) {
      this.toaster.error('Please fill in all required fields');
      return;
    }

    const payload = {
      ...this.formModel.value,
    "content_file_path" : this.file_path,
    };
    this.dialog.close(payload);
  }
}
