import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ExpenseCategoryDialogComponent } from '../expense-category-dialog/expense-category-dialog.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';


@Component({
  selector: 'app-expense-category-action',
  templateUrl: './expense-category-action.component.html',
  styleUrls: ['./expense-category-action.component.scss']
})
export class ExpenseCategoryActionComponent {
  isChecked = false;
  achieveId: any;
  checkedActive: any;
  checkedInActive: any;
  expenseforCopy_name: any;
  checkBox: any;
  assignAction: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toaster: ToastrService,
    private _rbackService: RbacMasterService,
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
  getValueToDisplay(params: ICellRendererParams) {

    this.checkBox = params.data.isChecked;

    if (this.checkBox === true) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }

    return params.valueFormatted ? params.valueFormatted : params.data.expenseforCopy_id
  }
  refresh(params: ICellRendererParams): boolean {
    if (params) {
      const data: any = {
        expenseforCopy_name: params.data.expenseforCopy_name.trim(),
      }
      if (params.data.color === null && params.data.color !== "") {


        this.createExpense(data);
      } else {
        const expenseforCopy_id: number = Number(params.data.expenseforCopy_id);
        this.ExpenseUpdate(expenseforCopy_id, data);

      }
    } else {
      this.toaster.error('Something went wrong please try again', 'Error Message');
    }

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  createExpense(data: any) {
    this._configurationalMasterService.ExpenseCreate(data).subscribe(
      (res: any) => {

        this.toaster.success('Expense Category Created Successfully');
        this.reloadCurrentRoute();
      }, (err: any) => {

        this.toaster.error("expenseforCopy_name is All Ready Exits!");
      }
    )
  };

  ExpenseUpdate(id: any, data: any) {
    this._configurationalMasterService.updateExpense(id, data).subscribe(
      (res: any) => {

        this.toaster.success('Expense Category Updated Successfully')
      }, (err: any) => {
        this.toaster.error("expenseforCopy_name is All Ready Exits!");

      });
  };

  toggle(e: any, isChecked: boolean) {
    e.stopPropagation();
    if (isChecked) {
      this.checkedActive = 'ACTIVE';

    } else {
      this.checkedActive = 'INACTIVE';

    }

    let body = {
      status: this.checkedActive,
      isChecked: isChecked,
    }

    if (this.checkBox === true) {
      this._configurationalMasterService.updateExpense(this.cellValue, body).subscribe((res: any) => {
        this.expenseforCopy_name = res;
        this.toaster.success("Expense Category data successfully Inactivate")



      })
      this.reloadCurrentRoute();
    } else {
      this._configurationalMasterService.updateExpense(this.cellValue, body).subscribe((res: any) => {
        this.expenseforCopy_name = res;
        this.toaster.success("Expense Category data successfully activate")


      })
      this.reloadCurrentRoute();
    }

  }
  openDialog() {
    const dialogRef
      = this.dialog.open(ExpenseCategoryDialogComponent, {
        width: '35%',
        // maxWidth: '100vw',
        // maxHeight: '100vh',
        // height: '100%',
        // panelClass: 'full-screen-modal',
        data: { id: this.cellValue }

      });

    dialogRef.afterClosed().subscribe(result => {

    });


  }
  edit(e: any) {

    const dialogRef = this.dialog.open(ExpenseCategoryDialogComponent, {
      data: { id: this.cellValue },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }
  view(e: any) {
    const dialogRef = this.dialog.open(ExpenseCategoryDialogComponent, {
      data: { id: this.cellValue, view: "view" },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }
  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure you want to Remove it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this._configurationalMasterService.deleteExpense(this.cellValue).subscribe(
          (res) => {

            this.toaster.success('Deleted successfully ');
            this.reloadCurrentRoute();
          },
          (err) => {
            this.toaster.error("Somthing went wrong Please try agin", "Error Message")

          }
        )
      }
    });
  }
}
