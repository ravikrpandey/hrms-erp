import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { CondidateProfileService } from 'src/app/@shared/services/service/recruitment/condidate-profile.service';
import { an } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-view-interview-details',
  templateUrl: './view-interview-details.component.html',
  styleUrls: ['./view-interview-details.component.scss']
})
export class ViewInterviewDetailsComponent implements OnInit {
  interviewStatusForm: FormGroup;
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
    this.interviewStatusForm = this.fb.group({
      selection_status: new FormControl(null, Validators.required),
      final_remarks: new FormControl(null, Validators.required),
    });
  }

  dataList: any = [];

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
    
      this.candidate_id = params?.candidate_id;
      this.jd_id = params?.jd_id;

      if (this.candidate_id && this.jd_id) {
        this.getAll_candidate_profile();
      }
    });
  }

  tableHeadList: any = [{ th: 'Skill' }, { th: 'Avg Rating' }];
  tableBodyList: any = [];
  tempInterviewDetails: any = [];
  skill_list: any = [];

  getAll_candidate_profile() {
    let query = {
      candidate_id: this.candidate_id,
      jd_id: this.jd_id,
    }
    
    this.$condidateProfile.get_candidates_interview_details(query).subscribe((res: any) => {
      console.log(res);
      this.dataList = res.data;
      this.basicDetails = res?.candidate_details;
      this.dataList?.map((item: any) => {
        let sum: any = 0;
        item?.skill_list?.map((subItem: any) => {
          sum = sum + Number(subItem?.avg_skill_rating_point);
          let avg_skill_rating_point = Number(subItem?.avg_skill_rating_point);
          subItem.avg_skill_rating_point = avg_skill_rating_point.toFixed(2);
        })
        let averageRating = sum / item?.skill_list.length;
        let final_rating = averageRating.toFixed(2); 
        if (final_rating) {
          item.final_rating = averageRating.toFixed(2)
        }
      });

      // this.dataList[1]?.interviewer_list?.map((item: any) => {
      //   this.tableHeadList?.push({ th: item?.first_name })
      // })

      // this.dataList[0]?.interviewer_list?.map((item: any) => {
      //   console.log(item)


      //   let interview_details = item?.interview_details;
      //   this.skill_list = this.dataList[0]?.skill_list;

      //   interview_details?.map((newItem: any, i: any) => {
      //     this.skill_list?.map((newItemSub: any) => {
      //       this.tempInterviewDetails?.push(item?.interview_details[i])
      //       let obj = {
      //         ...newItem,
      //         ...newItemSub,
      //       }
      //       this.tableBodyList?.push(obj)
      //     })
      //   })
      //   this.tableBodyList = this.removeDuplicates(this.tableBodyList);
      //   let newList = this.removeDuplicates(this.tempInterviewDetails);
      //   console.log(this.tempInterviewDetails)
      //   console.log(this.tableBodyList)
      // })
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

  handleSubmit() {
    
    if (this.interviewStatusForm.invalid) {
      return this.toast.error('Required fields should not be empty', 'Fields Error');
    }
    let data = this.interviewStatusForm?.value;

    let req = {
      ...data,
      candidate_id: this.candidate_id,
      jd_id: this.jd_id,
    }
    this.$condidateProfile.update_candidate_selection_status(req).subscribe((res: any) => {
      console.log(res);
      if (res) {
        this.toast.success(res.message);
        this.goBack();
      }
    })
  }

  goBack() {
    this.location.back();
  }

}

