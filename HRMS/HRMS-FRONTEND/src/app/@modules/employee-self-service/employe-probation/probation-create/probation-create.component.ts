import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ToastrService } from 'ngx-toastr';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import moment from 'moment';
import { Location } from '@angular/common';
@Component({
  selector: 'app-probation-create',
  templateUrl: './probation-create.component.html',
  styleUrls: ['./probation-create.component.scss']
})
export class ProbationEditComponent implements OnInit {
  grievanceForm: any;
  id: any;
  personalIdData: any;
  reportingManager: any;
  employeId: any;
  getData: any;
  parm: any;
  firstLastName: any;
  propertyManager: any = [];
  allAchievement: any;
  constructor(private fb: FormBuilder, private emp_master: EmpMasterService,
    private _empRegistration: EmpRegistrationService, private recruitService: RecruitService,
    private activetedRoute: ActivatedRoute,
    private route: Router,
    private toast: ToastrService,
    private location: Location
    ) {

    this.grievanceForm = this.fb.group({
      action_manager: new FormControl(null),
      probation1: new FormControl(null),
      reporting_manager: new FormControl(null),
      date_of_joining: new FormControl(null,[Validators.required]),
    })
  }

  ngOnInit(): void {
    this.activetedRoute.queryParams.subscribe(params => {
      this.parm = params;
      this.employeId = this.parm.probation_id;
      
    })
    this.getAchievementList();
    if(this.employeId){
      this.getByIdUse();
    }

  }
  goBack() {
    this.location.back();
  }
  getByIdUse() {
    this.emp_master.probationGetById(this.employeId).subscribe((res: any) => {
      this.getData = res.data;
      
      this.basicFormPatch(this.getData)

    })
  }

  basicFormPatch(getData: any) {
    this.grievanceForm.patchValue({
      action_manager: getData?.first_name,
      reporting_manager: getData?.reporting_manager,
      date_of_joining: getData?.date_of_joining,
      probation1: new Date()

    })
    
  }

  getAchievementList() {
    this.recruitService.getAllAchivement().subscribe(
      (res: any) => {
        
        this.allAchievement = res.data;
      },
      (err) => {
        
      }
    );
  }

  candidateClick(e:any){
    
    this.emp_master.probationGetById(e).subscribe((res:any)=>{
      this.getData=res.data;
      
      this.basicFormPatch(this.getData)
    })
  }

  updateForm() {
    if (this.grievanceForm.invalid) {
      this.toast.error("Required fields should not be empty", "Fields Error")
      
      return;
    }
    let val = this.grievanceForm.value;
    const data = {
      probation1: moment(val.probation1).format('YYYY-MM-DD'),
    }
    // e.stopPropagation();
    this.emp_master.editProbation(this.employeId, data).subscribe((res: any) => {
      // this.update=res
      this.toast.success("Probation Details Updated successfully..")
      // const latlang = { id: this.employeId };
      this.route.navigate(['master/ess/employee-probation']);
    })
  }
  reLoad() {
    // window.location.reload();
    history.back();
  }
}
