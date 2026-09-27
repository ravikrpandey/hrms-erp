import { DatePipe, ViewportScroller } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { HeadService } from '../../../../@shared/services/head.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RecruitService } from '../../../../@shared/services/recruitment.service';
import { GridApi } from 'ag-grid-community';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-request-new-position-create',
  templateUrl: './request-new-position-create.component.html',
  styleUrls: ['./request-new-position-create.component.scss'],
  providers: [DatePipe],
})
export class RequestNewPositionCreateComponent {
    public requestNewPositionForm : any;
    public designationList : any;
    public locations: any;
    public departments : any;
    public jdToUpload : any;
    public areaList : any;
    public entity_id: any;
  constructor(
    private datePipe: DatePipe,
    private head: HeadService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private configMaster : ConfigurationalmasterService,
    private recruitService: RecruitService,
  ) {
    this.requestNewPositionForm = this.fb.group({
      position: new FormControl(null, [Validators.required, Validators.maxLength(300)]),
      leadershipPosition: new FormControl(null, Validators.required),
      contractType: new FormControl(null, Validators.required),
      recruitmentReason: new FormControl(null, Validators.required),
      expectedStartDate: new FormControl(null, Validators.required),
      expectedEndDate: new FormControl(null, Validators.required),
      hierarchicalSuperior: new FormControl(null, Validators.required),
      location: new FormControl(null, Validators.required),
      department: new FormControl(null, Validators.required),
      area: new FormControl(null, Validators.required),
      jobSpecification: new FormControl(null, Validators.required),
      jobDescriptionFiles: new FormControl(null,),
      jdEditor: new FormControl(null,),
      budget: new FormControl(null, Validators.required),
      costCenter: new FormControl(null,),
      remark: new FormControl(null,),
      justification: new FormControl(null,)
    });

  }
  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.apiOnLoad()
    this.requestNewPositionForm?.get('jobSpecification')?.setValue("Yes");
    this.requestNewPositionForm?.get('budget')?.setValue("Yes");
    this.onSelectedBudget()
    this.onSelectedJobSpecification()
    this.activeroute.queryParams.subscribe((params: any) => {
    });
  }

  apiOnLoad(){
    this.getDesignations();
    this.getLocations();
    this.getDepartment();
    this.getArea();
  }

  getDesignations() {
    this.configMaster.getDesignation().subscribe((res: any) => {
      this.designationList = res.data;
    })
  }

  getLocations(){
    this.configMaster
    .getListBranchSetup_migration()
    .subscribe((params: any) => {
      this.locations = params.data;
    });
  }

  getDepartment() {
    this.configMaster.getDepartment(this.entity_id).subscribe((res: any) => {
      this.departments = res.data;
    })
  }

  getArea() {
    const entity_id = localStorage.getItem('selectedEntityId')
    this.configMaster.getAreaMasterList(entity_id).subscribe((res: any) => {
      this.areaList = res.data;
    })
  }

  onChange(e: any) {
    if (e.target.files && e.target.files.length > 0) {
      const files: FileList = e.target.files;
      for (let i = 0; i < files.length; i++) {
        const currentFile: File = files[i];
        let flag = false;
        this.jdToUpload.forEach((fileToUpload : any) => {
          if(fileToUpload.name == currentFile.name){
            flag = true;
          }
        })
        if ( !flag )  this.jdToUpload.push(currentFile);
      }
    }
  }

  onSubmitForm(value : any) {
  }
  cancel(){
  }

  onSelectedJobSpecification(){
    this.updateValidations()
    let x = this.requestNewPositionForm?.get('jobSpecification')?.value;
    if ( x == "Yes" ) {
      // ckeditor
      this.requestNewPositionForm?.get('jdEditor')?.setValue(null);
    }
    if ( x == "No" ) {
      // files
      this.requestNewPositionForm?.get('jobDescriptionFiles')?.setValue(null);
      this.jdToUpload = []
    }
  }

  updateValidations() {
      if (this.requestNewPositionForm?.get('jobSpecification')?.value === "Yes") {
        this.requestNewPositionForm?.get('jobDescriptionFiles')?.setValidators(Validators.required);
        
        this.requestNewPositionForm?.get('jdEditor')?.clearValidators();
        this.requestNewPositionForm?.get('jdEditor')?.updateValueAndValidity();
      }
      if (this.requestNewPositionForm?.get('jobSpecification')?.value === "No") {
        this.requestNewPositionForm?.get('jdEditor')?.setValidators(Validators.required);
        this.requestNewPositionForm?.get('jobDescriptionFiles')?.clearValidators();
        this.requestNewPositionForm?.get('jobDescriptionFiles')?.updateValueAndValidity();
        this.jdToUpload = [];
      }
    }

    onSelectedBudget(){
      this.updateValidations2()
      let x = this.requestNewPositionForm?.get('budget')?.value;
      if ( x == "Yes" ) {
        this.requestNewPositionForm?.get('remark')?.setValue(null);
        this.requestNewPositionForm?.get('justification')?.setValue(null);
      }
      if ( x == "No" ) {
        this.requestNewPositionForm?.get('costCenter')?.setValue(null);
      }
    }
  
    updateValidations2() {
        if (this.requestNewPositionForm?.get('budget')?.value === "Yes") {
          this.requestNewPositionForm?.get('costCenter')?.setValidators(Validators.required);
          
          this.requestNewPositionForm?.get('remark')?.clearValidators();
          this.requestNewPositionForm?.get('remark')?.updateValueAndValidity();
          this.requestNewPositionForm?.get('justification')?.clearValidators();
          this.requestNewPositionForm?.get('justification')?.updateValueAndValidity();
        }
        if (this.requestNewPositionForm?.get('budget')?.value === "No") {
          this.requestNewPositionForm?.get('remark')?.setValidators(Validators.required);
          this.requestNewPositionForm?.get('justification')?.setValidators(Validators.required);

          this.requestNewPositionForm?.get('costCenter')?.clearValidators();
          this.requestNewPositionForm?.get('costCenter')?.updateValueAndValidity();
        }
      }
  ngSubmit(value:any){
    if(this.requestNewPositionForm.invalid){
      Object.keys(this.requestNewPositionForm.controls).forEach(controlName => {
        const control = this.requestNewPositionForm.get(controlName);
        // Check if the control is invalid
        if (control && control.invalid) {
          // Push the name of the invalid control to the array
          console.log(controlName,"---")
        }
      });
      this.toast.error('All field should be valid','Error')
      return
    }
  }
}
