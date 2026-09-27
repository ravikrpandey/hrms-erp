import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaintenanceService } from 'src/app/@shared/services/Maintenance/maintenance.service';

@Component({
  selector: 'app-remark-dialogue',
  templateUrl: './remark-dialogue.component.html',
  styleUrls: ['./remark-dialogue.component.scss']
})
export class RemarkDialogueComponent implements OnInit {
  Allremark:any=[];
   constructor(
      private dialog: MatDialogRef<RemarkDialogueComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private management_service:MaintenanceService

    ) {


    }

    ngOnInit(): void {
     this.getAll_remark_ByPlanId();
    }

    getAll_remark_ByPlanId(){
      
      this.management_service.getAll_remark_ByPlanId(this.data?.data).subscribe((res:any)=>{
       if(res){
        this.Allremark=res.data;
       }
      },(err:any)=>{

      })
    }

}
