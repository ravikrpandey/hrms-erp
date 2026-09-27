import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from '../../../@shared/services/recruitment.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-achievement-create',
  templateUrl: './achievement-create.component.html',
  styleUrls: ['./achievement-create.component.scss'],
})
export class AchievementCreateComponent {

  achivementForm: FormGroup;
  id: any;
  achievement_id: any;
  getData: any;
  allAchievement: any;
  locatin: any;
  loginUser: any;
  reportingManagerList:any
  mainId: string | null;
  constructor(
    private recruitService: RecruitService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private _empRegistration: EmpRegistrationService,
    private location: Location
  ) {
    this.achivementForm = this.fb.group({
      achieved_by: new FormControl(null, Validators.required),
      Achivements: new FormControl(null),
      reporting_manager: new FormControl(null, Validators.required),
      achieve_description: new FormControl(null, Validators.required),
      notes: new FormControl(null, Validators.required),
      recognized_by: new FormControl(null, Validators.required),
      recognized_date: new FormControl(null),
      course: new FormControl(null, Validators.required),
      badges: new FormControl(null, Validators.required),
      course_employee: new FormControl(null),
      achieve_date: new FormControl(null, Validators.required),
    });
  }
  ngOnInit() {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params;
      
      this.achievement_id = params.achievement_id;
      
    });
    if (this.achievement_id) {
      this.getByIdUse();
    }
    this.getAchievementList();
    this.getAllManagerList()
    //get_user_name in edit achievement
    this.mainId = localStorage.getItem("EmpMainId");
    

    this._empRegistration.getByUserId(this.mainId).subscribe((res: any) => {
      this.getData = res.data;
      
      this.achivementForm.patchValue({
        achieved_by: this.getData?.first_name
      })
      // this.achivementForm = this.fb.group({
      //   achieved_by: this.getData.first_name,
      // });
    })

    let data: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(data);
    

  }
  goBack() {
    this.location.back();
  }
  candidateClick(e: any) {
    
    this.recruitService.achivementAddedById(e).subscribe((res: any) => {
      
      this.getData = res.data[0];
      this.basicFormPatch(this.getData);
    })
  }
  // data fatching
  getAchievementList() {
    this.recruitService.getAllAchivement().subscribe(
      (res: any) => {
        
        this.allAchievement = res.data;
      },
      (err) => {
        
      }
    );
  }

  getAllManagerList(){
    this._empRegistration.getAllManagersList().subscribe((res: any) => {
    this.reportingManagerList  = Array.from( res.data, (a: any) => `${a.first_name} ${a.last_name}`);
  })
}
  onSubmitForm() {
    let val = this.achivementForm.value;
    
    if (this.achivementForm.invalid) {
      this.toast.error("Required fields should not be empty", "Fields Error")
      
      return;
    }
    
    const data = {
      achieved_by: val.achieved_by,
      achievements: val.Achivements,
      reporting_manager: val.reporting_manager,
      achieve_description: val.achieve_description,
      notes: val.notes,
      recognized_by: val.recognized_by,
      course: val.course,
      badges: val.badges,
      course_employee: val.course_employee || "Test",
      recognized_date: moment(val.updatedAt).format('YYYY-MM-DD') || "2023-04-01",
      status: 'ACTIVE',
      achieve_date: moment(val.achieve_date).format('YYYY-MM-DD'),
    };
    
    this.recruitService.createAchievement(data).subscribe(
      (res: any) => {
        
        // this.submitted = false;
        this.toast.success(res.message);
        this.router.navigate(['master/ess/achievement']);
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong');
        } else if (err.status == 403) {
          this.toast.error('Achievements Already Exits!');
        }
        else {
          this.toast.error('Something went Wrong');
        }
      }
    );
  }

  onUpdateForm() {
    let val = this.achivementForm.value;
    
    const data = {
      achieved_by: val.achieved_by,
      achievements: val.Achivements,
      reporting_manager: val.reporting_manager,
      achieve_description: val.achieve_description,
      notes: val.notes,
      recognized_by: val.recognized_by,
      course: val.course,
      badges: val.badges,
      course_employee: val.course_employee || "Test",
      status: 'ACTIVE',
      recognized_date: moment(val.updatedAt).format('YYYY-MM-DD') || "2023-04-01",
      achieve_date: moment(val.achieve_date).format('YYYY-MM-DD'),
    };

    this.recruitService.updateAchievement(this.achievement_id, data).subscribe(
      (res: any) => {
        
        // this.submitted = false;
        this.toast.success('Achivement Data Updated Successfully..');
        this.router.navigate(['master/ess/achievement']);
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );

  }


  getByIdUse() {
    this.recruitService
      .achivementAddedById(this.achievement_id)
      .subscribe((res: any) => {
        this.getData = res.data[0];

        
        this.basicFormPatch(this.getData);
      });
  }

  //patching data from list(edit)
  basicFormPatch(getData: any) {
    

    this.achivementForm.patchValue({
      achieved_by: getData?.achieved_by,
      Achivements: getData?.achievements,
      reporting_manager: getData?.reporting_manager,
      achieve_date: getData?.createdAt,
      achieve_description: getData?.achieve_description,
      notes: getData?.notes,
      recognized_by: Number(getData?.recognized_by),
      recognized_date: getData?.recognized_date,
      course: getData?.course,
      badges: getData?.badges,
      course_employee: getData?.course_employee,
    });
    
  }

  cancelBtn() {
    this.achivementForm.reset();
    history.back();
  }

}

function patchFormValue() {
  throw new Error('Function not implemented.');

}
