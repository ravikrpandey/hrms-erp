import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
// import { environment } from 'src/app/environments/environment';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent, FocusEvent, BlurEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import Adapter from './ckeditorAdapter';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { HrServiceService } from 'src/app/@shared/services/hr-service.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/environments/environment'
@Component({
  selector: 'app-create-announcement',
  templateUrl: './create-announcement.component.html',
  styleUrls: ['./create-announcement.component.scss']
})
export class CreateAnnouncementComponent implements OnInit {
  viewData: any;
  getAllDepartment: any;
  getAllDepartment2: any;
  departments: any;
  htmlEditorValue2 = ``;
  databaseKey: any = environment.serverUrl;
  public Editor = ClassicEditor;
  public isDisabled = false;
  ckconfig: any;
  public editorData = ``;
  public componentEvents: string[] = [];
  announcementForm: FormGroup;
  mainId: any;
  financial_year_id: any;
  entity_id: any;
  editorInstance: any;
  imageUrl: any;
  id:any;

  constructor(
    private _empRegistration: EmpRegistrationService,
    private _fb: FormBuilder,
    private recruitService: RecruitService,
    private hr_service: HrServiceService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.announcementForm = this._fb.group({
      department_id: new FormControl([],Validators.required),
      notice_title: new FormControl('',Validators.required),
      from_date: new FormControl('',Validators.required),
      to_date: new FormControl('',Validators.required),
      file_Name: new FormControl(''),
      description: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.mainId = localStorage.getItem('EmpMainId');
    this.ckconfig = {
      extraPlugins: [this.customAdapterPlugin]
    };
    this.getAllDepartment_dropDown();

    this.route.queryParams.subscribe(params => {
       this.id = params['id'];
      const status = params['status'];
      if ( this.id) {
        this.loadAnnouncementDetails( this.id);
        if (status === 'view') {
          this.announcementForm.disable();
          this.isDisabled = true;
          this.viewData = status;
        }
      }
    });
  }

  isAllSelected = false;

toggleAllSelection() {
  const formControl = this.announcementForm.get('department_id');
  if (!formControl) return;

  if (this.isAllSelected) {
    // Deselect all
    formControl.patchValue([]);
  } else {
    // Select all department IDs
    const allIds = this.getAllDepartment.map((d: any) => d.dept_id);
    formControl.patchValue(allIds);
  }

  this.isAllSelected = !this.isAllSelected;
}

onSelectAll(event: any) {
  const formControl = this.announcementForm.get('department_id');
  if (!formControl) return;

  const selectedValues = formControl.value || [];
  const allIds = this.getAllDepartment.map((d: any) => d.dept_id);

  // Check if all are selected
  this.isAllSelected = allIds.every((id: any) => selectedValues.includes(id));
}


  getAllDepartment_dropDown() {
    const entity_id = localStorage.getItem("selectedEntityId");
    this._empRegistration.getAllDepartment_dropDown(entity_id).subscribe(res => {
      this.getAllDepartment = res.data.filter((res: any) => res.status === "ACTIVE");
      this.getAllDepartment2 = this.getAllDepartment;
      this.departments = this.getAllDepartment2.map((res: any) => res.department_name);
    });
  }

  departmentSearch(e: any) {
    const filteredVariable = this.getAllDepartment2.filter((item: any) => e.includes(item.department_name));
    this.getAllDepartment = filteredVariable;
  }

 onSubmitForm() {
  if (this.announcementForm.invalid) {
    this.announcementForm.markAllAsTouched();
    this.toast.error('Please fill all required fields');
    return;
  }

  const data = this.editorInstance.getData();
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/html');

  if (!doc.body) {
    console.error('CKEditor content parsing failed.');
    return;
  }

  const imageElements = doc.body.querySelectorAll('img');
  const imageUrls = Array.from(imageElements).map(img => img.src);
  imageElements.forEach(img => img.remove());
  const cleanText = doc.body.textContent?.trim() || '';

  this.announcementForm.patchValue({ description: cleanText });
  const submitForm = (uploadedUrls: string[]) => {
    if (uploadedUrls.length > 0) {
      this.announcementForm.patchValue({ file_Name: uploadedUrls[0] }); 
    }
    
    const val = {
      ...this.announcementForm.value,
      entity_id: this.entity_id,
      financial_year_id: this.financial_year_id,
      created_by: this.mainId,
    };

    const request$ = this.id
      ? this.hr_service.update_Announcement(this.id, val)
      : this.hr_service.create_Announcement(val);

    request$.subscribe(
      (res: any) => {
        this.toast.success(`Announcement ${this.id ? 'Updated' : 'Created'} Successfully`);
        this.router.navigate(['/master/hrms/announcement']);
      },
      (err: any) => {
        this.toast.error(`Failed to ${this.id ? 'update' : 'create'} announcement`);
      }
    );
  };

  const base64Images = imageUrls.filter(url => url.startsWith('data:image'));

  if (base64Images.length === 0) {
    submitForm([]);
  } else {
    const uploadedUrls: string[] = [];
    let uploadedCount = 0;

    base64Images.forEach((url, idx) => {
      const file = dataURLtoFile(url, `editor-image-${idx}.png`);
      const formData = new FormData();
      formData.append('file', file);

      this.recruitService.uploaddocumentsUpdate(formData).subscribe(
        (res: any) => {
          if (res?.url) {
            uploadedUrls.push(res.url);
          }
          uploadedCount++;
          if (uploadedCount === base64Images.length) {
            submitForm(uploadedUrls);
          }
        },
        (err: any) => {
          this.toast.error('Image upload failed');
        }
      );
    });
  }
}

  goBack() {
    window.history.back();
  }

  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  date = this.now.getDate();
  min = moment({ year: this.year, month: this.month, date: this.date }).format('YYYY-MM-DD');

  customAdapterPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new Adapter(loader, editor.config);
    };
  }

  toggleDisableEditors() {
    this.isDisabled = !this.isDisabled;
  }

  onReady(editor: any) {
    this.editorInstance = editor;
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new Adapter(loader, editor.config);
    };
  }

  loadAnnouncementDetails(id: any) {
    this.hr_service.getAnnouncementById(id).subscribe(
      (res: any) => {
        if (res?.data) {
          const data = res.data;

          let fileName = data.file_Name || '';
          if (fileName && !fileName.toLowerCase().endsWith('.png')) {
            fileName += '.png';
          }

          const departmentIds = data?.HRMS_ANNOUNCEMENT_DETAILs?.map((d: any) => d.dept_id) || [];

          this.announcementForm.patchValue({
            department_id: departmentIds,
            notice_title: data.notice_title || '',
            from_date: data.from_date || '',
            to_date: data.to_date || '',
            file_Name: fileName
          });

          console.log(this.generateAnnouncementHTML(res.data));
          ;
          // const baseUrl = environment?.servralUrl;
          // let htmlContent = '';

          // if (data.description) {
          //   const fixedDescription = data.description.replace(
          //     /<img src="\/uploaded_files\//g,
          //     `<img src="${baseUrl}/uploaded_files/`
          //   );
          //   htmlContent += fixedDescription;
          // }

          // if (fileName) {
          //   const imageUrl = `${baseUrl}/uploaded_files/${encodeURIComponent(fileName)}`;
          //   htmlContent += `
          //   <p>
          //     <img src="${imageUrl}" alt="Announcement Image" style="max-width:100%; height:auto;" />
          //   </p>
          // `;
          // }
          this.announcementForm.get('description')?.setValue(this.generateAnnouncementHTML(res.data));
        }
      },
      (err:any) => {
        console.error('Error loading announcement:', err);
        this.toast.error('Failed to load announcement');
      }
    );
  }

generateAnnouncementHTML(data: any) {
  const {description, file_Name } = data;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      ${file_Name ? `<img src="${environment?.serverUrl}/uploaded_files/${file_Name}" alt="Announcement Image" style="max-width: 100%; height: auto;" />` : ''}
      <p> ${description || 'N/A'}</p>
    </div>
  `;
}



}

function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}
