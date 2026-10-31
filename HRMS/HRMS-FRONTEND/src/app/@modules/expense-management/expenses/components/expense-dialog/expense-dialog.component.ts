import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-expense-dialog',
  templateUrl: './expense-dialog.component.html',
  styleUrls: ['./expense-dialog.component.scss']
})
export class ExpenseDialogComponent implements OnInit {
  expenseForm!: FormGroup;
  projects: any[] = [];
  categories: any[] = [];
  loading: boolean = false;
  submitting: boolean = false;
  selectedFile: File | null = null;
  selectedFileName: string = '';
  existingAttachmentName: string = '';
  isEdit: boolean = false;
  isRejected: boolean = false;
  rejectionReason: string = '';
  maxDate: string = new Date().toISOString().split('T')[0];
  projectSearchText: string = '';
  showProjectDropdown: boolean = false;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private toast: ToastrService,
    public dialogRef: MatDialogRef<ExpenseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDropdowns();
    if (this.data && this.data.expense) {
      this.isEdit = true;
      this.isRejected = this.data.expense.status === 'Rejected';
      this.rejectionReason = this.data.expense.rejection_reason || '';
      this.populateForm(this.data.expense);
    }
  }

  initForm(): void {
    this.expenseForm = this.fb.group({
      project_id: ['', [Validators.required]],
      expense_type: ['', [Validators.required]],
      expense_date: [new Date().toISOString().split('T')[0], [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      comments: [''],
    });
  }

  loadDropdowns(): void {
    this.loading = true;
    this.expenseService.getProjects().subscribe({
      next: (res: any) => {
        this.projects = res.data || [];
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading projects:', err);
        this.loading = false;
      }
    });

    this.expenseService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data || [];
      },
      error: (err: any) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  populateForm(exp: any): void {
    const formattedDate = exp.expense_date
      ? new Date(exp.expense_date).toISOString().split('T')[0]
      : '';

    this.expenseForm.patchValue({
      project_id: exp.project_id,
      expense_type: exp.expense_type,
      expense_date: formattedDate,
      amount: exp.amount,
      comments: exp.comments || '',
    });

    if (exp.attachment_name) {
      this.existingAttachmentName = exp.attachment_name;
    }
  }

  get filteredProjects(): any[] {
    if (!this.projectSearchText || !this.projectSearchText.trim()) {
      return this.projects || [];
    }
    const term = this.projectSearchText.toLowerCase().trim();
    return (this.projects || []).filter((p: any) =>
      (p.project_name && p.project_name.toLowerCase().includes(term)) ||
      (p.project_code && p.project_code.toLowerCase().includes(term)) ||
      (p.project_id && String(p.project_id).includes(term))
    );
  }

  getSelectedProjectName(): string {
    const selectedId = this.expenseForm?.get('project_id')?.value;
    if (!selectedId) return '';
    const proj = this.projects?.find((p: any) => p.project_id == selectedId);
    if (proj) {
      return `${proj.project_name} (${proj.project_code || 'PRJ-' + proj.project_id})`;
    }
    if (this.data?.expense?.project_id == selectedId && this.data?.expense?.project_name) {
      return `${this.data.expense.project_name} (${this.data.expense.project_code || 'PRJ-' + this.data.expense.project_id})`;
    }
    return '';
  }

  toggleProjectDropdown(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.showProjectDropdown = !this.showProjectDropdown;
    if (this.showProjectDropdown) {
      this.projectSearchText = '';
    }
  }

  selectProject(proj: any): void {
    const id = proj ? proj.project_id : '';
    this.expenseForm.patchValue({ project_id: id });
    this.expenseForm.get('project_id')?.markAsTouched();
    this.showProjectDropdown = false;
    this.projectSearchText = '';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.searchable-project-dropdown')) {
      this.showProjectDropdown = false;
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files && event.target.files[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        this.toast.error('File size cannot exceed 25MB', 'File Too Large');
        event.target.value = '';
        return;
      }
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.selectedFileName = '';
  }

  save(action: 'Draft' | 'Submit' | 'Resubmit'): void {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      this.toast.warning('Please fill in all required fields accurately.', 'Validation Warning');
      return;
    }

    const formVal = this.expenseForm.value;
    const formData = new FormData();
    formData.append('project_id', formVal.project_id);
    formData.append('expense_type', formVal.expense_type);
    formData.append('expense_date', formVal.expense_date);
    formData.append('amount', formVal.amount);
    formData.append('comments', formVal.comments || '');
    formData.append('action', action);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }

    this.submitting = true;

    if (this.isEdit) {
      this.expenseService.updateExpense(this.data.expense.id, formData).subscribe({
        next: (res: any) => {
          this.submitting = false;
          this.toast.success(res.message || 'Expense updated successfully', 'Success');
          this.dialogRef.close({ updated: true, data: res.data });
        },
        error: (err: any) => {
          this.submitting = false;
          this.toast.error(err.error?.message || 'Failed to update expense', 'Error');
        }
      });
    } else {
      this.expenseService.createExpense(formData).subscribe({
        next: (res: any) => {
          this.submitting = false;
          this.toast.success(res.message || 'Expense created successfully', 'Success');
          this.dialogRef.close({ created: true, data: res.data });
        },
        error: (err: any) => {
          this.submitting = false;
          this.toast.error(err.error?.message || 'Failed to create expense', 'Error');
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}

