import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { environment } from 'src/app/environments/environment';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-work-station-view',
  templateUrl: './work-station-view.component.html',
  styleUrls: ['./work-station-view.component.scss']
})
export class WorkStationViewComponent {
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
  imagesToUpload: any;
  imagePaths: any;


  constructor(private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
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
      type_of_workstation: new FormControl(null),
      name_of_workstation: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(150)]),
      running_cost_per_hour: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(150)]),
      hourly_effciency: new FormControl(null, [Validators.required]),
      uom_id: new FormControl(null),
      description: new FormControl(null, [Validators.required]),
      images: new FormControl(null, [Validators.required]),
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
    this._configurationalMasterService.getUOMList().subscribe((res: any) => {
      this.getUom_data = res.data;
    })
  }

  goBack() {
    this.location.back();
  }

  back() {
    history.back()
  }

  getByIdWorkStationMaster() {
    this._configurationalMasterService.getByIdWorkStationMaster(this.workStationId).subscribe((res: any) => {
      this.getData = res.data;
      // console.log(this.asignData);


      // console.log(this.getData);
      // this.getAssginSingle()
      this.basicFormPatch(this.getData)


    })
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

 openImageInNewTab(fileBody:any): void {
  const imageUrl = this.generateImageUrl(fileBody);
  window.open(imageUrl, '_blank');
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
}
