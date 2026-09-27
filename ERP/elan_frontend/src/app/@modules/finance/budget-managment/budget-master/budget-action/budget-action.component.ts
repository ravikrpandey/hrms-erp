import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Color, ICellRendererParams, Logger } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { BudgetCreateComponent } from '../budget-create/budget-create.component';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-budget-action',
  templateUrl: './budget-action.component.html',
  styleUrls: ['./budget-action.component.scss']
})
export class BudgetActionComponent {
  singleId:any;
  cellValue1:any;
  assignAction: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _finaceservice:FinaceService,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService,
  ) {
    // this.data = localStorage.getItem("jobId");
    // 

  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
   }
  public cellValue: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });}
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.cellValue1 = params.data;
    
  }

  getValueToDisplay(params: ICellRendererParams) {
    

    return params.valueFormatted ? params.valueFormatted : params.data.id
  }

  refresh(params: ICellRendererParams): boolean {
    
    // this.singleId = params.data.id
    // wrirte code to modify cell 

    if (params) {
      const data: any = {
        department_name: params.data.department_name.trim(),
        status: params.data.status,
        
      }
      
      if (params.data.color === null && params.data.color !== "") {
        this.createBudget(data);
      } else {
        const id: number = Number(params.data.id);
        // this.updateDepartment(id, data);
      }
    } else {
      this.toaster.error("budget_name is All Ready Exits!", 'Error Message');
    }


    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  createBudget(data: any) {
    this._finaceservice.createBudget(data).subscribe(
      (res: any) => {
        
        this.toaster.success('Budget Created Successfully');
        this.reloadCurrentRoute();
      }, (err: any) => {
        
        this.toaster.error("budget_name is All Ready Exits!", 'Error Message');
      }
    )
  };
  extend(e:any) {
    e.stopPropagation();
    
    
    this.router.navigate(['master/finance/budget-management/budget-master/extend-list'], { queryParams: { budget_id: this.cellValue}})
  }
  edit(e: any) {

    const dialogRef = this.dialog.open(BudgetCreateComponent, {
      data: { id: this.cellValue },

      width: '750px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  view(e: any) {
    const dialogRef = this.dialog.open(BudgetCreateComponent, {
      data: { id: this.cellValue, view: "view" },

      width: '750px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
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
        this._finaceservice.deleteBudget(this.cellValue).subscribe(
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
