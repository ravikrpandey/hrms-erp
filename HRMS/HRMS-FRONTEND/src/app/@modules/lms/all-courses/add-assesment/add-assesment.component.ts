import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { AddQuestionComponent } from '../add-question/add-question.component';
import { LmsService } from 'src/app/@shared/services/lms/lms.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { AddContentComponent } from '../add-content/add-content.component';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-add-assesment',
  templateUrl: './add-assesment.component.html',
  styleUrls: ['./add-assesment.component.scss']
})
export class AddAssesmentComponent {
  baseUrl :any
  separateDialCode = false;
  categoryList: any[] = [];
  dialogRef: MatDialogRef<any> | null = null;
  courseForm: FormGroup;
  assessmentForm: FormGroup;
  max = moment().format('YYYY-MM-DD');
  min = moment().format('YYYY-MM-DD');
  readonly minDate = new Date(new Date().getFullYear() - 100, 0, 1);
  courseId: string | null = null;
  contentData: any = [];
  questionData: any = [];
  dynamicText = '';
  dynamicbutton = '';
  activeTab: string = 'content';
  thumbnail_photo: string | null = null;
  action_type : any

  @ViewChild('advancedDetailsPanel') advancedDetailsPanel!: MatExpansionPanel;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private lmsService: LmsService,
    private toaster: ToastrService,
    private configService: ConfigurationalmasterService,
    private router: ActivatedRoute,
    public dialog: MatDialog,
    private commonService: CommonService
  ) {
 
    this.baseUrl = environment.serverUrl;
    this.router.queryParams.subscribe(params => {
      this.courseId = params['course_id'];
      this.action_type = params['action_type'];
      this.dynamicText = this.courseId ? 'Edit' : 'New';
      this.dynamicbutton = this.courseId ? 'Update' : 'Save';
    });

    this.assessmentForm = this.fb.group({
      assessment_name: ['', Validators.required],
      assessment_marks: ['', [Validators.required, Validators.min(0)]],
      assessment_percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      assessment_time: ['', Validators.required],
      max_attempts: ['', [Validators.required, Validators.min(1)]],
      questions: this.fb.array([])  
    });

    this.courseForm = this.fb.group({
      course_name: ['', Validators.required],
      thumbnail: ['', Validators.required],
      category: ['', Validators.required],
      course_type: ['contentWithAssesment', Validators.required],
      contentData: [[]],
      assesment: this.assessmentForm 
    });
    
    if(this.courseId){
      this.getCourseById()
    }
  }

  ngOnInit(): void {
    this.getLmsCourseCategory();

  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  clickToGoAssesment(data: any): void {
    if (data.target.value) {
      this.route.navigate(['master/lms/course/add_assesment'], {
        queryParams: { val: data.target.value }
      });
    }
  }
  addContentDialog(): void {
    const dialogRef = this.dialog.open(AddContentComponent, {
      width: '50%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '47%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contentData.push(result);
      }
    });
  }
  get assessmentQuestions(): FormArray {
    return this.assessmentForm.get('questions') as FormArray; 
  }
  openQuestionDialog(): void {
    const dialogRef = this.dialog.open(AddQuestionComponent, {
      width: '60%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '60%',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result:', result);
  
       
        if (!this.assessmentQuestions) {
          console.error('assessmentQuestions is not initialized.');
          return;
        }
  
        
        const newQuestion = this.fb.group({
          question_text: [result.question_text, Validators.required],
          options: this.fb.array(
            result.options.map((opt: any) =>
              this.fb.group({
                option_text: [opt.text, Validators.required],
                isCorrect: [opt.isCorrect],
              })
            )
          ),
          status: [result.status, Validators.required],
          correct_answer: [result.correct_answer, Validators.required],
        });
  
        
        this.assessmentQuestions.push(newQuestion);
      }
    });
  }
  editQuestionDialog(index: number): void {

    console.log(index);
    
    const question = this.assessmentQuestions.at(index).value;

    console.log(question)
  
    const dialogRef = this.dialog.open(AddQuestionComponent, {
      width: '50%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '60%',
      data: question , 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result:', result);
  
        if (!this.assessmentQuestions) {
          console.error('assessmentQuestions is not initialized.');
          return;
        }
  
       
        const updatedQuestion = this.fb.group({
          question_text: [result.question_text, Validators.required],
          options: this.fb.array(
            result.options.map((opt: any) =>
              this.fb.group({
                option_text: [opt.text, Validators.required],
                isCorrect: [opt.isCorrect],
              })
            )
          ),
          status: [result.status, Validators.required],
          correct_answer: [result.correct_answer, Validators.required],
        });
  
        this.assessmentQuestions.setControl(index, updatedQuestion);
      }
    });
  }
  
  viewQuestionDialog(index: number): void {
    const questionToView = this.assessmentQuestions.at(index).value; 
    this.dialog.open(AddQuestionComponent, {
      width: '50%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '60%',
      data: { question: questionToView, mode: 'view' }, 
    });
  }
  
  getCourseById() {
    this.lmsService.getCourseDetails(this.courseId).subscribe(
      (response: any) => {
        if (response?.data) {
          const courseData = response.data;
          const assessmentData = courseData.assesments[0]; 
          this.thumbnail_photo = courseData.thumbnail;
          this.contentData = courseData.contentData;
  
          this.assessmentForm.patchValue({
            assessment_name: assessmentData?.assessment_name,
            assessment_marks: assessmentData?.total_marks,
            assessment_percentage: assessmentData?.pass_percentage,
            assessment_time: assessmentData?.assessment_time_minutes,
            max_attempts: assessmentData?.max_attempts,
          });
  
         
          const questionFormArray = this.assessmentForm.get('questions') as FormArray;
          questionFormArray.clear();
  
          assessmentData.questions.forEach((q: any) => {
            const questionGroup = this.fb.group({
              question_text: [q.question_text, Validators.required],
              question_type: [q.question_type, Validators.required],
              marks: [q.marks, [Validators.required, Validators.min(0)]],
              isDeleted: [q.isDeleted || false],
              correct_answer : [q.correct_answer, Validators.required],
              options: this.fb.array( 
                q.options.map((opt: any) =>
                  this.fb.group({
                    option_text: [opt.option_text, Validators.required],
                    isCorrect: [opt.isCorrect],
                  })
                )
              ),
            });
  
            questionFormArray.push(questionGroup);
          });
  
         
          this.courseForm.patchValue({
            course_name: courseData?.course_name,
            category: courseData?.category,
            course_type: courseData?.course_type || 'contentWithAssesment',
            thumbnail : courseData?.thumbnail,
          });
        }
      },
      error => {
        console.error('Error fetching course details:', error);
      }
    );
  }
  
  
  onCourseTypeChange(event: any): void {
    const selectedValue = event.value;

    if (selectedValue === 'contentWithAssesment') {
      this.route.navigate(['/master/lms/course/add_course_with_assessment']);
    } else if (selectedValue === 'CommonContent') {
      this.route.navigate(['/master/lms/course/add_course']);
    }
  }

  removeQuestion(index: number): void {
    this.assessmentQuestions.removeAt(index);
  }


  saveAndNext() {
      this.setActiveTab('assessment');
  }
  onSubmit(): void {
    if(this.courseId){
      this.courseForm.patchValue({ contentData: this.contentData });

      const payload = {
        ...this.courseForm.value,
        thumbnail: this.thumbnail_photo,
      };
      console.log(payload);
      
  
      this.lmsService.updateSingleCourseAssessment(this.courseId,payload).subscribe(
        (response: any) => {
          this.toaster.success(response.message);
          this.route.navigate(['/master/lms/course']);
        },
        error => {
          this.toaster.error(error.error.message);
          console.error('Error submitting form:', error);
        }
      );
    }else{
    this.courseForm.patchValue({ contentData: this.contentData });

    if (this.courseForm.invalid) {
      console.log(this.courseForm.value);
      this.toaster.error('Please fill all required fields.');
      return;
    }
    const payload = {
      ...this.courseForm.value,
      thumbnail: this.thumbnail_photo,
    };
 

    this.lmsService.addCourseAssessment(payload).subscribe(
      (response: any) => {
        this.toaster.success(response.message);
        this.route.navigate(['/master/lms/course']);
      },
      error => {
        this.toaster.error(error.error.message);
        console.error('Error submitting form:', error);
      }
    );
  }
  }

  getLmsCourseCategory(): void {
    this.configService.getLmsCourseCategory().subscribe((res: any) => {
      this.categoryList = res.data || [];
    });
  }
  viewImage(e:any) {

    window.open(this.baseUrl + '/' +e, '_blank');
  }
  uploadDoc(event: Event): void {
    try {
      const target = event.target as HTMLInputElement;
      const files = target.files;

      if (!files || !files[0]) {
        return;
      }

      const isValidExtension = this.commonService.checkForValidFile(event);
      if (!isValidExtension) {
        this.courseForm.patchValue({ thumbnail_photo: null });
        this.thumbnail_photo = null;
        return;
      }

      const formData = new FormData();
      formData.append('file', files[0]);

      this.lmsService.documents(formData).subscribe(
        (response: any) => {
          if (response) {
            this.thumbnail_photo = `uploaded_files/${response.url}`;
          }
        },
        err => console.error(err)
      );
    } catch (error) {
      console.error(error);
    }
  }

  removeContent(index: number): void {
    this.contentData.splice(index, 1);
  }

  editContent(index: number): void {
    const dialogRef = this.dialog.open(AddContentComponent, {
      width: '60%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '47%',
      data: { tableData: this.contentData[index], id: 1 }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contentData[index] = result;
      }
    });
  }

  viewContent(index: number): void {
    this.dialog.open(AddContentComponent, {
      width: '60%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '47%',
      data: { tableData: this.contentData[index], id: 1, view: true }
    });
  console.log(this.contentData[index])
  }

}
