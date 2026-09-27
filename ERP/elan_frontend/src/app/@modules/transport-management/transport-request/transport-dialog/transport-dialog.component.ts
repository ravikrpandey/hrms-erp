import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr/toastr/toastr.service';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-transport-dialog',
  templateUrl: './transport-dialog.component.html',
  styleUrls: ['./transport-dialog.component.scss']
})
export class TransportDialogComponent {
 cellData: any;
  getData: any = [];
  serviceType: string;
  getdataCopy: any;
  notCreatedFlow: boolean=false;
  remarkshow: any;
  typeStatus:any;
  id : any;
  constructor(public dialog: MatDialogRef<TransportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
     private transport_service: TransportManagementService,
      private route: Router,
    private activeroute:ActivatedRoute
    ) {
    this.cellData = this.data;
    console.log('dsfbsdfbdsbfdgsgbsbgbsdfan',data);

  }

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params: any) => {
        console.log('ID from query params:', params.id);
  this.typeStatus = params.status;
  this.id = params.id;
});

    // this.getAllApproverList();
    this.approveLeavel();

  }

  getAllApproverList() {
    let data = {
      department: this.cellData?.department,
      PR_category: this.cellData?.PR_category=="Service PR"?"service":"item"
    }
    // this.transport_service.getAllApproverList(data).subscribe((res: any) => {
    //   this.getData = res.data[0].workFlowmaps;

    // })
  }

  approveLeavel() {
this.transport_service.getLevel(this.cellData?.id,).subscribe((res:any)=>{
  this.getdataCopy=res.data
},
((err:any)=>{

  if(err.status==400){
this.notCreatedFlow=true;
  }
})
)
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }


  view(e:any){
    console.log(e,'eeeee');
    this.remarkshow=e.remark || "No Remark Available";
  }

}
