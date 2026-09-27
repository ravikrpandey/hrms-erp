import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { AttendanceService } from 'src/app/@shared/services/service/attendance/attendance.service';
import { ActionAttendanceApprovalDialog } from '../action-attendance-approval-dialog/action-attendance-approval-dialog';

@Component({
  selector: 'app-action-attendance-approval',
  templateUrl: './action-attendance-approval.html',
  styleUrls: ['./action-attendance-approval.scss'],



})
export class ActionAttendanceApprovalComponent {
  params: any;

  constructor(
    private dialog: MatDialog,
    private services: AttendanceService,
    private toast:ToastrService,
  ) { }

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    this.params = params;
    return true;
  }


  openDialog(evt: MouseEvent) {
    evt.stopPropagation(); // prevent grid row selection / edit
    const rowData = this.params.data || {};
    const financialId = localStorage.getItem('financial_id');

    const req = {
      att_date: rowData?.selected_date,
      entity_id: rowData?.entity_id,
      employee_id: rowData?.employee_id,
      financial_year_id: financialId,
    };


    this.services.get_daily_Attendance_Data(req)
      .pipe(finalize(() => {
      }))
      .subscribe({
        next: (res: any) => {
          const punchData = res?.data || [];
          const dialogData = { ...rowData, punchData, attendance_data: rowData.attendance_data };
          const ref = this.dialog.open(ActionAttendanceApprovalDialog, {
            width: '850px',
            data: dialogData,
            disableClose: true
          });

      ref.afterClosed().subscribe((result: any) => {
  if (!result) return;

  const parent = this.params.context?.componentParent;
  if (!parent) return;

  if (result.success && result.id) {

    const newStatusRaw = result.status || result.response?.approval_status || '';
    const newStatus = String(newStatusRaw).toLowerCase();

    const idx = (parent.rowData || []).findIndex((r: any) => r.id === result.id);
    if (idx !== -1) {
      parent.rowData[idx] = {
        ...parent.rowData[idx],
        approval_status: newStatus  // store in normalized form
      };
    } else {

      if (result.response && result.response.data) {
        parent.rowData = parent.rowData || [];
        parent.rowData.push(result.response.data);
      } else {

        if (typeof parent.loadList === 'function') {
          parent.loadList();
        }
      }
    }

    // set the active tab to the new status so UI switches there (normalized)
    parent.activeTab = newStatus;

    // refresh filtered data & grid
    if (typeof parent.filterData === 'function') parent.filterData();
    if (parent.gridApi && typeof parent.gridApi.refreshClientSideRowModel === 'function') {
      parent.gridApi.refreshClientSideRowModel('everything');
    }

    // user feedback
    if (result.response && result.response.message) {
      parent.toast?.success(result.response.message);
    } else {
      parent.toast?.success('Status updated.');
    }
  } else {
    // handle failure or cancelled action
    if (result.success === false) {
      parent.toast?.error('Action failed.');
      console.warn('Dialog returned failure:', result.error || result);
    }
  }
});

        },
        error: (err: any) => {
          console.error('Failed to fetch punch data', err);
          this.toast.error('Failed to load attendance punches.');
        }
      });
  }

}
