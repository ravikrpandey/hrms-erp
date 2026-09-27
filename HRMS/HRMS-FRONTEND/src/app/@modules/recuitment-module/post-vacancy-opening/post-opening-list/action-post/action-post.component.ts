import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
// import { JobListDialogComponent } from '../emp-list-dialog/emp-list-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { EmailSendeComponent } from 'src/app/@shared/components/email-sende/email-sende.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-action-post',
  templateUrl: './action-post.component.html',
  styleUrls: ['./action-post.component.scss']
})
export class ActionPostComponent implements OnInit {
  // data: string | null;
  rowData: any;
  name: any;
  specificContent: any;
  id: any;
  assignAction:any;
    constructor(private route: Router, private _rbackService:RbacMasterService, private recruitService: RecruitService, private toast: ToastrService,
    public dialog: MatDialog) {
    // this.data = localStorage.getItem("jobId");
    // 

  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    
  }
  getValueToDisplay(params: ICellRendererParams) {
    
    return params.data.jobId;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e: any) {

    e.stopPropagation();
    

    // 
    this.route.navigate(['recruitment/job-create'], { queryParams: { job_id: this.cellValue } })
    // edit(e: any) {
    //   e.stopPropagation();
    // }
  }

  delete(e: any) {
    
    const data = {
      jobId: Number(this.cellValue)
    }
    this.recruitService.deleteJob(data).subscribe((res: any) => {
      
      this.toast.success("Job Details Deleted successfully..");
      window.location.reload();
    })
    e.stopPropagation();
  }

  emailSend(e: any) {
    e.stopPropagation();

    const dialogRef = this.dialog.open(EmailSendeComponent, {
      width: '40%',
      // maxWidth: '100vw',
      // maxHeight: '100vh',
      height: '70%',
      position: { bottom: '10px', right: '10px' },
      panelClass: 'full-screen-modal',
      data: { id: this.cellValue },
    });

    dialogRef.afterClosed().subscribe((result) => {
      
    });
  }
  sendPost(e: any) {
    e.stopPropagation();

    const data = {
      author: "urn:li:person:wTX-8T76Jy",
      lifecycleState: "PUBLISHED",
      specificContent: {
        ['com.linkedin.ugc.ShareContent']: {
          shareCommentary: {
            text: "Good Morning Guys!",
          },
          shareMediaCategory: "NONE"
        }
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
      }
    }
    this.recruitService.linkedinPostshare(data).subscribe((res: any) => {
      
      this.toast.success("Job Details Sended successfully..");
      // window.location.reload();
    })
  }
}
