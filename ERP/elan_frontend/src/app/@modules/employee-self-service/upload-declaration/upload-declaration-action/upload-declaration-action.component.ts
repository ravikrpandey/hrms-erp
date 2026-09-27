import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-declaration-action',
  templateUrl: './upload-declaration-action.component.html',
  styleUrls: ['./upload-declaration-action.component.scss']
})
export class UploadDeclarationActionComponent {

  assignAction: any;
  statusCheck: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private toaster: ToastrService,
    private payrollService:PayrollService,
   
  ) {}

  ngOnInit(): void {
    // this.assignAction = this._rbackService.accessAssignAction();
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
    this.statusCheck=params.data;
  }

  getValueToDisplay(params: ICellRendererParams) {
    // console.log("ssss",params.valueFormatted,params.data.id);
    return params.valueFormatted ? params.data.id : params.data.id;
  }

  refresh(params: ICellRendererParams): boolean {
    // this.cellValue = this.getValueToDisplay(params);
    return true;
  }
 

  edit(e:any) {
    this.route.navigate(['/master/ess/upload-declaration/create-upload-declaration'], {
      queryParams: { id: this.cellValue, Type: "edit" },
    });
  }
  view(e: any) {
    e.stopPropagation();
    this.router.navigate(['/master/ess/upload-declaration/create-upload-declaration'], {
      queryParams: { id: this.cellValue,mode:'view' },
    });
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
        this.payrollService.deleteUploaddeclaration(this.cellValue).subscribe(
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
