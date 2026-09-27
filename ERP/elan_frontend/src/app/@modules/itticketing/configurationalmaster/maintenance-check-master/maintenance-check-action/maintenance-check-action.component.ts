import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-maintenance-check-action',
  templateUrl: './maintenance-check-action.component.html',
  styleUrls: ['./maintenance-check-action.component.scss']
})
export class MaintenanceCheckActionComponent {
  singleId: any;
  assignAction: any;
  constructor(
    private route: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService,
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
    this.cellValue = this.getValueToDisplay(params);

  }

  getValueToDisplay(params: ICellRendererParams) {


    return params.valueFormatted ? params.valueFormatted : params.data.id
  }

  refresh(params: ICellRendererParams): boolean {

    // this.singleId = params.data.dept_id
    // wrirte code to modify cell

    if (params) {
      const data: any = {
        designation_name: params.data.designation_name.trim(),
        status: params.data.status,
      }
      if (params.data.color === null && params.data.color !== "") {
        // this.createDepartment(data);
      } else {
        const designation_id: number = Number(params.data.designation_id);
        // this.updateDepartment(designation_id, data);
      }
    } else {
      this.toaster.error("designation_name is All Ready Exits!", 'Error Message');
    }


    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  // edit(){
  //   this.router.navigate(["master/hrms/rbacmaster/Rbac-role-create"],{queryParams:{role_master_id:this.cellValue}})
  // }





  openDialog(e:any) {

  }
  editDesig: any;
  edit(e:any) {


  }

  delete(event: any) {
    event.stopPropagation();
    Swal.fire({
      title: 'Are you sure want to Remove?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result:any) => {
      // if (result.isConfirmed) {
      //   let data={
      //     id:this.cellValue,
      //     isDeleted:true
      //   }
      //   this._configurationalmasterService.changeIssue_Status(data).subscribe(
      //     (res:any) => {

      //       this.toaster.success('Deleted successfully ');
      //       this.reloadCurrentRoute();
      //     },
      //     (err:any) => {
      //       this.toaster.error("Somthing went wrong Please try agin", "Error Message")

      //     }
      //   )
      // }
    });
  }

}


