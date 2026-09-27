import { Component, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import moment from 'moment';
import {
  FormArray,
  FormControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { CampaignService } from 'src/app/@shared/services/campaignService/campaign.service';


@Component({
  selector: 'app-add-campaign',
  templateUrl: './add-campaign.component.html',
  styleUrls: ['./add-campaign.component.scss']
})

export class AddCampaignComponent {
  campaignForm: FormGroup;
  resultData: any;
  full_name: any;
  paramsData: any;
  loginUser: any;
  getFolderInfo: any;
  getParentValue: any;
  getChildValue: any;
  campaignType: any;

  constructor(
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute,
    private _campaign: CampaignService,
    private route: Router
  ) {

    this.campaignForm = this.fb.group({
      campaign_name: new FormControl(null)
    });


    this.getFolderInfo = this._campaign.getFolderInfo();
    this.getParentValue = this._campaign.getParentValue();
    this.getChildValue = this._campaign.getChildValue();

  }

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser');
    let full_name: any = localStorage.getItem('full_name');
    this.loginUser = JSON.parse(lg);
    this.full_name = JSON.parse(full_name);
    this.activateRoute.queryParams.subscribe((params: any) => {
      this.paramsData = params;
      if (this.paramsData.category == 1) {
        this.campaignType = "email"
      } else if (this.paramsData.category == 2) {
        this.campaignType = "SMS"
      } else if (this.paramsData.category == 3) {
        this.campaignType = "WhatsApp"
      }
      console.log(this.paramsData, "paramsData");
    });
    this.patchData();
  }

  sevralUrl() {
    return environment.serverUrl + '/uploaded_files/';
  }

  patchData() {
    if (this.paramsData?.id) {
      this.campaignForm.patchValue({ ...this.paramsData });
    }
  }

  onSubmit() {

    const getFolderValue = this._campaign.getFolderValue();
    let folderId: any;


    this.getFolderInfo = this._campaign.getFolderInfo();
    this.getParentValue = this._campaign.getParentValue();
    this.getChildValue = this._campaign.getChildValue();


    if (this.getFolderInfo === 'child') {
      folderId = this.getChildValue?.id;
    }
    else if (this.getFolderInfo === 'parent') {
      folderId = this.getParentValue?.id;
    }
    else {
      folderId = null;
    }

    let val: any = this.campaignForm.value;
    let req = { ...val, folderId };

    if (this.paramsData?.entryType == 'Edit') {

    } else {
      if (this.paramsData.category == 1) {
        this._campaign.createEmailCampaign(req).subscribe((res: any) => {
          this.route.navigate(
            ['master/campaign/campaign/schedule'],
            { queryParams: { id: res?.data?.id, campaign_name: res?.data?.campaign_name } }
          );
        });
      } else if (this.paramsData.category == 2) {
        this._campaign.createSmsCampaign(req).subscribe((res: any) => {
          this.route.navigate(
            ['master/campaign/campaign/sms'],
            { queryParams: { id: res?.data?.id, campaign_name: res?.data?.campaign_name } }
          );
        });
      } else if (this.paramsData.category == 3) {
        this._campaign.createWhatsAppCampaign(req).subscribe((res: any) => {
          this.route.navigate(
            ['master/campaign/campaign/whatsapp'],
            { queryParams: { id: res?.data?.id, campaign_name: res?.data?.campaign_name } }
          );
        });
      }
    }
  }
}
