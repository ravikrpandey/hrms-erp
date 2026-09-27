import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddTripCategoryComponent } from 'src/app/@modules/itticketing/configurationalmaster/trip-category/add-trip-category/add-trip-category.component';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';

@Component({
  selector: 'app-add-expense-dialog',
  templateUrl: './add-expense-dialog.component.html',
  styleUrls: ['./add-expense-dialog.component.scss']
})
export class AddExpenseDialogComponent implements OnInit {

  expenseForm: FormGroup;
  uploadedFile: File | null = null;
  tripId: any;



  constructor(
    private fb: FormBuilder,
    private route: Router,
    private dialogRef: MatDialogRef<AddExpenseDialogComponent>,
     private transport_service: TransportManagementService,
     private _configurationalMasterService:ConfigurationalmasterService,
      private dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.tripId = this.data.tripId;  // <-- access tripId here
    console.log("Trip ID received: ", this.tripId);
    this.expenseForm = this.fb.group({
      category: ['', Validators.required],
      date: ['', Validators.required],
      amount: ['', Validators.required],
      file: [null],
      description: ['']
    });
    this.getAlltripExpenseMaster()
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = file;
      this.expenseForm.patchValue({ file: file });
    }
  }



onSubmit(): void {
  if (this.expenseForm.valid) {
    const formValue = this.expenseForm.value;
    const formData = new FormData();

    formData.append('category', formValue.category);
    formData.append('date', formValue.date);
    formData.append('amount', formValue.amount);
    formData.append('description', formValue.description);
    formData.append('trip_id', this.tripId);

    if (this.uploadedFile) {
      formData.append('file', this.uploadedFile);
    }

    this.transport_service.createExpenseTripInfo(formData).subscribe({
      next: (res: any) => {
        this.dialogRef.close(formValue);
        this.getAlltripExpenseMaster(); 
      },
      error: (err: any) => {
        console.error("Error creating expense trip info", err);
      }
    });
  }
}

rowData:any

  getAlltripExpenseMaster() {
    this._configurationalMasterService.getAlltripExpenseMaster().subscribe((res: any) => {
      this.rowData = res.data;
    },(err:any) => {
      this.rowData = []
    })
  }
// reloadCurrentRoute() {
//   this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
//     this.route.navigate(
//       ['/master/transport-management/all-trip/live-trip-info'],
//       { queryParams: { id:  this.tripId } }
//     );
//   });
// }
  onCancel(): void {
    this.dialogRef.close();
  }


  //  openDialog() {
  //     const dialogRef = this.dialog.open(AddTripCategoryComponent, {
  //       // data: { id: this.queryParamss },

  //       width: '30%',
  //     });
  //     dialogRef.afterClosed().subscribe((result:any) => {
  //       // this.reloadCurrentRoute()
  //      });
  //   }

openDialog() {
  const dialogRef = this.dialog.open(AddTripCategoryComponent, {
    width: '30%',
  });

  dialogRef.afterClosed().subscribe((result: any) => {
    if (result) {
      // this.reloadCurrentRoute()
      this.getAlltripExpenseMaster();
    }
  });
}


}
