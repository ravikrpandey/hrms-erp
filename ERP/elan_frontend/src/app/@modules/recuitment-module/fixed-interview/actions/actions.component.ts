import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import Swal from 'sweetalert2';
import { FixedinterviewDialogComponent } from '../fixedinterview-dialog/fixedinterview-dialog.component';
import { SheduledialogComponent } from '../sheduledialog/sheduledialog.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';


@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class ActionsComponent implements ICellRendererAngularComp {

  candidateId: any;
  assignAction:any;
  
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private _recrutmentService: RecruitService,
    private _rbackService:RbacMasterService,

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
    console.log(params, 'dd');
    
    return params.valueFormatted ? params.valueFormatted : params.data.candidate_id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  dateopen(e: any) {

    console.log(this.cellValue, 'sddsjk');
    

    e.stopPropagation();
    const dialogRef = this.dialog.open(SheduledialogComponent, { data: { id: this.cellValue } });
    dialogRef.afterClosed().subscribe(result => {
      
    });

  }

  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Do You Want to Reject Fixed Interview of this candidate ?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          fixed_interview_status: "INACTIVE"
        };
        this._recrutmentService.deleteFixedInterview(this.cellValue, data).subscribe(
          (res) => {
            
            this.toastr.success('Delete successfully ');
            this.reloadCurrentRoute();
          },
          (err) => {
            this.toastr.error("Somthing went wrong.. Please try agin", "Error Message")
            
          }
        )
      }
    });
  }

}
