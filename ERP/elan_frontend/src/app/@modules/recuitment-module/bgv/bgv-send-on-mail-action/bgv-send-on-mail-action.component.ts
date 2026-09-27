import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-bgv-send-on-mail-action',
  templateUrl: './bgv-send-on-mail-action.component.html',
  styleUrls: ['./bgv-send-on-mail-action.component.scss'],
})
export class BgvSendOnMailActionComponent implements OnInit {
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

  bgvSendOnMailOpen() {
   
    this.route.navigate(['master/recruitment/bgv/bgv-send-on-mail'], { queryParams: { id: this.paramsVal?.id } })
  }

  // copyLink() {
  // }

  companyReviewsView() {
    
    this.route.navigate(['master/recruitment/bgv/view-company-remarks'], { queryParams: { id: this.paramsVal?.id } })
  }

  viewBgvMailDetail() {
   
    this.route.navigate(['master/recruitment/bgv/view-company-remarks'], { queryParams: { id: this.paramsVal?.id, actionType:'view' } })
  }

}
