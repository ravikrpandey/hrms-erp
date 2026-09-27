import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { LeadService } from 'src/app/@shared/services/lead.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';

@Component({
  selector: 'app-offer-dailog',
  templateUrl: './offer-dailog.component.html',
  styleUrls: ['./offer-dailog.component.scss']
})
export class OfferDailogComponent {
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

  constructor(private _empService: EmpRegistrationService, private leadService: LeadService,
    private recruitService: RecruitService, private _empMaster: EmpMasterService, private toster: ToastrService,
    public dialog: MatDialogRef<OfferDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    
  ) {
    this.onBoardingId= data.onBoardingId;

  }

  ngOnInit(): void {
      this.recruitService.getSingleOnBoarding(this.onBoardingId).subscribe((res: any) => {
        this.singleEmpData = res.data;
       })
  
    }
  }
