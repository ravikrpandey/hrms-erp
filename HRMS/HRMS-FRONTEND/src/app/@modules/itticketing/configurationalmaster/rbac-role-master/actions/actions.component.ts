import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import Swal from 'sweetalert2';
import { NewRoleDialogComponent } from '../new-role-dialog/new-role-dialog.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent {
  isChecked = false;
  checkedActive: any;
  checkedAuther: any;
  checkBox: any;
  role_id: any;
  assignAction: any;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _rbackService: RbacMasterService,
    private toster: ToastrService,
  ) {
    // this.data = localStorage.getItem("jobId");
    // 

  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);

  }
  getValueToDisplay(params: ICellRendererParams) {

    // this.checkBox = params.data.isChecked;
    // 
    // if (this.checkBox === true) {
    //   this.isChecked = true;
    // } else {
    //   this.isChecked = false;
    // }
    this.role_id = params.data.role_master_id;



    return params.valueFormatted ? params.valueFormatted : params.data.role_master_id
  }
  refresh(params: ICellRendererParams): boolean {
    // set value into cell again

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  edit() {
    this.router.navigate(["master/configurational-master/designations/create-designation"], { queryParams: { role_master_id: this.cellValue } })
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
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
      if (result.value) {
        this._rbackService.deleteRoleAssign(this.role_id).subscribe((res: any) => {
          if (res) {
            this.toster.success('Deleted successfully');
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        })
      } 
      // else if (result.dismiss === Swal.DismissReason.cancel) {
      //   return this.toster.error('Your role is safe', 'Fields Error');
      // }
    })

  }
  openDialog() {

    const dialogRef
      = this.dialog.open(NewRoleDialogComponent, {
        // width: '100%',
        // maxWidth: '100vw',
        // maxHeight: '100vh',
        // height: '100%',
        // panelClass: 'full-screen-modal',
        data: { role_master_id: this.cellValue }

      });

    dialogRef.afterClosed().subscribe(result => {

    });


  }
  // toggle(e: any, isChecked: boolean) {
  //   e.stopPropagation();
  //   
  //   // let checked =isChecked;
  //   

  //   if (isChecked) {
  //     this.checkedActive = 'ACTIVE';

  //     
  //     // 
  //   } else {
  //     this.checkedActive = 'INACTIVE';
  //     
  //     // 
  //   }

  //   let body = {
  //     status: this.checkedActive,
  //     isChecked: isChecked,
  //   }
  //   
  //   if (this.checkBox === true) {
  //     this._rbackService.deleteRoleAssign(this.cellValue, body).subscribe((res: any) => {
  //       this.checkedAuther = res;
  //       // this.toast.success("Auther data successfully Inactivate")

  //       

  //     })
  //     // this.reloadCurrentRoute();
  //   } else {
  //     this._rbackService.deleteRoleAssign(this.cellValue, body).subscribe((res: any) => {
  //       this.checkedAuther = res;
  //       // this.toast.success("Auther data successfully activate")
  //       

  //     })
  //     // this.reloadCurrentRoute();
  //   }

  //  }

}
