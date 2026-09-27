import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';

@Component({
  selector: 'app-vehical-category-statsu',
  templateUrl: './vehical-category-statsu.component.html',
  styleUrls: ['./vehical-category-statsu.component.scss']
})
export class VehicalCategoryStatsuComponent {
  assignAction: any;
  singleData: any = {};
  isChecked = false;
  checkBox: any;
  constructor(private route: Router,
    public dialog: MatDialog,
    private toster: ToastrService,
    private _rbackService: RbacMasterService,
    private transport_service:TransportManagementService) { }

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
    this.cellValue = this.statusUpdate(params);
    this.singleData = params?.data;

  }
  statusUpdate(params: ICellRendererParams) {
    this.checkBox = params.data.status;
    if (this.checkBox === "ACTIVE") {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }

    return params.valueFormatted
      ? params.valueFormatted
      : params.data.id;
  }

  refresh(params: ICellRendererParams): boolean {

    this.cellValue = this.statusUpdate(params);
    return true;
  }

  toggle(e: any, isChecked: boolean) {
    try {
      e.stopPropagation();
      let status;
      if (isChecked) status = "ACTIVE";
      else status = "INACTIVE";
      let data={
        id:this.singleData?.id,
        status:status
      }
      this.transport_service.update_vehical_category(data).subscribe((res:any)=>{
        if(res){
          this.toster.success('Status Changed Successfully');
          location.reload();
        }
      },(err:any)=>{

      })
    } catch (error) {
      console.log(error);
    }
  }
  // Form update end
}



