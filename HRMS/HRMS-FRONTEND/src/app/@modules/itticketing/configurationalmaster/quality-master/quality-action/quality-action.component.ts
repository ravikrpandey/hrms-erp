import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Color, ICellRendererParams, Logger } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-quality-action',
  templateUrl: './quality-action.component.html',
  styleUrls: ['./quality-action.component.scss']
})
export class QualityActionComponent {
  singleId: any;
  cellValue1: any;
  assignAction: any;
  entity_id:any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService,
  ) {
    // this.data = localStorage.getItem("jobId");
    // 

  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
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
    this.cellValue = this.getValueToDisplay(params);
    this.cellValue1 = params.data;

  }

  getValueToDisplay(params: ICellRendererParams) {


    return params.valueFormatted ? params.valueFormatted : params.data.id
  }

  refresh(params: ICellRendererParams): boolean {

    // this.singleId = params.data.dept_id
    // wrirte code to modify cell 

    if (params) {
      const data: any = {
        department_name: params.data.department_name.trim(),
        status: params.data.status,

      }

      if (params.data.color === null && params.data.color !== "") {
        this.createDepartment(data);
      } else {
        const dept_id: number = Number(params.data.id);
        // this.updateDepartment(dept_id, data);
      }
    } else {
      this.toaster.error("department_name is All Ready Exits!", 'Error Message');
    }


    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  createDepartment(data: any) {
    this._configurationalMasterService.createDepartment(data,this.entity_id).subscribe(
      (res: any) => {

        this.toaster.success('Department Created Successfully');
        this.reloadCurrentRoute();
      }, (err: any) => {

        this.toaster.error("department_name is All Ready Exits!", 'Error Message');
      }
    )
  };

  edit(e: any) {
    e.stopPropagation();
    this.router.navigate(['master/configurational-master/quality-master/create'], {
      queryParams: { id: this.cellValue },
    });
  }
  view(e: any) {
    e.stopPropagation();
    this.router.navigate(['master/configurational-master/quality-master/create'], {
      queryParams: { id: this.cellValue, view: "view" },
    });
  }
  delete(e: any) {
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
        this._configurationalMasterService.QualityDelete(this.cellValue).subscribe(
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
