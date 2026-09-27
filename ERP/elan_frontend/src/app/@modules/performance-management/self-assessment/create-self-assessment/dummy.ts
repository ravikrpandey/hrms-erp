import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { SelfAssessmentService } from '../self-assessment.service';
import { environment } from 'src/app/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ViewAssessmentComponent } from '../view-assessment/view-assessment.component';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-create-self-assessment',
  templateUrl: './create-self-assessment.component.html',
  styleUrls: ['./create-self-assessment.component.scss']
})
export class CreateSelfAssessmentComponent {
  employeeDetail:FormGroup;
  technicalAssement:FormGroup;
  behaviorAssessment:FormGroup;
  skillDevelopmentForm:FormGroup;
  suggestSkillDevelopmentForm:FormGroup;
  endDate:any;
  startDate:any;
  sdpEndDate:any;
  sdpStartDate:any;
  entity_id: any;
  financial_id: any;
  techAssessment: any = [];
  selfAssessmentRating: any = [];
  selfEmployee: any = [];
  EmpMainId: any;
  Competence: string[] = ['Leadership','Ethic','Excellence','Accountability']
  baseUrl = environment.servralUrl;
  skill_document: any;
  loginUser: any;
  Rating_status: any = "Pending For Committee Review";
  yearly_assessment_id: any;
 
  getAllBehavior: any= [];
  getSkillDevelopment: any = [];
  getKpaMaster: any = [];
  paramsType: any;
  financial_year_id: any;
  paramsEndpoints: { entity_id: any; financial_id: any; employee_id: string | null; };
  kpa_assessment: any = [];
  Months: string[];
  currentDate:any;
  params_employee_id: any;
  main_entity: string | null;
  main_financial_id: string | null;
  params_entity_id: any;
  params_financial_id: any;
  main_endpoints: { financial_id: number; entity_id: number; employee_id: number; };
  constructor(private fb: FormBuilder, private selfAssessmentService:SelfAssessmentService, private toaster: ToastrService, private route: Router, private activeroute:ActivatedRoute, public dialog: MatDialog,private http:HttpClient){
    this.employeeDetail = this.fb.group({
      emp_name:[''],
      emp_number:[''],
      department_name:[''],
      area_name:[''],
      hierarchical_superio:[''],
      start_date:[''],
      end_date:[''],
      emp_month:[''],
      assessment_name:['']
    });

    this.technicalAssement = this.fb.group({
      technicalItems:this.fb.array([])
    });

    this.behaviorAssessment = this.fb.group({
      behaviorItems:this.fb.array([])
    });

    for(let data of this.Competence){
      this.behaviorItems.push(
        this.fb.group({
          self_rating_id:[null],
          manager_rating_id:[null,[Validators.required]],
          Competence: [data]
        })
      )
    }

    this.suggestSkillDevelopmentForm = this.fb.group({
      remark: [''],
      remark_by_employee:[''],
      current_date:['',Validators.required],
      suggestDevelopment:this.fb.array([
        this.fb.group({
          development:['',[Validators.required]],
        })
      ])
    });

    this.skillDevelopmentForm = this.fb.group({
      items:this.fb.array([
        this.fb.group({
          development:[''],
          action_plan:[''],
          initiate_date:[null],
          end_date: [null],
          files:['']
        })
      ])
    });

    this.activeroute.queryParams.subscribe((params: any) => {
      this.paramsType = params.type;
      this.params_employee_id = params.emp_id;
      this.yearly_assessment_id = Number(params?.id);
      this.params_financial_id = params.financial_year_id;
      this.params_entity_id = Number(params.entity_id);
    });
  }

  get items(){
    return this.skillDevelopmentForm.get('items') as FormArray;
  }

  get suggestDevelopment(){
    return this.suggestSkillDevelopmentForm.get('suggestDevelopment') as FormArray;
  }

  
  get behaviorItems(){
    return this.behaviorAssessment.get('behaviorItems') as FormArray;
  }

  
  get technicalItems(){
    return this.technicalAssement.get('technicalItems') as FormArray;
  }

  ngOnInit(){
    this.localStorage();
    this.getKpi();
    this.SelfAssessentRating();
    this.getEmployee();
    this.getEmployeeAssessment();
    this.getMonth();
  }
  getMonth(){
    this.Months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  }

  getEmployeeAssessment(){
    let paramsEndpoint = {
      entity_id: this.params_entity_id,
      financial_id: this.params_financial_id,
      employee_id:  this.params_employee_id,
      yearly_assessment_id : this.yearly_assessment_id
    }

    this.selfAssessmentService.getEmployeeAssessment(paramsEndpoint).subscribe((res:any)=>{
      if(res.code == 200){
        this.getAllBehavior = res.data.getAllBehavior;
        this.getSkillDevelopment = res.data.getSkillDevelopment;
        this.getKpaMaster = res.data.getKpaMaster;

        if(this.getKpaMaster.length >0){
          this.kpa_assessment = [];
          this.getKpaMaster?.forEach(async (element:any,index:any) => {
            const formGroup = await this.technicalItems.at(index) as FormGroup;
            formGroup.patchValue({
              self_rating_id: element.self_rating_id
            });
            this.technicalItems.controls[index]?.get('self_rating_id')?.disable();
          });

          this.techAssessment.forEach((kpadata:any) => {
            this.getKpaMaster.forEach((technical_assessment:any) => {
              if(kpadata.id === technical_assessment.kpa_id){
                this.kpa_assessment.push(kpadata);
              }
            });
          });
        }
        
        if(this.getAllBehavior.length>0){
          this.getAllBehavior.forEach(async (element:any,index:any) => {
            const formGroup = await this.behaviorItems.at(index) as FormGroup;
            formGroup.patchValue({
              self_rating_id: element.self_rating || null
            });
            this.behaviorItems.controls[index]?.get('self_rating_id')?.disable();
          });
        }

        if(this.getSkillDevelopment.length>0){
          this.getSkillDevelopment.forEach(async (element:any,index:any) => {
            this.items.push(
              this.fb.group({
                development:[''],
                action_plan:[''],
                initiate_date:[null],
                end_date: [null],
                files:['']
              })
            )
            const formGroup = await this.items.at(index) as FormGroup;
            formGroup.patchValue({
              development: element.need_for_development || "",
              action_plan:element.action_plan || "",
              initiate_date:element.initiate_date || null,
              end_date:element.end_date || null,
              files:element.file_document
            });
            // this.getFileName(index);
            this.skillDevelopmentForm.patchValue({
              remark:element.remarks
            });
            this.items.controls[index].get('development')?.disable();
            this.items.controls[index].get('action_plan')?.disable();
            this.items.controls[index].get('initiate_date')?.disable();
            this.items.controls[index].get('end_date')?.disable();
          });
          this.skillDevelopmentForm.get('remark')?.disable();
        }
      }
    })
  }

  getFileName(index: number) {
    const fileName = 'downloaded-file.jpg'; // Desired file name
     const fileUrl:any = this.items.at(index).get('files')?.value as File;
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error => console.error('Download failed', error)
    );
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  back(){
    this.route.navigate(['master/performance/team-performance-assessment']);
  }

  createTecnicalField(){
    console.log("kpa_assessmentkpa_assessment",this.kpa_assessment);
    
    for(let data of this.kpa_assessment){
      this.technicalItems.push(
        this.fb.group({
          self_rating_id:[null],
          manager_rating_id:[null,[Validators.required]],
          kpa_id:[data.id]
        })
      )
    }
  }

  startDateValidator(index: number, items: AbstractControl[]): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const initiateDate = items[index]?.get('initiate_date')?.value;
      const endDate = items[index]?.get('end_date')?.value;
      const previousEndDate = items[index - 1]?.get('end_date')?.value;
      if(endDate && endDate <= initiateDate){
        return { 'currentendDateInvalid': true };
      }
      return initiateDate && initiateDate < previousEndDate
        ? { 'startDateInvalid': true }
        : null;
    };
  }

  endDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const parentGroup = control.parent as FormGroup | null;
    if (!parentGroup) {
      return null;
    }
  
    const startDate = parentGroup.controls['initiate_date'].value;
    const endDate = control.value;
  
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return { 'endDateInvalid': true };
    }
    return null;
  }
  

  addRow(){
    this.items.push(
      this.fb.group({
        development:[''],
        action_plan:[''],
        initiate_date:[null],
        end_date: [null],
        files:['']
      })
    )
  }

  romoveRow(index:any){
    this.items.removeAt(index);
  }

  SuggestAddRow(){
    this.suggestDevelopment.push(
      this.fb.group({
        development:['',[Validators.required]],
      })
    )
  }

  romoveSuggestRow(index:any){
    this.suggestDevelopment.removeAt(index);
  }

  getKpi(){
    this.selfAssessmentService.getSelfAssessentKpi(this.paramsEndpoints).subscribe((res:any)=>{
      if(res.code == 200){
        this.techAssessment = res.data;
        // bellow line use for backup the data please do not remove this code
        this.kpa_assessment = this.techAssessment;
        this.createTecnicalField();
      }  
    });
  }

  SelfAssessentRating(){
    this.selfAssessmentService.getSelfAssessentRating().subscribe((res:any)=>{
      this.selfAssessmentRating = res.data;
    });
  }

  localStorage() {
    this.main_entity = localStorage.getItem('selectedEntityId');
    this.main_financial_id = localStorage.getItem('financial_id');
    this.EmpMainId = localStorage.getItem('EmpMainId');
  
    this.paramsEndpoints ={
      employee_id:  this.params_employee_id,
      financial_id: this.params_financial_id,
      entity_id: this.params_entity_id
    }

    this.setEndPoint();
  }

  setEndPoint(){
    this.main_endpoints = {
      financial_id :Number(this.main_financial_id),
      entity_id : Number(this.main_entity),
      employee_id : Number(this.EmpMainId),
    }
  }

  
  getEmployee(){
    let paramsEndpoints = {
      entity_id:this.params_entity_id,
      employee_id: this.params_employee_id,
      yearly_assessment_id: this.yearly_assessment_id,
    }
    this.selfAssessmentService.getTeamAssessentemployee(paramsEndpoints).subscribe((res:any)=>{
      if(res.code ==200){
        this.selfEmployee = res.data;
        this.employeeDetail.patchValue({
          emp_name:this.selfEmployee.full_name,
          emp_number:this.selfEmployee.employee_code,
          department_name:this.selfEmployee.department_name,
          area_name:this.selfEmployee.area_name,
          hierarchical_superio:this.selfEmployee.reporting_manager,
          start_date:this.selfEmployee.start_date,
          end_date:this.selfEmployee.end_date,
          assessment_name:this.selfEmployee.assessment_name
        });

        this.employeeDetail.get('emp_name')?.disable();
        this.employeeDetail.get('emp_number')?.disable();
        this.employeeDetail.get('department_name')?.disable();
        this.employeeDetail.get('area_name')?.disable();
        this.employeeDetail.get('hierarchical_superio')?.disable();
        this.employeeDetail.get('start_date')?.disable();
        this.employeeDetail.get('end_date')?.disable();
        this.employeeDetail.get('assessment_name')?.disable();
        
        // if(this.paramsType == "view"){
        //   this.getSelfAssessment();
        // }
      }
    });
  }

  uploadDoc(index:any,evemt: any) {
    try {
      const formData = new FormData();
      if (evemt.target.files && evemt.target.files[0]) {
        formData.append('file', evemt.target.files[0]);
      }
      this.selfAssessmentService.documents(formData).subscribe((response: any) => {
        if (response) {
          this.skill_document = response?.url;
          this.patchFilesValue(index, this.skill_document);
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

patchFilesValue(formGroupIndex: number, filesValue: any) {
  const formGroup = this.items.at(formGroupIndex) as FormGroup;
  formGroup.get('files')?.patchValue('/uploaded_files/'+filesValue);
}

view(kpiData:any) {
  const dialogRef = this.dialog.open(ViewAssessmentComponent, {
    data: { data:kpiData, action: "view" },
    width: '500px',
  });

  dialogRef.afterClosed().subscribe((result) => {
    // this.reloadCurrentRoute();
  });
}

  onSubmit(){
    console.log("kkkkkkkkkkkkkkkkkkkkk");
    
    if(this.suggestSkillDevelopmentForm.invalid || this.technicalAssement.invalid || this.behaviorAssessment.invalid){
      this.suggestDevelopment.controls.forEach(control => {
        control.markAllAsTouched(); 
      });
      
      this.behaviorItems.controls.forEach(control => {
        control.markAllAsTouched(); 
      });
      
      this.technicalItems.controls.forEach(control => {
        control.markAllAsTouched(); 
      });
      return
    }
    let payload = {
      SuggestSkillDevelopmentForm: this.suggestSkillDevelopmentForm.value,
      behaviorAssessment: this.behaviorAssessment.value,
      technicalAssement: this.technicalAssement.value,
      rating_status:this.Rating_status,
      yearly_assessment_id: this.yearly_assessment_id
    }
    console.log("payloadpayloadpayload",payload);
    
    // this.selfAssessmentService.postSelfAssessment(this.paramsEndpoints,payload).subscribe((res:any)=>{
    //   if(res.code ==200){
    //     this.toaster.success(res.message);
    //     setTimeout(() => {
    //       this.route.navigate(['master/performance-assessment/team-performance-assessment']);
    //     }, 4000);
    //   }
    //   else{
    //     this.toaster.error(res.message);
    //   }
    // }, err => {
    //   this.toaster.error(err.error.message)
    // });
  }
}
