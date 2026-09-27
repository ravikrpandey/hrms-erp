import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

// import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { DeclarationFormDialogComponent } from '../declaration-form-dialog/declaration-form-dialog.component';

@Component({
  selector: 'app-declaration-form-action',
  templateUrl: './declaration-form-action.component.html',
  styleUrls: ['./declaration-form-action.component.scss']
})
export class DeclarationFormActionComponent {

  paramsVal: any;
  assignAction: any;
  status: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService
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
    this.paramsVal = params.data.emptype_id;
    this.status = params.data.approval_status;
    debugger;
    this.cellValue = this.getValueToDisplay(params);
  }
  getValueToDisplay(params: ICellRendererParams) {


    return params.valueFormatted
      ? params.valueFormatted
      : params.data.id;
  }
  refresh(params: ICellRendererParams): boolean {

    // write code to modify cell

    //EDIT DATA FROM API
    if (params) {
      const data: any = {
        emptype_name: params.data.emptype_name.trim(),
        status: params.data.status,
      };
      if (params.data.color === null && params.data.color !== '') {

      } else {
        const emptype_id: number = Number(params.data.emptype_id);
        //this.updateEmpt(emptype_id, data);
      }
    } else {
      this.toaster.error(
        "emptype_name is All Ready Exits!",
        'Error Message'
      );
    }

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }



  openDialog() {
    const dialogRef = this.dialog.open(DeclarationFormDialogComponent, {
      data: { visible: 'visible', id: this.paramsVal },

      width: '30%',
    });

    dialogRef.afterClosed().subscribe((result) => {

    });

  }
  
  editData(e:any){
    this.route.navigate(['/master/payroll/declaration-form/update-declaration'], {
      queryParams: { id: this.cellValue,mode:'view' }
    });
  }

  view(){
    this.route.navigate(['/master/payroll/declaration-form/view'], {
      queryParams: { id: this.cellValue,mode:'view' }
    });
  }

}
