import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanelTitle } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { LmsService } from 'src/app/@shared/services/lms/lms.service';
import { environment } from 'src/app/environments/environment';
import { CommonCourseDialogComponent } from '../common-course-dialog/common-course-dialog.component';

@Component({
  selector: 'app-common-course-detaile',
  templateUrl: './common-course-detaile.component.html',
  styleUrls: ['./common-course-detaile.component.scss']
})
export class CommonCourseDetaileComponent {
  separateDialCode = false;
  categoryList: any = []
  dialogRef: MatDialog | any;
  courseForm: FormGroup;
  now = new Date();
  baseUrl :any
  year = this.now.getFullYear();
  month = this.now.getMonth();
  date = this.now.getDate();

  max = moment().format('YYYY-MM-DD');
  min = moment().format('YYYY-MM-DD');
  private readonly _currentYear = new Date().getFullYear();
  readonly minDate = new Date(this._currentYear - 100, 0, 1);

  courseId: string | null = null;
  Type: any;
  filteredList5: any;
  contentData: any = []
  @ViewChild('advancedDetailsPanel') advancedDetailsPanel: MatExpansionPanelTitle;
  dynamicText: string;
  dynamicbutton: string;
  paramsVal: any;
  action_type: any
  courseData :any

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private lmsSercice: LmsService,
    private toaster: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _lmsService: LmsService,
    private router: ActivatedRoute,
    public dialog: MatDialog,
    private $common: CommonService
  ) {
    this.router.queryParams.subscribe((params) => {
      this.courseId = params['course_id'];
      this.action_type = params['action_type'];
      this.dynamicText = this.courseId ? 'Edit' : 'New';
      this.dynamicbutton = this.courseId ? 'Update' : 'Save';
    });
    this.baseUrl = environment.serverUrl;
    this.courseForm = this.fb.group({
      course_name: ['', Validators.required],
      thumbnail: ['', Validators.required],
      category: ['', Validators.required],
      course_type: ['CommonContent', Validators.required],
      contentData: [[]]
    });
    if(this.courseId){
      this.getCourseById()
    }
    console.log(this.action_type,"action type");
    
  }
 
  ngOnInit(): void {
    this.getLmsCourseCategory();
  }

  viewImg() {

    window.open(this.baseUrl + '/' + this.thumbnail_photo, '_blank');
  }
  
  
  closedContactTypeDialog() {
    this.dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }

  clickToGoAssesment(data: any) {
    if (data.target.value) {
      this.router.queryParams.subscribe((params) => {
        console.log(params);
        
      });

      this.route.navigate(["master/lms/course/add_assesment"], {
        queryParams: {
          val: data.target.value
        }
      });
      
    }
  }

  openlink(e:any){
    window.open( e, '_blank');
  }
  getLmsCourseCategory() {
    this._configurationalMasterService.getLmsCourseCategory().subscribe((res: any) => {
      this.categoryList = res.data;


    })
  }
  thumbnail_photo: any
  getCourseById() {
    this._lmsService.getCourseDetails(this.courseId).subscribe(
      (response: any) => {
        if (response?.data) {
          this.courseData = response.data;
          
  
          this.contentData = this.courseData.contentData;
      this.thumbnail_photo = this.courseData.thumbnail;
          this.courseForm.patchValue({
            course_name: this.courseData?.course_name,
            category: this.courseData?.category,
            course_type: this.courseData?.course_type || 'CommonContent',
            thumbnail : this.courseData?.thumbnail,
          });
        }
      },
      error => {
        console.error('Error fetching course details:', error);
      }
    );
  }
  openContent(e:any){
    const dialogRef = this.dialog.open(CommonCourseDialogComponent, {
      // width: '60%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      // height: '300px',
      data: { tableData: e, id: 1 }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contentData[e.id] = result;
      }
    });
  }
  uploadDoc(event: any) {
    try {
      let isValidExtension = this.$common.checkForValidFile(event);
      if (!isValidExtension) {
        this.courseForm.patchValue({ thumbnail_photo: null });
        return this.thumbnail_photo = ""
      }
      const formData = new FormData();
      if (event.target.files && event.target.files[0]) {
        formData.append('file', event.target.files[0]);
      }
      this.lmsSercice.documents(formData).subscribe((response: any) => {
        if (response) {
          this.thumbnail_photo = `uploaded_files/${response?.url}`;
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  removeContent(index: Number) {
    this.contentData.splice(index, 1);
  }
}
