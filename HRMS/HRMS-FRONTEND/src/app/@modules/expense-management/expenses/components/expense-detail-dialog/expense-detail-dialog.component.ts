import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ExpenseService } from '../../services/expense.service';
import { ExpenseRejectDialogComponent } from '../expense-reject-dialog/expense-reject-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expense-detail-dialog',
  templateUrl: './expense-detail-dialog.component.html',
  styleUrls: ['./expense-detail-dialog.component.scss']
})
export class ExpenseDetailDialogComponent implements OnInit {
  expense: any = null;
  history: any[] = [];
  permissions: any = {};
  loading: boolean = true;
  actionInProgress: boolean = false;

  constructor(
    private expenseService: ExpenseService,
    private toast: ToastrService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ExpenseDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  ngOnInit(): void {
    this.loadExpenseDetails();
  }

  loadExpenseDetails(): void {
    this.loading = true;
    this.expenseService.getExpenseById(this.data.id).subscribe({
      next: (res: any) => {
        this.expense = res.data;
        this.history = res.data?.history || [];
        this.permissions = res.permissions || {};
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading expense details:', err);
        this.toast.error(err.error?.message || 'Failed to load expense details', 'Error');
        this.loading = false;
      }
    });
  }

  getFileUrl(path: string): string {
    return this.expenseService.getFileUrl(path);
  }

  onApprove(): void {
    const isPM = this.permissions.canApprovePM;
    const isFinance = this.permissions.canApproveFinance;

    if (!isPM && !isFinance) return;

    const stageLabel = isPM ? 'Project Manager' : 'Finance Approver';

    Swal.fire({
      title: 'Approve Expense?',
      html: `
        <div style="font-size: 14px; color: #475569; line-height: 1.6; text-align: center;">
          Are you sure you want to approve expense <strong>${this.expense.expense_number}</strong>
          of <strong style="color: #0c85c0;">₹${Number(this.expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
          as <strong>${stageLabel}</strong>?
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Approve',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.actionInProgress = true;
        this.expenseService.approveExpense(this.expense.id, `Approved by ${stageLabel}`).subscribe({
          next: (res: any) => {
            this.actionInProgress = false;
            this.toast.success(res.message || 'Expense approved successfully', 'Success');
            this.dialogRef.close({ updated: true });
          },
          error: (err: any) => {
            this.actionInProgress = false;
            this.toast.error(err.error?.message || 'Approval failed', 'Error');
          }
        });
      }
    });
  }

  onReject(): void {
    const isPM = this.permissions.canRejectPM;
    const isFinance = this.permissions.canRejectFinance;

    if (!isPM && !isFinance) return;

    const dialogRef = this.dialog.open(ExpenseRejectDialogComponent, {
      width: '480px',
      data: {
        expense_number: this.expense.expense_number,
        amount: this.expense.amount,
        employee_name: this.expense.employee_name
      }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.rejection_reason) {
        this.actionInProgress = true;
        this.expenseService.rejectExpense(this.expense.id, res.rejection_reason).subscribe({
          next: (apiRes: any) => {
            this.actionInProgress = false;
            this.toast.success(apiRes.message || 'Expense rejected', 'Notice');
            this.dialogRef.close({ updated: true });
          },
          error: (err: any) => {
            this.actionInProgress = false;
            this.toast.error(err.error?.message || 'Rejection failed', 'Error');
          }
        });
      }
    });
  }

  onEditResubmit(): void {
    this.dialogRef.close({ openEdit: true, expense: this.expense });
  }

  onClose(): void {
    this.dialogRef.close(null);
  }
}

