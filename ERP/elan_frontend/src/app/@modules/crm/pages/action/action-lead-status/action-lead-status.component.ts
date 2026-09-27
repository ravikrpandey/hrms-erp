import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ViewLeadDescriptionDialogComponent } from '../../dialogs/view-lead-description-dialog/view-lead-description-dialog.component';
@Component({
  selector: 'app-action-lead-status',
  templateUrl: './action-lead-status.component.html',
  styleUrls: ['./action-lead-status.component.scss'],
  encapsulation:ViewEncapsulation.ShadowDom

})
export class ActionLeadStatusComponent implements OnInit {
  assignAction: any;
  singleData: any = {};
  constructor(private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private toster: ToastrService,
    private _rbackService: RbacMasterService,
  ) {
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService?.accessAssignAction();
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
    this.singleData = params?.data;

  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data.employee_id;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e: any) {
    console.log(this.singleData);
    const dialogRef = this.dialog.open(ViewLeadDescriptionDialogComponent, {
      width: '90%',
      data: { id: this.singleData },
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }
  lead_summery:any='lead_summery'
  updateCreateLead() {
    // this.router.navigate(["master/crm/create-lead"], { queryParams: { data: this.singleData?.id?.id } })
    const id = this.singleData?.id;
    if (id) {
      const newTab = window.open('', '_blank');
      if (newTab) {
        newTab.location.href = `/master/crm/create-lead?id=${encodeURIComponent(id)}&typeLead=${this.lead_summery}`;
      }
    }
  }


}
