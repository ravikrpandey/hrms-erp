import { Component } from '@angular/core';
import { BgvService } from '../@shared/services/service/recruitment/bgv.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/environments/environment';
import { query } from '@angular/animations';

@Component({
  selector: 'app-company-remarks',
  templateUrl: './company-remarks.component.html',
  styleUrls: ['./company-remarks.component.scss']
})
export class CompanyRemarksComponent {

  dataList: any = [];
  remarks: any;
  basicDetails: any = {}
  cand_bgv_id: any;
  comp_id: any;
  baseUrl: any;
  paramsdata: any;
  isDisabled: boolean = true;
  docData: any[] = [];  // Array to store the document data
  displayedColumns: string[] = ['document', 'view'];
  companyCheckList: any;
  constructor(
    private route: ActivatedRoute,
    private toast: ToastrService,
    private $bgv: BgvService,
  ) {
    this.baseUrl = environment.serverUrl;
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.paramsdata = params?.id;
      const [cand_bgv_id, comp_id] = this.paramsdata.split('/');
      this.comp_id = comp_id;
      this.cand_bgv_id = cand_bgv_id;
      if (this.cand_bgv_id) {
        // this.getAllCompany();
        this.get_candidate_companyDetails();
        this.get_all_selfratings();
      }
    });
    this.fetchDocumentData();
    this.getAllCompany();
  }

  fetchDocumentData(): void {
    this.docData = [
      { document: 'Document 1', url: 'http://example.com/doc1' },
      { document: 'Document 2', url: 'http://example.com/doc2' },
    ];
  }

  // Open the document in a new window
  viewDocument(url: string): void {
    window.open(this.baseUrl + '/' + url, '_blank');
  }
  get_candidate_companyDetails() {

    let query = {
      cand_bgv_id: this.cand_bgv_id,
      comp_id: this.comp_id,
    }

    this.$bgv.get_candidate_companyDetails(query).subscribe((res: any) => {
      this.basicDetails = res?.data[0];
      this.dataList = res?.company_list;
    })
  }

  get sanitizedDescription(): string {
    return this.basicDetails?.candidate_description?.replace(/<\/?p>/g, '') || '';
  }

  getAllCompany() {
    this.$bgv.get_all_company().subscribe((res: any) => {
      this.companyCheckList = res.data;
    })
  }

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
        comp_id: this.comp_id,
        cand_bgv_id: this.cand_bgv_id,
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
