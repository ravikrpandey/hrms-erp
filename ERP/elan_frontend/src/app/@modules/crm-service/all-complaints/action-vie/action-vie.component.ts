import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ViewLeadDescriptionDialogComponent } from '../../complaint-list/view-lead-description-dialog.component';

@Component({
  selector: 'app-action-vie',
  templateUrl: './action-vie.component.html',
  styleUrls: ['./action-vie.component.scss']
})
export class ActionVieComponent {
  assignAction:any;
  constructor(private route: Router,
    public dialog: MatDialog,
    private employService: EmpRegistrationService,
    private toster: ToastrService,
    private _rbackService:RbacMasterService,
  ) {
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

  open(e: any) {
    const dialogRef = this.dialog.open(ViewLeadDescriptionDialogComponent, { 
      width: '90%',
       data: { id: this.cellValue },
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
}