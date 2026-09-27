import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpMasterService } from '../services/emp-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from '../services/recruitment.service';
import { LeadService } from '../services/lead.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
// import { log } from 'console';

@Component({
  selector: 'task-order-app-list-dialog',
  templateUrl: './task-order-app-list-dialog.component.html',
  styleUrls: ['./task-order-app-list-dialog.component.scss']
})
export class TaskOrderAppListDialogComponent implements OnInit {
  rowData: any;
  empId: any
  singleEmpData: any;
  reportingManager: any;
  title: any;
  lastName: any;
  announceId: any;
  announceData: any;
  achiveId: any;
  achievemenList: any;
  grivenceId: any;
  grivenceSingleData: any;
  complaintId: any;
  listComplaint: any;
  helpDiskId: any;
  helpDiskData: any;
  resign_id: any;
  resignData: any;
  backgroundData: any;
  verifyNewId: any;
  interviewId: any;
  interviewData: any;
  previousData: any;
  finalData: any[] = [];
  leadData: any;
  leadId: any;
  cellValue: any;
  route: any;
  status: any;
  onBoardingId:any;
  onBoardingData:any;
  leadForm:FormGroup;
  rowData1: any;

  constructor(private _empService: EmpRegistrationService, private leadService: LeadService,
    private recruitService: RecruitService, private _empMaster: EmpMasterService, private toster: ToastrService,
    public dialog: MatDialogRef<TaskOrderAppListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb : FormBuilder,

  ) {
console.log(data,'dataCopy');

    if (this.data.jobId) {
      this.empId = this.data.jobId

    }

    if (this.data.verifyId) {
      this.verifyNewId = this.data.verifyId

    }

    if (this.data.interview_id) {
      this.interviewId = this.data.interview_id

    }

    if (this.data.resign) {
      this.resign_id = this.data.resign

    }

    if (this.data.announcementId) {
      this.announceId = this.data.announcementId;

    }

    //achivement
    if (this.data.achivementId) {
      this.achiveId = this.data.achivementId;
    }

    // grivance
    if (this.data.grivanceViewId) {
      this.grivenceId = this.data.grivanceViewId
    }
    // complaint
    if (this.data.complaint_id) {
      this.complaintId = this.data.complaint_id
    }
    //help-disk
    if (this.data.helpDiskViewId) {
      this.helpDiskId = this.data.helpDiskViewId;
    }
    if (this.data.lead_id) {
      this.leadId = this.data.lead_id;
    }

    if (this.data.onBoardingId) {
      this.onBoardingId = this.data.onBoardingId;

    }
    this.leadForm = this.fb.group({
      status: new FormControl(null),
  })
  }

  ngOnInit(): void {
    //job-Description
    if (this.data.jobId) {
      this.recruitService.getJobById(this.empId).subscribe((res: any) => {
        this.singleEmpData = res.data;

      })
    }

    if (this.data.interview_id) {
      this.recruitService.interviewById(this.interviewId).subscribe((res: any) => {
        this.interviewData = res.data;

      })
    }

    // background-data
    if (this.data.verifyId) {
      this.recruitService.getcandidateById(this.verifyNewId).subscribe((res: any) => {
        this.backgroundData = res.data;
        this.previousData = this.backgroundData.precious_job_status;
        for (let item of this.previousData) {
          this.finalData.push(item.precious_job_status);
        }

      })
    }

    // internal announcement
    if (this.data.announcementId) {
      this._empMaster.getByIdAnnouncement(this.announceId).subscribe((res: any) => {
        this.announceData = res.data;

      })
    }

    // resign component
    if (this.data.resign) {
      this.recruitService.getIdResignation(this.resign_id).subscribe((res: any) => {
        this.resignData = res.data;

      })
    }

    //achivement employe
    if (this.achiveId) {
      this.recruitService.achievementDetails(this.achiveId).subscribe((res: any) => {
        this.achievemenList = res.data[0];

      })
    }

    //grivance
    if (this.grivenceId) {
      this._empMaster.grievanceAddById(this.grivenceId).subscribe((res: any) => {
        this.grivenceSingleData = res.data;

      })
    }

    //complaint
    if (this.complaintId) {
      this._empMaster.complaintAddById(this.complaintId).subscribe((res: any) => {
        this.listComplaint = res.data;

      })
    }

    //help-disk
    if (this.helpDiskId) {
      // alert('view helpdisk')
      this._empMaster.helpDeskGetById(this.helpDiskId).subscribe((res: any) => {
        this.helpDiskData = res.data;

      })
    }

     //on-boarding
     if (this.onBoardingId) {
      // alert('view helpdisk')
      this.recruitService.getSingleOnBoarding(this.onBoardingId).subscribe((res: any) => {
        this.onBoardingData = res.data;

      })
    }

    if (this.leadId) {
      this.leadService.getByIdLead(this.leadId).subscribe((res: any) => {
        this.leadData = res.data;

      })
    }
    this.leadService.getTaskOrderDetails(this.data.data).subscribe((res: any) => {
      this.rowData1 = res.data;
      console.log(this.rowData1,"rowData<<<<");
    })
  }


  getStatus(e: any) {
    //
    this.status = e.value;

    const test = {
      status: this.status
    }
  }
  updateLead(){
    console.log('leadData type', this.leadData?.certificate_type)
    if(this.leadData?.certificate_type ==2 || this.leadData?.certificate_type ==4){
      console.log('lead form value', this.leadForm?.value)
     this.leadService.editLeadStatusValue(this.leadData.lead_genration_id,this.leadForm.value).subscribe((res:any) => {
     this.toster.success("Updated Assignment Successfully..")
     })
    }
    else{
      this.leadService.editLeadStatusValue(this.leadData.lead_genration_id,this.leadForm.value).subscribe((res:any) => {
        this.toster.success("Updated Assignment Successfully..")
      })
    }
   }

  statusGet() {
    const test = {
      status: this.status
    }


    this.recruitService.statusResignation(this.resign_id, test).subscribe((res: any) => {

      this.toster.success(`Resignation ${this.status}`)
    })
   window.location.reload();
  }
}
