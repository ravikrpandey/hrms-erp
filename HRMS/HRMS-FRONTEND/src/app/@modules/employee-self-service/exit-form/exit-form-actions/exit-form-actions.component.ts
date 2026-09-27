import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ExitFormRemarksComponent } from '../exit-form-remarks/exit-form-remarks.component';
@Component({
  selector: 'app-exit-form-actions',
  templateUrl: './exit-form-actions.component.html',
  styleUrls: ['./exit-form-actions.component.scss'],
})
export class ExitFormActionsComponent {
  public cellValue: any;
  allExitFormData: any;
  exit_form_id: any;
  resignation_id: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {}

  agInit(params: ICellRendererParams): void {
    this.exit_form_id = params.data.exit_form_id;
    this.resignation_id = params.data.resignation_id;
    this.cellValue = this.getValueToDisplay(params);
    this.allExitFormData = params.data;
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted
      ? params.valueFormatted
      : params.data.type_of_vendor_id;
  }
  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  view(e: any) {
    e.stopPropagation();
    this.route.navigate(['master/ess/exit-form/create'], {
      queryParams: {
        resignation_id: this.resignation_id,
        exit_form_id: this.exit_form_id,
        type: 'view',
      },
    });
  }
  viewRemark(e: any) {
    const dialogRef = this.dialog.open(ExitFormRemarksComponent, {
      width: '450px',
      data: {
        resignation_id: this.resignation_id,
        exit_form_id: this.exit_form_id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
