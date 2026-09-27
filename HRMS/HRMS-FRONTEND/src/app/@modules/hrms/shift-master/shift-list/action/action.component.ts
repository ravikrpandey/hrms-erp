import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Color, ICellRendererParams, Logger } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ShiftCreateComponent } from '../../shift-create/shift-create.component';
import { ShiftServiceService } from 'src/app/@shared/services/service/hrmServices/shift-service.service';

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
    private Service: ShiftServiceService,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService,
  ) {
    // this.data = localStorage.getItem("jobId");
    // 

  }
  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.assignAction = this._rbackService.accessAssignAction();
    this.createShiftList;
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

  createShiftList(data: any, entity_id:any) {
    this.Service.createShiftList(data,entity_id).subscribe(
      (res: any) => {
        
        this.toaster.success('Shift Created Successfully');
        this.reloadCurrentRoute();
      }, (err: any) => {
        
        this.toaster.error("Shift Name is All Ready Exits!", 'Error Message');
      }
    )
  };

  edit(e: any) {

    const dialogRef = this.dialog.open(ShiftCreateComponent, {
      data: { id: this.cellValue1.id},

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  view(e: any) {
    const dialogRef = this.dialog.open(ShiftCreateComponent, {
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
        this.Service.deleteShift(this.cellValue1?.id).subscribe(
          (res) => {
            
            this.toaster.success('Deleted successfully! ');
            this.reloadCurrentRoute();
          },
          (err) => {
            this.toaster.error("Something went wrong, Please try agin", "Error Message")
            
          }
        )
      }
    });
  } 
}
