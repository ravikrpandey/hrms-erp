

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { BvgListComponent } from '../bvg-list/bvg-list.component';
import { HrServiceService } from '../../../../@shared/services/hr-service.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
@Component({
  selector: 'app-hr-dashboard-list',
  templateUrl: './hr-dashboard-list.component.html',
  styleUrls: ['./hr-dashboard-list.component.scss']
})
export class HrDashboardComponent implements OnInit {


  nameSearch:any=''
  rowData: any;
  rowData2: any;
  rowData1: any;
  personalIdData: any;
  propertyManager: any
  text: any;
  firstLastName: any;
  rowClass: any;
  employeeData: any = [];
  gridApi: any;
  constructor(private emp_master: EmpMasterService,
    private empService: EmpRegistrationService,
    public dialog: MatDialog,
    private _HRservice: HrServiceService,
    private _recruitService:RecruitService

  ) {
    this.rowClass = 'rowClass'
  }
  public cellValue: any;
  ngOnInit(): void {
    this.getAlldata();
  }

  getAlldata() {
    this._recruitService.HrDashboardList().subscribe(
      (res: any) => {
        
        this.employeeData = res.result;
        // let data=res.result.candidate_id;
        // 

      })
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    // this.gridApi.paginationSetPageSize(Number(value));
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    

  }
  // onCellClicked(e:any){
  //   
  //   const dialogRef = this.dialog.open(GrievanceDialogComponent,{width:'400px',data:{id:e.data.employee_grievance_id}});
  //     dialogRef.afterClosed().subscribe(result => {
  //       
  //     })
  // }
  openDialog(id:any) {
    // 
    this.dialog.open(BvgListComponent, {
      width: '100%',
      data:id
    })
  }
  //     data: { candidate_id: this.cellValue }
  //   });
  //   
  // }
}
