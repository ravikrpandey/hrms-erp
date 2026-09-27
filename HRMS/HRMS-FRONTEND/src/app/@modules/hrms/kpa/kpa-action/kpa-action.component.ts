import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';
import { ICellRendererParams } from 'ag-grid-community';
@Component({
  selector: 'app-kpa-action',
  templateUrl: './kpa-action.component.html',
  styleUrls: ['./kpa-action.component.scss']
})
export class KpaActionComponent {
  paramsVal: any;
  assignAction: any;
  editDataParams: any = 'edit'
  viewDataParams:any = 'view'
  public cellValue: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _hrmMasterService: HrmServiceService
  ) {
  }
  ngOnInit(): void {
    this.assignAction = this._hrmMasterService.accessAssignAction();
    console.log("assignAction",this.assignAction);
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.paramsVal = params.data.id;
    this.cellValue = this.getValueToDisplay(params);
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted
      ? params.valueFormatted
      : params.data.emptype_id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  openDialog() {
    this.router.navigate(['/master/performance/kpa-master/createkpa-master'], { queryParams: { id: this.paramsVal, type: this.viewDataParams } });
  }
  
  editData() {
    this.router.navigate(['/master/performance/kpa-master/updatekpa-master'], { queryParams: { id: this.paramsVal, type: this.editDataParams } });
  }

}
