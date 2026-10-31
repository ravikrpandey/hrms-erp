import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-expense-reject-dialog',
  templateUrl: './expense-reject-dialog.component.html',
  styleUrls: ['./expense-reject-dialog.component.scss']
})
export class ExpenseRejectDialogComponent {
  rejectionReason: string = '';
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<ExpenseRejectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onConfirm(): void {
    if (!this.rejectionReason || this.rejectionReason.trim().length < 5) {
      this.errorMessage = 'Please provide a clear rejection reason (minimum 5 characters).';
      return;
    }
    this.dialogRef.close({ rejection_reason: this.rejectionReason.trim() });
  }
}

