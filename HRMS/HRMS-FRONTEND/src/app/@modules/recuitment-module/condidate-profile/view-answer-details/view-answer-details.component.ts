import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { CondidateProfileService } from 'src/app/@shared/services/service/recruitment/condidate-profile.service';
import { an } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-view-answer-details',
  templateUrl: './view-answer-details.component.html',
  styleUrls: ['./view-answer-details.component.scss']
})
export class ViewAnswerDetailsComponent implements OnInit {
  answerStatusForm: FormGroup;
  candidate_id: any;
  jd_id: any;
  basicDetails: any;
  statusList: any = [
    {
      id: 'SELECTED_WITHOUT_BGV',
      value: 'Selected'
    },
    {
      id: 'GO_FOR_BGV',
      value: 'Go for BGV'
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
    private fb: FormBuilder,
    private $condidateProfile: CondidateProfileService,
  ) {
    this.answerStatusForm = this.fb.group({
    });
  }

  dataList: any = [];

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.candidate_id = params?.candidate_id;
      this.jd_id = params?.jd_id;

      if (this.candidate_id && this.jd_id) {
        this.getcandidate_answer();
      }
    });
  }

  tableHeadList: any = [{ th: 'Skill' }, { th: 'Avg Rating' }];
  tableBodyList: any = [];
  skill_list: any = [];

  getcandidate_answer() {
    let query = {
      candidate_id: this.candidate_id,
      jd_id: this.jd_id,
    }

    this.$condidateProfile.get_candidates_answer_details(query).subscribe((res: any) => {
      this.dataList = res.data;
      this.basicDetails = res?.candidate_details;
    })
  }

  removeDuplicates(list: any) {
    // Create a Set to keep track of unique 'th' values
    let seen = new Set();
    let removedList = list.filter((item: any) => {
      // Check if 'th' value is already in the Set
      if (!seen.has(item?.skill_name)) {
        seen.add(item?.skill_name); // Add 'th' value to Set if not already there
        return true; // Include the item in the filtered array
      }
      return false; // Exclude the item (duplicate)
    });
    return removedList;
  }
  goBack() {
    this.location.back();
  }

}

