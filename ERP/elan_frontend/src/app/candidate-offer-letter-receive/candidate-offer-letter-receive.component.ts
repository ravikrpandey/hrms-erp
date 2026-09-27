import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { OfferLetterService } from '../@shared/services/service/recruitment/offer-letter.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-candidate-offer-letter-receive',
  templateUrl: './candidate-offer-letter-receive.component.html',
  styleUrls: ['./candidate-offer-letter-receive.component.scss']
})
export class CandidateOfferLetterReceiveComponent implements OnInit {
  recordData: any = {};
  dataList: any = [];
  baseUrl: any;
  formObj: any = {};
  candidate_id: any;

  constructor(
    private toast: ToastrService,
    private activeroute: ActivatedRoute,
    private $offerLetter: OfferLetterService,
  ) {
    this.baseUrl = environment.servralUrl;
  }

  ngOnInit() {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.candidate_id = params.id;
      if (this.candidate_id) {
        this.getCandidateoffer_detailsBYID();
      }
    });
  }

  getCandidateoffer_detailsBYID() {
    this.$offerLetter.getCandidateoffer_detailsBYID(this.candidate_id).subscribe(
      (res) => {
        this.recordData = res?.data[0];
      }
    );
  };

  handleSubmit() {
    if (!this.formObj?.candidate_offer_status) {
      return this.toast.error('Offer Status fields should not be empty', 'Fields Error');
    }

    this.formObj.candidate_id = this.candidate_id;
    this.$offerLetter.updateCandidate_OfferStatus(this.formObj).subscribe(
      (res) => {
        this.toast.success(res.message);
        this.formObj = {};
      },
      (err) =>{
        this.toast.error(err.error.message);
        this.formObj = {};
      }
    );
  }

}
