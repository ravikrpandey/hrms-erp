import { Component } from '@angular/core';
import {
  ICellRendererParams,
} from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { StoreManagementDialogueComponent } from '../store-management-dialogue/store-management-dialogue.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-store-management-action',
  templateUrl: './store-management-action.component.html',
  styleUrls: ['./store-management-action.component.scss']
})
export class StoreManagementActionComponent {
  checkBox: any;
  public cellValue: any;
  assignAction: any;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private toaster: ToastrService,
    private _rbackService: RbacMasterService,

  ) {

  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();

  }

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
    this.checkBox = params.data;
    return params.valueFormatted
      ? params.valueFormatted
      : params.data.id;
  }

  openDialog() {
    const dialogRef = this.dialog.open(StoreManagementDialogueComponent, {
      width: '30%',
      data: { id: this.cellValue },
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  edit(e: any) {
    const dialogRef = this.dialog.open(StoreManagementDialogueComponent, {
      data: { id: this.cellValue },
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }

}
