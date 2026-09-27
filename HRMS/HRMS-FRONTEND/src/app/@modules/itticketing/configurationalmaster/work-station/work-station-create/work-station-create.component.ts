import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { environment } from 'src/app/environments/environment';
function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}
@Component({
  selector: 'app-work-station-create',
  templateUrl: './work-station-create.component.html',
  styleUrls: ['./work-station-create.component.scss']
})
export class WorkStationCreateComponent {
  workStationForm: any;
  workStationId: any;
  parm: any;
  getData: any;
  propertyManager: any;
  firstLastName: any;
  personalIdData: any;
  wordCount: any;

  @ViewChild("text") text: ElementRef;
  words: any;
  extraWords: boolean = false;

  asignData: any;
  asignvariables: any;
  asignvariable: any;
  uniqueId: any;
  uniquedata: any;
  variables: any = [];
  variable: any = [];
  countryList: any;
  phoneCode: any;
  newPhoneCode: string;
  stateList: any;
  stateVar: any = [];
  stateVar2: any = [];
  checkData: any;
  getUom_data: any;
  imageToUpload: any;
  imagePath: any;
  imagesToUpload: any = [];
  imagePaths: any = [];


  constructor(private fb: FormBuilder,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private emp_master: EmpMasterService,
    private toast: ToastrService,
    private locatin: Location,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _empRegistration: EmpRegistrationService,
    private recruitService: RecruitService,
    private location: Location
  ) {

    this.workStationForm = this.fb.group({
      type_of_workstation: new FormControl(null, [Validators.required]),
      name_of_workstation: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(150),noLeadingSpaces()]),
      running_cost_per_hour: new FormControl(null, [Validators.required]),
      hourly_effciency: new FormControl(null, [Validators.required]),
      uom_id: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required,noLeadingSpaces()]),
      // images: new FormControl(null, [Validators.required]),
    })
  }

  ngOnInit(): void {
    this.activetedRoute.queryParams.subscribe((params: any) => {
      this.parm = params;
      this.workStationId = params.id;

    })
    if (this.workStationId) {
      this.getByIdWorkStationMaster();

    }
    this._configurationalMasterService.getActiveUOMList().subscribe((res: any) => {
      this.getUom_data = res.data;
    })
  }

  goBack() {
    this.location.back();
  }

  wordCounter() {
    //alert(this.text.nativeElement.value)
    this.wordCount = this.text ? this.text.nativeElement.value.split(/\s+/) : 0;
    this.words = this.wordCount ? this.wordCount.length : 0;
  }
  // onChange(e: any) {


  //   if (e.target.files && e.target.files[0]) {
  //     const data: FileList = e.target.files;
  //     this.imageToUpload = data.item(0) || null;

  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.imagePath = e.target.result;


  //     };
  //     reader.readAsDataURL(this.imageToUpload);
  //   }

  // }
  onChange(e: any) {
    if (e.target.files && e.target.files.length > 0) {
      const files: FileList = e.target.files;

      // Assuming you have an array to store multiple files
      // if(!this.parm?.create){
      //   this.imagesToUpload = [];
      // }

      for (let i = 0; i < files.length; i++) {
        const currentFile: File = files[i];
        this.imagesToUpload.push(currentFile);

        const reader = new FileReader();
        reader.onload = (event: any) => {
          // Assuming you have an array to store multiple image paths
          this.imagePaths[i] = event.target.result;
        };

        reader.readAsDataURL(currentFile);
      }
    }
  }
  changedText() {
    if (this.words >= 50) {
      this.extraWords = true;
      this.toast.warning('Please enter within the text limit..', 'Warning Message');
      return
    } else if (this.words < 50) {
      this.extraWords = false;
    }
  }

  back() {
    history.back()
  }

  imageToGeted: any = [];
  getByIdWorkStationMaster() {
    this._configurationalMasterService.getByIdWorkStationMaster(this.workStationId).subscribe((res: any) => {
      this.getData = res.data;
      this.imageToGeted = res.data.UploadDocs;
      this.basicFormPatch(this.getData)


    })
  }

  removeImage(i: any) {
    if (i !== -1) {
      this.imageToGeted.splice(i, 1);
    }
  }

  generateImageUrl(uploadDoc: any): string {
    const serverUrl = environment.serverUrl;
    return `${serverUrl}/${uploadDoc}`;
  }

  isImage(uploadDoc: any): boolean {
    // Check if the file has an image extension
    
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const extension = this.getFileExtension(uploadDoc);
    
    return imageExtensions.includes(extension.toLowerCase());
 }

 generateFileUrl(uploadDoc: any): string {
    const serverUrl = environment.serverUrl;
    return `${serverUrl}/${uploadDoc}`;
 }

 getFileName(uploadDoc: any): string {
    // Extract and return the file name from the path
    const pathParts = uploadDoc.split('/');
    
    return pathParts[pathParts.length - 1];
 }

 getFileExtension(filename: string): string {
    // Extract and return the file extension from the filename
    const parts = filename.split('.');
    
    return parts[parts.length - 1];
 }

  basicFormPatch(getData: any) {

    this.workStationForm.patchValue({
      type_of_workstation: getData?.type_of_workstation,
      name_of_workstation: getData?.name_of_workstation,
      running_cost_per_hour: getData?.running_cost_per_hour,
      hourly_effciency: getData?.hourly_effciency,
      uom_id: getData?.uom_id,
      description: getData?.description,
    })
  }

  updateForm(e: any) {
    e.stopPropagation();
    let val = this.workStationForm.value;
    if (this.workStationForm.invalid) {
      this.toast.error('required fields should not be blank', 'Required fields');
      return
    }
    
    const formData = new FormData();
    formData.append('type_of_workstation', val.type_of_workstation);
    formData.append('name_of_workstation', val.name_of_workstation);
    formData.append('running_cost_per_hour', val.running_cost_per_hour);
    formData.append('uom_id', val.uom_id);
    formData.append(`hourly_effciency`, val.hourly_effciency);
    formData.append(`description`, val.description);
    formData.delete('images');

    
    for (let i = 0; i < this.imagesToUpload.length; i++) {
      formData.append('images', this.imagesToUpload[i]);
    }
    formData.append('uploadedImages', JSON.stringify(this.imageToGeted));

    this._configurationalMasterService.updateWorkStationMaster(this.workStationId, formData).subscribe((res: any) => {
      if (res.message == 'WorkStation Name Already Exists!'){
        this.toast.error("Work Station Name Already Exists")
      }else {
        this.toast.success("Work Station Master Details Updated successfully", "Updated successfully")
      }
      this.router.navigate(['master/configurational-master/work-station']);
    }, (err) => {
      this.toast.error("Something went wrong please try again", "Error Massage");
    }

    )
  }

  onSubmitForm() {
    let val = this.workStationForm.value;
    if (this.workStationForm.invalid) {
      this.toast.error('required fields should not be blank', 'Required fields');
      return
    }
    const formData = new FormData();
    formData.append('type_of_workstation', val.type_of_workstation);
    formData.append('name_of_workstation', val.name_of_workstation);
    formData.append('running_cost_per_hour', val.running_cost_per_hour);
    formData.append('uom_id', val.uom_id);
    formData.append(`hourly_effciency`, val.hourly_effciency);
    formData.append(`description`, val.description);
    formData.delete('images');

    // Append each file individually
    for (let i = 0; i < this.imagesToUpload.length; i++) {
      formData.append('images', this.imagesToUpload[i]);
    }
    this._configurationalMasterService.createWorkStationMaster(formData).subscribe((res: any) => {

      this.toast.success("Work Station Master created successfully", "Created Successfully");
      this.router.navigate(['master/configurational-master/work-station']);
    }, (err) => {

      if (err.error.code === 403) {
        this.toast.error(`${err.error.message}`, "Error Massage");
      } else {
        this.toast.error("Something went wrong please try again", "Error Massage");
      }
    }
    )
  }
}
