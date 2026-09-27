import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
// import { DMSService } from 'src/app/@shared/services/dms.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
// import { ContentDialogComponent } from './content-dialog/content-dialog.component';
import { LmsServiceService } from 'src/app/@shared/services/lms-service.service';
// import { ContentDialogComponent } from 'src/app/@modules/lms/lms-management/dashboard-lms/super-admin/content-learning/content-dialog/content-dialog.component';
import { LmsUserManagementService } from 'src/app/@shared/services/lms-user-management.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
// import { LmsApprovalDialogComponent } from 'src/app/@modules/header-menu/my-pending-task/lms-approval-dialog/lms-approval-dialog.component';
import { ContentDialogComponent } from '../../content-dialog/content-dialog.component';

@Component({
  selector: 'app-lms',
  templateUrl: './lms.component.html',
  styleUrls: ['./lms.component.scss']
})
export class LMSComponent implements OnInit {
  rowData: any;
  showLoader: boolean = false;
  disabledSearchBox: boolean = true;
  searchVal: any = '';
  empId: any;
  show: any;

  constructor(private _lmsService: LmsServiceService,
    
    public dialog: MatDialog,
    private _lmsUserManagementService: LmsUserManagementService,
    private route: Router,
    private toster: ToastrService,
    
  ) {
  }

  ngOnInit(): void {
    let loginUser: any = localStorage.getItem('signInUser');
    let emp: any = JSON.parse(loginUser);
    this.empId = emp?.employee_id
    this.getPenddingData(emp?.employee_id);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  getPenddingData(id: any) {
    this.showLoader = true;
    this._lmsUserManagementService.penddingCourse(id).subscribe(
      (res) => {
        
        this.showLoader = false;
        this.rowData = res.data
      }, (err) => {
        this.showLoader = false;
        
      }
    )
  }

  rejectBtn(course: any, e: any) {
    e.stopPropagation();
    if (course) {
      Swal.fire({
        title: 'Are you sure to reject this course?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: "#f44336",
        confirmButtonColor: "#3f51b5",
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          const data = {
            course_request_status: 'NOT REQUEST',
            author_course_id: this.empId,
            employee_id: course.registered_user.employee_id 
          };

          this._lmsUserManagementService.sendCourseRequest(course.traning_id, data).subscribe(
            (res) => {
              
              this.toster.success('Request Rejected successfully')
              this.reloadCurrentRoute();
            }, (err) => {
              // this.loading = false;
              this.toster.error('Something went wrong please try again', 'Error Message');
            })
        }
        else {
          

        }
      });
    }
  }
  openDialog(data:any,e:any) {
    e.stopPropagation();
    // const dialogRef = this.dialog.open(LmsApprovalDialogComponent,{
    //   data:{data,e}
    // });
    // 
    // this.show=data
    // 
    // dialogRef.afterOpened().subscribe(result => {
      
    // });
    // dialogRef.afterClosed().subscribe(result => {
      
    // });
  }

  // rejectBtn(e: any) {
  //   

  // }
  getCellValue(rowData: any) {
    // 
    const dialogRef = this.dialog.open(ContentDialogComponent, {
      width: '400px',
      data: rowData
    });
    dialogRef.afterClosed().subscribe((result) => {
      
    });
  }

  showSearchBox(searchBox: any) {
    searchBox.classList.toggle('showSearchBox')
    // 

    this.disabledSearchBox = !this.disabledSearchBox
    if (this.disabledSearchBox) {
      this.searchVal = '';
    };
  }

}

