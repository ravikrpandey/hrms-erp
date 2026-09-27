import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { JobListDialogComponent } from '../emp-list-dialog/emp-list-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionTwoComponent implements OnInit {
  // data: string | null;

  constructor(private route: Router, private recruitService: RecruitService, private toast: ToastrService,
    public dialog: MatDialog) {
      // this.data = localStorage.getItem("jobId");
      // 
      
  }

  ngOnInit(): void {
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

  edit(e:any) {
    
    e.stopPropagation();
    
    
    // 
    this.route.navigate(['recuitment/job-create'], { queryParams: { job_id: this.cellValue } })
    // edit(e: any) {
    //   e.stopPropagation();
    // }
  }

  delete(e:any){
    
    const data = {
      jobId: Number(this.cellValue)
    }
    this.recruitService.deleteJob(data).subscribe((res:any)=>{
      
      this.toast.success("Job Details Deleted successfully..");
      window.location.reload();
    })
    e.stopPropagation();

    
  }
  openDialog() {
    const dialogRef
      = this.dialog.open(JobListDialogComponent, {
        width: '100%',
        maxWidth: '100%',
        maxHeight: '100vh',
        height: '100%',
        panelClass: 'full-screen-modal',
        data: { id: this.cellValue }
      });
      
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
}
