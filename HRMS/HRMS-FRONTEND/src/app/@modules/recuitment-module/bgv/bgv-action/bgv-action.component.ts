import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-bgv-action',
  templateUrl: './bgv-action.component.html',
  styleUrls: ['./bgv-action.component.scss'],
})
export class BgvActionComponent implements OnInit {
  assignAction: any;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private _rbackService: RbacMasterService,
  ) {
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }
  public cellValue: any;
  public paramsVal: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
   
    this.paramsVal = params.data;
    this.cellValue = this.getValueToDisplay(params);
  }

  getValueToDisplay(params: ICellRendererParams) {

    return params.data.candidate_id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  openReadyForBgv() {
  
    this.route.navigate(['master/recruitment/bgv/ready-for-bgv'], { queryParams: { JD_id: this.paramsVal?.JD_id } })
  }

}
