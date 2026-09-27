

import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
// import { DMSService } from 'src/app/@shared/services/dms.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
// import { ContentDialogComponent } from './content-dialog/content-dialog.component';
import { LmsServiceService } from 'src/app/@shared/services/lms-service.service';
// import { ContentDialogComponent } from 'src/app/@modules/lms/lms-management/dashboard-lms/super-admin/content-learning/content-dialog/content-dialog.component';
import { ContentDialogComponent } from '../../content-dialog/content-dialog.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  rowData: any;
  showLoader: boolean = false;
  disabledSearchBox:boolean = true;
  searchVal:any= '';
  constructor(private _lmsService: LmsServiceService,
    public dialog: MatDialog,
    private route: Router
    ) {
  }

  ngOnInit(): void {
    localStorage.setItem("employee_id:", "undefined");
    this.showLoader = true;
    this._lmsService.getAllContentList().subscribe((res: any) => {
      this.showLoader = false;
      this.rowData = res.data;
      
    }, (err) => {
      
      this.showLoader = false;

    }
    );

  }


  getCellValue(rowData: any) {
    // 
    const dialogRef = this.dialog.open(ContentDialogComponent, {
      width: '400px',
      data:rowData
    });
    dialogRef.afterClosed().subscribe((result) => {
      
    });
  }

  showSearchBox(searchBox:any){
    searchBox.classList.toggle('showSearchBox')
    // 
    
    this.disabledSearchBox = !this.disabledSearchBox
    if(this.disabledSearchBox){
      this.searchVal = '';
    };
  }

}

