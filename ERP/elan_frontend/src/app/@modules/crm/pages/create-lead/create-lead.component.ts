import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
@Component({
  selector: 'app-create-lead',
  templateUrl: './create-lead.component.html',
  styleUrls: ['./create-lead.component.scss'],
})
export class CreateLeadComponent {
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
  productVariantData: any = [];
  // Dynamic form start
  dynamicForm: FormGroup;
  formDisabled: boolean = false;
  allLeadSource: any = [];
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
  cetegory: any;
  productData: any[] = [];
  // productData: any[] = [];
  subCategory: any[] = [];
  entityId: any;
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
    private $productionService: ProductionService,
    private _configurationalMasterService: ConfigurationalmasterService
  ) {
    this.createLeadForm = this.fb.group({
      // product_id: new FormControl(null, Validators.required),
      // product_category_id: new FormControl(null, Validators.required),
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
      productDetailList: new FormArray([
        new FormGroup({
          id: new FormControl(null),
          product_master_id: new FormControl(null),
          product_category_id: new FormControl(null),
          product_sub_category_id: new FormControl(null),
          variant_id: new FormControl(null),
          product_code: new FormControl(null),
          product_description: new FormControl(null),

        }),
      ]),
    });
  }
  lead_summery: any;
  ngOnInit() {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    this.entityId = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.activeroute.queryParams.subscribe((params: any) => {
      this.leadId = params?.id;
      this.lead_summery = params?.typeLead
    });
    this.getAllCategory();
    this.getProductName();
    this.getEmployee();
    this.getFormDetails();
    this.getAll_Source();
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


  goBack() {
    this.location.back();
  }

  // Get product name start
  getProductName() {
    try {
      this.$crm.getAllproduct().subscribe((response: any) => {
        if (response) {
          this.productList = response.data;
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
    //try {
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
      this.$crm.getLeadData({ id: this.leadId, query: 'id' }, this.loginUser?.employee_id, this.entityId, this.financial_year_id).subscribe((response: any) => {
        if (response) {

          this.singleData = response?.data;
          if (this.singleData?.upload_image) {
            this.imageUrl = this.singleData?.upload_image;
          }
          this.dynamicForm.patchValue({
            ...this.singleData?.dynamic_fields,
          });

          this.dynamicForm.patchValue({
            follow_up_date: this.singleData?.follow_up_date
          });
          // this.getAllActiveProduct(this.singleData?.product_category_id,null)
          this.dynamicForm.patchValue({
            address: this.singleData?.address,
            // product_id: this.singleData?.product_id,
            // product_category_id: this.singleData?.product_category_id,
            lead_owner: this.singleData?.lead_owner,
            company_name: this.singleData?.company_name,
            lead_created_date: this.singleData?.lead_created_date,
            contact_person_name: this.singleData?.contact_person_name,
            contact_number: this.singleData?.contact_number,
            mail_id: this.singleData?.mail_id,
            follow_up_date: this.singleData?.follow_up_date,
            description: this.singleData?.description,
            user_id: this.singleData?.user_id,
            source_id: this.singleData?.source_id,
          });
          let product = response?.crmDetail;
          const productDetailList = this.createLeadForm.get('productDetailList') as FormArray;

          productDetailList.clear();

          if (product) {
            product.forEach(async (detail: any, index: any) => {
              
             await this.getSubCategory(detail.product_category_id, index);
             await this.getAllActiveProduct(detail.pro_sub_cat_id,detail.product_category_id, index);

             await this.getAllProductVariant(detail.product_id, index);

              const group = new FormGroup({
                id: new FormControl(detail.id || null),
                product_master_id: new FormControl(detail.product_id || null),
                product_category_id: new FormControl(detail.product_category_id || null),
                product_sub_category_id: new FormControl(detail.pro_sub_cat_id || null),
                variant_id: new FormControl(detail.variant_id || null),
                product_code: new FormControl(detail?.MASTER_ITEM?.item_code || null),
                product_description: new FormControl(detail?.MASTER_ITEM?.description || null),
              });
              productDetailList.push(group);
              
            });
          }

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
  errorMsg: boolean = false;
  onSubmitForm() {

    console.warn(this.dynamicForm.value, 'fff');
    let user_id = this.dynamicForm.get('user_id')
    if (user_id) {
      user_id.clearValidators()
      user_id.updateValueAndValidity()
    }

    this.descriptionReq = true;
    if (this.dynamicForm.invalid) {
      this.dynamicForm.markAllAsTouched()
      return this.toast.error("Required fields should not be empty", "Fields Error")
    }
    if (this.dynamicForm?.value?.description == null) {
      return this.toast.error("Required fields should not be empty", "Fields Error")
    }
    if (!this.dynamicForm.value.address) {
      this.errorMsg = true;
    }
    else {
      this.errorMsg = false;

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
    let productDetailList = this.createLeadForm.get('productDetailList') as FormArray;
    let productDetail = productDetailList.value;
    delete data.user_id;
    data.upload_image = this.imageUrl;
    data.lead_created_date = moment(data?.lead_created_date).format('YYYY-MM-DD');
    data.follow_up_date = moment(data?.follow_up_date).format('YYYY-MM-DD');
    data.login_id = this.loginUser?.employee_id;
    data.entity_id = this.entityId;
    data.financial_year_id = this.financial_year_id;
    data.createLeadDetails = productDetail;
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
    
    let productDetailList = this.createLeadForm.get('productDetailList') as FormArray;
    let productDetail = productDetailList.value;
    let update_data = {
      follow_up_date: moment(this.dynamicForm.value?.follow_up_date).format('YYYY-MM-DD'),
      description: this.dynamicForm.value?.description,
      user_id: this.dynamicForm?.value?.user_id,
      login_id: this.loginUser?.employee_id,
      status: this.dynamicForm?.value?.status,
      createLeadDetails: productDetail
    };
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
    
    const customer_code = btoa(Math.random().toString())
    .slice(0, 10)
    .toUpperCase();

    let  formData= this.dynamicForm.value;
    formData.employee_id= this.loginUser?.employee_id;
    formData.entity_id=this.entityId;
    formData.financial_year_id=this.financial_year_id;
    formData.customer_code=customer_code;
    let data = {
      ...formData,
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
  uploadDoc(event: any) {
    let isValidExtension = this.$common.checkForValidFile(event);
    if (!isValidExtension) {
      return;
    }
    let data = '';
    if (event.target.files && event.target.files[0]) {
      data = event.target.files[0];
    }
    var formData: any = new FormData();
    formData.append('file', data);
    this.$crm.uploadDoc(formData).subscribe(
      (res: any) => {
        this.imageUrl = res?.url;
        this.handleViewImg = false;
      },
      (err) => {
        if (err) {
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
      this.$crm.getFormDetails(this.entityId).subscribe((response: any) => {
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
            { name: 'product_id', label: 'Product Name', type: 'select', value: null, required: false, isDisabled: this.leadId ? true : false, options: this.productData },
            { name: 'lead_owner', label: 'Lead Owner', type: 'text', value: '', required: true, isDisabled: true },
            { name: 'company_name', label: 'Company Name', type: 'text', value: '', required: this.leadId ? false : true, isDisabled: this.leadId ? true : false },
            { name: 'lead_created_date', label: 'Lead Create Date', type: 'date', value: null, required: this.leadId ? false : false, isDisabled: false },
            { name: 'contact_person_name', label: 'Contact Person Name', type: 'text', value: '', required: this.leadId ? false : true, isDisabled: this.leadId ? true : false },
            { name: 'contact_number', label: 'Contact NO', type: 'text', value: '', required: this.leadId ? false : true, isDisabled: this.leadId ? true : false },
            { name: 'upload_image', label: 'Document', type: 'file', value: '', required: true, isDisabled: false },
            { name: 'follow_up_date', label: 'Follow-up Date', type: 'date', value: null, required: true, isDisabled: false },
            { name: 'description', label: 'Description', type: 'ckEditor', value: '', required: true, isDisabled: false },
            { name: 'user_id', label: 'Employee Name', type: 'select', value: null, isDisabled: false, options: this.employeeList },
            { name: 'mail_id', label: 'Mail ID', type: 'text', value: '', required: this.leadId ? false : true, isDisabled: this.leadId ? true : false },
            { name: 'address', label: 'Address', type: 'text', value: '', required: this.leadId ? false : true, isDisabled: this.leadId ? true : false },
            { name: 'source_id', label: 'Lead Source', type: 'select', value: null, required: true, isDisabled: this.leadId ? true : false, options: this.cetegory },
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
    window.open(environment.servralUrl + '/uploaded_files/' + this.imageUrl, '_blank');
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
 async getAllActiveProduct(event: any, event2:any, index: any) {
    
    // this.CF_1.productDetailList.at(index).patchValue({
    //   product_master_id: null,
      
    //   product_code: null,
    //   product_description: null
    // })
   await  this.$productionService.getItemsBySubCategory(event.id ?? event, event.item_category_id ?? event2).subscribe((res: any) => {

      this.productData[index] = res.data
    })
  }

async  getSubCategory(event: any, index: any) {
    
    // this.CF_1.productDetailList.at(index).patchValue({
    //   product_master_id: null,
    //   product_sub_category_id: null,
    //   product_code: null,
    //   product_description: null
    // })
   await this._configurationalMasterService.getSubCategory(event.value ?? event).subscribe((res: any) => {

      this.subCategory[index] = res.data
    })
  }
 async getAllCategory() {
    await this._configurationalMasterService.getActiveAssetMasterList().subscribe((res: any) => {
      this.cetegory = res.data;

    })
  }
  get CF_1(): any {
    return this.createLeadForm.controls;
  };
  addrow() {

    <FormArray>this.CF_1.productDetailList.push(
      new FormGroup({
        product_category_id: new FormControl(null),
        product_master_id: new FormControl(null),
        product_sub_category_id: new FormControl(null),
        variant_id: new FormControl(null),
        product_code: new FormControl(null),
        product_description: new FormControl(null),

      }),
    );

  }

  deleteRow(i: any, control: any) {
    if (this.CF_1.productDetailList.length >= 1) {
      this.CF_1.productDetailList.removeAt(i);
    } else {
      this.toast.error('must be one', "Can't Deleted!");
    }
  }
  setItemDescription(data: any, index: any) {

    
    this.CF_1.productDetailList.at(index)?.patchValue({ product_code: data?.item_code, product_description: data?.description })
  }



  getAllProductVariant(data: any, index: any) {
    this._configurationalMasterService.getProductVariantByproduct_id(data.value ?? data).subscribe((res: any) => {
      if (res) {
        this.productVariantData[index] = res.data;
      }
    }, (err: any) => {

    })
  }
  bindProductData(index: any) {
    let productDetailList = this.createLeadForm.get('productDetailList') as FormArray;
    let product_id = productDetailList.value[index]?.product_master_id;
    let data = this.productData[index].filter((res: any) => res.id == product_id);

    if (data && data.length > 0) {
      const product = data[0];
      productDetailList.at(index).patchValue({
        product_description: product.product_description,
        product_code: product.product_code
      });
    }

  }
  getAll_Source() {
    this._configurationalMasterService.getAllSource(this.entityId, this.financial_year_id).subscribe((res: any) => {
      if (res.data) {
        this.allLeadSource = res.data;
      }
    }, (err: any) => {

    })
  }
}
