import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { YearlyAssessmentService } from '../../../../@shared/services/performance-management/yearly-assessment.service';
import { CreateAssessmentComponent } from '../create-assessment/create-assessment.component';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-action-assessment',
  templateUrl: './action-assessment.component.html',
  styleUrls: ['./action-assessment.component.scss']
})
export class ActionAssessmentComponent {
  singleId:any;
  cellValue:any; 
  assignAction: any;
  entity_id: any;
  GetId: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private assessmentService: YearlyAssessmentService,
    private toaster: ToastrService,
    private _commonService : CommonService
  ) {

  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.assignAction = this.assessmentService.accessAssignAction();
    console.log("assignActionassignAction",this.assignAction);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  agInit(params: ICellRendererParams): void {

    this.cellValue = this.getValueToDisplay(params);
    this.cellValue = params.data;
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data.id
  }

  refresh(params: ICellRendererParams): boolean {
    this.GetId = this.getValueToDisplay(params);
    return true;
  }

  edit(e: any) { 
    const dialogRef = this.dialog.open(CreateAssessmentComponent, {
      data: { id: this.GetId ,data:this.cellValue, action:"edit" },
      width: '368px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.reloadCurrentRoute();
    });
  }

  view(e: any) {
    const dialogRef = this.dialog.open(CreateAssessmentComponent, {
      data: { id: this.GetId,data:this.cellValue, action: "view" },

      width: '368px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.reloadCurrentRoute();
    });
  }

  deleteAction(e: any) {
   
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure you want to Remove it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this._commonService?.showLoader()
        this.assessmentService.deleteAssessment(this.cellValue?.id).subscribe(
          (res) => {
            this._commonService?.hideLoader()
            this.toaster.success(res.message);
            this.reloadCurrentRoute();
          },
          (err) => {
            this._commonService?.hideLoader()
            this.toaster.error("Somthing went wrong Please try agin", "Error Message")
          }
        )
      }
    });
  }
}
