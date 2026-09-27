import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/@shared/services/common.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';

@Component({
  selector: 'app-resignation-status',
  templateUrl: './resignation-status.component.html',
  styleUrls: ['./resignation-status.component.scss']
})
export class ResignationStatusComponent {
  cellData: any;
  rowData: any;
  getData: any = [];
  serviceType: string;
  getdataCopy: any;
  notCreatedFlow: boolean = false;
  remarkshow: any;
  id:any;
  constructor(public dialog: MatDialogRef<ResignationStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private prService: PurchaseRequestService,
      private recruitService: RecruitService,
    private _commonService : CommonService, 
    private toast: ToastrService, private route: Router,) {
    this.cellData = this.data.allData.id;
    console.log(this.cellData);
    
  }

  ngOnInit(): void {
    // this.getAllApproverList();
    this.getalllevelresignation();
  }


  getalllevelresignation = () => {
    this.id = localStorage.getItem('EmpMainId')
    this._commonService?.showLoader()
    this.recruitService
    .getalllevelresignation(this.cellData)
    .subscribe((params: any) => {
      this._commonService?.hideLoader()
      this.rowData = params.data;  
      console.log("agsfagsf",this.rowData);
    },(err : any) => {
      this.rowData = []
      this._commonService?.hideLoader()
    });
  }



  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });}

 
  view(e:any){
    console.log(e,'eeeee');
    this.remarkshow=e.remark || "No Remark Available";
  }
 
}
