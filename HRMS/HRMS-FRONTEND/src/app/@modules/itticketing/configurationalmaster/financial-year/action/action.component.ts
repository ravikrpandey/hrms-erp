import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Color, ICellRendererParams, Logger } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { FinanceCreateComponent } from '../finance-create/finance-create.component';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent {
  singleId:any;
  cellValue1:any; 
  assignAction: any;
  entity_id: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _financeService: FinaceService,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService,
  ) {
    // this.data = localStorage.getItem("jobId");
    // 
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
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
    this.cellValue1 = params.data;
    // console.log("paramsss",this.cellValue);
    // console.log("paramsss11",this.cellValue1)
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data.id
  }

  refresh(params: ICellRendererParams): boolean {
    
    // this.singleId = params.data.id
    // wrirte code to modify cell 
    // if (params) {
     
    // } else {
    //   this.toaster.error("finance year is All Ready Exits!", 'Error Message');
    // }

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e: any) { 
    const dialogRef = this.dialog.open(FinanceCreateComponent, {
      data: { id: this.cellValue ,data:this.cellValue1, action:"edit" },
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.reloadCurrentRoute();
    });
  }

  view(e: any) {
    const dialogRef = this.dialog.open(FinanceCreateComponent, {
      data: { id: this.cellValue,data:this.cellValue1, action: "view" },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.reloadCurrentRoute();
    });
  }

  deleteAction(e: any) {
    
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
        this._financeService.deleteFinancialYear(this.cellValue1?.id).subscribe(
          (res) => {
            this.toaster.success(res.message);
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
