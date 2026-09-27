import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { GradeDialogComponent } from '../grade-dialog/grade-dialog.component';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-grade-action',
  templateUrl: './grade-action.component.html',
  styleUrls: ['./grade-action.component.scss']
})
export class GradeActionComponent {
  paramsVal: any;
  assignAction: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService
  ) {
    // this.data = localStorage.getItem("jobId");
    // 
  }
  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }
  public cellValue: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.paramsVal = params.data.grade_id;
    this.cellValue = this.getValueToDisplay(params);

  }
  getValueToDisplay(params: ICellRendererParams) {


    return params.valueFormatted
      ? params.valueFormatted
      : params.data.grade_id;
  }
  refresh(params: ICellRendererParams): boolean {

    // write code to modify cell

    //EDIT DATA FROM API
    if (params) {
      const data: any = {
        grade_name: params.data.grade_name,
        status: params.data.status,
      };
      if (params.data.color === null && params.data.color !== '') {
        this.createGraade(data);
      } else {
        const grade_id: number = Number(params.data.grade_id);
        // this.updateGrade(grade_id, data);
      }
    } else {
      this.toaster.error(
        "grade_name is All Ready Exits!",
        'Error Message'
      );
    }

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  createGraade(data: any) {
    this._configurationalmasterService.creategrade(data).subscribe(
      (res: any) => {

        this.toaster.success('Grade Created Successfully!');
        this.reloadCurrentRoute();
      },
      (err: any) => {

        this.toaster.error(
          "grade_name is All Ready Exits!",
          'Error Message'
        );
      }
    );
  }

  // updateGrade(id: any, data: any) {
  //   this._configurationalmasterService.editGrade(id, data).subscribe(
  //     (res: any) => {
  //       
  //       this.toaster.success('Updated Successfully!');
  //       this.reloadCurrentRoute()
  //     },
  //     (err: any) => {
  //       this.toaster.error(
  //         'Something went wrong please try again',
  //         'Error Message'
  //       );
  //       
  //     }
  //   );
  // }
  openDialog() {
    const dialogRef = this.dialog.open(GradeDialogComponent, {
      data: { visible: 'visible', id: this.paramsVal },
      width: '30%',
    })
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  editData() {
    const dialogRef = this.dialog.open(GradeDialogComponent, {
      data: { grade: 'edit', id: this.paramsVal },
      width: '30%',
    })
    dialogRef.afterClosed().subscribe((result) => {
    });
  }
  deleteData(event: any) {
    event.stopPropagation();
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
        this._configurationalmasterService.GradeDelete(this.cellValue).subscribe(
          (res) => {

            this.toaster.success('Deleted successfully ');
            this.reloadCurrentRoute();
          },
          (err) => {
            this.toaster.error("Somthing went wrong Please try agin", "Error Message")

          }
        )
      }
    });
  }
}
