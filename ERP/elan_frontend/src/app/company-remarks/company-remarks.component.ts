import { Component } from '@angular/core';
import { BgvService } from '../@shared/services/service/recruitment/bgv.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-remarks',
  templateUrl: './company-remarks.component.html',
  styleUrls: ['./company-remarks.component.scss']
})
export class CompanyRemarksComponent {

  dataList: any = [
    {
      company_name: 'name 1',
      start_date: 'date 1',
      end_date: 'date 2',
    },
    {
      company_name: 'name 2',
      start_date: 'date 2',
      end_date: 'date 2',
    },
  ];
  remarks: any;
  basicDetails: any = {}
  cand_bgv_id: any;
  isDisabled: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private toast: ToastrService,
    private $bgv: BgvService,
  ) {

  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {

      this.cand_bgv_id = params?.id;
      if (this.cand_bgv_id) {
        this.get_candidate_companyDetails();
        this.get_all_selfratings();
      }
    });
  }

  get_candidate_companyDetails() {

    this.$bgv.get_candidate_companyDetails(this.cand_bgv_id).subscribe((res: any) => {
      console.log(res);
      this.basicDetails = res?.data[0];
      this.dataList = res?.company_list;
    })
  }

  // Company check list start
  companyCheckList: any = [
    {
      quality_type_name: 'Quality of work',
    },
    {
      quality_type_name: 'Goal Achievement',
    },
    {
      quality_type_name: 'Relationship with colleagues',
    },
    {
      quality_type_name: 'Communication',
    },
    {
      quality_type_name: 'Time Management',
    },
    {
      quality_type_name: 'Work under pressure',
    },
    {
      quality_type_name: 'Task Management',
    },
    {
      quality_type_name: 'Task Multiple',
    },
    {
      quality_type_name: 'Proactivity & Initiative',
    },
  ]
  get_all_selfratings() {
    this.$bgv.get_all_selfratings().subscribe((res: any) => {
      console.log(res);
      let list = res?.data;
      this.companyCheckList?.map((item: any) => {
        item.ratingList = list;
      })
    })
  }

  handleSave(data: any) {

    try {
      let quality_check_list = [];
      let isCheck = false;
      this.companyCheckList?.map((item: any) => {
        if (!item?.rating_value) {
          isCheck = true;
        }
      })
      if (isCheck) {
        return this.toast.error('Answer fields should not be empty', 'Fields Error');
      }
      else {
        quality_check_list = this.companyCheckList?.filter((elem: any) => elem?.rating_value)
      }
      let req = {
        company_id: data?.id,
        remarks: data?.remarks,
        quality_check_list: quality_check_list,
      }
      this.$bgv.create_company_quality_ratings(req).subscribe((res: any) => {
        if (res) {
          this.toast.success(res?.message);
          this.isDisabled = false;
        }
      }, err => {
        console.log(err);
        if (err?.status == 403) {
          this.isDisabled = false;
        }
        this.toast.error(err?.error?.message, 'Fields Error');
      })
    } catch (err) {
      console.log(err);
    }
  }

  handleSubmit() {
    try {

      let req = {
        candidate_id: this.basicDetails?.id,
        submit_status: 'SUBMITTED',
      }
      this.$bgv.submit_employer_details(req).subscribe((res: any) => {
        if (res) {
          this.toast.success(res?.message);
        }
      }, err => {
        console.log(err);
        this.toast.error(err?.error?.message, 'Fields Error')
      })
    } catch (err) {
      console.log(err);
    }
  }


}
