import { Component } from '@angular/core';
import { CreateVehicalCategoryComponent } from '../create-vehical-category/create-vehical-category.component';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehical-category-action',
  templateUrl: './vehical-category-action.component.html',
  styleUrls: ['./vehical-category-action.component.scss']
})
export class VehicalCategoryActionComponent {
  singleId: any;
  assignAction: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
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
    });
  }
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);

  }

  getValueToDisplay(params: ICellRendererParams) {


    return params.valueFormatted ? params.valueFormatted : params.data.id
  }

  refresh(params: ICellRendererParams): boolean {

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  // edit(){
  //   this.router.navigate(["master/hrms/rbacmaster/Rbac-role-create"],{queryParams:{role_master_id:this.cellValue}})
  // }


  openDialog(e:any) {
    e.stopPropagation();
    const dialogRef
      = this.dialog.open(CreateVehicalCategoryComponent, {
        width: '30%',
        data: { id: this.cellValue, view: 'visible' }
      });

    dialogRef.afterClosed().subscribe((result:any) => {
    });
  }
  editDesig: any;
  edit(e:any) {


    const dialogRef
      = this.dialog.open(CreateVehicalCategoryComponent, {
        width: '30%',
        data: { id: this.cellValue }
      });

    dialogRef.afterClosed().subscribe((result:any) => {
    });
  }



}



