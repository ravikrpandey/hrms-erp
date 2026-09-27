import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CellClickedEvent,
  CheckboxSelectionCallbackParams,
  ColDef,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  HeaderCheckboxSelectionCallbackParams,
  PaginationNumberFormatterParams,
} from 'ag-grid-community';

import { RecruitService } from '../../../@shared/services/recruitment.service';
import 'ag-grid-enterprise';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { Router } from '@angular/router';
// import { ActionComponent } from '../../../../@shared/action';
import { ActionComponent } from 'src/app/@shared/action/action.component';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';
import { AppListDialogComponent } from 'src/app/@shared/app-list-dialog/app-list-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-calendar-list',
  templateUrl: './calendar-list.component.html',
  styleUrls: ['./calendar-list.component.scss'],
})
export class CalendarComponent implements OnInit {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  
  // rowData:any;

  constructor(
    private _empService: EmpRegistrationService, private recruitService: RecruitService,
    private route: Router,public dialog: MatDialog,  private toast: ToastrService
  ) {
    this.rowClass = 'rowClass';
  }
  ngOnInit(): void {
    this.recruitService.getAchievementList().subscribe((res: any) => {
      this.rowData = res.data;
      
    });
   }

 
  achivement() {
    this.route.navigate(['ess/achievement-create']);
  }

  onCellClicked(e:any){
    
    const dialogRef = this.dialog.open(AppListDialogComponent,{width:'400px',data:{achivementId:e.data.achievement_id}});
      dialogRef.afterClosed().subscribe(result => {
        
      })
  }


}
