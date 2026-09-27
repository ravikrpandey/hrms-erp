import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
// import { DMSService } from 'src/app/@shared/services/dms.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
// import { ContentDialogComponent } from './content-dialog/content-dialog.component';
import { LmsServiceService } from 'src/app/@shared/services/lms-service.service';
// import { ContentDialogComponent } from 'src/app/@modules/lms/lms-management/dashboard-lms/super-admin/content-learning/content-dialog/content-dialog.component';
import { HeaderMenuService } from 'src/app/@shared/services/header-menu.service';
import { ViewComponent } from './view/view.component';
import Swal from 'sweetalert2';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { ToastrService } from 'ngx-toastr';
// import { ContentDialogComponent } from '../../content-dialog/content-dialog.component';

@Component({
  selector: 'app-hr-management',
  templateUrl: './hr-management.component.html',
  styleUrls: ['./hr-management.component.scss']
})
export class HRManagementComponent implements OnInit {
  rowData: any;
  showLoader: boolean = false;
  disabledSearchBox: boolean = true;
  searchVal: any = '';
  paramsVal: any;
  loginUserID: string | null;

  constructor(private _lmsService: LmsServiceService,
    public dialog: MatDialog,
    private router: Router,
    private header_menu: HeaderMenuService,
    private _recrutmentService: RecruitService,
    private toaster: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.loginUserID = localStorage.getItem('EmpMainId');
    


    localStorage.setItem("employee_id:", "undefined");
    this.showLoader = true;
    // this._lmsService.getAllContentList().subscribe((res: any) => {
    //   this.showLoader = false;
    //   this.rowData = res.data;
    //   
    // }, (err) => {
    //   
    //   this.showLoader = false;

    // }
    // );
    this.getData();
  }
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  getData() {
    this.header_menu.pendingListById(this.loginUserID).subscribe((res: any) => {
      this.showLoader = false;
      this.rowData = res.data;
      
    },(err) => {
      
      this.showLoader = false;
    }
    );

    let approve: any = document.getElementsByClassName('approve');
    let reject: any = document.querySelector('.reject');
    
    

  }


  getCellValue(rowData: any) {
    
    
    // 
    const dialogRef = this.dialog.open(ViewComponent, {
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

  // review(e:any,candidate_id:any){
  //   e.stopPropagation();
  //   
  //   this.paramsVal=candidate_id
  // }

  review(e: any, candidate_id: any) {
    this.paramsVal = candidate_id
    e.stopPropagation();

    Swal.fire({
      title: 'Have you reviewed this candidate completely ?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'Not Now'
    }).then((result) => {
      if (result.isConfirmed) {
        const data: any = {
          status: 'Reviewed'
        };
        // this._recrutmentService.update_status(this.paramsVal, data).subscribe((res: any) => {
          

        // })
        this._recrutmentService.update_status(this.paramsVal, data).subscribe(
          (res) => {
            
            this.toaster.success(res.message, "Reviewed successfully")
            this.reloadCurrentRoute();
          }, (err) => {
            
            this.toaster.error('Something went wrong please try again', "Error Message")
          }
        )
      }
    });
  }
  documents(e:any){
    e.stopPropagation();

  }

}

