import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators'; // changed import
import { AttendanceService } from 'src/app/@shared/services/service/attendance/attendance.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-action-attendance-approval-dialog',
  templateUrl: './action-attendance-approval-dialog.html',
  styleUrls: ['./action-attendance-approval-dialog.scss'],
})
export class ActionAttendanceApprovalDialog {
  loading = false;
  financialId: any;
  prevAttendance: any[] = [];
  punchData: any[] = [];
  groupedAttendance: Array<{ date: string; entries: any[] }> | any = [];
  manual: any;

  constructor(
    public dialogRef: MatDialogRef<ActionAttendanceApprovalDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private services: AttendanceService,
    private toast: ToastrService,
      private router: Router,
  private location: Location
  ) {
  this.punchData = this.data.punchData || [];
  this.manual = this.data.attendance_data || [];
  this.financialId = localStorage.getItem('financial_id');
  this.punchData = this.data.punchData || [];
  this.manual = this.data.attendance_data || [];
    this.overMapping();
  }



overMapping() {

  const original = this.punchData || [];
  const manual = this.data?.attendance_data || [];
  const normalizeKey = (item: any) => {
    const date = (item.att_date || '').trim();
    const entry = (item.entry_type || '').trim().toUpperCase();
    const emp = String(item.employee_id);
    const ent = String(item.entity_id);
    const time = (item.att_checktime || '').trim();
    return `${date}_${entry}_${emp}_${ent}_${time}`;
  };

  const originalKeys = new Set(original.map(normalizeKey));

  const compared = manual.map((item: any) => {
    const key = normalizeKey(item);
    const status = originalKeys.has(key) ? 'same' : 'new';
    return { ...item, _status: status };
  });

  const grouped: any = {};
  compared.forEach((entry: any) => {
    if (!grouped[entry.att_date]) {
      grouped[entry.att_date] = { date: entry.att_date, entries: [] };
    }
    grouped[entry.att_date].entries.push(entry);
  });

  this.groupedAttendance = Object.values(grouped);
  console.log('Grouped Attendance:', this.groupedAttendance);
}

  close() {
    this.dialogRef.close();
  }

  approve() {
    this.updateStatus('approved');
  }

  reject() {
    this.updateStatus('rejected');
  }

  back() {
    this.updateStatus('backed');
  }

private updateStatus(status: 'approved' | 'rejected' | 'backed') {
  if (!this.data?.id) {
    this.toast.error('Missing id');
    return;
  }
  this.loading = true;
  const payload = { id: this.data.id, approval_status: status };

  this.services
    .updateAttendancestatus(payload)
    .pipe(finalize(() => (this.loading = false)))
    .subscribe({
      next: (res: any) => {
        const returnedStatus = (res && res.approval_status) ? res.approval_status : status;
        this.toast.success('Status updated successfully');

        // refresh current route
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
        });

        // close dialog and pass result
        this.dialogRef.close({
          success: true,
          status: returnedStatus,
          id: this.data.id,
          response: res
        });
      },
      error: (err: any) => {
        console.error('Error updating status:', err);
        this.toast.error('Failed to update status');
        this.dialogRef.close({ success: false, error: err });
      },
    });
}

}
