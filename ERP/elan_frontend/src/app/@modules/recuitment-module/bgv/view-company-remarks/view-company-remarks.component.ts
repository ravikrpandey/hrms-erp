import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from "@angular/common";
import { BgvService } from 'src/app/@shared/services/service/recruitment/bgv.service';

@Component({
  selector: 'app-view-company-remarks',
  templateUrl: './view-company-remarks.component.html',
  styleUrls: ['./view-company-remarks.component.scss']
})
export class ViewCompanyRemarksComponent {

  dataList: any = [];
  basicDetails: any = {}
  candidate_id: any;
  actionType: any;
  formObj: any = {};

  statusList: any = [
    {
      id: 'COMPLETED',
      value: 'Completed'
    },
    {
      id: 'REJECTED',
      value: 'Rejected'
    },
    {
      id: 'HOLD',
      value: 'Hold'
    },
  ]

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private $bgv: BgvService,
  ) {

  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
   
      this.candidate_id = params?.id;
      this.actionType = params?.actionType;
      if (this.candidate_id) {
        this.get_candidate_company_detailsBYID();
      }
    });
  }

  get_candidate_company_detailsBYID() {
  
    this.$bgv.get_candidate_company_detailsBYID(this.candidate_id).subscribe((res: any) => {
      console.log(res);
      this.basicDetails = res?.data[0];
      this.dataList = res?.company_list;
    })
  }

  handleSubmit() {
  
    try {
      if (!this.formObj?.bgv_status) {
        return this.toast.error('Status Field is Required');
      }
      this.formObj.candidate_id = this.candidate_id;
      this.$bgv.update_bgv_statusDetails(this.formObj).subscribe((res: any) => {
        if (res) {
          this.toast.success(res?.message);
          this.goBack();
        }
      }, (err) => {
        this.toast.error(err?.error?.message);
        console.log(err)
      })
    } catch (err) {
      console.log(err)
    }
  }

  goBack() {
    this.location.back();
  }

}
