import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-request-action',
  templateUrl: './request-action.component.html',
  styleUrls: ['./request-action.component.scss']
})
export class RequestActionComponent {
  singleId: any;
  assignAction: any;
  constructor(
    private router: Router,
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
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
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
  edit(e:any){
    this.router.navigate(["/master/maintenance-management/plan-maintenance/create-schedule"],{queryParams:{id:this.cellValue,status:'update'}})
  }
}


