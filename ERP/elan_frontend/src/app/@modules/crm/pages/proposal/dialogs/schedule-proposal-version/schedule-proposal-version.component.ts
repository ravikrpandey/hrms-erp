import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';

@Component({
  selector: 'app-schedule-proposal-version',
  templateUrl: './schedule-proposal-version.component.html',
  styleUrls: ['./schedule-proposal-version.component.scss']
})
export class ScheduleProposalVersionComponent {
 rowData: any = [];
  singleData: any;
  scheduleFollowup: FormGroup;
  constructor(
    private router: Router,
    private $proposal: ProposalService,
    private toast : ToastrService,
    private matDialog : MatDialog,
    public dialog: MatDialogRef<ScheduleProposalVersionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb:FormBuilder
  ) {
    this.singleData = data?.id;
  }
  
  ngOnInit(): void {
    this.scheduleFollowup = this.fb.group({
      proposal_no:[],
      version:[],
      followup_date:['', Validators.required]
    })
    this.patchData(this.data);
  }
  patchData(data:any){
    
    this.scheduleFollowup.patchValue(data);
  }
  onClose() {
    this.dialog.close();
  }
  updateForlloupDate(){
    
    this.data.follow_up_date = this.scheduleFollowup.value.followup_date;
    this.$proposal.updateFollowUpDate(this.data.id, this.data).subscribe({
      next:(res:any)=> {
        this.toast.success(res.message);
        this.dialog.close(res)
      },error:(err)=> {
        this.toast.error(err.error.message)
      },
    })
  }
}
