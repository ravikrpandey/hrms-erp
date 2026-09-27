import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponentResignation implements OnInit {
  params:any;
  resignId:any;
  assignAction:any;
  private _commonService: any;
  
  constructor(private route: Router, private _rbackService:RbacMasterService, private recruitService: RecruitService, private toast:ToastrService) {

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
    // resignation
    if (params.data.employee_resignation_id) {
      this.resignId = params.data.employee_resignation_id;
      return params.data.employee_resignation_id;

    }
  }
    refresh(params: ICellRendererParams): boolean {
      // set value into cell again
      
      this.cellValue = this.getValueToDisplay(params);
      return true;
    }
    
    delete (e:any){
      e.stopPropagation();
        const data = {
          resign_id: Number(this.cellValue)
        }

        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'question',
          showCancelButton: true, 
          cancelButtonColor: '#00a9e4',
          confirmButtonText: 'Delete',
          confirmButtonColor: 'rgba(206, 22, 22, 0.92)'
        }).then((result) => {
          if (result.isConfirmed) {
            this._commonService?.showLoader()
            this.recruitService.deleteResignation(this.resignId, data).subscribe((res: any) => {
              
              this.toast.success("Resignation Deleted Successfully..");
              this.reloadCurrentRoute();
            },(err)=>{
              this._commonService?.hideLoader()
              this.toast.error("Somthing went wrong.. Please try agin", "Error Message")
            })
          }
        });

    }
  }

