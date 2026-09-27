import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from '../../../../@shared/services/recruitment.service';
import { Location } from '@angular/common';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { DynamicFormService } from 'src/app/@shared/services/crm/dynamic-form.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ViewLeadDescriptionDialogComponent } from '../dialogs/view-lead-description-dialog/view-lead-description-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/app/environments/environment';
import { CloseDealDialogComponent } from '../dialogs/close-deal-dialog/close-deal-dialog.component';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
@Component({
  selector: 'app-create-lead2',
  templateUrl: './create-lead.component.html',
  styleUrls: ['./create-lead.component.scss'],
})
export class CreateLeadComponent2 {
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  // day = this.now.getDay();
  dates = this.now.getDate();
  maxDate = moment({ year: this.year + 100, month: this.month, date: this.dates }).format('YYYY-MM-DD');
  minDate = moment({ year: this.year - 0, month: this.month, date: this.dates }).format('YYYY-MM-DD');

  @ViewChild('editer') editer: any;
  fileUrl = environment?.servralUrl+'/uploadDoc/';

  createLeadForm: FormGroup;
  locatin: any;
  productList: any = [];
  maxInputLength: number = 100;
  imageUrl: any;
  leadId: any;
  loginUser: any;
  singleData: any;
  descriptionReq: boolean = false;
  handleViewImg: boolean = true;
  componentTypeList : any = [];
  // Dynamic form start
  dynamicForm: FormGroup;
  comId: any;
  formConfig: any = {
    fields: [
      // { name: 'firstName', label: 'First Name', type: 'text', value: '' },
      // { name: 'lastName', label: 'Last Name', type: 'text', value: '' },
      // {
      //   name: 'gender', label: 'Gender', type: 'select', value: null, options: [
      //     { label: 'Male', value: 'male' },
      //     { label: 'Female', value: 'female' },
      //   ]
      // },
    ],
  };
  entity_id: string | null;
  financial_year_id: string | null;
  // Dynamic form end

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
    private $configMaster: ConfigurationalmasterService
  ) {
    this.createLeadForm = this.fb.group({
      product_id: new FormControl(null, Validators.required),
      lead_owner: new FormControl(null, Validators.required),
      company_name: new FormControl(null, Validators.required),
      lead_created_date: new FormControl(null, Validators.required),
      contact_person_name: new FormControl(null, Validators.required),
      contact_number: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      upload_image: new FormControl('', Validators.required),
      lead_form_id: new FormControl(null, Validators.required),
      field_name_two: new FormControl(null, Validators.required),
      status_id: new FormControl(null, Validators.required),
      follow_up_date: new FormControl(null, Validators.required),
      description: new FormControl(null),
    });
  }
lead_summery:any;
  ngOnInit() {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    this.activeroute.queryParams.subscribe((params: any) => {
      this.leadId = params?.id;
      this.lead_summery=params?.typeLead
    });

    this.getProductName();
    this.getEmployee();
    this.getFormDetails();
    this.getComponentTypeList();
  }

  // Dynamic form start
  createDynamicForm() {
    this.dynamicForm = this.dynamicFormService.generateForm(this.formConfig);
    this.dynamicForm.patchValue({
      lead_owner: this.loginUser?.first_name,
      lead_created_date: new Date(),
    });
  }
  // Dynamic form end

  getComponentTypeList() {
    try {
      this.$configMaster.getComponentType().subscribe((response: any) => {
        if (response) {
          this.componentTypeList = response.data;
          this.componentTypeList.forEach((com:any) => {
            if ( com.component_type == 'Create Lead') {
              this.comId = com.id
            }
          })
          this.getFormDetails();
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }


  goBack() {
    this.location.back();
  }

  // Get product name start
  getProductName() {
    try {
      this.$crm.getAllproduct().subscribe((response: any) => {
        if (response) {
          this.productList = response?.data;
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  // Get product name end

  // Get employee start
  employeeList: any = [];
  getEmployee() {
    // try {
    //   this.$crm.registrationall().subscribe((response: any) => {
    //     if (response) {
    //       this.employeeList = response.data;
    //     }
    //   }, err => {
    //     console.log(err);
    //   })
    // } catch (error) {
    //   console.log(error);
    // }
  }
  // Get employee end

  // Get single lead start
  getLeadData() {
    try {
      this.$crm.getLeadData({ id: this.leadId, query: 'id' }, this.loginUser?.employee_id,this.entity_id,this.financial_year_id).subscribe((response: any) => {
        if (response) {
          this.singleData = response?.data;
          console.warn(this.singleData,'singledata');

          if (this.singleData?.upload_image) {
            this.imageUrl = this.singleData?.upload_image;
          }
          this.dynamicForm.patchValue({
            ...this.singleData?.dynamic_fields,
          });
          this.dynamicForm.patchValue({
            address: this.singleData?.address,
            product_id: this.singleData?.product_id,
            lead_owner: this.singleData?.lead_owner,
            company_name: this.singleData?.company_name,
            lead_created_date: this.singleData?.lead_created_date,
            contact_person_name: this.singleData?.contact_person_name,
            contact_number: this.singleData?.contact_number,
            // mail_id: this.singleData?.mail_id,
            upload_image: this.singleData?.upload_image,
            follow_up_date: this.singleData?.follow_up_date,
            description: this.singleData?.description,
            user_id: this.singleData?.user_id,
          });
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  // Get single lead end

  // Create lead start
  onSubmitForm() {
    this.descriptionReq = true;
    if (this.dynamicForm.invalid) {
      return this.toast.error("Required fields should not be empty", "Fields Error")
    }
    if (this.dynamicForm?.value?.description == null) {
      return this.toast.error("Required fields should not be empty", "Fields Error")
    }

    if (this.closedProposal) {
      this.createDealClosed();
    }
    else {
      if (this.leadId) {
        this.updateLeadData();
      }
      else {
        this.createLead();
      }
    }

  }

  createLead() {
    let data = this.dynamicForm.value;
    data.upload_image = this.imageUrl;
    data.lead_created_date = moment(data?.lead_created_date).format('YYYY-MM-DD');
    data.follow_up_date = moment(data?.follow_up_date).format('YYYY-MM-DD');
    data.login_id = this.loginUser?.employee_id;
    this.$crm.createLead(data).subscribe((res: any) => {
      if (res) {
        this.toast.success(res.message);
        this.router.navigate([`master/crm/lead-status`]);
      }
    },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong');
        } else if (err.status == 403) {
          this.toast.error('Achievements Already Exits!');
        }
        else {
          this.toast.error('Something went Wrong');
        }
      }
    );
  }

  // Update lead start
  updateLeadData() {
    let update_data = {
      follow_up_date: moment(this.dynamicForm.value?.follow_up_date).format('YYYY-MM-DD'),
      description: this.dynamicForm.value?.description,
      user_id: this.dynamicForm?.value?.user_id,
      login_id: this.loginUser?.employee_id,
      status:this.dynamicForm?.value?.status,
    };

    // console.warn(data,'fff');

    this.$crm.updateLeadData(this.leadId, update_data).subscribe((res: any) => {
      if (res) {
        this.toast.success(res.message);
        this.router.navigate([`master/crm/lead-status`]);
      }
    },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong');
        } else if (err.status == 403) {
          this.toast.error('Achievements Already Exits!');
        }
        else {
          this.toast.error('Something went Wrong');
        }
      }
    );
  }

  // Close lead start
  createDealClosed() {
    let data = {
      proposal_id: this.closedProposal?.proposal_id,
      version_id: this.closedProposal?.version_id,
      lead_id: this.leadId
    };
    this.$proposal.createDealClosed(data).subscribe((res: any) => {
      if (res) {
        this.toast.success(res.message);
        this.router.navigate([`master/crm/closed-deals`]);
      }
    },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong');
        } else if (err.status == 403) {
          this.toast.error('Achievements Already Exits!');
        }
        else {
          this.toast.error('Something went Wrong');
        }
      }
    );
  }

  // Upload doc start
  uploadDoc(evemt: any) {
    let isValidExtension = this.$common.checkForValidFile(evemt);
    if (!isValidExtension) return

    let data = "";
    if (evemt.target.files && evemt.target.files[0]) {
      data = evemt.target.files[0];
    }

    var formData: any = new FormData();
    formData.append('file', data);
    this.$crm.uploadDoc(formData).subscribe(
      (res: any) => {
        this.imageUrl = res?.backendUrl;
        this.handleViewImg = false;
      },
      (err) => {
        if (err.status == 400) {
          this.toast.error('Something went Wrong');
        } else if (err.status == 403) {
          this.toast.error('Achievements Already Exits!');
        }
        else {
          this.toast.error('Something went Wrong');
        }
      }
    );
  }
  // Upload doc end

  cancelBtn() {
    this.createLeadForm.reset();
    history.back();
  }

  // to restrict user from entering strings
  keyPress(event: Event | any, fieldName: any) {
    if (fieldName == 'contact_number') {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
      this.maxInputLength = 10;
    }
    else {
      this.maxInputLength = 100;
    }
  }

  // Get form detail start
  getFormDetails() {
    try {
      this.formConfig.fields = [];
      this.$configMaster.getDynamicFormDetails(this.comId).subscribe((response: any) => {
        if (response) {
          let list = response?.data;
          list?.map((item: any) => {
            item.name = item?.field_name?.toLowerCase().replace(/\s+/g, '');
            item.label = item?.field_name;
            item.value = null;
            if (this.leadId && item?.field_name != 'Status') item.isDisabled = true;
            else item.isDisabled = false;
            if (item?.type == 'dropdown') {
              item.type = 'select';
              item.options?.map((optionItem: any) => {
                optionItem.label = optionItem?.field_value;
                optionItem.value = optionItem?.field_value;
              })
            }
            if ((item?.mandatory == 'ACTIVE' && !this.leadId)) item.required = true;
            else item.required = false;
          })

          // Static form configration start
          this.productList?.map((item: any) => {
            item.value = item?.id;
            item.label = item?.product_name;
          })
          this.employeeList?.map((item: any) => {
            item.value = item?.employee_id;
            item.label = item?.first_name + ' ' + item?.middle_name + ' ' + item?.last_name;
          })

          let staticList = [
            { name: 'product_id', label: 'Product Name', type: 'select', value: null, required: true, isDisabled: this.leadId ? true : false, options: this.productList },
            { name: 'lead_owner', label: 'Lead Owner', type: 'text', value: '', required: true, isDisabled: true },
            { name: 'company_name', label: 'Company Name', type: 'text', value: '', required: this.leadId ? false : true, isDisabled: this.leadId ? true : false },
            { name: 'lead_created_date', label: 'Lead Create Date', type: 'date', value: null, required: this.leadId ? false : false, isDisabled: true },
            { name: 'contact_person_name', label: 'Contact Person Name', type: 'text', value: '', required: this.leadId ? false : true, isDisabled: this.leadId ? true : false },
            { name: 'contact_number', label: 'Contact NO', type: 'text', value: '', required: this.leadId ? false : true, isDisabled: this.leadId ? true : false },
            { name: 'upload_image', label: 'Document', type: 'file', value: '', required: true, isDisabled: false },
            { name: 'follow_up_date', label: 'Follow-up Date', type: 'date', value: null, required: true, isDisabled: false },
            { name: 'description', label: 'Description', type: 'ckEditor', value: '', required: true, isDisabled: false },
            { name: 'user_id', label: 'Employee Name', type: 'select', value: null, required: false, isDisabled: false, options: this.employeeList },
            { name: 'mail_id', label: 'Mail ID', type: 'text', value: '', required: this.leadId ? false : true, isDisabled: this.leadId ? true : false },
            { name: 'address', label: 'Address', type: 'text', value: '', required: this.leadId ? false : true, isDisabled: this.leadId ? true : false },
          ];
          // Static form configration end

          this.formConfig.fields = staticList.concat(list);

          this.createDynamicForm();
          if (this.leadId) {
            this.getLeadData();
          }
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  // Get form detail end

  viewDescription() {
    const dialogRef = this.dialog.open(ViewLeadDescriptionDialogComponent, {
      width: '90%',
      data: { id: this.singleData },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
    });
  }

  viewImg() {
    window.open(this.fileUrl + this.imageUrl, '_blank');
  }

  // Close proposal dialog start
  closedProposal: any;
  dynamicFormChange(fieldName: any) {
    if (fieldName == 'status' && this.dynamicForm?.value?.status == 'Deal Close') {
      const dialogRef = this.dialog.open(CloseDealDialogComponent, {
        width: '1200px',
        data: { value: '' },
      });

      dialogRef.afterClosed().subscribe(result => {
        this.closedProposal = result;
      });
    }
  }
  // Close proposal dialog end

  // View proposal start
  viewProposal(data: any) {
    this.router.navigate(["master/crm/create-proposal"], { queryParams: { version_id: data?.version_id, proposalId: data?.proposal_id, actionType: 'view' } })
  }


}
