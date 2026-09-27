import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Color, ICellRendererParams, Logger } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import Swal from 'sweetalert2';
import { AllowanceListComponent} from '../allowance-list.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { AllowanceCreateComponent } from '../../allowance-create/allowance-create.component';
import { CommonService } from 'src/app/@shared/services/common.service';

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
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService,
    private _commonService : CommonService
  ) {
    // this.data = localStorage.getItem("jobId");
    // 

  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.assignAction = this._rbackService.accessAssignAction();
   }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.cellValue1 = params.data;
    
  }

  createDepartment(data: any) {
    this._configurationalMasterService.createDepartment(data,this.entity_id).subscribe(
      (res: any) => {
        
        this.toaster.success('Allowance Created Successfully');
        this.reloadCurrentRoute();
      }, (err: any) => {
        
        this.toaster.error("Allowance Name is All Ready Exits!", 'Error Message');
      }
    )
  };

  edit(e: any) {

    const dialogRef = this.dialog.open(AllowanceCreateComponent, {
      data: { id: this.cellValue1.id},

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  view(e: any) {
    const dialogRef = this.dialog.open(AllowanceCreateComponent, {
      data: { id: this.cellValue1.id,data:this.cellValue1, view: "view" },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
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
        this._commonService.showLoader()
        this._configurationalMasterService.deleteallowance(this.cellValue1?.id).subscribe(
          (res) => {
            this._commonService.hideLoader()
            this.toaster.success('Deleted successfully ');
            this.reloadCurrentRoute();
          },
          (err) => {
            this._commonService.hideLoader()
            this.toaster.error("Somthing went wrong Please try agin", "Error Message")
            
          }
        )
      }
    });
  } 
}

