import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';;
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';


@Component({
  selector: 'app-allocated-action',
  templateUrl: './allocated-action.component.html',
  styleUrls: ['./allocated-action.component.scss']
})
export class AllocatedActionComponent {
  singleData:any;
  params:any;
  assignAction: any;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private _rbackService : RbacMasterService,
  ) { 
  }
  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.singleData = params.data;
    this.cellValue = this.getValueToDisplay(params);
 
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted
      ? params.valueFormatted
      : params.data.id;
  }

  
  view(e:any){
    this.router.navigate(['/master/asset-management/asset-allocate-list/deallocation'], { queryParams: { id: this.singleData.employee_id ,allocated_id: this.singleData.allocated_id, item_status_id: this.singleData.grn_item_status_id} })
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}


