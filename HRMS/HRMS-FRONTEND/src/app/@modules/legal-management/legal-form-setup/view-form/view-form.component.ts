import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { CrmService } from 'src/app/@shared/services/crmService/crm.service';
import { DynamicFormService } from 'src/app/@shared/services/crmService/dynamic-form.service';
import { MeetingService } from 'src/app/@shared/services/crmService/meeting.service';
import { ProposalService } from 'src/app/@shared/services/crmService/proposal.service';
import { LegalFormSetupService } from 'src/app/@shared/services/legal-management/legal-form-setup.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-view-form',
  templateUrl: './view-form.component.html',
  styleUrls: ['./view-form.component.scss']
})
export class ViewFormComponent implements OnInit{
  mode: any;
  // Dynamic form start
  dynamicForm: FormGroup;
  formConfig: any = {
    fields: [],
  };
  countryList: any = [];
  createLeadForm: FormGroup;
  loginUser: any;
  full_name: any;
  entity_id: any;
  role_master_id: any;
  existingClientList: any;
  leadId: any;
  singleData: any;
  existing_client: boolean;
  fileUrl: string;
  imageUrl: any;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private location: Location,
    private $crm: CrmService,
    private $proposal: ProposalService,
    private dynamicFormService: DynamicFormService,
    private $common: CommonService,
    private prService: PurchaseRequestService,
    private travelRequest: TravelRequestService,
    private legalFormService: LegalFormSetupService
  ) {
    this.createLeadForm = this.fb.group({});
  }

  ngOnInit() {}
  //     let lg: any = localStorage.getItem('signInUser');
  //     let ent_id: any = localStorage.getItem('selectedEntityId');
  //     let role_id: any = localStorage.getItem('role_master_id');
  //     let full_name: any = localStorage.getItem('full_name');
  //     this.fileUrl = environment?.serverUrl + '/uploadDoc/';
  //     this.loginUser = JSON.parse(lg);
  //     this.full_name = JSON.parse(full_name);
  
  //     this.entity_id = JSON.parse(ent_id);
  //     this.role_master_id = JSON.parse(role_id);
  
  //     this.activeroute.queryParams.subscribe(async (params: any) => {
  //       this.mode = params?.mode;
  //       if (!this.mode) {
  //         this.dynamicForm.reset();
  //         this.createDynamicForm();
  //       }
  //       this.getFormDetails();
  //     })
  //   }
      

  //       // Dynamic form start
  // createDynamicForm() {
  //   this.dynamicForm = this.dynamicFormService.generateForm(this.formConfig);
  //   console.warn(this.dynamicForm, 'fdfd');   
  // }
  // // Dynamic form end
  // goBack() {
  //   // this.location.back();
  // }
  // // Get form detail start
  // getDynamicForm: any = [];
  // getListData: any = [];
  // getFormDetails() {
  //   try {
  //     this.formConfig.fields = [];
  //     this.legalFormService.getLegalFormSetup().subscribe(
  //       (response: any) => {
  //         if (response) {
  //           this.getDynamicForm = response.data;
  //           this.getListData = response.data;
  //           debugger
  //           this.updateListData();
  //           this.getListData?.map((item: any) => {
  //             item.name = item?.field_name?.toLowerCase().replace(/\s+/g, '');
  //             item.label = item?.field_name;
  //             item.value = null;
  //             if (item?.field_name != 'Stage')
  //               item.isDisabled = false;
  //             else item.isDisabled = false;
  //             if (item?.type == 'dropdown') {
  //               item.type = 'select';
  //               item?.options?.map((optionItem: any) => {
  //                 optionItem.label = optionItem?.field_value;
  //                 optionItem.value = optionItem?.field_value;
  //               });
  //             }
  //             if (item?.type == 'multi select') {
  //               item.type = 'multiSelect';
  //               item.selectedMultipalList = new FormControl('');
  //               item?.options?.map((optionItem: any) => {
  //                 optionItem.label = optionItem?.field_value;
  //                 optionItem.value = optionItem?.field_value;
  //               });
  //             }
  //             if (item?.mandatory == 'ACTIVE' && !this.leadId)
  //               item.required = true;
  //             else item.required = false;
  //           });

  //           // Static form configration start
  //           // this.productList?.map((item: any) => {
  //           //   item.value = item?.id;
  //           //   item.label = item?.product_name;
  //           // });
  //           // this.employeeList?.map((item: any) => {
  //           //   item.value = item?.employee_id;
  //           //   item.label =
  //           //     item?.first_name +
  //           //     ' ' +
  //           //     item?.middle_name +
  //           //     ' ' +
  //           //     item?.last_name;
  //           // });

  //           this.existingClientList?.map((item: any) => {
  //             item.value = item?.id;
  //             item.label = item?.product_name;
  //           });

  //           let staticList: string | any[] = [
             
  //             // {
  //             //   name: 'contact_number',
  //             //   label: 'Contact No',
  //             //   type: 'text',
  //             //   value: '',
  //             //   required: this.leadId ? false : true,
  //             //   isDisabled: this.leadId ? true : false,
  //             // },
            
  //           ];

  //           // Static form configration end
            

  //           this.formConfig.fields = staticList.concat(this.getListData);
  //           this.createDynamicForm();
  //           console.warn(this.formConfig.fields, 'sddsgsd');

            
  //         }
  //       },
  //       (err) => {
  //         console.log('here i am ');
  //         console.log(err);
  //       }
  //     );
  //   } catch (error) {
  //     console.log('here i am ');
  //     console.log(error);
  //   }
  // }
  // onKeyPress(event: KeyboardEvent) {
  //   const inputChar = event.key;
  //   if (!/^[A-Za-z\s]$/.test(inputChar)) {
  //     event.preventDefault(); // Prevent non-alphabet characters
  //   }
  // }
  // onKeyPressNum(event: KeyboardEvent) {
  //   // Allow only digits (0-9) and prevent any other key from being typed
  //   const inputChar = event.key;
  //   if (!/^\d$/.test(inputChar)) {
  //     event.preventDefault(); // Block any non-numeric input
  //   }
  // }
  // updateListData() {
  //   if (this.existingClientList && this.getListData.length >= 2) {
  //     this.getListData = this.getListData.slice(0, -2);
  //   }
  // }
  //   // Get single lead start
  //   // getLeadData() {
  //   //   try {
  //   //     this.$crm
  //   //       .getLeadData(
  //   //         { id: this.leadId, query: 'id' },
  //   //         this.loginUser?.employee_id
  //   //       )
  //   //       .subscribe(
  //   //         (response: any) => {
  //   //           if (response) {
  //   //             this.singleData = response?.data[0];
  //   //             // handle multi select start
  //   //             let tempList = Object.keys(this.singleData?.dynamic_fields);
  //   //             this.formConfig?.fields?.map((item: any) => {
  //   //               if (item?.type == 'multiSelect') {
  //   //                 tempList?.map((subItem: any) => {
  //   //                   if (item?.name == subItem) {
  //   //                     item.selectedMultipalList.setValue(
  //   //                       this.singleData?.dynamic_fields?.[subItem]
  //   //                     );
  //   //                   }
  //   //                 });
  //   //               }
  //   //             });
  //   //             // handle multi select end
  
  //   //             if (this.singleData?.upload_image) {
  //   //               // this.imageUrl = this.singleData?.upload_image;
  //   //             }
  //   //             this.dynamicForm.patchValue({
  //   //               ...this.singleData?.dynamic_fields,
  //   //             });
  //   //             this.dynamicForm.patchValue({
  //   //               follow_up_date: this.singleData?.follow_up_date,
  //   //             });
  //   //             this.dynamicForm.patchValue({
  //   //               address: this.singleData?.address,
  //   //               product_service_id: this.singleData?.product_service_id,
  //   //               user_id: this.singleData?.user_id,
  //   //               lead_owner: this.singleData?.lead_owner,
  //   //               company_name: this.singleData?.company_name,
  //   //               lead_created_date: this.singleData?.lead_created_date,
  //   //               contact_person_name: this.singleData?.contact_person_name,
  //   //               country_code: this.singleData?.country_code,
  //   //               contact_number: this.singleData?.contact_number,
  //   //               mail_id: this.singleData?.mail_id,
  //   //               upload_image: this.singleData?.upload_image,
  //   //               follow_up_date: !this.singleData?.follow_up_date || this.singleData?.follow_up_date === "1900-01-01" ? '' : this.singleData?.follow_up_date,
  //   //               description: this.singleData?.dynamic_fields?.description,
  //   //               contactSource: this.singleData?.dynamic_fields?.contactSource,
  //   //             });
  //   //           }
  //   //         },
  //   //         (err) => {
  //   //           console.log(err);
  //   //         }
  //   //       );
  //   //   } catch (error) {
  //   //     console.log(error);
  //   //   }
  //   // }
  //   // Get single lead end
    onSubmitForm(){}
}
