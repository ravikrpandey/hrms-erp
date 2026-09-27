import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';

@Component({
  selector: 'app-announcement-view',
  templateUrl: './announcement-view.component.html',
  styleUrls: ['./announcement-view.component.scss']
})
export class AnnouncementViewComponent {
  announceData:any;
  empId:any

constructor(private _empMaster:EmpMasterService, public dialog: MatDialogRef<AnnouncementViewComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any){
    this.empId = this.data.id
    
}

ngOnInit(): void {
 this.getBydata()
}

getBydata(){
  this._empMaster.getByIdAnnouncement(this.empId).subscribe((res:any)=>{
    this.announceData=res.data;
    
     })
}
}
