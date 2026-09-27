import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
@Component({
  selector: 'app-complaint-dialog',
  templateUrl: './complaint-dialog.component.html',
  styleUrls: ['./complaint-dialog.component.scss'],
})
export class ComplaintDialogComponent {
  rowData: any;
  complaintId: any;
  listComplaint: any;

  constructor(
    private _empService: EmpRegistrationService,
    private recruitService: RecruitService,
    public dialog: MatDialogRef<ComplaintDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.complaintId = this.data.id;
    
  }
  ngOnInit(): void {
    this.recruitService.getByIdcomplaint(this.complaintId).subscribe((res: any) => {
      this.listComplaint = res.data;
      
    });
    if (this.complaintId) {
      

      
    } else {
      
    }
  }
}
