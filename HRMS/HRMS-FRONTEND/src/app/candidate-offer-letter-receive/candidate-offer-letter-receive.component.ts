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
    this.baseUrl = environment.serverUrl;
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
    try {
      debugger
      this.$offerLetter.getCandidateoffer_detailsBYID(this.candidate_id).subscribe(
        (res) => {
          this.recordData = res?.data[0];
        }
      );
    } catch (err) {
      console.log(err)
    }
  };

  handleSubmit() {
debugger
   try{
    if (!this.formObj?.candidate_offer_status) {
      return this.toast.error('Offer Status fields should not be empty', 'Fields Error');
    }
    this.formObj.candidate_id = this.candidate_id;
    this.$offerLetter.updateCandidate_OfferStatus(this.formObj).subscribe(
      (res) => {
        this.toast.success(res.message);
        this.formObj = {};
      },(error) => {
        if(error.error.code == 403)
        this.toast.error(error.error.message);
      }
    );
   } catch(err){
    console.log(err)
   }
  }

}
