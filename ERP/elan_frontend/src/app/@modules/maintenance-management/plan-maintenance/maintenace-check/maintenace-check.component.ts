import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MaintenanceService } from 'src/app/@shared/services/Maintenance/maintenance.service';

@Component({
  selector: 'app-maintenace-check',
  templateUrl: './maintenace-check.component.html',
  styleUrls: ['./maintenace-check.component.scss']
})
export class MaintenaceCheckComponent {
  dataList: any = [];

  userLoginId: any;
  loading: boolean = false;
  id: any;
  proposalId: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastrService,
    public dialog: MatDialogRef<MaintenaceCheckComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private  mainetance_service:MaintenanceService
  ) { }


  ngOnInit() {
    this.userLoginId = localStorage.getItem('EmpMainId')
    this.route.queryParams.subscribe((params: any) => {
      this.id = params?.id;
      if (this.id) {
        this.getAll_maintenanceTypeby_Workstation_id(this.data.id);
      }
    });
  }

  // Get version
  getAll_maintenanceTypeby_Workstation_id(id:any) {
    try {
      this.mainetance_service.getAll_maintenanceTypeby_Workstation_id(id).subscribe((res:any)=>{
      if(res){
         this.dataList=res.data;
      }
      },(err:any)=>{

      })
    } catch (error) {
      console.log(error);
    }
  }
  // Get version

  closeProposal(data: any) {
    ;
    this.dataList?.map((item: any) => {
      if (item?.id == data?.id) {
        item.isClosed=true;
      }
    });
  }


  closeLeadCreate() {
    let closed = this.dataList.filter((elem: any) => elem?.isClosed == true);
    if (!( closed[0]?.id)) {
      return this.toast.error('Please create at least one Maintenance Type', 'Fields Error');
    }
    else {
      this.dialog.close(closed);
    }
  }

}
