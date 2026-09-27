import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EmployeSelfService } from 'src/app/@shared/services/employe-self.service';

@Component({
  selector: 'app-attendence-dialogue',
  templateUrl: './attendence-dialogue.component.html',
  styleUrls: ['./attendence-dialogue.component.scss']
})
export class AttendenceDialogueComponent {

  dataList: any = [];

  constructor(
    public dialog: MatDialogRef<AttendenceDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ess_service:EmployeSelfService,
    private  toast:ToastrService
  ) {
  }

  onClose(): void {
    this.dialog.close();
  }
  ngOnInit(): void {
    this.get_employeeAttendence();
  }
  get_employeeAttendence(){
    this.ess_service.get_employeeAttendence(this.data).subscribe((res:any)=>{
      if(res){
         this.toast.success('Attendence Fetch Successfully')
        this.dataList=res.data;
      }
    },(err:any)=>{
      this.toast.error(err.error.message)
    })
  }
}