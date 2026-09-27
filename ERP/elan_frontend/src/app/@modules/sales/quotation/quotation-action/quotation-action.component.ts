import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ViewLeadDescriptionDialogComponent } from 'src/app/@modules/crm/pages/dialogs/view-lead-description-dialog/view-lead-description-dialog.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-quotation-action',
  templateUrl: './quotation-action.component.html',
  styleUrls: ['./quotation-action.component.scss'],
  encapsulation:ViewEncapsulation.ShadowDom
})
export class QuotationActionComponent {
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

  updateCreateLead() {
    // this.router.navigate(["master/crm/create-lead"], { queryParams: { data: this.singleData?.id?.id } })
    const id = this.singleData?.id;
    if(id){
      this.router.navigate(["/master/crm/create-proposal"], { queryParams: {id:this.singleData?.id,actionType:'create'}})
     }
  }

  editData(event:any){
    this.router.navigate(["/master/crm/create-proposal"], { queryParams: {proposalId:this.singleData?.proposal_id,actionType:'edit'}})

  }

}
