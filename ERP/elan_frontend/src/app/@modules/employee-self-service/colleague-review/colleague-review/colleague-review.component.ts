import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { SelfAssessmentService } from '../../self-assessment/self-assessment.service';
import { YearlyAssessmentService } from 'src/app/@shared/services/performance-management/yearly-assessment.service';
import { ColleagueReviewService } from 'src/app/@shared/services/colleague-review.service';
import Swal from 'sweetalert2';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-colleague-review',
  templateUrl: './colleague-review.component.html',
  styleUrls: ['./colleague-review.component.scss']
})
export class ColleagueReviewComponent {
  review:FormGroup;
  roles: any;
  employees: any = [];
  entity_id: any;
  loginUser: any;
  EmpMainId: any;
  financial_year_id: string | null;
  selfAssessmentRating: any;
  Competence: string[] = ['Leadership','Innovation','Ethic','Excellence','Accountability']
  paramsType: any;
  isDisabled = false;
  isButtonDisabled = false;
  yearlyAssessment: any;
  financialYear: any;
  filter_fy: string | null;
  assessments: any;
  id: any;
  login_id: any;
  ColleagueReview: any;
  submit_assessment_id: any;
  financialYear2: any;
  assessments2: any;
  roles2: any;
  employees2: any;
  years: any;
  assessmentList: any;
  rolesList: any;
  employeeList: any;
  constructor(private fb: FormBuilder, 
    private selfAssessmentService:SelfAssessmentService, 
    private toaster: ToastrService, 
    private config: ConfigurationalmasterService,private assessmentService: YearlyAssessmentService,
    private $miscellaneous: MiscellaneousService,
    private route: Router, private activeroute:ActivatedRoute,
    private colleagueReviewService: ColleagueReviewService,
    private _commonService : CommonService, 
    public dialog: MatDialog,){
    this.review = this.fb.group({
      financial_year_id:['',[Validators.required]],
      assessment_name:['',[Validators.required]],
      role_id:['',[Validators.required]],
      employee_id:['',[Validators.required]],
      reviews:this.fb.array([]),
    });

    this.activeroute.queryParams.subscribe((params: any) => {
      this.paramsType = params.type;
      this.id = params.id;
      if ( this.paramsType == "view" ) this.isDisabled = true;
    });
  }

  ngOnInit(){
    this.onLoadApi()  
    // this.getEmployee();
  }

  onLoadApi = () => {
    this.getAllRole()
    this.localStorage()
    this.setCompetence()
    this.SelfAssessentRating();
    this.getFinancialYear()
    if ( this.id ) {
      this.getByID()
    }
  }

  getFinancialYear = () => {
    this.$miscellaneous.getAllActivefinancial_year().subscribe((res:any)=>{
      if(res.code == 200){
        this.yearlyAssessment = res.data;
        const currentYear = new Date().getFullYear();
        this.financialYear = this.yearlyAssessment.filter((assessment:any) => {
          if ( this.filter_fy == assessment.id ) {
            return true;
          }
        });
        this.financialYear2 = this.financialYear
        this.years = this.financialYear.map((value:any) => value.financial_year)
      }
    })
  }

  getColleagueReview = () =>{

  }

  updateValues = () => {
    this.review.get('role_id')?.setValue(null)
    this.review.get('employee_id')?.setValue(null) 
  }

  getAssessment = (e:any) => {
    this.review.get('assessment_name')?.setValue(null)
    this.review.get('role_id')?.setValue(null)
    this.review.get('employee_id')?.setValue(null) 
    this.colleagueReviewService.getAllAssessment(this.filter_fy,this.entity_id,e.value).subscribe((res)=>{
      if(res.code == 200){
        this.assessments  = res.data;
        this.assessments2  = res.data;
        this.assessmentList  = this.assessments.map((value:any) => value.assessment_name);
      }
    })
  }

  get reviews(){
    return this.review.get('reviews') as FormArray;
  }

  getByID = () => {
    this.colleagueReviewService.getById(1).subscribe((res)=>{
      if(res.code == 200){
        this.ColleagueReview  = res.data;
        this.isDisabled = true;
        this.colleagueReviewService.getAllAssessment(this.filter_fy,this.entity_id,this.ColleagueReview.financial_year_id).subscribe((res)=>{
          if(res.code == 200){
            this.assessments  = res.data;
            this.colleagueReviewService.get_all_employeeBy_User_role(this.ColleagueReview.roleId,this.entity_id,this.ColleagueReview.assessment_name,this.filter_fy,this.login_id).subscribe((res:any) => {
              if (res.code == 200){
                this.employees = res.data;
                console.log(this.employees)

                this.review.patchValue({
                  emp_name: res.data.first_name,
                  emp_number:res.data.employee_code,
                  department_name:res.data.department_name,
                  area_name:res.data.area_name,
                  hierarchical_superio:res.data.reporting_manager,
                });
                
                if(this.ColleagueReview.reviews.length>0){
                  this.ColleagueReview.reviews.forEach(async (element:any,index:any) => {
                    const formGroup = await this.reviews.at(index) as FormGroup;
                    formGroup.patchValue({
                      self_rating_id: element.self_rating || null
                    });
                  });
                }
              } 
            })
          }
        })
      }
    })
  }

  setCompetence = () => {
    for(let data of this.Competence){
      this.reviews.push(
        this.fb.group({
          Competence: [data],
          rating: [null,[Validators.required]]
        })  
      )
    }
  }

  localStorage = () => {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.EmpMainId = this.loginUser.employee_id;
    this.login_id = this.EmpMainId;
    this.filter_fy = localStorage.getItem('financial_id');
    this.entity_id = JSON.parse(entity);
  }

  getAllRole(){
    this.config.getAllRole('Super Admin').subscribe((res:any)=>{
      if(res.code == 200){
        this.roles = res.data;
        this.roles2 = res.data;
        this.rolesList = this.roles.map((value:any) => value.role_master_name);
        console.log("+++++++++",this.roles)
      }  
    });
  }

  onSelectionChange(e:any){
    this.review.get('employee_id')?.setValue(null) 
    this.colleagueReviewService.get_all_employeeBy_User_role(e.value,this.entity_id,this.review.get('assessment_name')?.value,this.filter_fy,this.login_id).subscribe((res:any) => {
      if (res.code == 200){
        this.employees = res.data;
        this.employees2 = res.data;
        this.employeeList = this.employees.map((value:any) => value.employee_name)
        console.log(this.employees)
      }else {
        this.employees = []
      }
    },(err:any) => {
      this.employees = []
    })
  }

  onSelect(e:any){
    this.employees.forEach((value:any) => {
      if ( value.employee_id == this.review.get('employee_id')?.value ) {
        this.submit_assessment_id = value.submit_assessment_id
      } 
    } )
  }
  back(){
    this.route.navigate([`/master/ess/colleague-review`])
  }

  SelfAssessentRating(){
    this.selfAssessmentService.getSelfAssessentRating().subscribe((res:any)=>{
      this.selfAssessmentRating = res.data;
    });
  }

  yearSearch(e: any) {
    const aa = e
    let filteredVariable = this.financialYear2.filter((item: any) => aa.includes(item.financial_year));
    this.financialYear = filteredVariable
  }

  assessmentSearch(e: any) {
    const aa = e
    let filteredVariable = this.assessments2.filter((item: any) => aa.includes(item.assessment_name));
    this.assessments = filteredVariable
  }

  roleSearch(e: any) {
    const aa = e
    let filteredVariable = this.roles2.filter((item: any) => aa.includes(item.role_master_name));
    this.roles = filteredVariable
  }

  employeeSearch(e: any) {
    const aa = e
    let filteredVariable = this.employees2.filter((item: any) => aa.includes(item.employee_name));
    this.employees = filteredVariable
  }

  onSubmit(){
    if(this.review.invalid ){
      this.reviews.controls.forEach(control => {
        control.markAllAsTouched(); 
      });
      this.toaster.error("All Fields are not valid")
      return
    }
   

    let payload = {
      review: this.review.value,
      entity_id : this.entity_id,
      filter_fy: this.filter_fy,
      login_id: this.EmpMainId,
      submit_assessment_id : this.submit_assessment_id
    }
    
    // this.isButtonDisabled = true;

    Swal.fire({
      title: 'Are you sure ?',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result:any) => { 
      if (result.isConfirmed) {
        this._commonService?.showLoader()
        this.colleagueReviewService.addReview(payload).subscribe((res:any)=>{
          this._commonService?.hideLoader()
          if(res.code ==200){
            this.toaster.success("Successfully Submitted");
            setTimeout(() => {
              this.route.navigate(['/master/ess/colleague-review']);
            }, 500);
          }
          else{
            this.toaster.error(res.message);
          }
        }, (err:any) => {
          this._commonService?.hideLoader()
          this.toaster.error(err.error.message)
          this.isButtonDisabled = false;
        });
      };
    });
  }
}