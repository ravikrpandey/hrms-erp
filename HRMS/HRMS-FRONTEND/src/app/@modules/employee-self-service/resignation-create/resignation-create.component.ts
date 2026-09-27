import { DatePipe, JsonPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { CKEditorComponent} from 'ckeditor4-angular/ckeditor.component';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { HeadService } from 'src/app/@shared/services/head.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-resignation-create',
  templateUrl: './resignation-create.component.html',
  styleUrls: ['./resignation-create.component.scss'],
  providers: [DatePipe]
})
export class ResignationCreateComponent implements OnInit {
  @ViewChild('editer') editer: any
  propertyManager:any;
  resignDetailsForm: FormGroup;
  private gridApi!: GridApi<any>;
  file: any;
  employeBYId: any
  id: any;
  getData: any;
  employeReport: any;
  submitted = true;
  imagePath: any;
  imageToUpload: any;
  basicData: any;
  dataEmployee: any;
  data: any = '';
  regionData: any;
  gradeData: any;
  imageDefult: any = '../../../../../../assets/icons/icon_zyno/user.png'
  abc: any;
  update: any;
  employeId: any;
  title:any;
  jobTypeId: any;
  jobTitleId: any;
  jobRole: any;
  requisitionStatus: any;
  jobStatus: any;
  requestedBy: any;
  assignedTo: any;
  reportingManager:any;
  lastName:any
  salaryRange: any;
  title2: any;
  reportData: any = [];
  cellValue: any;
  @ViewChild(MatPaginator, { static: false }) paginator !: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort !: MatSort;
  reposting:any;
  date: any;
  stepId: any;
  jobId: any;
  job_id: any;
  jobTitle: any;
  jobType: any;
  strippedString: any;
  resignId: any;
  mainId: any;
  mainEmployeeData: any;
  joinDate: any;
  diffDate: number;
  diffYear: number;
  finalDiff: number;
  constructor(private dialog: MatDialog ,private datePipe: DatePipe,  private head:HeadService ,private fb: FormBuilder, private _empRegistration: EmpRegistrationService,
     private toast: ToastrService, private route: Router, private activeroute:ActivatedRoute,
     private recruitService: RecruitService,
     private location: Location) {
    this.dataEmployee;
    
    this.resignDetailsForm = this.fb.group({
      employee_name: new FormControl(null, Validators.required),
      department: new FormControl(null, Validators.required),
      joining_date: new FormControl(null, Validators.required),
      job_location: new FormControl(null),
      jobRole: new FormControl(null),
      date_of_joining: new FormControl(null),
      manager: new FormControl(null),
      years_of_service: new FormControl(null),
      resign_date: new FormControl(null, Validators.required),
      reason: new FormControl(null, Validators.required),
      employee_id: new FormControl(null),
      // login_user_id: new FormControl(localStorage.getItem('EmpMainId')),
    })
  }
  employee_id: any
  ngOnInit(): void {
    this.activeroute.queryParams.subscribe(params => {
      this.id = params;
      
      this.job_id = this.id.resign_id;
      this.resignId = this.job_id;
      
    });
    if(this.job_id) {
      this.recruitService.getIdResignation(this.job_id).subscribe((res) => {
        
        this.getData = res
        this.patchFormValue();
      })
    } else {
      this.mainId = localStorage.getItem("EmpMainId");
      
      
      this._empRegistration.getByUserId(this.mainId).subscribe((res) => {
        this.mainEmployeeData = res.data;
        
        
        this.joinDate = this.mainEmployeeData?.date_of_joining;
        const todaydate = new Date();
        
        this.diffDate = this.getDiffDays(new Date(this.joinDate), new Date(todaydate));
        this.diffYear = this.diffDate/365;
        this.finalDiff = Math.round(this.diffYear * 100) / 100
        
        this.patchFormValueTrue();
      })
    }
    
  }
  getDiffDays(startDate:any, endDate:any) {
    return Math.ceil(Math.abs(startDate - endDate) / (1000 * 60 * 60 * 24));
  }

  patchFormValueTrue() {
    this.resignDetailsForm.patchValue({
      employee_id:this.mainEmployeeData.employee_id,
      employee_name: this.mainEmployeeData.first_name + " " + this.mainEmployeeData.middle_name + " " + this.mainEmployeeData.last_name,
      department:this.mainEmployeeData.department,
      jobRole:this.mainEmployeeData.user_role,
      date_of_joining:this.mainEmployeeData.date_of_joining,
      manager:this.mainEmployeeData.reporting_manager,
      years_of_service: this.finalDiff,
      job_location:this.mainEmployeeData.reporting_office_location,
      resign_date:this.mainEmployeeData.resign_date,
      reason:this.mainEmployeeData.reason
    })
  }

  patchFormValue() {
    
    this.resignDetailsForm.patchValue({
      employee_id:this.getData.data.employee_resignation_id,
      employee_name: this.getData.data.employee_name,
      department:this.getData.data.department,
      jobRole:this.mainEmployeeData.user_role,
      date_of_joining:this.getData.data.date_of_joining,
      manager:this.getData.data.manager,
      years_of_service: this.getData.years_of_service,
      job_location:this.getData.data.job_location,
      resign_date:this.getData.data.resign_date,
      reason:this.getData.data.reason
    })
  }

  goBack() {
    this.location.back();
  }

get f() { return this.resignDetailsForm.controls; }

  onChange(e: any) {
    

    if (e.target.files && e.target.files[0]) {
      const data: FileList = e.target.files;
      this.imageToUpload = data.item(0) || null;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath = e.target.result;
      };
      reader.readAsDataURL(this.imageToUpload)
    }
    
  }

  onSubmitForm() {
    
    
    this.submitted = true;
    let val = this.resignDetailsForm.value;
    
    
    const data: any = {
      employee_id: val.employee_id,
      // login_user_id: val.login_user_id,
      employee_name: val.employee_name,
      department: val.department,
      job_location: val.job_location,
      manager: val.manager,
      reason: val.reason,
      years_of_service: val.years_of_service,
      joining_date: moment(val.joining_date).format('YYYY-MM-DD'),
      resign_date: moment(val.resign_date).format('YYYY-MM-DD'),
      status: "ACTIVE"
    }
    

      this.data= this.resignDetailsForm.value;
      
      this.recruitService.createResignation(data).subscribe((res:any)=>{
        // this.update=res
        this.toast.success("Resignation Updated successfully..")
        
        this.jobId = res.jobId;
        this.route.navigate(['master/ess/resignation']);
      })

  }

  onUpdateForm() {
    
    
    this.submitted = true;
    let val = this.resignDetailsForm.value;
    
    
    const data: any = {
      employee_id: val.employee_id,
      // login_user_id: val.login_user_id,
      employee_name: val.employee_name,
      department: val.department,
      job_location: val.job_location,
      manager: val.manager,
      reason: val.reason,
      years_of_service: val.years_of_service,
      joining_date: moment(val.joining_date).format('YYYY-MM-DD'),
      resign_date: moment(val.resign_date).format('YYYY-MM-DD'),
    }
    

      this.data= this.resignDetailsForm.value;
      
      this.recruitService.editResignation(this.resignId, data).subscribe((res:any)=>{
        // this.update=res
        this.toast.success("Job Description Updated successfully..")
        
        this.jobId = res.jobId;
        this.route.navigate(['master/ess/resignation']);
      })

  }
  reportClick(id: any) {
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
}