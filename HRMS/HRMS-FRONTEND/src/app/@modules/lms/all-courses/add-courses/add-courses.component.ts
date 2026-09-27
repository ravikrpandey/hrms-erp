import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { AddContentComponent } from '../add-content/add-content.component';
import { LmsService } from 'src/app/@shared/services/lms/lms.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-add-courses',
  templateUrl: './add-courses.component.html',
  styleUrls: ['./add-courses.component.scss']
})
export class AddCoursesComponent {
  separateDialCode = false;
  categoryList: any = []
  dialogRef: MatDialog | any;
  courseForm: FormGroup;
  now = new Date();
  baseUrl: any
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
  @ViewChild('advancedDetailsPanel') advancedDetailsPanel: MatExpansionPanel;
  dynamicText: string;
  dynamicbutton: string;
  paramsVal: any;
  action_type: any

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
      thumbnail: [''],
      category: ['', Validators.required],
      course_type: ['CommonContent', Validators.required],
      contentData: [[]]
    });
    if (this.courseId) {
      this.getCourseById()
    }
  }
  ngOnInit(): void {
    this.getLmsCourseCategory();
  }
  addContentDialog() {
    const dialogRef = this.dialog.open(AddContentComponent, {
      width: '50%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '47%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contentData.push(result);
      }
    });
  }

  viewImg() {

    window.open(this.baseUrl + '/' + this.thumbnail_photo, '_blank');
  }
onSubmit(): void {
  if (!this.courseForm.contains('contentData')) {
    this.courseForm.addControl('contentData', new FormControl(this.contentData));
  } else {
    this.courseForm.get('contentData')?.setValue(this.contentData);
  }
  const controls = this.courseForm.controls;

  if (
    this.courseForm.invalid ||
    !this.thumbnail_photo ||
    !this.contentData || this.contentData.length === 0
  ) {
    if (controls['course_name'].invalid) {
      this.toaster.error('Course Name is required', 'Validation Error');
    } else if (controls['category'].invalid) {
      this.toaster.error('Category is required', 'Validation Error');
    } else if (!this.thumbnail_photo) {
      this.toaster.error('Thumbnail is required', 'Validation Error');
    } else if (!this.contentData || this.contentData.length === 0) {
      this.toaster.error('At least one course content must be added', 'Validation Error');
    } else {
      this.toaster.error('Please fill all required fields', 'Validation Error');
    }

    this.courseForm.markAllAsTouched();
    return;
  }

  const payload = {
    ...this.courseForm.value,
    thumbnail: this.thumbnail_photo,
  };
  if (this.courseId) {
    this.lmsSercice.updateSingleCourseContent(this.courseId, payload).subscribe(
      (response: any) => {
        this.toaster.success(response.message);
        this.route.navigate(['/master/lms/course']);
      },
      (error) => {
        this.toaster.error(error.error.message);
        console.error('Error submitting', error);
      }
    );
  } else {
    this.lmsSercice.addCourse(payload).subscribe(
      (response: any) => {
        this.toaster.success(response.message);
        this.route.navigate(['/master/lms/course']);
      },
      (error) => {
        this.toaster.error(error.error.message);
        console.error('Error submitting', error);
      }
    );
  }
}  closedContactTypeDialog() {
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
  filterCategoryList: any
  getLmsCourseCategory() {
    this._configurationalMasterService.getLmsCourseCategory().subscribe((res: any) => {
      this.categoryList = res.data;
      this.filterCategoryList = [...this.categoryList]



    })
  }
  thumbnail_photo: any
  getCourseById() {
    this._lmsService.getCourseDetails(this.courseId).subscribe(
      (response: any) => {
        if (response?.data) {
          const courseData = response.data;


          this.contentData = courseData.contentData;
          this.thumbnail_photo = courseData.thumbnail;
          this.courseForm.patchValue({
            course_name: courseData?.course_name,
            category: courseData?.category,
            course_type: courseData?.course_type || 'CommonContent',
            thumbnail: courseData?.thumbnail,
          });
        }
      },
      error => {
        console.error('Error fetching course details:', error);
      }
    );
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
  editContent(index: number) {
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
  viewImage(e: any) {

    window.open(this.baseUrl + '/' + e, '_blank');
  }
  viewContent(index: number) {
    const dialogRef = this.dialog.open(AddContentComponent, {
      width: '60%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '47%',
      data: { tableData: this.contentData[index], id: 1, view: true }
    });
  }

}
