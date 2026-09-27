import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { AssignProposalDialogComponent } from '../dialogs/assign-proposal-dialog/assign-proposal-dialog.component';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { SalesService } from '../../sales.service';
import { SalesService as SalesService1 } from 'src/app/@modules/sales/service/sales.service';
import { ChangeDetectorRef } from '@angular/core';
import { SchemeDialogComponent } from '../scheme-dialog/scheme-dialog.component';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import * as moment from 'moment';
import { environment } from 'src/app/environments/environment';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { CommonService } from 'src/app/@shared/services/common.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { UpdatedSalesBookComponent } from '../../sales-booking/updated-sales-book/updated-sales-book.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { PreviewQuotationComponent } from '../preview-quotation/preview-quotation.component';
import { QuotationCalculationComponent } from '../dialogs/quotation-calculation/quotation-calculation.component';
import { isItemListChanged } from 'src/app/@shared/helper/quotationItemCompaire';
import { SoForwordDialogComponent } from "./so-forword-dialog/so-forword-dialog.component";
import { cl } from '@fullcalendar/core/internal-common';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { UploadDocumentsComponent } from '../dialogs/upload-documents/upload-documents.component';
import { Subject } from 'rxjs';
import { InstallationKitBomProposalComponent } from '../dialogs/installation-kit-bom-proposal/installation-kit-bom-proposal.component';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ManageAdvanceComponent } from '../dialogs/manage-advance/manage-advance.component';

@Component({
    selector: 'app-create-proposal',
    templateUrl: './create-proposal.component.html',
    styleUrls: ['./create-proposal.component.scss'],
})
export class CreateProposalComponent {
    @ViewChildren('searchInput') searchInputs!: QueryList<ElementRef>;
    proposalForm: any;
    invoiceAddressForm: FormGroup;
    icon: boolean = true;
    leadFormSetupId: any;
    levelOneData: any;
    isEdit: boolean = true;
    isDisabled: boolean = false;
    proposalTypeList: any = ['B2B', 'B2C', 'EXPORT'];
    gstTypeList: any = ['CGST/SGST', 'IGST'];
    leadId: any;
    proposalId: any;
    actionType: any;
    version_id: any;
    hsnCodeList: any = [];
    totalCalculateGrand_total: any;
    proposal_list_id: any;
    routerParams: any;
    status: any;
    isInvoiceSubmitted: boolean = false;
    userLoginId: any;
    formDisabled: boolean = false;
    isDiscountRequired: boolean = false;
    isDiscountApproved: boolean = false;
    existing_type: any;
    existingData: any;
    entityId: string | null;
    financial_year_id: string | null;
    productData: any[] = [];
    cetegory: any = [];
    productVariantData: any[] = [];
    hideTableColumns: boolean;
    totalGrandAmount: any;
    totalGrandAmountOut: any;
    schemeData: any;
    schemeId: any;
    showInfo = false;
    applyCondition: boolean = false;
    isPromoApplied: boolean = false;
    schemeIdGet: any;
    customer_type: any;
    disableApply: boolean = false;
    onScheme: boolean = false;
    valueVersionId: any;
    totalQty: any;
    additionalChargeData: any;
    additionalChargeDataGetBy: any;
    countryList: any[] = [];
    stateList: any[] = [];
    cityList: any[] = [];
    shippingStateList: any[] = [];
    shippingCityList: any[] = [];
    customerContactList: any[] = [];
    emailCheckBtn: boolean = false;
    checkSchcme: boolean = false
    selectedFile: File | null = null;
    progress = -1;
    sales_documents: any;
    showSchemeBtn: boolean = false;
    schedule_delivery_date: any;
    hasApplyScheme: boolean = false;
    versionData: any;
    gstCalculateTotal: any;
    pi: boolean = false;
    quotationType: boolean = false;
    new_customer: string;
    lead_source: string;
    created_by: string;
    created_by_id: string;
    pageModeURL: string
    isReadOnly: boolean = false;
    searchText: string[] = []
    selectedCurrency: any;
    fromCurrency: any
    fromCurrencyId: any
    currencyData: any;

    constructor(
        private fb: FormBuilder,
        private toast: ToastrService,
        private route: ActivatedRoute,
        private $crm: CrmService,
        private location: Location,
        private dialog: MatDialog,
        private $proposal: ProposalService,
        private salesService: SalesService,
        private salesService1: SalesService1,
        private $common: CommonService,
        private $miscellaneousService: MiscellaneousService,
        private cdr: ChangeDetectorRef,
        private $productionService: ProductionService,
        private _empRegistration: EmpRegistrationService,
        private _configurationalMasterService: ConfigurationalmasterService,
        private financeService: FinaceService,
        private _router: Router
    ) {
        this.route.queryParams.subscribe((params: any) => {

            this.actionType = params?.actionType;

            this.pi = params?.pi == 'true' ? true : false;
            this.existing_type = params.type;
            this.existingData = params.existing;
            this.new_customer = params.new_customer;
            this.pageModeURL = params.pageMode;
            if (this.new_customer === 'yes') {
                this.lead_source = params.lead_source;
                this.created_by = params.created_by;
                this.created_by_id = params.created_by_id;
                this.setNewCustomerValue();
            }
            this.quotationType = params?.quotationType === 'true' ? true : false;
        });
        this.proposalForm = this.fb.group({
            id: new FormControl(null),
            proposal_no: new FormControl(Validators.required),
            proposal_type_id: new FormControl(2),
            company_name: new FormControl(null, Validators.required),
            contact_person_name: new FormControl('', Validators.required),
            contact_number: new FormControl(''),
            mail_id: new FormControl('', [Validators.required, Validators.email]),
            source_name: new FormControl(null),
            gst_no: new FormControl(''),
            deleted_remaining_quantity: new FormControl(0),
            advance_amount: new FormControl(),
            advance_check: new FormControl(false),
            additional_charges: new FormControl(0),
            discount: new FormControl(null),
            sgst: new FormControl(null),
            cgst: new FormControl(null),
            igst: new FormControl(null),
            grant_total: new FormControl(null),
            totalAMTAfterDiscount: new FormControl(null),
            grossTotal: new FormControl(null),
            schemeData: new FormControl(null),
            grace_period: new FormControl(null),
            credit_days: new FormControl(null),
            utiliz_credit_days: new FormControl(null),
            utilized_credit_limit: new FormControl(null),
            end_date_pi: new FormControl(null),
            schedule_delivery_date: new FormControl(null),
            sales_booking_no: new FormControl(null),
            po_type: new FormControl(null),
            country_id: new FormControl({ value: null, disabled: true }, Validators.required),
            state_id: new FormControl({ value: null, disabled: true }, Validators.required),
            city_id: new FormControl({ value: null, disabled: true }, Validators.required),
            postal_address: new FormControl({ value: null, disabled: true }, Validators.required),
            address: new FormControl({ value: null, disabled: true }, Validators.required),
            billing_address_id: new FormControl(null, [Validators.required]),
            shipping_country_id: new FormControl({ value: 101, disabled: false }, Validators.required),
            shipping_state_id: new FormControl(null, [Validators.required]),
            shipping_city_id: new FormControl(null, [Validators.required]),
            shipping_postal_address: new FormControl(null, [Validators.required]),
            shipping_address: new FormControl(null, [Validators.required]),
            shipping_pin_code: new FormControl(null, [Validators.required]),
            shipping_address_id: new FormControl(null),
            shipping_gst_in: new FormControl(null),
            // postal_address: new FormControl(null),
            valid_till_date: new FormControl(null, Validators.required),
            lead_source: new FormControl(null, [Validators.required]),
            created_by: new FormControl(null, [Validators.required]),
            created_by_id: new FormControl(null),
            delivery_term_id: new FormControl(null, [Validators.required]),
            delivery_term_remark: new FormControl(null, [Validators.required]),
            unloading_resp_id: new FormControl(null, [Validators.required]),
            unloading_resp_remark: new FormControl(null, [Validators.required]),
            unloading_resp_amount: new FormControl(null),
            warranty_month: new FormControl(null, [Validators.required]),
            warranty_month_remark: new FormControl(null, [Validators.required]), // use for Special Warranty Terms
            payment_main_id: new FormControl(null),
            sub_payment_main_id: new FormControl(null),
            freight_id: new FormControl(null),
            insurance_id: new FormControl(null, [Validators.required]),
            insurance_amt: new FormControl(null),
            location_id: new FormControl(null, [Validators.required]),
            warehouse_id: new FormControl(null, [Validators.required]),
            pincode: new FormControl({ value: null, disabled: true }, Validators.required),
            contact_person_id: new FormControl(null),
            sactioned_credit_limit: new FormControl(null),
            sactioned_credit_period: new FormControl(null),
            available_credit_limit: new FormControl(null),
            is_same_as_shipping: new FormControl(false),
            profit_center_id: new FormControl(null),
            cost_center_id: new FormControl(null),
            // paymentTC: new FormControl(null),
            productDetailList: new FormArray([
                new FormGroup({
                    id: new FormControl(null),
                    product_master_id: new FormControl(null),
                    product_sub_category_id: new FormControl(null),
                    variant_id: new FormControl(null),
                    item_name: new FormControl(null),
                    product_code: new FormControl(null),
                    product_description: new FormControl(null),
                    product_category_id: new FormControl(null),
                    uom_name: new FormControl(null),
                    uom_id: new FormControl(null),
                    qty: new FormControl(null),
                    price_per_unit: new FormControl(null),
                    original_price_per_unit: new FormControl(null),
                    warranty: new FormControl(null),
                    min_price: new FormControl(null),
                    original_min_price: new FormControl(null),
                    max_price: new FormControl(null),
                    original_max_price: new FormControl(null),
                    gst_type: new FormControl(null),
                    cgst: new FormControl(null),
                    sgst: new FormControl(null),
                    igst: new FormControl(null),
                    maximum_discount: new FormControl(null),
                    discount_approved: new FormControl(null),
                    discount_request: new FormControl(null),
                    readonly: new FormControl(true),
                    hsn_code_id: new FormControl(null),
                    select_scheme: new FormControl(null),
                    schemeApplied: new FormControl(false),
                    name_product: new FormControl(false),
                    custom_branding: this.fb.control(null),
                    customizeTotal: new FormControl(null),
                    branding_data: this.fb.control(null),
                    customization: this.fb.control(null),
                    customisation_data: this.fb.control(null),
                    image: new FormControl(null),
                    discount_1: new FormControl(null),
                    discount_2: new FormControl(null),
                    discount_3: new FormControl(null),
                    discount1Flat: new FormControl(null),
                    discount2Flat: new FormControl(null),
                    discount3Flat: new FormControl(null),
                    hsn_code_id_view: new FormControl(null),
                    hsn_code: new FormControl(null),
                    totalPrice: new FormControl(null),
                    totalWithGst: new FormControl(null),
                    old_totalPrice: new FormControl(null),
                    old_totalWithGst: new FormControl(null),
                    bomArray: new FormControl([])
                }),
            ]),
            // copy withsavePO
            copyProductDetailList: new FormArray([
                new FormGroup({
                    id: new FormControl(null),
                    product_master_id: new FormControl(null),
                    product_sub_category_id: new FormControl(null),
                    variant_id: new FormControl(null),
                    product_code: new FormControl(null),
                    product_description: new FormControl(null),
                    product_category_id: new FormControl(null),
                    uom_name: new FormControl(null),
                    uom_id: new FormControl(null),
                    qty: new FormControl(null),
                    price_per_unit: new FormControl(null),
                    warranty: new FormControl(null),
                    min_price: new FormControl(null),
                    max_price: new FormControl(null),
                    gst_type: new FormControl(null),
                    cgst: new FormControl(null),
                    sgst: new FormControl(null),
                    igst: new FormControl(null),
                    maximum_discount: new FormControl(null),
                    discount_approved: new FormControl(null),
                    discount_request: new FormControl(null),
                    readonly: new FormControl(true),
                    hsn_code_id: new FormControl(null),
                    select_scheme: new FormControl(null),
                    schemeApplied: new FormControl(false),
                    name_product: new FormControl(false),
                    custom_branding: this.fb.control(null),
                    customizeTotal: new FormControl(null),
                    item_name: new FormControl(false),
                    image: new FormControl(false),
                    branding_data: this.fb.control(null),
                    customization: this.fb.control(null),
                    customisation_data: this.fb.control(null),
                    hsn_code_id_view2: new FormControl(null),
                    discount_1: new FormControl(null),
                    discount_2: new FormControl(null),
                    discount_3: new FormControl(null),
                    discount1Flat: new FormControl(null),
                    discount2Flat: new FormControl(null),
                    discount3Flat: new FormControl(null),
                    bomArray: new FormControl([])
                }),
            ]),
            chargesDetailList: new FormArray([]),
            total_received: new FormControl(null),
            approvalRemark: new FormControl(null),
            invoice_remark: new FormControl(null),
            document: new FormControl(null),
            po_number: new FormControl(null),
            po_date: new FormControl(null),
            sales_documents: new FormControl(null),
            credit_remark: new FormControl(null),
            currency_id: new FormControl(null),
        });
        this.isDisabledField();
        this.loadOnChanges();
        this.proposalForm
            .get('contact_person_id')
            ?.valueChanges.subscribe((data: any) => {
                const selectedContact = this.customerContactList.find(
                    (value) => value.id === data
                );
                if (selectedContact) {
                    this.proposalForm
                        .get('contact_person_name')
                        .setValue(`${selectedContact?.title || ''} ${selectedContact.contact_person_name}`);
                    this.proposalForm.get('mail_id').setValue(selectedContact.email_id);
                    this.proposalForm
                        .get('contact_number')
                        .setValue(selectedContact.mobile);
                }
            });
        this.invoiceAddressForm = this.fb.group({
            branch_id: new FormControl(null),
            company_name: new FormControl(
                null,
                this.defferentAddress ? null : null
            ),
            gst_no: new FormControl(null),
            complete_address: new FormControl(null),
        });
    }


    client_id: string;
    type_existing: any;
    id_existing: any;
    type: any;
    proposalApprovalId: any;
    lead_summery: any;
    getDataScheme: any;
    liveUrl: any;
    dyanamicValue: any;
    isDiscount: any;
    showitemData: boolean = false;
    paymentMainList: any = [];
    paymentList: any[] = [];     // UI binding
    paymentRows: any[][] = [];   // column wise table
    finalPaymentArray: any[] = []; // save for DB
    totalPaymentTab = 0; // payment terms calculate total amount
    columnsNumber: number = 5; // pass column for header/input fields
    paymentDbList: any = []; // payment details
    newCustomer: boolean = false;
    salesBookingStatus: any;
    private destroy$ = new Subject<void>();
    dealerDetails: any;
    savedQuotationCurrency: string = 'INR';
    savedQuotationCurrencyRate: number = 1; // INR

    ngOnInit() {
        localStorage.removeItem('itemListForDiscount');
        this.entityId = localStorage.getItem('selectedEntityId');
        this.financial_year_id = localStorage.getItem('financial_id');
        this.userLoginId = localStorage.getItem('EmpMainId');
        this.getAllCategory();
        this.getAllCountry();
        this.getProposalType();
        this.getLocationList();
        this.getAllCostCenter(this.entityId);
        this.getAllProfitCenter(this.entityId);
        this.route.queryParams.subscribe((params: any) => {

            if (params.client_id) {
                this.customer_type = 'EXISTING';
                this.client_id = params.client_id;
                this.type_existing = params.type;
                this.salesBookingStatus = params.status;
                this.newCustomer = params?.new_customer === 'yes' ? true : false;
                if (this.client_id === 'new') {

                } else {
                    this.getAllExistingClient(params.client_id);
                    this.getCustomerContactById(params.client_id);
                    this.getsCustomerAddress(params.client_id);
                }
            }
            if (params.actionType == 'dealClose') {
                this.id_existing = params.id;
                this.getAllexistingClientData();
            }
            this.leadId = params?.id;
            this.type = params.type;
            this.proposalId = params?.proposalId;
            this.actionType = params?.actionType;
            this.version_id = params?.version_id;
            this.proposalApprovalId = params.proposal_approval_id;
            this.proposal_list_id = params?.proposal_list_id;
            this.routerParams = params;
            this.lead_summery = params?.typeLead;
            if (this.leadId || this.proposalId) {
                this.getAllproduct();
                this.customer_type = 'NEW';
            }
            if (this.version_id) {
                this.proposalVersionListById();
            } else {
                if (this.leadId) {
                    this.getLeadData(this.leadId);
                }
                if (this.proposalId) {
                    this.getAllDealClosedData();
                    this.branchSetup_get();
                }
            }
            if (this.routerParams?.status === "performance") {
                this.proposalForm.get('end_date_pi')?.setValidators([Validators.required]);
                this.proposalForm.get('created_by_id')?.clearValidators();
                this.proposalForm.get('created_by_id')?.updateValueAndValidity();
            } else if (this.routerParams?.type === 'WithPO' || this.routerParams?.type === 'WithoutPO') {
                this.showitemData = true;
                this.proposalForm.get('created_by_id')?.clearValidators();
                this.proposalForm.get('created_by_id')?.updateValueAndValidity();
                this.proposalForm.get('schedule_delivery_date')?.setValidators([Validators.required]);
                this.proposalForm.get('profit_center_id')?.setValidators([Validators.required]);
                this.proposalForm.get('profit_center_id')?.updateValueAndValidity();
                this.proposalForm.get('cost_center_id')?.setValidators([Validators.required]);
                this.proposalForm.get('cost_center_id')?.updateValueAndValidity();
            } else {
                this.proposalForm.get('profit_center_id')?.clearValidators();
                this.proposalForm.get('cost_center_id')?.clearValidators();
                this.proposalForm.get('end_date_pi')?.clearValidators();
                this.proposalForm.get('schedule_delivery_date')?.clearValidators();
            }
        });
        this.handleFormDisabled();
        this.getAllScheme();
        this.additionalChargeAll();
        if (this.routerParams?.status === 'proformaAdd') {
            this.generateSalesBookingNo(this.financial_year_id)
        }
        if (this.routerParams?.dealer === 'true') {
            this.dealerByCustomer(this.client_id);
        }
        this.environment();
        this.dynamicValue();
        this.getLeadSource(this.financial_year_id, this.entityId);
        this.deliveryTermUnloadings();
        this.paymentMainLists();
        this.insuranceLists()
        // this.freightLists()
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + 15);
        this.proposalForm.get('valid_till_date')?.setValue(newDate, { emitEvent: false });
        this.proposalForm.get('warranty_month')?.setValue(12);
        //this.proposalForm.get('warranty_month_remark')?.setValue('Month');
        this.branchSetup_get();
        this.getAllSanctionCreditLimits();
        this.setNewCustomerValue();

        // use for insurance_amt field
        this.proposalForm.get('grant_total')?.valueChanges
            .pipe(
                debounceTime(300)  // Wait 300ms — call after all updates are complete
            )
            .subscribe((newValue: any) => {
                this.onGrantTotalChanged(newValue);
            });

        if (this.client_id) this.checkSchemeStatusByClientCategory(this.client_id);

        this.getCustomerCreditLimit(this.client_id);
        this._configurationalMasterService.currency$.pipe(takeUntil(this.destroy$)).subscribe(currency => {
            console.log(currency);
            if (!currency) return;
            this.fromCurrencyId = this.selectedCurrency?.Currency_Convert_id;
            this.selectedCurrency = currency;

            this.proposalForm.get('currency_id').patchValue(this.selectedCurrency?.Currency_Convert_id)
            // this.updateCurrencyRate();
            this.calculateQuotationTotals();

        });
        this.proposalForm.get('country_id')?.valueChanges.subscribe((countryId:any) => {
  this.updateBillingValidators(countryId);
});

this.proposalForm.get('shipping_country_id')?.valueChanges.subscribe((countryId:any) => {
  this.updateShippingValidators(countryId);
});
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // updateCurrencyRate() {

    //     // const rate = Number(this.selectedCurrency?.rate || 1);

    //     // this.CF_1.productDetailList.controls.forEach((row: any) => {

    //     //     const maxPrice = Number(row.get('original_max_price')?.value || 0);
    //     //     const minPrice = Number(row.get('original_min_price')?.value || 0);
    //     //     const pricePerUnit = Number(row.get('original_price_per_unit')?.value || 0);

    //     //     row.patchValue({ price_per_unit: this.selectedCurrency.Currency_Type === 'INR' ? pricePerUnit : pricePerUnit * rate }, { emitEvent: false });
    //     //     row.patchValue({ min_price: this.selectedCurrency.Currency_Type === 'INR' ? minPrice : minPrice * rate }, { emitEvent: false });
    //     //     row.patchValue({ max_price: this.selectedCurrency.Currency_Type === 'INR' ? maxPrice : maxPrice * rate }, { emitEvent: false });
    //     // }
    //     // );


    //     // this.calculationAfterCurrencyChange();
    //     this.calculateQuotationTotals();
    // }
    // calculationAfterCurrencyChange() {
    //     const productArray = this.proposalForm.get('productDetailList') as FormArray;
    //     (productArray.controls as FormGroup[]).forEach(productGroup => {
    //         const qty = Number(productGroup.get('qty')?.value || 0);
    //         const price = Number(productGroup.get('price_per_unit')?.value || 0);
    //         const gstPercent = Number(productGroup.get('igst')?.value || 0);

    //         const gross = qty * price;
    //         const gst = (gross * gstPercent) / 100;
    //         const total = gross + gst;
    //         productGroup.patchValue({
    //             totalPrice: gross,
    //             totalWithGst: total
    //         }, { emitEvent: false });           
    //     });        
    // }
    getCustomerCreditLimit(id: any) {
        // console.log(id, "_____CreditLimit")
        this.salesService1.getCreditLimitById(id).subscribe((response: any) => {
            let data = response.data[0];
            if (data) {
                // console.log(data, "_____CreditLimit11")
                this.proposalForm.patchValue({
                    sactioned_credit_limit: data.sactioned_credit_limit,
                    utilized_credit_limit: data.utilized_credit_limit,
                    available_credit_limit: data.available_credit_limit,
                    sactioned_credit_period: data.sactioned_credit_period,
                    grace_period: data.grace_period
                });
            }
        });
    }

    onGrantTotalChanged(value: any): void {
        console.log('Final Grant total (after all updates):', value);
        const numericValue = Number(value) || 0;
        const gper = +(numericValue * 0.01).toFixed(2); // 1% = 1 / 100 = 0.01
        this.proposalForm.patchValue({
            insurance_amt: gper
        }, { emitEvent: false }); // It avoids triggering itself again
    }

    onItemDropdownOpen(rowIndex: number) {
        // jab dropdown open hoga to by default items blank karna
        //   this.productData[rowIndex] = [];
    }

    onItemSearch(query: any, rowIndex: any) {
        if (query.target.value.length < 3) {
            // this.productData[rowIndex] = []; // 3 char se kam ho to clear
            return;
        }

        let data = {
            search: query.target.value
        }

        this._configurationalMasterService.getAllItem(data).subscribe((res: any) => {
            this.productData[rowIndex] = res?.data || []
            // if ( this.id ) {
            //   this.allitemgroup(this.id);
            // }
        }, (err: any) => {

        })
    }

    dealerByCustomer(customerId: any) {
        this.salesService.dealerByCustomer(customerId).subscribe({
            next: (res: any) => {
                this.dealerDetails = res.data;
            }, error: (err: any) => {
                this.toast.error(err.error.message)
            }
        })
    }
    setNewCustomerValue() {
        if (this.new_customer === 'yes') {
            this.proposalForm.get('lead_source')?.setValue(parseInt(this.lead_source));
            this.proposalForm.get('created_by')?.setValue(this.created_by);
            this.proposalForm.get('created_by_id')?.setValue(this.created_by_id);
        }
    }

    deliveryRemarkLabel = 'Term of Delivery Remark';
    onDeliveryTermChange(selectedId: number, type: any) {

        if (type === 'Term') {
            const selectedObj = this.termOfDeliveryList?.find(
                (t: any) => t.id === selectedId
            );

            const deliveryTerm = selectedObj?.delivery_term;
            const remarkControl = this.proposalForm.get('delivery_term_remark');

            if (deliveryTerm === 'Freight - To-Pay') {
                this.deliveryRemarkLabel = 'Amount';
                remarkControl?.setValue(null);
            } else if (deliveryTerm === 'FOR Customer Warehouse') {
                this.deliveryRemarkLabel = 'City';
                remarkControl?.setValue(null);
            } else if (deliveryTerm === "Ex-Works" && (this.routerParams?.dealer === 'true' || this.getData?.dealer)) {
                // remarkControl?.patchValue(this.dealerDetails?.company_name?this.dealerDetails.company_name|| this.getData?.dealerName);
                remarkControl?.patchValue(this.dealerDetails?.company_name ? this.dealerDetails.company_name : this.getData?.dealerName);

            }
            else {
                this.deliveryRemarkLabel = 'Details of Delivery ';
                remarkControl?.setValue(selectedObj?.unloading || '');
            }
        }
    }

    dynamicValue() {
        if (this.actionType === "create" && !this.quotationType) {
            this.dyanamicValue = "Create New Quotation"
            this.showSchemeBtn = true;

        } else if (this.actionType === "create" && this.quotationType && this.routerParams?.status !== 'Edit SB') {
            this.dyanamicValue = "Create Sales Booking"
            this.showSchemeBtn = true;
        } else if (this.actionType === "create" && this.quotationType && this.routerParams?.status === 'Edit SB') {
            this.dyanamicValue = "Edit Sales Booking"
            this.showSchemeBtn = true;
        }
        else if (this.actionType === 'view') {
            this.dyanamicValue = "View Quotation"
            this.showSchemeBtn = false;

        } else if (this.actionType === 'edit' && !this.pi) {
            this.dyanamicValue = "Edit Quotation"
            this.showSchemeBtn = true;

        } else if (this.actionType === "edit" && this.pi) {
            this.dyanamicValue = "Edit PI"
            this.showSchemeBtn = true;
        } else if (this.type === "WithPO" || this.type === "WithoutPO") {
            this.dyanamicValue = "Sales Booking"
            this.showSchemeBtn = false;
        }
    }

    baseURL: any;
    environment() {
        let env = environment.servralUrl;
        this.baseURL = env
        if (env === 'https://elanuat.api.elitetraveltech.in') {
            this.liveUrl = "https://elanuat.elitetraveltech.in/"
        } else if (env === 'https://elandevapi.elitetraveltech.in') {
            this.liveUrl = "https://elandev.elitetraveltech.in/"
        } else {
            this.liveUrl = "http://localhost:4200/"
        }
    }

    chargesToggle: boolean = false;
    shippingToggle: boolean = false;
    saveWithToggle: boolean = true;
    onSaveWithPO: boolean = true;
    toggleShippingAddress(event: any) {

        if (this.shippingToggle) {
            let frmValue = this.proposalForm.getRawValue();
            this.getAllShippingState(frmValue?.country_id);
            this.getAllShippingCity(frmValue?.state_id);

            this.proposalForm.patchValue({
                shipping_country_id: frmValue?.country_id || '',
                shipping_state_id: frmValue?.state_id || '',
                shipping_city_id: frmValue?.city_id || '',
                shipping_postal_address: frmValue?.postal_address || '',
                shipping_pin_code: frmValue?.pincode || '',
                shipping_address: frmValue?.address || '',
                is_same_as_shipping: this.shippingToggle,
            });
            this.fetchPinDetails();

        } else {
            this.proposalForm.patchValue({
                shipping_country_id: null,
                shipping_state_id: null,
                shipping_city_id: null,
                shipping_postal_address: null,
                shipping_pin_code: null,
                shipping_address: null,
                is_same_as_shipping: this.shippingToggle,
            });
        }
    }

    toggleChargesRow(event: any) {
        if (this.chargesToggle) {
            if (this.CF_2.chargesDetailList.length === 0) {
                this.addChargesRow();
            }
        } else {
            const chargesFormArray = <FormArray>this.CF_2.chargesDetailList;
            while (chargesFormArray.length !== 0) {
                chargesFormArray.removeAt(0);
            }
            this.calculateQuotationTotals();
        }
    }

    saveWithPO(e: any) {
        if (e?.checked === true) {
            this.onSaveWithPO = true;
        } else {
            this.onSaveWithPO = false;
        }
    }
    get CF_2(): any {
        return this.proposalForm.controls;
    }

    addChargesRow() {
        if (!this.chargesToggle) return; // Prevent adding if toggle is off
        (<FormArray>this.CF_2.chargesDetailList).push(
            new FormGroup({
                charge_name: new FormControl(null, Validators.required),
                charges_amount: new FormControl(null, Validators.required),
                charges_hsn_id: new FormControl(null, Validators.required),
                charges_rate: new FormControl(null),
                charges_desc: new FormControl(null),
                charge_name_id: new FormControl(null)
            })
        );
    }

    deleteChargesRow(i: any, control: any) {
        if (this.CF_2.chargesDetailList.length >= 1) {
            this.CF_2.chargesDetailList.removeAt(i);
            this.calculateQuotationTotals();
        } else {
            this.toast.error('must be one', "Can't Deleted!");
        }
    }

    hsnCodeList2: any;
    hsn: any;
    getHsnCode(id: any, index: any) {
        this._configurationalMasterService
            .getHsnCode(this.entityId)
            .subscribe((res: any) => {
                this.hsnCodeList = res.data;
                this.hsnCodeList2 = this.hsnCodeList;
                this.hsn = this.hsnCodeList2.map((res: any) => res?.hsn_sac_code);
                const control = this.CF_1.productDetailList.at(index);
                const controlCopy = this.CF_1.copyProductDetailList.at(index);
                const matchedHsn = this.hsnCodeList?.find((hsn: any) => hsn?.id === id);

                if (matchedHsn) {
                    control?.patchValue({
                        hsn_code_id: matchedHsn?.id,
                        hsn_code_id_view: matchedHsn?.hsn_sac_code,
                    });
                    controlCopy?.patchValue({
                        hsn_code_id: matchedHsn?.id,
                        hsn_code_id_view2: matchedHsn?.hsn_sac_code,
                    });
                }
            });
    }

    hsnSearch(e: any) {
        const aa = e;
        let filteredVariable = this.hsnCodeList2.filter((item: any) =>
            aa.includes(item?.hsn_sac_code)
        );
        this.hsnCodeList = filteredVariable;
    }

    onHSNCodeChange(value: any, index: number): void {
        let chargesDetailList = this.proposalForm.get(
            'chargesDetailList'
        ) as FormArray;
        const selectedHSN = this.hsnCodeList.find(
            (hsn: { id: any }) => hsn.id == value
        );
        chargesDetailList.at(index).patchValue({
            charges_rate: selectedHSN.value,
            charges_desc: selectedHSN.description,
        });
    }

    keyPress2(event: KeyboardEvent) {
        const inputChar = String.fromCharCode(event.charCode);
        const currentValue = (event.target as HTMLInputElement).value;

        const isNumber = /[0-9]/.test(inputChar);
        const isDot = inputChar === '.';

        if (event.keyCode !== 8 && !isNumber) {
            if (isDot) {
                if (currentValue.includes('.')) {
                    event.preventDefault();
                }
            } else {
                event.preventDefault();
            }
        }

        if (event.key === ' ' || event.key === '+' || event.key === '-') {
            event.preventDefault();
        }
    }

    reloadCurrentRoute(id: any, type: any) {
        let currentUrl = `/master/crm/create-proposal?proposalId=${id}$actionType=${type}`;
        this._router
            .navigateByUrl(currentUrl, { skipLocationChange: true })
            .then(() => {
                this._router.navigate([currentUrl]);
            });
    }

    handleFormDisabled() {

        if (this.actionType != 'edit' && this.salesBookingStatus !== 'Edit SB' && this.actionType !== 'create'
        ) {
            this.formDisabled = true;
        } else {
            this.formDisabled = false;

        }

    }

    clientData: any = [];

    getAllExistingClient(client_id: any) {
        let data = {
            proposal_no: this.proposalForm?.value?.proposal_no,
        };
        this.salesService.existingClient(client_id, data).subscribe((res: any) => {
            if (res) {
                this.clientData = res.data;
                const customerItemList = res.data?.customer_item_list || [];
                const productDetailListArray = this.CF_1.productDetailList as FormArray;

                productDetailListArray.clear();

                if (this.clientData) {
                    this.getCustomerCreditLimit(client_id);
                    this.proposalForm.patchValue({
                        company_name: this.clientData.company_name,
                        gst_no: this.clientData?.gst_in,
                        country_id: this.clientData?.country_id,
                        state_id: this.clientData?.state_id,
                        city_id: this.clientData?.city_id,
                        postal_address: this.clientData?.postal_address,
                        pincode: this.clientData?.pincode,
                        address: this.clientData?.address,

                        // available_credit_limit: this.clientData?.available_credit_limit,
                        // sactioned_credit_limit: this.clientData?.sactioned_credit_limit,
                        // sactioned_credit_period: this.clientData?.sactioned_credit_period,
                    });
                }
                if (this.clientData?.CUSTOMER_ADDRESS_CONTACT_MSTs) {
                    this.proposalForm.patchValue({
                        credit_days: null,
                        //  source_name:this.clientData?.source_name
                    });
                }

                if (customerItemList.length > 0) {
                    this.CF_1.productDetailList = this.patchData(customerItemList);

                    const firstItem = customerItemList[0];
                    this.schemSelection(firstItem.scheme_id);

                    this.proposalForm.patchValue({
                        schemeData: firstItem.scheme_id,
                    });

                    if (firstItem.scheme_id) {
                        this.disableApply = true;
                        this.onScheme = true;
                    }
                } else {
                    productDetailListArray.push(
                        new FormGroup({
                            product_master_id: new FormControl(null),
                            product_sub_category_id: new FormControl(null),
                            variant_id: new FormControl(null),
                            product_varient_list: new FormControl([]),
                            product_code: new FormControl(null),
                            product_description: new FormControl(null),
                            product_category_id: new FormControl(null),
                            uom_name: new FormControl(null),
                            uom_id: new FormControl(null),
                            qty: new FormControl(null),
                            price_per_unit: new FormControl(null),
                            original_price_per_unit: new FormControl(null),
                            warranty: new FormControl(null),
                            min_price: new FormControl(null),
                            original_min_price: new FormControl(null),
                            max_price: new FormControl(null),
                            original_max_price: new FormControl(null),
                            cgst: new FormControl(null),
                            gst_type: new FormControl(null),
                            sgst: new FormControl(null),
                            igst: new FormControl(null),
                            maximum_discount: new FormControl(null),
                            discount_approved: new FormControl(null),
                            hsn_code_id: new FormControl(null),
                            select_scheme: new FormControl(null),
                            schemeApplied: new FormControl(false),
                            name_product: new FormControl(null),
                            hsn_code_id_view: new FormControl(null),
                            hsn_code: new FormControl(null),
                            image: new FormControl(null),
                            item_name: new FormControl(null),
                            custom_branding: this.fb.control(null),
                            customizeTotal: new FormControl(null),
                            discount_1: new FormControl(null),
                            discount_2: new FormControl(null),
                            discount_3: new FormControl(null),
                            discount1Flat: new FormControl(null),
                            discount2Flat: new FormControl(null),
                            discount3Flat: new FormControl(null),
                            branding_data: this.fb.control(null),
                            customization: this.fb.control(null),
                            customisation_data: this.fb.control(null),
                            totalPrice: new FormControl(null),
                            totalWithGst: new FormControl(null),
                            old_totalPrice: new FormControl(null),
                            old_totalWithGst: new FormControl(null),
                            bomArray: new FormControl([])
                        })
                    );
                }
                this.generateRandomPropWithDate();
                this.getAllproduct();
            }
        });
    }

    getAllExistingClientDuplicate(client_id: any) {
        let data = {
            proposal_no: this.proposalForm?.value?.proposal_no,
        };
        this.salesService.existingClient(client_id, data).subscribe((res: any) => {
            if (res) {
                this.clientData = res.data;

                const customerItemList = res.data?.customer_item_list || [];
                const productDetailListArray = this.CF_1.productDetailList as FormArray;

                productDetailListArray.clear(); // Pehle clear kar do purani rows (important)

                if (this.clientData) {
                    this.proposalForm.patchValue({
                        company_name: this.clientData.company_name,
                    });
                }
                if (this.clientData?.CUSTOMER_ADDRESS_CONTACT_MSTs) {
                    this.proposalForm.patchValue({
                        contact_person_name:
                            this.clientData?.CUSTOMER_ADDRESS_CONTACT_MSTs[0]
                                ?.contact_person_name,
                        contact_number:
                            this.clientData?.CUSTOMER_ADDRESS_CONTACT_MSTs[0]?.mobile,
                        mail_id:
                            this.clientData?.CUSTOMER_ADDRESS_CONTACT_MSTs[0]?.email_id,
                        credit_days: null,
                        //  source_name:this.clientData?.source_name
                    });
                }

                if (customerItemList.length > 0) {
                    this.CF_1.productDetailList = this.patchData(customerItemList);

                    const firstItem = customerItemList[0];
                    this.schemSelection(firstItem.scheme_id);

                    this.proposalForm.patchValue({
                        schemeData: firstItem.scheme_id,
                    });

                    if (firstItem.scheme_id) {
                        this.disableApply = true;
                        this.onScheme = true;
                    }
                } else {
                    // customer_item_list empty hai
                    // ek blank row daal dete hain

                    productDetailListArray.push(
                        new FormGroup({
                            product_master_id: new FormControl(null),
                            product_sub_category_id: new FormControl(null),
                            variant_id: new FormControl(null),
                            product_varient_list: new FormControl([]),
                            product_code: new FormControl(null),
                            product_description: new FormControl(null),
                            product_category_id: new FormControl(null),
                            uom_name: new FormControl(null),
                            uom_id: new FormControl(null),
                            qty: new FormControl(null),
                            warranty: new FormControl(null),
                            price_per_unit: new FormControl(null),
                            min_price: new FormControl(null),
                            max_price: new FormControl(null),
                            original_price_per_unit: new FormControl(null),
                            original_min_price: new FormControl(null),
                            original_max_price: new FormControl(null),
                            cgst: new FormControl(null),
                            gst_type: new FormControl(null),
                            sgst: new FormControl(null),
                            igst: new FormControl(null),
                            maximum_discount: new FormControl(null),
                            discount_approved: new FormControl(null),
                            hsn_code_id: new FormControl(null),
                            hsn_code: new FormControl(null),
                            select_scheme: new FormControl(null),
                            schemeApplied: new FormControl(false),
                            name_product: new FormControl(null),
                            custom_branding: this.fb.control(null),
                            customizeTotal: new FormControl(null),
                            branding_data: this.fb.control(null),
                            customization: this.fb.control(null),
                            customisation_data: this.fb.control(null),
                            hsn_code_id_view2: new FormControl(null),
                            image: new FormControl(null),
                            item_name: new FormControl(null),
                            discount_1: new FormControl(null),
                            discount_2: new FormControl(null),
                            discount_3: new FormControl(null),
                            discount1Flat: new FormControl(null),
                            discount2Flat: new FormControl(null),
                            discount3Flat: new FormControl(null),
                            totalPrice: new FormControl(null),
                            totalWithGst: new FormControl(null),
                            old_totalPrice: new FormControl(null),
                            old_totalWithGst: new FormControl(null),
                            bomArray: new FormControl([])
                        })
                    );
                }
                this.generateRandomPropWithDate();
                this.getAllproduct();
            }
        });
    }

    handleShowHide(data: any) {
        if (
            (this.actionType == 'edit' || this.actionType == 'view') &&
            data?.request_type == 'discount'
        ) {
            this.isDiscountRequired = true;
            this.isDiscountApproved = true;
        }
    }

    generateRandomPropWithDate() {
        if (this.actionType == 'create') {
            const currentDate = new Date();
            const formattedDate = currentDate
                .toISOString()
                .slice(0, 10)
                .replace(/-/g, '');
            const randomNumber = Math.floor(1000 + Math.random() * 9000);
            return 'PROP' + formattedDate + randomNumber;
        }
    }

    selectProduct(data: any, index: any) {
        let currentList = this.proposalForm?.value?.productDetailList;
        let productObj = this.productList?.find((elem: any) => elem?.id == data);
        let tempList = [...this.productList];
        let productVarientList: any = [];
        tempList?.map((item: any) => {
            if (item?.id == data) {
                productVarientList = item?.product_variant_masters;
            }
        });

        currentList[index] = {
            ...currentList[index],
            product_master_id: productObj?.id,
            product_code: productObj?.product_code,
            product_varient_list: productVarientList,
            product_description: '',
            uom_name: '',
            uom_id: '',
            price_per_unit: '',
            warranty: '',
        };
    }

    generateProductVarient(data: any, index: any) {
        let currentList = [...this.proposalForm?.value?.productDetailList];
        let varientObj: any = {};
        this.productList?.map((item: any) => {
            item?.product_variant_masters?.map((subItem: any) => {
                if (subItem?.id == data) {
                    varientObj = subItem;
                }
            });
        });
        let isDuplicate = true;
        if (currentList?.length > 1) {
            let newList = currentList.slice();
            if (currentList && currentList.length > 1) newList.splice(index, 1);
            newList?.map((item: any) => {
                if (item.variant_id == data) {
                    isDuplicate = false;
                    this.toast.error('This variant has been already added.');
                }
            });
        }
        currentList[index] = {
            ...currentList[index],
            variant_id: isDuplicate ? varientObj?.id : '',
            product_description: isDuplicate ? varientObj?.product_description : '',
            uom_name: isDuplicate ? varientObj?.tbl_uom?.uom_name : '',
            uom_id: isDuplicate ? varientObj?.uom_id : '',
            price_per_unit: isDuplicate ? varientObj?.price_per_unit : '',
            warranty: isDuplicate ? varientObj?.warranty : '',
            maximum_discount: 0,//isDuplicate ? varientObj?.maximum_discount : '',
        };
        this.proposalForm.patchValue({
            productDetailList: currentList,
        });
        this.calculateQuotationTotals();
    }

    get CF_1(): any {
        return this.proposalForm.controls;
    }

    addrow() {
        <FormArray>this.CF_1.productDetailList.push(
            new FormGroup({
                product_master_id: new FormControl(null),
                product_sub_category_id: new FormControl(null),
                item_name: new FormControl(null),
                variant_id: new FormControl(null),
                product_varient_list: new FormControl([]),
                product_code: new FormControl(null),
                product_description: new FormControl(null),
                product_category_id: new FormControl(null),
                uom_name: new FormControl(null),
                uom_id: new FormControl(null),
                qty: new FormControl(null),
                price_per_unit: new FormControl(null),
                original_price_per_unit: new FormControl(null),
                warranty: new FormControl(null),
                min_price: new FormControl(null),
                original_min_price: new FormControl(null),
                max_price: new FormControl(null),
                original_max_price: new FormControl(null),
                cgst: new FormControl(null),
                gst_type: new FormControl(null),
                sgst: new FormControl(null),
                igst: new FormControl(null),
                maximum_discount: new FormControl(null),
                discount_approved: new FormControl(null),
                hsn_code_id: new FormControl(null),
                hsn_code: new FormControl(null),
                select_scheme: new FormControl(null),
                schemeApplied: new FormControl(false),
                name_product: new FormControl(null),
                customizeTotal: new FormControl(null),
                custom_branding: this.fb.control(null),
                branding_data: this.fb.control(null),
                customization: this.fb.control(null),
                customisation_data: this.fb.control(null),
                hsn_code_id_view: new FormControl(null),
                image: new FormControl(null),
                discount_1: new FormControl(null),
                discount_2: new FormControl(null),
                discount_3: new FormControl(null),
                discount1Flat: new FormControl(null),
                discount2Flat: new FormControl(null),
                discount3Flat: new FormControl(null),
                totalPrice: new FormControl(null),
                totalWithGst: new FormControl(null),
                old_totalPrice: new FormControl(null),
                old_totalWithGst: new FormControl(null),
                bomArray: new FormControl([])
            })
        );
    }

    schemeExtraData: { [index: number]: any } = {};

    selectScheme(i: any, control: any) {

        const formArray = this.proposalForm.get('productDetailList') as FormArray;
        let val = this.proposalForm.value;
        const data = {
            product_name:
                control?.value?.name_product || control?.value?.product_name,
            qty: control?.value?.qty,
            select_scheme: control?.value?.select_scheme,
            id: control?.value?.id || control?.value?.id_product,
            proposal_no: this.proposalForm?.value?.proposal_no,
            actionType: this.actionType,
            version_id: Number(this.version_id),
            proposal_id: Number(this.proposalId),
            deleted_remaining_quantity: val?.deleted_remaining_quantity
        };

        if (!data.qty || data.qty === 0) {
            this.toast.warning('Please Add Qty');
            return;
        }

        if (!data.select_scheme || data.select_scheme.length === 0) {
            this.toast.warning('Please Select Add-Ons');
            return;
        }

        let otherData: any = {
            id: data.id || null,
            product_master_id: control?.value?.product_master_id,
            product_category_id: control?.value?.product_category_id,
            product_sub_category_id: control?.value?.product_sub_category_id,
            variant_id: null,
            product_code: control?.value?.product_code,
            product_description: control?.value?.product_description,
            discount: control?.value?.maximum_discount,
            order_qty: control?.value?.qty,
            gst: 10,
        };

        // Check if there’s already saved schemeData for this row
        let prefilledSchemeData
        if (control?.value?.custom_branding == null) {
            prefilledSchemeData = control?.value?.custom_branding || null;

        } else {
            prefilledSchemeData = control?.value?.custom_branding || null;

        }
        if (this.client_id !== 'new') {
            const dialogRef = this.dialog.open(SchemeDialogComponent, {
                width: '80%',
                data: {
                    id: this.leadId,
                    data: data,
                    otherData: otherData,
                    customer_type: this.customer_type,
                    client_id: this.client_id,
                    schemeData: prefilledSchemeData,
                    selectedCurrency: this.selectedCurrency

                },
            });

            dialogRef.afterClosed().subscribe((result: any) => {
                if (result) {

                    this.proposalForm.get('deleted_remaining_quantity')?.setValue(null);
                    const formArray = this.proposalForm.get(
                        'productDetailList'
                    ) as FormArray;
                    const formGroup = formArray.at(i);

                    let existingData = formGroup.get('custom_branding')?.value || [];

                    // If not an array, convert to array
                    if (!Array.isArray(existingData)) {
                        existingData = [existingData];
                    }

                    // Push new result into existing array
                    existingData.push(result);
                    const totalGrandInTotal = existingData.reduce((sum: any, item: any) => {
                        return sum + parseFloat((item.grand_in_total || 0));
                    }, 0);

                    const totalBrandingTotal = existingData.reduce((sum: any, item: any) => {
                        return sum + parseFloat((item?.branding_data?.totalWithGst || 0));
                    }, 0);
                    const customizeTotal = parseFloat(totalGrandInTotal) + parseFloat(totalBrandingTotal)


                    // Patch the updated array back to form
                    formGroup.patchValue({
                        custom_branding: existingData,
                        customizeTotal: customizeTotal
                    });

                    this.calculateQuotationTotals();
                    this.schemeExtraData[i] = {
                        branding_data: result?.branding || null,
                        customization: result?.customization?.[0] || null,
                        customisation_data: result?.customization?.[0]?.customization || null,
                    };
                }
            });
        }
    }

    checkNullValues(data: any): boolean {
        const keysToSkip = ['id', 'variant_id', 'gst'];  // Define keys to skip

        for (let key in data) {
            // Skip checking specific keys
            if (keysToSkip.includes(key)) {
                continue;
            }

            // Check if the value is null or undefined for other keys
            if (data[key] === null || data[key] === undefined) {
                return false; // Return false if any value is null or undefined
            }
        }

        return true; // Return true if none of the values is null or undefined
    }

    // use for customization / branding
    selectSchemeView(i: any, control: any) {
        const rowData = control.getRawValue();
        //console.log(rowData);
        let data = {
            product_name:
                rowData?.MASTER_PRODUCT?.product_name ||
                rowData?.item_name ||
                rowData?.product_name ||
                rowData?.name_product,
            qty: rowData?.qty,
            product_master_id: rowData?.product_master_id,
            select_scheme: rowData?.select_scheme,
            id: rowData?.id || rowData?.id_product,
            proposal_no: this.proposalForm?.value?.proposal_no,
            actionType: this.actionType,
            version_id: Number(this.version_id),
            proposal_id: Number(this.proposalId),
        };
        // let data = {
        //     product_name:
        //         control?.value?.MASTER_PRODUCT?.product_name ||
        //         control?.value?.item_name ||
        //         control?.value?.product_name ||
        //         control?.value?.name_product,
        //     qty: control?.value?.qty,
        //     product_master_id: control?.value?.product_master_id,
        //     select_scheme: control?.value?.select_scheme,
        //     id: control?.value?.id || control?.value?.id_product,
        //     proposal_no: this.proposalForm?.value?.proposal_no,
        //     actionType: this.actionType,
        //     version_id: Number(this.version_id),
        //     proposal_id: Number(this.proposalId),
        // };

        if (data?.select_scheme === null || data?.select_scheme.length === 0) {
            this.toast.warning('Please Select Add-Ons');
            return;
        }
        // const prefilledSchemeData = control?.value?.custom_branding || null;
        const prefilledSchemeData = rowData?.custom_branding || null;

        const dialogRef = this.dialog.open(SchemeDialogComponent, {
            width: '80%',
            disableClose: true,
            data: {
                id: this.leadId,
                data: data,
                status: this.actionType == 'view' ? '' : 'view', // delete button show for edit/create mode
                type: this.actionType == 'edit' || this.actionType == 'create' ? '' : 'addSO', // delete button hide for view mode
                customer_type: this.customer_type,
                client_id: this.client_id,
                schemeData: prefilledSchemeData,
                selectedCurrency: this.selectedCurrency
            },
        });
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
                this.proposalForm.get('deleted_remaining_quantity')?.setValue(result);
                this.calculateQuotationTotals();
            }
        });
    }

    deleteRow(index: any, control: any) {
        if (this.CF_1.productDetailList.length >= 1) {
            this.CF_1.productDetailList.removeAt(index);
            const productArray = this.proposalForm.get('productDetailList') as FormArray;
            this.proposalForm.updateValueAndValidity();
            this.removeCustomizationBrandingBOM(index);
        } else {
            this.toast.error('must be one', "Can't Deleted!");
        }
    }

    patchData(e: any): FormArray {

        // If no items, return one blank row
        if (!e || e.length === 0) {
            const blankRow = new FormGroup({
                variant_id: new FormControl(null),
                qty: new FormControl(0),
                gst_type: new FormControl(null),
                cgst: new FormControl(null),
                sgst: new FormControl(null),
                discount_approved: new FormControl(null),
                discount_request: new FormControl(null),
                readonly: new FormControl(false),
                // branding_data: new FormControl(null),
                // customisation_data: new FormControl(null),
                // customization: new FormControl(null),
                scheme: new FormControl(null),
                product_master_id: new FormControl(null),
                id: new FormControl(null),
                product_code: new FormControl(''),
                select_scheme: new FormControl([]),
                product_sub_category_id: new FormControl(null),
                product_description: new FormControl(''),
                price_per_unit: new FormControl(null),
                original_price_per_unit: new FormControl(null),
                warranty: new FormControl(null),
                min_price: new FormControl(null),
                original_min_price: new FormControl(null),
                max_price: new FormControl(null),
                original_max_price: new FormControl(null),
                maximum_discount: new FormControl(null),
                uom_name: new FormControl(null),
                hsn_code_id: new FormControl(null),
                igst: new FormControl(null),
                uom_id: new FormControl(null),
                apply_scheme: new FormControl(false),
                promo_item: new FormControl(false),
                name_product: new FormControl(''),
                version_status: new FormControl(null),
                custom_branding: this.fb.control(null),
                customizeTotal: new FormControl(null),
                branding_data: this.fb.control(null),
                customization: this.fb.control(null),
                customisation_data: this.fb.control(null),
                image: new FormControl(null),
                item_name: new FormControl(null),
                discount_1: new FormControl(null),
                discount_2: new FormControl(null),
                discount_3: new FormControl(null),
                discount1Flat: new FormControl(null),
                discount2Flat: new FormControl(null),
                discount3Flat: new FormControl(null),
                qad_discount: new FormControl(null),
                totalPrice: new FormControl(null),
                totalWithGst: new FormControl(null),
                old_totalPrice: new FormControl(null),
                old_totalWithGst: new FormControl(null),
                bomArray: new FormControl([])
            });

            return new FormArray([blankRow]);
        }

        // Existing logic
        //console.log(e, "e<<<<<<<<<<<<<<<<<");

        return new FormArray(
            e.map((x: any, index: any) => {
                this.getSubCategory(x?.product_category_id, index);

                // this.getAllActiveProduct(x?.pro_sub_cat_id, x?.product_category_id, index);
                const rate = Number(this.selectedCurrency?.rate || 1);
                const originalPrice = Number(x?.MASTER_PRODUCT?.product_list_price || 0);

                const defaultControls = {
                    id_product: x?.product_id || null,
                    variant_id: null,
                    qty: x?.order_qty || x?.promo_order_qty || 0,
                    gst_type: null,
                    cgst: null,
                    sgst: null,
                    discount_approved: null,
                    discount_request: null,
                    readonly: false,
                    branding_data: x?.branding_data || null,
                    customisation_data: x?.customisation_data || null,
                    customization: x?.customization || null,
                    scheme: x?.scheme,
                    custom_branding: x?.custom_branding || null,
                    customizeTotal: x?.customizeTotal,
                    warranty: x?.warranty || null,
                    bomArray: x?.bomArray || []
                };

                const mergedData = { ...defaultControls, ...x };
                const obj = new FormGroup({});

                Object.keys(mergedData).forEach((k) => {
                    // if (k === 'product_id') {
                    if (k === 'product_master_id') {
                        // Ensure product_master_id is set correctly
                        obj.addControl(
                            'product_master_id',
                            new FormControl({ value: mergedData[k] || null, disabled: this.isReadOnly })
                        );
                    } else if (k === 'id') {
                        obj.addControl('id', new FormControl(x?.id || null));
                    } else {
                        obj.addControl(k,
                            new FormControl({ value: mergedData[k], disabled: this.isReadOnly }));
                    }
                });

                // Add additional controls as needed
                obj.addControl(
                    'product_code',
                    new FormControl(
                        x?.MASTER_PRODUCT?.product_code ??
                        x?.product_code ??
                        x?.item_code ??
                        ''
                    )
                );

                if (this.version_id) {
                    obj.addControl(
                        'select_scheme',
                        new FormControl(this.parseSelectScheme(x?.select_scheme))
                    );
                } else {
                    obj.addControl(
                        'select_scheme',
                        new FormControl(
                            this.parseSelectScheme(
                                x?.select_scheme ||
                                x?.customization?.select_scheme ||
                                x?.scheme?.select_scheme
                            )
                        )
                    );
                }

                obj.addControl(
                    'product_sub_category_id',
                    new FormControl({ value: x?.pro_sub_cat_id, disabled: this.isReadOnly })
                );
                obj.addControl(
                    'product_master_id',
                    new FormControl(x?.product_master_id)
                );

                obj.addControl(
                    'product_description',
                    new FormControl(
                        x?.MASTER_PRODUCT?.product_description ??
                        x?.product_description ??
                        x?.description
                    )
                );
                obj.addControl(
                    'price_per_unit',
                    new FormControl(this.selectedCurrency?.Currency_Type === 'INR' ? originalPrice : originalPrice * rate || null)
                );

                obj.addControl('original_price_per_unit', new FormControl(x?.MASTER_PRODUCT?.price_per_unit || null));
                obj.addControl('original_min_price', new FormControl(0));
                obj.addControl('original_max_price', new FormControl(0));
                obj.addControl('old_totalWithGst', new FormControl(x?.MASTER_PRODUCT?.price_per_unit || null));
                obj.addControl('old_totalPrice', new FormControl(0));

                // obj.addControl('price_per_unit',new FormControl(this.selectedCurrency?.Currency_Type === 'INR' ? originalPrice : originalPrice * rate || null)
                // );
                // obj.addControl(
                //     'price_per_unit',
                //     new FormControl(this.selectedCurrency?.Currency_Type === 'INR' ? originalPrice : originalPrice * rate || null)
                // );
                // obj.addControl(
                //     'warranty',
                //     new FormControl(x?.MASTER_PRODUCT?.warranty || x?.warranty || null)
                // );
                obj.addControl(
                    'maximum_discount',
                    new FormControl(
                        x?.MASTER_PRODUCT?.maximum_discount || x?.discount || null
                    )
                );
                obj.addControl(
                    'uom_name',
                    new FormControl(x?.MASTER_PRODUCT?.MASTER_UOM?.uom_name || null)
                );
                obj.addControl(
                    'hsn_code_id',
                    new FormControl(
                        this.getHsnCode(x?.MASTER_PRODUCT?.hsn_code_id || x?.hsn_code_id, index)
                    )
                );

                // obj.addControl(
                //     'hsn_code_id_view',
                //     new FormControl(
                //         new FormControl(x?.MASTER_PRODUCT?.MASTER_UOM?.uom_name || null)
                //     )
                // );
                obj.addControl(
                    'igst',
                    new FormControl(x?.MASTER_PRODUCT?.igst || x?.gst || null)
                );
                obj.addControl(
                    'hsn_code_id_view2',
                    new FormControl(x?.hsn_sac_code || null)
                );
                obj.addControl(
                    'hsn_code_id_view',
                    new FormControl(x?.hsn_sac_code || null)
                );
                obj.addControl(
                    'sgst',
                    new FormControl(x?.MASTER_PRODUCT?.sgst || null)
                );
                obj.addControl(
                    'cgst',
                    new FormControl(x?.MASTER_PRODUCT?.cgst || null)
                );
                obj.addControl(
                    'uom_id',
                    new FormControl(
                        x?.MASTER_PRODUCT?.MASTER_UOM?.uom_id ??
                        x?.MASTER_PRODUCT?.MASTER_UOM?.id
                    )
                );
                obj.addControl(
                    'apply_scheme',
                    new FormControl(x?.apply_scheme ?? false)
                );
                obj.addControl('promo_item', new FormControl(x?.promo_item ?? false));
                obj.addControl('name_product', new FormControl(x?.item_name ?? ''));
                obj.addControl(
                    'version_status',
                    new FormControl(x?.version_status ?? '')
                );
                obj.addControl(
                    'qad_discount',
                    new FormControl(x?.qad_discount ?? '')
                );

                // Return the form group
                this.getAllActiveProductView(
                    x?.pro_sub_cat_id,
                    x?.product_category_id,
                    index,
                    x?.product_master_id
                );

                return obj;
            })
        );
    }

    parseSelectScheme(value: any): string[] {
        try {
            if (typeof value === 'string') {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed.map(String) : [];
            }
            if (Array.isArray(value)) {
                return value.map(String);
            }
            return [];
        } catch (e) {
            console.error('Invalid select_scheme format', value);
            return [];
        }
    }

    patchChargesData(charge: any) {
        if (charge.length > 0) this.chargesToggle = true;
        this.CF_2.chargesDetailList.clear;

        charge.forEach((elem: any, i: number) => {
            this.addChargesRow();
            this.CF_2.chargesDetailList.at(i).patchValue({
                charge_name: elem.charge_name,
                charges_amount: elem.amount,
                charges_hsn_id: elem.hsn_code_id,
                charges_rate: elem.tax_rate,
                charges_desc: elem.description,
                charge_name_id: elem?.charge_name_id
            });
        });
    }

    goBack() {
        this.location.back();
    }

    productList: any = [];

    getAllproduct() {
        // try {
        //     this.$crm.getAllproduct().subscribe(
        //         (response: any) => {
        //             if (response) {
        //                 this.productList = response.data;
        //                 this.getProductById(this.productList.id);
        //             }
        //         },
        //         (err) => {
        //             console.log(err);
        //         }
        //     );
        // } catch (error) {
        //     console.log(error);
        // }
    }

    getProductById(productId: any) {
        this._configurationalMasterService
            .getProductById(productId)
            .subscribe((res: any) => {
                console.log(res, 'aditya');

                this.proposalForm.patchValue({
                    hsn_code_id: res?.data?.hsn_code_id,
                });
            });
    }

    leadData: any = {};
    productDetailsData: any = [];
    productListDetailsRecord: any = [];
    getLeadData(id: any) {
        try {
            const data = {
                proposal_no: this.proposalForm?.value?.proposal_no,
            };

            this.$proposal.getProposalCompanyData(id, data).subscribe(
                (response: any) => {
                    if (!response) return;

                    const crmData = response?.data?.crmDetails || response?.crmDetails;
                    const leadData = response?.data || response?.responseObj || response;

                    this.schemeId = response?.scheme_id;

                    if (this.schemeId) {
                        this.disableApply = true;
                        this.onScheme = true;
                    }

                    if (crmData) {
                        this.schemeCalculation(crmData);
                    }

                    if (leadData?.productDetailList) {
                        this.productListDetailsRecord = leadData.productDetailList;
                        this.lead_id = leadData.id;
                    } else if (crmData) {
                        this.productListDetailsRecord = crmData;
                    }
                    if (response.responseObj && response?.companyData?.[0]) {
                        this.populateCompanyFields(response.companyData[0]);
                        this.handleShowHide(response);
                    } else if (leadData) {
                        this.setAllData(leadData);
                        this.handleShowHide(response);
                        this.populateCompanyFields(leadData);
                    }
                },
                (err) => console.error('Error fetching lead data:', err)
            );
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    }

    private populateCompanyFields(data: any): void {
        if (!data) return;

        this.proposalForm.patchValue({
            address: data.address ?? '',
            company_name: data.company_name ?? '',
            contact_person_name: data.contact_person_name ?? '',
            mail_id: data.mail_id ?? '',
            contact_number: data.contact_number ?? '',
        });

        const fieldsToReset = ['country_id', 'state_id', 'city_id', 'pincode', 'address'];
        fieldsToReset.forEach((field) => {
            const control = this.proposalForm.get(field);
            if (!control?.value) {
                control.enable();
                control.setValue('');
                control.updateValueAndValidity();
                control.markAsDirty();
            }
        });
    }

    getLeadDataCopy(id: any) {
        try {
            let data = {
                proposal_no: this.proposalForm?.value?.proposal_no,
            };
            this.$proposal.getProposalCompanyData(id, data).subscribe(
                (response: any) => {
                    if (response) {
                        let obj = response.data;
                        this.CF_1.productDetailList = this.patchData(response?.crmDetails);

                        this.schemeCalculation(response?.crmDetails);
                    }
                },
                (err) => {
                    console.log(err);
                }
            );
        } catch (error) {
            console.log(error);
        }
    }

    schemeCalculation(data: any) {
        let totalGrandAmount = 0;
        let totalGrandAmountOut = 0;
        data?.forEach((item: any) => {
            totalGrandAmount += Number(item?.scheme?.grand_in_total);
            if (item?.scheme?.substract_total === true) {
                totalGrandAmountOut += Number(item?.scheme?.grand_out_total);
            }
        });
        this.totalGrandAmount = Number(totalGrandAmount);
        this.totalGrandAmountOut = totalGrandAmountOut;
        this.calculateQuotationTotals();
    }

    getData: any;

    getProposalList() {
        try {
            let data = 'All Proposal';
            this.$proposal
                .getProposalList(this.proposalId, 'proposal_no', this.userLoginId, data, 'Quotation')
                .subscribe(
                    (response: any) => {
                        if (response) {
                            let obj = response.data;
                            this.status = obj?.proposal_status;
                            this.getData = obj;
                            this.setAllData(obj);
                            this.handleShowHide(obj);
                        }
                    },
                    (err) => {
                        console.log(err);
                    }
                );
        } catch (error) {
            console.log(error);
        }
    }

    getData1: any;
    getAllProductDetails: any = [];

    getAllDealClosedData() {
        try {
            this.$proposal
                .getClosedListData(
                    this.proposalId,
                    this.version_id,
                    this.proposalApprovalId
                )
                .subscribe(
                    (response: any) => {
                        if (response) {
                            let obj = response.data;
                            this.status = obj?.proposal_status;
                            this.getData = obj;


                            this.getAllProductDetails =
                                obj?.crmDetails ?? obj?.productDetailList;
                            this.setAllData(obj);
                            this.handleShowHide(obj);
                        }
                    },
                    (err) => {
                        console.log(err);
                    }
                );
        } catch (error) {
            console.log(error);
        }
    }

    lead_id: any;
    finalStatus: any;
    discountStatus: any;
    isSetCurrency: boolean = false;
    setAllData(obj: any) {

        this.discountStatus = obj?.discountStatus;
        this.finalStatus = obj?.finalStatus;
        let productDetailList = [];
        if (obj?.productDetailList) {
            productDetailList = obj?.productDetailList;
        }
        // else if(obj?.data?.dynamic_fields?.createLeadDetails){
        //   productDetailList = obj?.data?.dynamic_fields?.createLeadDetails;

        // }
        else {
            productDetailList = obj?.crmDetails;
        }

        this.CF_1.productDetailList = this.patchData(productDetailList);
        this.CF_1.copyProductDetailList = this.patchData(productDetailList);

        this.shippingToggle = obj?.is_same_as_shipping;

        // if (productDetailList.length && !this.proposalId2) {
        //     this.CF_1.productDetailList = this.patchData(productDetailList);
        //     this.CF_1.copyProductDetailList = this.patchData(productDetailList)
        // }

        this.getAllProductDetails = productDetailList;

        let charges = obj?.charges;
        if (charges) {
            this.patchChargesData(charges);
        }
        if (obj?.scheme_id) {
            this.isPromoApplied = true;
        }
        this.schemSelection(obj?.scheme_id);

        this.calculateQuotationTotals();

        this.deliveryTermUnloadings();
        if (obj?.insurance_id === 1) {
            this.isInsuranceAmt = true;
        }

        this.onDeliveryTermChange(obj?.delivery_term_id, 'Term');

        this.getAllShippingState(obj?.shippin_country_id);
        this.getAllShippingCity(obj?.state_id);

        this.proposalForm.patchValue({
            contact_person_id: obj?.contact_person_id,
            proposal_no: obj?.proposal_no
                ? obj?.proposal_no
                : this.generateRandomPropWithDate(),
            proposal_type_id: 2,
            company_name: obj?.company_name ?? obj?.data?.company_name,
            gst_no: obj?.gst_no,
            shipping_gst_in: obj?.shipping_gst_in,
            credit_days: null,
            // total_cost: obj?.total_cost,
            additional_charges: obj?.additional_charges ? obj?.additional_charges : 0,
            discount: obj?.discount,
            // paymentTC: obj?.paymentTC,
            profit_center_id: obj?.profit_center_id,
            cost_center_id: obj?.cost_center_id,
            end_date_pi: obj?.expiry_date,
            schedule_delivery_date: obj?.schedule_delivery_date,
            // taxable_value: obj?.taxable_value,
            // hsn_code_id:obj?.crmDetails?.MASTER_UOM?.hsn_code_id,
            // igst: obj?.crmDetails?.MASTER_UOM?.igst,
            grant_total: obj?.grant_total,
            // igst: obj?.igst,
            igst: obj?.gstTotal,
            totalAMTAfterDiscount: obj?.totalAMTAfterDiscount,
            grossTotal: obj?.grossTotal,
            schemeData: obj?.scheme_id,
            country_id: obj?.country_id,
            state_id: obj?.state_id,
            city_id: obj?.city_id,
            postal_address: obj?.postal_address,
            pincode: obj?.pincode,
            address: obj?.address,
            source_name:
                obj?.data?.source_name ??
                obj?.companyData?.[0]?.source_name ??
                obj?.source_name,
            // postal_address:postal_address,
            valid_till_date: obj?.valid_till_date,
            lead_source: obj?.lead_source_id,
            created_by: obj?.created_by,
            created_by_id: obj?.created_by_id,
            delivery_term_id: obj?.delivery_term_id,
            delivery_term_remark: obj?.dealer == 1 && obj?.delivery_term_id == 1 ? obj?.dealerName : obj?.delivery_term_remark,
            unloading_resp_id: obj?.unloading_resp_id,
            unloading_resp_remark: obj?.unloading_resp_remark,
            unloading_resp_amount: obj?.unloading_resp_amount,
            warranty_month: obj?.warranty_month,
            warranty_month_remark: obj?.warranty_month_remark,
            payment_main_id: obj?.payment_main_id,
            sub_payment_main_id: obj?.sub_payment_main_id,
            freight_id: obj?.freight_id,
            insurance_id: obj?.insurance_id,
            insurance_amt: obj?.insurance_amt,
            location_id: obj?.location_id,
            warehouse_id: obj?.warehouse_id,
            // sactioned_credit_limit: obj?.sactioned_credit_limit,
            // utilized_credit_limit: obj?.utilized_credit_limit,
            // sactioned_credit_period: obj?.sactioned_credit_period,
            // available_credit_limit: obj?.available_credit_limit,
            shipping_country_id: obj?.shipping_country_id ?? 101,
            shipping_state_id: obj?.shipping_state_id,
            shipping_city_id: obj?.shipping_city_id,
            shipping_postal_address: obj?.shipping_postal_address,
            shipping_address: obj?.shipping_address,
            shipping_pin_code: obj?.shipping_pin_code,
            is_same_as_shipping: obj?.is_same_as_shipping,
            billing_address_id: obj?.billing_address_id,
            shipping_address_id: obj?.shipping_address_id,
            advance_amount: obj?.advance_amount,
            advance_check: obj?.advance_check
            // sactioned_credit_limit: obj?.sactioned_credit_limit,
        });
        this.isSetCurrency = true;
        this.getCustomerCreditLimit(obj?.customer_id);

        this.isChecked = obj?.advance_check;
        this.fetchPinDetails();
        if (obj.contact_person_id) {
            this.proposalForm.get('contact_person_id').disable();
            this.proposalForm.get('contact_person_id').updateValueAndValidity();
        }
        // this.proposalForm.patchValue({ total_cost: obj?.total_cost });
        // if (this.actionType != 'create') {
        if (obj?.grant_total) {
            this.proposalForm.patchValue({ proposal_no: obj?.proposal_no });
        }

        if (obj?.email_status === "ACCEPTED" || obj?.email_status === "REJECTED") {
            this.emailCheckBtn = true;

        }

        if (obj?.created_by !== 'Self') {
            this.selectCreatedBy(obj?.created_by)
        }
        //this.paymentMainSubCategory(obj?.payment_main_id)
        this.selectLocation(obj?.location_id);
        //this.onUnloadingChange(obj?.unloading_resp_id,obj?.unloading_resp_remark);
    }

    proposalVersionListById() {
        try {
            let action_type;
            if (this.valueVersionId) {
                action_type = false;
            } else {
                action_type = true;
            }
            this.$proposal
                .proposalVersionListById(
                    this.versionId2 || this.version_id, this.proposalId2 || this.proposalId,
                    this.proposalApprovalId ? this.proposalApprovalId : '',
                    action_type, this.userLoginId
                )
                .subscribe(
                    (response: any) => {
                        if (response) {
                            this.fromCurrency = response?.data?.currency_id
                            this.currencyData = response?.currencyData
                            this._configurationalMasterService.currencyData.next({
                                currency_id: response.data?.currency_id
                            });
                            let obj = response.data;
                            this.savedQuotationCurrency = obj.Currency_Type;
                            this.savedQuotationCurrencyRate = obj.exchange_rate;
                            this.versionData = response.data
                            // this.status = obj?.proposal_status;
                            this.isDiscount = response.data?.proposalDiscount;
                            this.sales_documents = obj?.sales_documents[0]?.documents
                            this.schedule_delivery_date = obj?.schedule_delivery_date;
                            this.status = 'pending';
                            this.getData = obj;
                            this.client_id = response.data?.customer_id
                            this.getsCustomerAddress(this.client_id);
                            this.paymentDbList = this.versionData?.paymentDetails;
                            this.mergePayments();

                            if (obj.customer_id) {
                                this.getCustomerContactById(obj.customer_id);
                            }
                            // if(obj.dealer){
                            //     this.dealerByCustomer(obj.customer_id);
                            // }
                            if (this.getData?.scheme_id === null) {
                                this.checkSchemeStatusByClientCategory(response.data?.customer_id);
                            } else {
                                this.checkSchcme = true;
                            }

                            // if (this.routerParams?.status) {
                            //     if (this.getData?.scheme_id === null) {
                            //         this.checkSchcme = true
                            //     }
                            // }
                            const hasApplyScheme = obj?.productDetailList?.some((item: any) => item.apply_scheme === 1);

                            this.hasApplyScheme = hasApplyScheme
                            // obj.productDetailList= obj.productDetailList.filter((x:any)=>x.approvel_status!=='REJECTED');
                            this.setAllData(obj);
                            this.handleShowHide(obj);
                            // if (obj.contact_person_id) {
                            //   this.proposalForm
                            //     .get('contact_person_id')
                            //     .setValue(obj.contact_person_id || null);
                            // }
                        }
                    },
                    (err) => {
                        console.log(err);
                    }
                );
        } catch (error) {
            console.log(error);
        }
    }


    selectGstType(index: any) {
        let currentList = this.proposalForm?.controls?.['productDetailList']?.value;
        currentList[index] = {
            ...currentList[index],
            cgst: null,
            sgst: null,
            igst: null,
        };
        this.proposalForm.patchValue({
            productDetailList: currentList,
        });
        this.proposalForm.patchValue({
            cgst: 0,
            sgst: 0,
            igst: 0,
        });
    }

    // totalCGST: number = 0;
    // totalSGST: number = 0;
    // totalIGST: number = 0;
    // totalDiscount: number = 0;
    // totalCGSTPercent: number = 0;
    // totalSGSTPercent: number = 0;
    // totalIGSTPercent: number = 0;
    // grandTotal: number = 0;
    // formattedTotalCGST: any;
    // formattedTotalSGST: any;
    // formattedTotalIGST: any;
    // formattedTotalDiscount: any;
    // formattedGrandTotal: any;
    // formattedTotalCGSTPercent: any;
    // formattedTotalSGSTPercent: any;
    // formattedTotalIGSTPercent: any;
    // totalCGSTforAdditionalCharge: any;
    // totalSGSTforAdditionalCharge: any;
    // totalIGSTforAdditionalCharge: any;
    // totalAMTAfterDiscount: any;
    // grossTotal: any;

    // calculation for items
    // productCalculation() {

    //     let formObj = this.proposalForm?.value;
    //     let currentList = this.CF_1.productDetailList.value || [];
    //     3;
    //     let chargeList = this.CF_2.chargesDetailList.value || [];

    //     this.totalCGST = 0;
    //     this.totalSGST = 0;
    //     this.totalIGST = 0;
    //     this.totalDiscount = 0;
    //     this.grandTotal = 0;

    //     this.totalCGSTPercent = 0;
    //     this.totalSGSTPercent = 0;
    //     this.totalIGSTPercent = 0;

    //     const additionalCharges = parseFloat(formObj?.additional_charges) || 0;
    //     let totalAMTwithout: any = 0;
    //     const rate = Number(this.selectedCurrency?.rate || 1);
    //     currentList.forEach((item: any) => {
    //         const qty = Number(item?.qty);
    //         let discountPercent;
    //         //          const originalPrice = Number(item?.max_price || 0);
    //         // const pricePerUnit =this.selectedCurrency?.Currency_Type === 'INR'? originalPrice: originalPrice * rate;
    //         const pricePerUnit = Number(item?.price_per_unit);
    //         if (!item.discount_approved) {
    //             discountPercent = Number(item?.maximum_discount) || 0;
    //         } else {
    //             discountPercent = Number(item?.discount_approved) || 0;
    //         }
    //         const cgstPercent = Number(item?.cgst) || 0;
    //         const sgstPercent = Number(item?.sgst) || 0;
    //         const igstPercent = Number(item?.igst) || 0;

    //         const totalPrice = qty * pricePerUnit;
    //         const discountAmount = 0;//(totalPrice * discountPercent) / 100;
    //         const discountedPrice = totalPrice - discountAmount;
    //         totalAMTwithout += discountedPrice;
    //         const cgstAmount = (cgstPercent * discountedPrice) / 100;
    //         const sgstAmount = (sgstPercent * discountedPrice) / 100;
    //         const igstAmount = (igstPercent * discountedPrice) / 100;

    //         this.totalCGST += cgstAmount;
    //         this.totalSGST += sgstAmount;
    //         this.totalIGST += igstAmount;
    //         this.totalDiscount += discountAmount;
    //         this.grandTotal += discountedPrice + cgstAmount + sgstAmount + igstAmount;

    //         this.totalCGSTPercent += cgstPercent;
    //         this.totalSGSTPercent += sgstPercent;
    //         this.totalIGSTPercent += igstPercent;
    //     });
    //     this.totalAMTAfterDiscount = totalAMTwithout;
    //     this.grossTotal = totalAMTwithout;
    //     this.grandTotal += additionalCharges;

    //     this.formattedTotalCGST = this.totalCGST.toFixed(2);
    //     this.formattedTotalSGST = this.totalSGST.toFixed(2);
    //     this.formattedTotalIGST = this.totalIGST.toFixed(2);
    //     this.formattedTotalDiscount = this.totalDiscount.toFixed(2);
    //     this.formattedGrandTotal = this.grandTotal.toFixed(2);

    //     this.formattedTotalCGSTPercent = this.totalCGSTPercent.toFixed(2);
    //     this.formattedTotalSGSTPercent = this.totalSGSTPercent.toFixed(2);
    //     this.formattedTotalIGSTPercent = this.totalIGSTPercent.toFixed(2);

    //     this.totalCGSTforAdditionalCharge =
    //         (this.totalCGSTPercent * additionalCharges) / 100;
    //     this.totalSGSTforAdditionalCharge =
    //         (this.totalSGSTPercent * additionalCharges) / 100;
    //     this.totalIGSTforAdditionalCharge =
    //         (this.totalIGSTPercent * additionalCharges) / 100;

    //     this.totalCGST += this.totalCGSTforAdditionalCharge;
    //     this.totalSGST += this.totalSGSTforAdditionalCharge;
    //     this.totalIGST += this.totalIGSTforAdditionalCharge;

    //     this.formattedTotalCGST = this.totalCGST.toFixed(2);
    //     this.formattedTotalSGST = this.totalSGST.toFixed(2);
    //     this.formattedTotalIGST = this.totalIGST.toFixed(2);

    //     this.grandTotal +=
    //         this.totalCGSTforAdditionalCharge +
    //         this.totalSGSTforAdditionalCharge +
    //         this.totalIGSTforAdditionalCharge;
    //     const totalGrandAmount = Number(this.totalGrandAmount) || 0;
    //     const totalGrandAmountOut = Number(this.totalGrandAmountOut) || 0;

    //     this.formattedGrandTotal =
    //         parseFloat(this.grandTotal.toFixed(2)) +
    //         totalGrandAmount -
    //         totalGrandAmountOut;

    //     // let totalAdditionalCharges = 0;
    //     // let totalGSTonCharges = 0;
    //     // chargeList.forEach((charge: any) => {
    //     //     const chargeAmount = Number(charge?.charges_amount) || 0;
    //     //     const chargeRate = Number(charge?.charges_rate) || 0;

    //     //     totalAdditionalCharges += chargeAmount;
    //     //     totalGSTonCharges += (chargeAmount * chargeRate) / 100;
    //     // });

    //     // this.totalCalculateGrand_total = this.formattedGrandTotal + totalAdditionalCharges;
    //     // this.gstCalculateTotal = parseFloat(this.formattedTotalIGST) + totalGSTonCharges

    //     // if (!this.isEdit && !this.proposalId2) {
    //     //     this.proposalForm.patchValue({
    //     //         // total_cost: (this.grandTotal - additionalCharges).toFixed(2),
    //     //         discount: this.formattedTotalDiscount,
    //     //         cgst: this.formattedTotalCGST,
    //     //         sgst: this.formattedTotalSGST,
    //     //         // igst: parseFloat(this.formattedTotalIGST) + totalGSTonCharges,
    //     //         // grant_total: this.formattedGrandTotal + totalAdditionalCharges,
    //     //         igst: parseFloat(this.formattedTotalIGST),
    //     //         grant_total: this.formattedGrandTotal,
    //     //         totalAMTAfterDiscount: this.totalAMTAfterDiscount,
    //     //         grossTotal: this.grossTotal,
    //     //     });
    //     // }
    //     // if (this.selectedCurrency && this.actionType) {
    //     //     this.proposalForm.patchValue({
    //     //         // total_cost: (this.grandTotal - additionalCharges).toFixed(2),
    //     //         discount: this.formattedTotalDiscount,
    //     //         cgst: this.formattedTotalCGST,
    //     //         sgst: this.formattedTotalSGST,
    //     //         // igst: parseFloat(this.formattedTotalIGST) + totalGSTonCharges,
    //     //         // grant_total: this.formattedGrandTotal + totalAdditionalCharges,
    //     //         igst: parseFloat(this.formattedTotalIGST),
    //     //         grant_total: this.formattedGrandTotal,
    //     //         totalAMTAfterDiscount: this.totalAMTAfterDiscount,
    //     //         grossTotal: this.grossTotal,
    //     //     });
    //     // }
    // }

    // Calculate items, bom, customization and branding totals
    calculateQuotationTotals() {

        const rate = Number(this.selectedCurrency?.rate || 1);

        // start update item grid
        this.CF_1.productDetailList.controls.forEach((row: any) => {

            const maxPrice = Number(row.get('original_max_price')?.value || 0);
            const minPrice = Number(row.get('original_min_price')?.value || 0);
            const pricePerUnit = Number(row.get('original_price_per_unit')?.value || 0);

            row.patchValue({ price_per_unit: this.selectedCurrency.Currency_Type === 'INR' ? pricePerUnit : pricePerUnit * rate }, { emitEvent: false });
            row.patchValue({ min_price: this.selectedCurrency.Currency_Type === 'INR' ? minPrice : minPrice * rate }, { emitEvent: false });
            row.patchValue({ max_price: this.selectedCurrency.Currency_Type === 'INR' ? maxPrice : maxPrice * rate }, { emitEvent: false });

            // -------- Flat Discount 1 --------
            if (!row.get('original_discount1Flat')) {
                const value = Number(row.get('discount1Flat')?.value || 0);
                row.addControl(
                    'original_discount1Flat',
                    new FormControl(
                        this.savedQuotationCurrency === 'INR'
                            ? value
                            : value / Number(this.savedQuotationCurrencyRate)
                    )
                );
            }

            // -------- Flat Discount 2 --------
            if (!row.get('original_discount2Flat')) {
                const value = Number(row.get('discount2Flat')?.value || 0);
                row.addControl(
                    'original_discount2Flat',
                    new FormControl(
                        this.savedQuotationCurrency === 'INR'
                            ? value
                            : value / Number(this.savedQuotationCurrencyRate)
                    )
                );
            }

            // -------- Flat Discount 3 --------
            if (!row.get('original_discount3Flat')) {
                const value = Number(row.get('discount3Flat')?.value || 0);
                row.addControl(
                    'original_discount3Flat',
                    new FormControl(
                        this.savedQuotationCurrency === 'INR'
                            ? value
                            : value / Number(this.savedQuotationCurrencyRate)
                    )
                );
            }

            row.patchValue({
                discount1Flat:
                    this.selectedCurrency.Currency_Type === 'INR'
                        ? Number(row.get('original_discount1Flat')?.value || 0)
                        : Number(row.get('original_discount1Flat')?.value || 0) * Number(this.selectedCurrency.rate),

                discount2Flat:
                    this.selectedCurrency.Currency_Type === 'INR'
                        ? Number(row.get('original_discount2Flat')?.value || 0)
                        : Number(row.get('original_discount2Flat')?.value || 0) * Number(this.selectedCurrency.rate),

                discount3Flat:
                    this.selectedCurrency.Currency_Type === 'INR'
                        ? Number(row.get('original_discount3Flat')?.value || 0)
                        : Number(row.get('original_discount3Flat')?.value || 0) * Number(this.selectedCurrency.rate)

            }, { emitEvent: false });
        });

        // end update item grid

        const products = this.proposalForm.getRawValue().productDetailList;

        const totals = {
            gross: 0,
            gst: 0,
            offerAmount: 0,
            discount: 0,
            grand: 0
        };

        products.forEach((product: any) => {

            // -------- Items --------
            if (product.promo_item == null || product.promo_item == 0) { // without scheme items
                // -------- Total Discount Amount Item --------
                if (product.original_totalDiscountAmountItem == null) {
                    const value = Number(product.totalDiscountAmountItem || 0);
                    product.original_totalDiscountAmountItem =
                        this.savedQuotationCurrency === 'INR'
                            ? value
                            : value / Number(this.savedQuotationCurrencyRate);
                }

                product.totalDiscountAmountItem =
                    this.selectedCurrency.Currency_Type === 'INR'
                        ? Number(product.original_totalDiscountAmountItem)
                        : Number(product.original_totalDiscountAmountItem) * Number(this.selectedCurrency.rate);


                // -------- Total Discount Amount Per Qty --------
                if (product.original_totalDiscountAmountPerQTY == null) {
                    const value = Number(product.totalDiscountAmountPerQTY || 0);
                    product.original_totalDiscountAmountPerQTY =
                        this.savedQuotationCurrency === 'INR'
                            ? value
                            : value / Number(this.savedQuotationCurrencyRate);
                }

                product.totalDiscountAmountPerQTY =
                    this.selectedCurrency.Currency_Type === 'INR'
                        ? Number(product.original_totalDiscountAmountPerQTY)
                        : Number(product.original_totalDiscountAmountPerQTY) * Number(this.selectedCurrency.rate);

                const qty = Number(product.qty || 0);
                const price = Number(product.price_per_unit || 0);
                const gstPercent = Number(product.igst || 0);
                const discount = product.totalDiscountAmountItem;

                const gross = (qty * price) - discount;
                const gst = (gross * gstPercent) / 100;

                totals.gross += gross;
                totals.gst += gst;
                totals.offerAmount += gross;
                totals.discount += discount;
                totals.grand += gross + gst;
            }

            // const gross = Number(product.totalPrice || 0);
            // const gst = Number(product.totalWithGst || 0) - gross;
            // const discount = Number(product.totalDiscountAmountItem || 0);

            // totals.gross += gross;
            // totals.gst += gst;
            // totals.offerAmount += gross;
            // totals.discount += discount;
            // totals.grand += gross + gst;

            // -------- BOM --------
            if (product.bomArray?.length) {
                product.bomArray.forEach((bom: any) => {
                    // Base INR value
                    if (bom.original_price_per_unit == null) {
                        if (this.savedQuotationCurrency === 'INR') {
                            bom.original_price_per_unit = Number(bom.price_per_unit || 0);
                        } else {
                            // USD/CNY -> INR
                            bom.original_price_per_unit =
                                Number(bom.price_per_unit || 0) / Number(this.savedQuotationCurrencyRate);
                        }
                    }

                    // Display
                    if (this.selectedCurrency.Currency_Type === 'INR') {
                        bom.price_per_unit = Number(bom.original_price_per_unit);
                    } else {
                        // INR -> Selected Currency
                        bom.price_per_unit =
                            Number(bom.original_price_per_unit) * Number(this.selectedCurrency.rate);
                    }

                    if (bom.discountType == 'flat') {
                        // Base INR value
                        if (bom.original_discount == null) {
                            if (this.savedQuotationCurrency === 'INR') {
                                bom.original_discount = Number(bom.discount || 0);
                            } else {
                                // USD/CNY -> INR
                                bom.original_discount =
                                    Number(bom.discount || 0) / Number(this.savedQuotationCurrencyRate);
                            }
                        }

                        // Display
                        if (this.selectedCurrency.Currency_Type === 'INR') {
                            bom.discount = Number(bom.original_discount);
                        } else {
                            // INR -> Selected Currency
                            bom.discount =
                                Number(bom.original_discount) * Number(this.selectedCurrency.rate);
                        }
                    }

                    // -------- Total Discount Amount --------
                    if (bom.original_totalDiscountAmount == null) {
                        const value = Number(bom.totalDiscountAmount || 0);
                        bom.original_totalDiscountAmount =
                            this.savedQuotationCurrency === 'INR'
                                ? value
                                : value / Number(this.savedQuotationCurrencyRate);
                    }

                    bom.totalDiscountAmount =
                        this.selectedCurrency.Currency_Type === 'INR'
                            ? Number(bom.original_totalDiscountAmount)
                            : Number(bom.original_totalDiscountAmount) * Number(this.selectedCurrency.rate);

                    const qty = Number(bom.qty || 0);
                    const discount = bom.totalDiscountAmount;
                    const gstPercent = Number(bom.gst || 0);

                    const gross = (qty * bom.price_per_unit) - discount;
                    const gst = (gross * gstPercent) / 100;

                    bom.total_price = gross;
                    bom.totalWithGst = gross + gst;

                    totals.gross += gross;
                    totals.gst += gst;
                    totals.offerAmount += gross;
                    totals.discount += discount;
                    totals.grand += gross + gst;

                    // const gross = Number(bom.total_price || 0);
                    // const gst = Number(bom.totalWithGst || 0) - gross;
                    // const discount = Number(bom.totalDiscountAmount || 0);

                    // totals.gross += gross;
                    // totals.gst += gst;
                    // totals.offerAmount += gross;
                    // totals.discount += discount;
                    // totals.grand += gross + gst;
                });
            }

            // -------- Customization & Branding --------
            if (Array.isArray(product.custom_branding)) {
                product.custom_branding.forEach((cb: any) => {
                    // Accessories / Baskets
                    if (Array.isArray(cb.customisation_data)) {
                        cb.customisation_data.forEach((cust: any) => {
                            // Base INR value
                            if (cust.original_price_per_unit == null) {
                                if (this.savedQuotationCurrency === 'INR') {
                                    cust.original_price_per_unit = Number(cust.price_per_unit || 0);
                                } else {
                                    // USD/CNY -> INR
                                    cust.original_price_per_unit =
                                        Number(cust.price_per_unit || 0) / Number(this.savedQuotationCurrencyRate);
                                }
                            }

                            // Display
                            if (this.selectedCurrency.Currency_Type === 'INR') {
                                cust.price_per_unit = Number(cust.original_price_per_unit);
                            } else {
                                // INR -> Selected Currency
                                cust.price_per_unit =
                                    Number(cust.original_price_per_unit) * Number(this.selectedCurrency.rate);
                            }

                            let discountActual = cust.discount1 || cust.discount;
                            if (cust.discountType1 == 'flat') {
                                // Base INR value
                                if (cust.original_discount == null) {
                                    if (this.savedQuotationCurrency === 'INR') {
                                        cust.original_discount = Number(discountActual || 0);
                                    } else {
                                        // USD/CNY -> INR
                                        cust.original_discount =
                                            Number(discountActual || 0) / Number(this.savedQuotationCurrencyRate);
                                    }
                                }

                                // Display
                                if (this.selectedCurrency.Currency_Type === 'INR') {
                                    cust.discount1 = Number(cust.original_discount);
                                } else {
                                    // INR -> Selected Currency
                                    cust.discount1 =
                                        Number(cust.original_discount) * Number(this.selectedCurrency.rate);
                                }
                            }

                            // -------- Total Discount Amount --------
                            if (cust.original_totalDiscountAmount == null) {
                                const value = Number(cust.totalDiscountAmountItem || 0);
                                cust.original_totalDiscountAmount =
                                    this.savedQuotationCurrency === 'INR'
                                        ? value
                                        : value / Number(this.savedQuotationCurrencyRate);
                            }

                            cust.totalDiscountAmountItem =
                                this.selectedCurrency.Currency_Type === 'INR'
                                    ? Number(cust.original_totalDiscountAmount)
                                    : Number(cust.original_totalDiscountAmount) * Number(this.selectedCurrency.rate);

                            const qty = Number(cust.qty || 0);
                            const discount = cust.totalDiscountAmountItem;
                            const gstPercent = Number(cust.gst || 0);

                            const gross = (qty * cust.price_per_unit) - discount;
                            const gst = (gross * gstPercent) / 100;

                            cust.total_price = gross;
                            cust.totalWithGst = gross + gst;

                            totals.gross += gross;
                            totals.gst += gst;
                            totals.offerAmount += gross;
                            totals.discount += discount;
                            totals.grand += gross + gst;

                            // const gross = Number(cust.totalPrice || 0);
                            // const gst = (gross * Number(cust.gst || 0)) / 100;
                            // const discount = Number(cust.totalDiscountAmount || 0);

                            // totals.gross += gross;
                            // totals.gst += gst;
                            // totals.offerAmount += gross;
                            // totals.discount += discount;
                            // totals.grand += gross + gst;
                        });
                    }
                    // Branding
                    if (cb.branding_data) {
                        let cbData = cb.branding_data;
                        // Base INR value
                        if (cbData.original_price_per_unit == null) {
                            if (this.savedQuotationCurrency === 'INR') {
                                cbData.original_price_per_unit = Number(cbData.branding_amt || 0);
                            } else {
                                // USD/CNY -> INR
                                cbData.original_price_per_unit =
                                    Number(cbData.branding_amt || 0) / Number(this.savedQuotationCurrencyRate);
                            }
                        }

                        // Display
                        if (this.selectedCurrency.Currency_Type === 'INR') {
                            cbData.branding_amt = Number(cbData.original_price_per_unit);
                        } else {
                            // INR -> Selected Currency
                            cbData.branding_amt =
                                Number(cbData.original_price_per_unit) * Number(this.selectedCurrency.rate);
                        }

                        let discountActual = cbData.discount1 || cbData.discount;
                        if (cbData.discountType1 == 'flat') {
                            // Base INR value
                            if (cbData.original_discount == null) {
                                if (this.savedQuotationCurrency === 'INR') {
                                    cbData.original_discount = Number(discountActual || 0);
                                } else {
                                    // USD/CNY -> INR
                                    cbData.original_discount =
                                        Number(discountActual || 0) / Number(this.savedQuotationCurrencyRate);
                                }
                            }

                            // Display
                            if (this.selectedCurrency.Currency_Type === 'INR') {
                                cbData.discount1 = Number(cbData.original_discount);
                            } else {
                                // INR -> Selected Currency
                                cbData.discount1 =
                                    Number(cbData.original_discount) * Number(this.selectedCurrency.rate);
                            }
                        }

                        // -------- Total Discount Amount --------
                        if (cbData.original_totalDiscountAmount == null) {
                            const value = Number(cbData.totalDiscountAmountItem || 0);
                            cbData.original_totalDiscountAmount =
                                this.savedQuotationCurrency === 'INR'
                                    ? value
                                    : value / Number(this.savedQuotationCurrencyRate);
                        }

                        cbData.totalDiscountAmountItem =
                            this.selectedCurrency.Currency_Type === 'INR'
                                ? Number(cbData.original_totalDiscountAmount)
                                : Number(cbData.original_totalDiscountAmount) * Number(this.selectedCurrency.rate);

                        const qty = Number(cbData.qty || 0);
                        const discount = cbData.totalDiscountAmountItem;
                        const gstPercent = Number(cbData.gst || 0);

                        const gross = (qty * cbData.branding_amt) - discount;
                        const gst = (gross * gstPercent) / 100;

                        cbData.totalPrice = gross;
                        cbData.totalWithGst = gross + gst;

                        totals.gross += gross;
                        totals.gst += gst;
                        totals.offerAmount += gross;
                        totals.discount += discount;
                        totals.grand += gross + gst;

                        // const gross = Number(cb.branding_data.totalPrice || 0);
                        // const gst = (gross * Number(cb.branding_data.gst || 0)) / 100;
                        // const discount = Number(cb.branding_data.totalDiscountAmount || 0);

                        // totals.gross += gross;
                        // totals.gst += gst;
                        // totals.offerAmount += gross;
                        // totals.discount += discount;
                        // totals.grand += gross + gst;
                    }
                });
            }
        });

        // Discount after all items
        const totalDiscount = (this.isDiscount || []).reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);

        this.proposalForm.patchValue({
            // discount: totals.discount,
            discount: Number(totals.discount || 0) + totalDiscount,
            cgst: totals.gst,
            sgst: totals.gst,
            igst: totals.gst.toFixed(2),
            grossTotal: totals.gross.toFixed(2),
            // totalAMTAfterDiscount: totals.offerAmount.toFixed(2),
            // grant_total: totals.grand.toFixed(2)
            totalAMTAfterDiscount: (Number(totals.offerAmount) - totalDiscount).toFixed(2),
            grant_total: (Number(totals.grand) - totalDiscount).toFixed(2)
        });
    }

    onQtyChanged(event: any, index: number) {
        const qty = Number(event.target.value) || 0;

        const productArray = this.proposalForm.get('productDetailList') as FormArray;
        const productGroup = productArray.at(index) as FormGroup;

        const price = Number(productGroup.get('price_per_unit')?.value || 0);
        const gstPercent = Number(productGroup.get('igst')?.value || 0);

        const gross = qty * price;
        const gst = (gross * gstPercent) / 100;
        const totalWithGst = gross + gst;

        // update data in FormArray 
        productGroup.patchValue({
            qty,
            totalPrice: gross,
            totalWithGst
        });

        // force validation/UI refresh
        this.proposalForm.updateValueAndValidity();
        this.removeCustomizationBrandingBOM(index);
    }

    keyPress(event: Event | any, index: any) {

        const key = event.key;
        if (key === '+' || key === '-') {
            event.preventDefault();
        }
        this.isEdit = false;
    }

    dialogOpen() {
        let productDetailList = this.CF_1.productDetailList.value;

        let updatedProposalValue: any = {
            ...this.proposalForm?.value, // baaki saare properties waise hi rahenge
            productDetailList: productDetailList, // bas productDetailList replace kar denge
        };

        // Update the value (note: agar Angular form hai, directly value update karna won't reflect in form controls)
        this.proposalForm.value = updatedProposalValue;

        if (this.proposalForm?.value?.productDetailList?.length) {
            const dialogRef = this.dialog.open(AssignProposalDialogComponent, {
                width: '2000px',
                data: {
                    value: this.proposalForm?.value,
                    productList: this.productData[0],
                    create_lead_id: this.getData?.create_lead_id,
                    existing: 'existing',
                },
            });

            dialogRef.afterClosed().subscribe((result) => {
            });
        }
    }

    proposalId2: any;
    versionId2: any;
    discountPopup() {
        let data = this.proposalForm?.value;
        data.customer_id = this.client_id;
        let formValue = this.proposalForm?.getRawValue();
        formValue.customer_id = this.client_id;
        formValue.id = this.proposalId;
        formValue.type = this.actionType;
        formValue.version_id = this.version_id;
        formValue.create_lead_id = this.getData?.create_lead_id;

        if (this.existing_type === 'existing_client') {
            data.existing_client = true;
            data.customer_id = this.client_id;
            formValue.customer_id = this.client_id;
        }

        if (this.actionType === 'edit' || this.routerParams?.status === "clone") {
            data.id = this.proposalId;
            data.create_lead_id = this.getData?.create_lead_id;
            data.type = 'edit';
            // formValue = this.proposalForm?.value;
        }
        if (this.proposalForm?.value?.productDetailList?.length) {

            localStorage.setItem('itemListForDiscount', JSON.stringify(this.proposalForm?.value?.productDetailList));

            if (this.versionId2) {
                data.isPreview = true;
                data.id = this.proposalId2;
                data.type = 'edit';
                data.changed = true;
                data.isPreviewVersion = this.versionId2;
            }

            if (this.routerParams?.status === "performance") {
                data.proformaStatus = true;
                data.expiry_date = moment(this.proposalForm.value.end_date_pi).format("YYYY-MM-DD");
                data.is_so_created = true;
                data.login_id = this.userLoginId;
                // formValue = this.proposalForm?.value;
            }
            if (this.routerParams?.status === "performance" && !this.routerParams?.actionType) {
                formValue = this.proposalForm?.getRawValue();
            }
            data.version_id = this.version_id;

            const items = formValue.productDetailList || [];
            const invalidItem = items.find((item: any) => !item.qty || item.qty <= 0);

            if (invalidItem) {
                this.toast.error("Please enter quantity for all items.");
                return; // stop further execution
            }

            if (this.quotationType) {
                formValue['quotationType'] = this.quotationType;
                data.id = this.proposalId;
            }

            formValue.pi = this.pi;
            if (this.routerParams?.status == 'Edit SB') {
                // formValue = this.proposalForm?.value;
                data.id = this.proposalId;
                formValue.isSalesBooking = this.routerParams?.status;
            }
            // formValue.dealer = this.routerParams?.dealer=='true' ||this.routerParams?.dealer ?true:false;
            formValue.dealer = (
                this.routerParams?.dealer === 'true' ||
                !isNaN(Number(this.routerParams?.dealer))
            ) ? true : false;

            console.log(formValue, "____DISCOUNTPOPUPLIST", data)
            const dialogRef = this.dialog.open(QuotationCalculationComponent, {
                width: '2000px',
                disableClose: true,
                data: {
                    value: formValue,
                    // productList: this.productData[0],
                    // create_lead_id: this.getData?.create_lead_id,
                    existing_type: this.existing_type,
                    isDiscount: this.isDiscount,
                    exitProposalData: data,
                    pageMode:
                        this.actionType === 'approval'
                            ? 'view'
                            : (this.actionType ?? 'view'),
                    pageModeURL: this.pageModeURL,
                    PaymentArray: this.finalPaymentArray,
                    selectedCurrency: this.selectedCurrency,
                    fromCurrencyId: this.fromCurrencyId
                },
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result) {

                    this.proposalId2 = result?.res?.data?.proposal_id;
                    this.versionId2 = result?.res?.data.version_id;
                    if (result?.res?.data?.proposal_id && result?.res?.data?.version_id) {
                        this.proposalVersionListById();
                    }
                    this.$proposal.currentData.subscribe((data: any) => {
                        this.proposalForm.get('totalAMTAfterDiscount')?.patchValue(result?.data.finalGrossAfterDiscount);
                        this.proposalForm.get('grossTotal')?.patchValue(result?.data.grossTotal);
                        this.proposalForm.get('igst')?.patchValue(result?.data.gstTotal);
                        this.proposalForm.get('grant_total')?.patchValue(result?.data?.finalGrandTotal);

                    });
                }
            });
        }
    }

    advanceDetails: any;
    manageAdvancePopup() {

        let data = this.proposalForm?.value;
        data.customer_id = this.client_id;
        let formValue;
        formValue = this.proposalForm?.getRawValue();
        const dialogRef = this.dialog.open(ManageAdvanceComponent, {
            width: '95vw',
            maxWidth: '95vw',
            maxHeight: '90vh',
            disableClose: true,
            data: {
                value: formValue,
                customer_id: this.client_id,

                selectedCurrency: this.selectedCurrency,
                fromCurrency: this.fromCurrency,
                currencyDataList: this.currencyData,
                advanceDetails: this.advanceDetails
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {

                this.advanceDetails = result;
            }
        });

    }

    selectedMultipleFiles: any[] = [];
    uploadMultipleDocuments() {
        // if(this.type=='WithPO'){
        //     this.actionType=this.type;
        // }
        let proposalId = this.proposalId || this.proposalId2 || null;
        let versionId = this.version_id || this.versionId2 || null;
        if (proposalId && versionId) {
            const dialogRef = this.dialog.open(UploadDocumentsComponent, {
                width: '2000px',
                disableClose: true,
                data: {
                    proposalId: proposalId,
                    versionId: versionId,
                    pageMode: this.actionType ?? 'view',
                    files: this.selectedMultipleFiles
                },
            });

            dialogRef.afterClosed().subscribe((files: any[]) => {
                if (files) {
                    this.selectedMultipleFiles = files;   // store from dialog
                    console.log("Files from Dialog:", this.selectedMultipleFiles);
                }
            });
        } else {
            this.toast.error('Please create the quotation first.');
        }
    }

    upsellCreate() {
        Swal.fire({
            title: `You want to do Up-Sell ${'<br>'} Product Price`,
            icon: 'question',
            showCancelButton: true,
            cancelButtonColor: '#f44336',
            confirmButtonColor: '#3f51b5',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                let currentList = this.proposalForm?.value?.productDetailList;
                currentList?.map((item: any) => (item.readonly = false));
                this.proposalForm.patchValue({
                    productDetailList: currentList,
                });
            }
        });
    }

    formObj: any = {};

    updateProposalStatus(statusType: any) {
        this.proposalForm?.value?.productDetailList?.map(
            (item: any, index: number) => {
                const discountApproved = Number(item?.discount_approved);
                const maximumDiscount = Number(item?.maximum_discount);
                const discountRequest = Number(item?.discount_request);

                let approvalRemark = this.proposalForm?.value?.approvalRemark;
                let list: any = [];
                this.proposalForm?.value?.productDetailList?.map((item: any) => {
                    list.push({
                        id: Number(item?.id),
                        discount_approved: Number(item?.discount_approved),
                    });
                });
                if (!approvalRemark) {
                    return this.toast.error('Remark is required');
                }
                let data = {
                    ...this.proposalForm.value,
                    remark: approvalRemark,
                    id: this.proposalId,
                    proposal_approval_id: this.proposalApprovalId,
                    proposal_status: statusType == 'AP' ? 'approved' : 'rejected',
                };
                this.$proposal.updateProposalStatus(data).subscribe(
                    (res: any) => {
                        if (res) {
                            this.toast.success(res.message);
                            this.goBack();
                        }
                    },
                    (err) => {
                        if (err.status == 400) {
                            this.toast.error('Something went Wrong');
                        } else if (err.status == 403) {
                            this.toast.error('Already Exits!');
                        } else {
                            this.toast.error('Something went Wrong');
                        }
                    }
                );
                // }
            }
        );
    }

    forword() {
        this.proposalForm?.value?.productDetailList?.map(
            (item: any, index: number) => {
                let approvalRemark = this.proposalForm?.value?.approvalRemark;
                let list: any = [];
                this.proposalForm?.value?.productDetailList?.map((item: any) => {
                    list.push({
                        id: Number(item?.id),
                        discount_approved: Number(item?.discount_approved),
                    });
                });
                if (!approvalRemark) {
                    return this.toast.error('Remark is required');
                }
                let data = {
                    ...this.proposalForm.value,
                    remark: approvalRemark,
                    id: this.proposalId,
                    proposal_approval_id: this.proposalApprovalId,
                    proposal_status: 'FORWARD',
                };
                this.$proposal.updateProposalStatus(data).subscribe(
                    (res: any) => {
                        if (res) {
                            this.toast.success(res.message);
                            this._router.navigate([`master/sales/all-proposal`]);
                        }
                    },
                    (err) => {
                        if (err.status == 400) {
                            this.toast.error('Something went Wrong');
                        } else if (err.status == 403) {
                            this.toast.error('Already Exits!');
                        } else {
                            this.toast.error('Something went Wrong');
                        }
                    }
                );
            }
        );
    }

    setReceivedAmount(receivedAmt: any) {
        this.proposalForm.patchValue({
            total_received: receivedAmt,
        });
    }

    // Make invoice start
    showInvoice: boolean = false;
    defferentAddress: boolean = false;
    invoiceAddress: boolean = false;
    branchObj: any = {};

    makeInvoice() {
        this.showInvoice = true;
    }

    backInvoice() {
        this.showInvoice = false;
        this.invoiceAddress = false;
        this.resetAddressUpdateForm();
    }

    defferentAddressChange() {
        this.defferentAddress = !this.defferentAddress;
    }

    resetAddressUpdateForm() {
        this.invoiceAddressForm.reset();
        this.branchObj = {};
    }

    branchList: any = [];

    branchSetup_get() {
        try {
            this.$crm.branchSetup_get().subscribe(
                (response: any) => {
                    if (response) {
                        this.branchList = response.data?.filter(
                            (elem: any) => elem?.billing_status == 1
                        );
                        this.locationList = response.data
                    }
                },
                (err) => {
                    console.log(err);
                }
            );
        } catch (error) {
            console.log(error);
        }
    }

    backFromViewInvoice() {
        this.actionType = this.routerParams?.actionType;
        this.showInvoice = true;
        this.invoiceAddress = false;
        this.resetAddressUpdateForm();
    }

    viewInvoice() {
        this.branchObj = this.branchList?.find(
            (elem: any) => elem?.id == this.invoiceAddressForm?.value?.branch_id
        );
        if (this.invoiceAddressForm.status === 'INVALID') {
            return this.toast.error(
                'Required fields should not be empty',
                'Fields Error'
            );
        }
        this.getLeadData(this.proposalId);
        if (this.defferentAddress) {
            this.updateAddress();
            this.getUpdatedAddress();
        } else {
            this.showInvoice = false;
            this.defferentAddress = false;
            this.invoiceAddress = true;
            this.actionType = '';
        }
    }

    updateAddress() {
        try {
            let req = this.invoiceAddressForm?.value;
            req.branch_id = this.branchObj?.id;
            req.proposal_id = this.proposalId;
            this.$proposal.createBilling(req).subscribe(
                (response: any) => {
                    if (response) {
                        this.toast.success(response.message);
                        this.showInvoice = false;
                        this.defferentAddress = false;
                        this.invoiceAddress = true;
                        this.actionType = '';
                    }
                },
                (err) => {
                    console.log(err);
                }
            );
        } catch (error) {
            console.log(error);
        }
    }

    getUpdatedAddress() {
        try {
            this.$proposal.getUpdatedAddress().subscribe(
                (response: any) => {
                    if (response) {
                        let obj = response?.data;
                        this.branchObj = {
                            ...obj,
                            ...this.branchObj,
                            branch_address: obj?.complete_address,
                            billing_id: obj?.id,
                        };
                    }
                },
                (err) => {
                    console.log(err);
                }
            );
        } catch (error) {
            console.log(error);
        }
    }

    saveInvoice() {
        try {
            let req = {
                proposal_id: this.proposalId,
                billing_id: this.branchObj?.billing_id,
                invoice_remark: this.proposalForm?.value?.invoice_remark,
            };
            this.$proposal.createInvoice(req).subscribe(
                (response: any) => {
                    if (response) {
                        this.isInvoiceSubmitted = true;
                        this.toast.success(response.message);
                        this.invoiceAddress = false;
                        this.actionType = this.routerParams?.actionType;
                        this.resetAddressUpdateForm();
                    }
                },
                (err) => {
                    console.log(err);
                }
            );
        } catch (error) {
            console.log(error);
        }
    }

    checkGSTNumber(value: any) {
        if (value) {
            const pattern =
                /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
            return pattern.test(value);
        }
    }

    isSubmitting = false;
    isAnyProductChanged(oldItems: any[], newItems: any[]): boolean {
        const keysToCheck = [
            "product_master_id",
            "qty",
            //   "branding_data",
            //   "custom_branding",
            //   "customisation_data"
        ];
        if (!Array.isArray(oldItems) || !Array.isArray(newItems)) {
            console.log("One of the inputs is not an array or is null");
            return false; // treat null or invalid as changed
        }
        if (oldItems.length !== newItems.length) {
            return true; // Length mismatch = definitely changed
        }

        for (let i = 0; i < oldItems.length; i++) {
            const oldItem = oldItems[i];
            const newItem = newItems[i];

            for (const key of keysToCheck) {
                const val1 = oldItem[key];
                const val2 = newItem[key];

                // Compare arrays
                if (Array.isArray(val1) && Array.isArray(val2)) {
                    if (val1.length !== val2.length || val1.some((v, j) => v !== val2[j])) {
                        console.log(`Item ${i}: '${key}' array mismatch`, val1, "vs", val2);
                        return true;
                    }
                }
                // Compare objects or null
                else if (typeof val1 === 'object' && typeof val2 === 'object') {
                    if (JSON.stringify(val1) !== JSON.stringify(val2)) {
                        console.log(`Item ${i}: '${key}' object mismatch`, val1, "vs", val2);
                        return true;
                    }
                }
                // Compare primitives
                else if (val1 !== val2) {
                    console.log(`Item ${i}: '${key}' value mismatch`, val1, "vs", val2);
                    return true;
                }
            }
        }

        return false; // No changes found
    }

    getInvalidControls(form: FormGroup | FormArray, parentKey: string = ''): string[] {
        const invalidControls: string[] = [];

        Object.keys(form.controls).forEach(key => {
            const control = form.get(key);

            // Create a readable path (e.g. "productDetailList[0].amount")
            const controlPath = parentKey ? `${parentKey}.${key}` : key;

            if (control instanceof FormGroup) {
                invalidControls.push(...this.getInvalidControls(control, controlPath));
            }
            else if (control instanceof FormArray) {
                control.controls.forEach((arrayControl, index) => {
                    const arrayPath = `${controlPath}[${index}]`;
                    if (arrayControl instanceof FormGroup || arrayControl instanceof FormArray) {
                        invalidControls.push(...this.getInvalidControls(arrayControl, arrayPath));
                    } else if (arrayControl.invalid) {
                        invalidControls.push(arrayPath);
                    }
                });
            }
            else if (control && control.invalid) {
                invalidControls.push(controlPath);
            }
        });

        return invalidControls;
    }


    loading: boolean = false;
    createProposal() {
        const grant_total = Number(this.proposalForm.get('grant_total')?.value || 0); // Final Offer Amount Including GST
        const paymentTermsTotal = Number(this.totalPaymentTab || 0); // Calculate Total Amount for payment terms
        if (this.selectedType == 'percent') {
            if (paymentTermsTotal !== 100) {
                let message = '';
                if (paymentTermsTotal < 100) {
                    message = `Total percent is less than 100. Please make it exactly 100%.`;
                }
                else if (paymentTermsTotal > 100) {
                    message = `Total percent exceeds 100%. Please adjust to 100%.`;
                }
                this.toast.error(message, 'Payment Terms Percent Mismatch');
                return;
            }
        } else {
            if (grant_total !== paymentTermsTotal) {
                const diff = grant_total - paymentTermsTotal;
                let message = '';
                if (diff > 0) {
                    message = `Remaining amount ₹${diff.toFixed(2)} is not covered. Please complete the payment terms.`;
                } else {
                    message = `Payment terms exceed the final amount by ₹${Math.abs(diff).toFixed(2)}. Please correct it.`;
                }
                this.toast.error(message, 'Payment Terms Amount Mismatch');
                return;
            }
        }

        if (this.proposalForm.invalid) {
            const invalidFields = this.getInvalidControls(this.proposalForm);
            console.log('invalidFieldsinvalidFieldsinvalidFields=====>', invalidFields)
            this.toast.error('Please fill required fields', 'Fields Error');
            return
        }

        this.loading = true;

        let proposal_type_id = this.proposalForm.get('proposal_type_id')?.value;
        if (!proposal_type_id) {
            this.toast.error('Proposal type is required', 'Fields Error');
            this.isSubmitting = false;
            return;
        }
        const value = this.proposalForm.value;

        // 2. Get updated productDetailList by merging extra scheme data
        const updatedProductDetailList = value.productDetailList.map(
            (item: any, index: number) => {
                return {
                    ...item,
                    ...(this.schemeExtraData[index] || {}), // merge scheme extra data
                };
            }
        );

        // 3. Replace the value object (optional, for submission)
        const updatedFormValue = {
            ...value,
            productDetailList: updatedProductDetailList,
        };

        let department_id = localStorage.getItem('department_id');
        let loginUser: any = localStorage.getItem('signInUser');
        let userData = JSON.parse(loginUser);
        if (this.isSubmitting) return;
        this.isSubmitting = true;

        const gstValidate = this.checkGSTNumber(value?.gst_no);
        const proposalType = this.proposalForm.value.proposal_type_id;
        const gstNo = this.proposalForm.value.gst_no;

        if (proposalType === 'B2B' && (!gstNo || gstNo.trim() === '')) {
            this.toast.error('Enter a valid GST No.', 'Fields Error');
            this.isSubmitting = false;
            return;
        }

        if (proposalType === 'B2B' && gstNo) {
            this.toast.clear();
        }

        let data = {
            ...updatedFormValue,
            additional_charges: Number(value?.additional_charges),
            login_id: this.userLoginId,
            request_type: 'normal',
            department_id: department_id,
            employee_id: userData.employee_id,
            // customer_id: this.proposalId,
            old_version: this.version_id || null,
            include_additional_charges: this.chargesToggle,
            sales_documents: this.sales_documents
        };

        data.grossDiscountDetails = this.versionData?.proposalDiscount;
        data.pageModeURL = this.pageModeURL;
        data.PaymentArray = this.finalPaymentArray;

        let empDetail = localStorage.getItem('signInUser');
        if (empDetail != null) {
            const empdetail = JSON.parse(empDetail);
            data.lead_owner = `${empdetail.first_name} ${empdetail.last_name}`;
        }

        if (this.existing_type === 'existing_client') {
            data.existing_client = true;
            data.customer_id = this.client_id;
        }

        if (this.actionType === 'edit' || this.routerParams?.status === "clone") {
            data.id = this.proposalId;
            data.create_lead_id = this.getData?.create_lead_id;
            data.type = 'edit';
        }
        if (this.actionType === 'create') {
            data.id = this.proposalId2 ? this.proposalId2 : null;
            data.version_id = this.versionId2 ? this.versionId2 : null;
            data.create_lead_id = this.getData?.create_lead_id;
            data.type = this.proposalId2 ? 'edit' : null;
        }

        if (Array.isArray(data.productDetailList)) {
            data.productDetailList.forEach((product: any) => {
                if (product.discount_request === '') {
                    delete product.discount_request;
                }
            });
        }
        if (this.productListDetailsRecord?.length) {
            data.id = this.lead_id;
        } else {
            data.create_lead_id = this.leadId;
        }

        if (this.productListDetailsRecord?.length) {
            this.productListDetailsRecord = this.productListDetailsRecord.map(
                (item: any) => {
                    if (item.gst) {
                        const gstValue = parseFloat(item.gst);
                        return {
                            ...item,
                            cgst: parseFloat((gstValue / 2).toFixed(2)),
                            sgst: parseFloat((gstValue / 2).toFixed(2)),
                        };
                    }
                    return item;
                }
            );
            this.productListDetailsRecord.forEach((product: any) => {
                data.productDetailList.forEach((item: any) => {
                    if (product.id == item.id) {
                        item.MASTER_PRODUCT = product.MASTER_PRODUCT;
                        if (product.gst) {
                            item.cgst = product.cgst;
                            item.sgst = product.sgst;
                        }
                    }
                });
            });

        } else {
            data.create_lead_id = this.leadId;
        }
        data.entity_id = this.entityId;
        data.financial_year_id = this.financial_year_id;

        const productDetailsValid = data.productDetailList.every((res: any) => {
            if (res.qty == null || res.qty === undefined || res.product_master_id === null || res.product_master_id === undefined) {
                this.toast.error('Item Details is required !!', 'Error Msg');
                this.isSubmitting = false;
                this.loading = false;
                return false;
            }
            return true;
        });

        if (!productDetailsValid) return;
        data.create_lead_id = this.leadId;
        if (this.quotationType) {
            data.quotationType = this.quotationType;
        }
        let deleveryTerm = this.termOfDeliveryList.find((x: any) => x.id === data.delivery_term_id);
        let unloadingResp = this.unloadingRespList.find((x: any) => x.id === data.unloading_resp_id);
        let paymentMain = this.paymentMainList.find((x: any) => x.id === data.payment_main_id);
        let paymentSubMain = this.paymentSubList.find((x: any) => x.id === data.sub_payment_main_id);
        let freight = this.freightList.find((x: any) => x.id === data.freight_id);
        let insurance = this.insuranceList.find((x: any) => x.id === data.insurance_id);
        data.sub_payment_name = paymentSubMain?.sub_payment_name;
        data.freight_name = freight?.freight_name;
        data.insurance_name = insurance?.insurance_name;
        data.delivery_term = deleveryTerm?.delivery_term;
        data.unloading = unloadingResp?.unloading;
        data.payment_name = paymentMain?.payment_name;
        let existingItems: any = localStorage.getItem('itemListForDiscount');
        const existing = JSON.parse(existingItems);
        if (!existing) {
            localStorage.setItem('itemListForDiscount', JSON.stringify(data?.productDetailList));

        }
        let changed = this.isAnyProductChanged(data?.productDetailList, existing);

        data.isPreview = true;
        data.isPreviewVersion = this.versionId2;
        this.isSubmitting = false;

        if (this.routerParams?.status === "performance") {
            data.proformaStatus = true;
            data.expiry_date = moment(value.end_date_pi).format("YYYY-MM-DD");
            data.is_so_created = true;
            data.login_id = this.userLoginId;
        }
        data.version_id = this.version_id;
        data.pi = this.pi;
        data.dealer = (this.routerParams?.dealer === 'true' || !isNaN(Number(this.routerParams?.dealer))) ? true : false;
        // console.log(data,"_____QUOTATIONPAVAN"); return
        if (changed) {
            this.loading = false
            Swal.fire({
                title: "Are you sure?",
                text: "Do you want to proceed with the changes?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes"
            }).then((result) => {
                if (result.isConfirmed) {
                    data.changed = changed;
                    // Swal.fire({
                    //     title: "Updated!",
                    //     text: "Your changes has been updated.",
                    //     icon: "success"
                    // });
                    //this.previewDialog(data);

                    this.$proposal.createProposal(data).subscribe(
                        (res: any) => {
                            this.loading = false;
                            if (res) {
                                this.proposalId2 = res?.data?.proposal_id;
                                this.versionId2 = res?.data.version_id;
                                //    localStorage.removeItem('itemListForDiscount');

                                this.previewDialog(res.data);
                            }
                            this.isSubmitting = false;
                        },
                        (err) => {
                            this.loading = false;
                            if (err.status === 400) {
                                this.toast.error(err?.message);
                            } else if (err.status === 403) {
                                this.toast.error('Already Exists!');
                            } else {
                                this.toast.error(err?.error?.message || 'Something went Wrong');
                            }
                            // localStorage.removeItem('itemListForDiscount');
                            this.isSubmitting = false;
                        }
                    );
                } else {
                    // localStorage.removeItem('itemListForDiscount');
                    this.isSubmitting = false;
                }
            });
        } else {
            data.changed = changed;
            //this.previewDialog(data);

            this.$proposal.createProposal(data).subscribe(
                (res: any) => {
                    this.loading = false;
                    if (res) {

                        this.proposalId2 = res?.data?.proposal_id;
                        this.versionId2 = res?.data.version_id;
                        // localStorage.removeItem('itemListForDiscount');
                        this.previewDialog(res.data);
                    }
                    this.isSubmitting = false;
                },
                (err) => {
                    this.loading = false;
                    if (err.status === 400) {
                        this.toast.error(err?.message);
                    } else if (err.status === 403) {
                        this.toast.error('Already Exists!');
                    } else {
                        this.toast.error(err?.error?.message || 'Something went Wrong');
                    }
                    this.isSubmitting = false;
                }
            );

        }

    }
    updateSalesBooking() {

        const grant_total = Number(this.proposalForm.get('grant_total')?.value || 0); // Final Offer Amount Including GST
        const paymentTermsTotal = Number(this.totalPaymentTab || 0); // Calculate Total Amount for payment terms
        if (this.selectedType == 'percent') {
            if (paymentTermsTotal !== 100) {
                let message = '';
                if (paymentTermsTotal < 100) {
                    message = `Total percent is less than 100. Please make it exactly 100%.`;
                }
                else if (paymentTermsTotal > 100) {
                    message = `Total percent exceeds 100%. Please adjust to 100%.`;
                }
                this.toast.error(message, 'Payment Terms Percent Mismatch');
                return;
            }
        } else {
            if (grant_total !== paymentTermsTotal) {
                const diff = grant_total - paymentTermsTotal;
                let message = '';
                if (diff > 0) {
                    message = `Remaining amount ₹${diff.toFixed(2)} is not covered. Please complete the payment terms.`;
                } else {
                    message = `Payment terms exceed the final amount by ₹${Math.abs(diff).toFixed(2)}. Please correct it.`;
                }
                this.toast.error(message, 'Payment Terms Amount Mismatch');
                return;
            }
        }

        if (this.proposalForm.invalid) {
            const invalidFields = this.getInvalidControls(this.proposalForm);
            console.log('invalidFieldsinvalidFieldsinvalidFields=====>', invalidFields)
            this.toast.error('Please fill required fields', 'Fields Error');
            return
        }

        this.loading = true;

        let proposal_type_id = this.proposalForm.get('proposal_type_id')?.value;
        if (!proposal_type_id) {
            this.toast.error('Proposal type is required', 'Fields Error');
            this.isSubmitting = false;
            return;
        }
        const value = this.proposalForm.value;

        // 2. Get updated productDetailList by merging extra scheme data
        const updatedProductDetailList = value.productDetailList.map(
            (item: any, index: number) => {
                return {
                    ...item,
                    ...(this.schemeExtraData[index] || {}), // merge scheme extra data
                };
            }
        );

        // 3. Replace the value object (optional, for submission)
        const updatedFormValue = {
            ...value,
            productDetailList: updatedProductDetailList,
        };

        let department_id = localStorage.getItem('department_id');
        let loginUser: any = localStorage.getItem('signInUser');
        let userData = JSON.parse(loginUser);
        if (this.isSubmitting) return;
        this.isSubmitting = true;

        const gstValidate = this.checkGSTNumber(value?.gst_no);
        const proposalType = this.proposalForm.value.proposal_type_id;
        const gstNo = this.proposalForm.value.gst_no;

        if (proposalType === 'B2B' && (!gstNo || gstNo.trim() === '')) {
            this.toast.error('Enter a valid GST No.', 'Fields Error');
            this.isSubmitting = false;
            return;
        }

        if (proposalType === 'B2B' && gstNo) {
            this.toast.clear();
        }

        let data = {
            ...updatedFormValue,
            paymentDetails: this.advanceDetails,
            additional_charges: Number(value?.additional_charges),
            login_id: this.userLoginId,
            request_type: 'normal',
            department_id: department_id,
            employee_id: userData.employee_id,
            // customer_id: this.proposalId,
            old_version: this.version_id || null,
            include_additional_charges: this.chargesToggle,
            sales_documents: this.sales_documents
        };

        data.grossDiscountDetails = this.versionData?.proposalDiscount;
        data.pageModeURL = this.pageModeURL;
        data.PaymentArray = this.finalPaymentArray;

        let empDetail = localStorage.getItem('signInUser');
        if (empDetail != null) {
            const empdetail = JSON.parse(empDetail);
            data.lead_owner = `${empdetail.first_name} ${empdetail.last_name}`;
        }

        if (this.existing_type === 'existing_client') {
            data.existing_client = true;
            data.customer_id = this.client_id;
        }

        if (this.actionType === 'edit' || this.routerParams?.status === "clone") {
            data.id = this.proposalId;
            data.create_lead_id = this.getData?.create_lead_id;
            data.type = 'edit';
        }
        if (this.actionType === 'create') {
            data.id = this.proposalId2 ? this.proposalId2 : null;
            data.version_id = this.versionId2 ? this.versionId2 : null;
            data.create_lead_id = this.getData?.create_lead_id;
            data.type = this.proposalId2 ? 'edit' : null;
        }

        if (Array.isArray(data.productDetailList)) {
            data.productDetailList.forEach((product: any) => {
                if (product.discount_request === '') {
                    delete product.discount_request;
                }
            });
        }
        if (this.productListDetailsRecord?.length) {
            data.id = this.lead_id;
        } else {
            data.create_lead_id = this.leadId;
        }

        if (this.productListDetailsRecord?.length) {
            this.productListDetailsRecord = this.productListDetailsRecord.map(
                (item: any) => {
                    if (item.gst) {
                        const gstValue = parseFloat(item.gst);
                        return {
                            ...item,
                            cgst: parseFloat((gstValue / 2).toFixed(2)),
                            sgst: parseFloat((gstValue / 2).toFixed(2)),
                        };
                    }
                    return item;
                }
            );
            this.productListDetailsRecord.forEach((product: any) => {
                data.productDetailList.forEach((item: any) => {
                    if (product.id == item.id) {
                        item.MASTER_PRODUCT = product.MASTER_PRODUCT;
                        if (product.gst) {
                            item.cgst = product.cgst;
                            item.sgst = product.sgst;
                        }
                    }
                });
            });

        } else {
            data.create_lead_id = this.leadId;
        }
        data.entity_id = this.entityId;
        data.financial_year_id = this.financial_year_id;

        const productDetailsValid = data.productDetailList.every((res: any) => {
            if (res.qty == null || res.qty === undefined || res.product_master_id === null || res.product_master_id === undefined) {
                this.toast.error('Item Details is required !!', 'Error Msg');
                this.isSubmitting = false;
                this.loading = false;
                return false;
            }
            return true;
        });

        if (!productDetailsValid) return;
        data.create_lead_id = this.leadId;
        if (this.quotationType) {
            data.quotationType = this.quotationType;
        }
        let deleveryTerm = this.termOfDeliveryList.find((x: any) => x.id === data.delivery_term_id);
        let unloadingResp = this.unloadingRespList.find((x: any) => x.id === data.unloading_resp_id);
        let paymentMain = this.paymentMainList.find((x: any) => x.id === data.payment_main_id);
        let paymentSubMain = this.paymentSubList.find((x: any) => x.id === data.sub_payment_main_id);
        let freight = this.freightList.find((x: any) => x.id === data.freight_id);
        let insurance = this.insuranceList.find((x: any) => x.id === data.insurance_id);
        data.sub_payment_name = paymentSubMain?.sub_payment_name;
        data.freight_name = freight?.freight_name;
        data.insurance_name = insurance?.insurance_name;
        data.delivery_term = deleveryTerm?.delivery_term;
        data.unloading = unloadingResp?.unloading;
        data.payment_name = paymentMain?.payment_name;
        let existingItems: any = localStorage.getItem('itemListForDiscount');
        const existing = JSON.parse(existingItems);
        if (!existing) {
            localStorage.setItem('itemListForDiscount', JSON.stringify(data?.productDetailList));

        }
        let changed = this.isAnyProductChanged(data?.productDetailList, existing);

        data.isPreview = true;
        data.isPreviewVersion = this.versionId2;
        this.isSubmitting = false;

        if (this.routerParams?.status === "performance") {
            data.proformaStatus = true;
            data.expiry_date = moment(value.end_date_pi).format("YYYY-MM-DD");
            data.is_so_created = true;
            data.login_id = this.userLoginId;
        }
        data.version_id = this.version_id;
        data.pi = this.pi;
        data.id = this.proposalId;
        data.type = 'edit';

        if (changed) {
            this.loading = false
            Swal.fire({
                title: "Are you sure?",
                text: "Do you want to proceed with the changes?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes"
            }).then((result) => {
                if (result.isConfirmed) {
                    data.changed = changed;
                    // Swal.fire({
                    //     title: "Updated!",
                    //     text: "Your changes has been updated.",
                    //     icon: "success"
                    // });
                    //this.previewDialog(data);

                    this.$proposal.updateSalesBooking(data).subscribe(
                        (res: any) => {
                            this.loading = false;
                            if (res) {
                                this.proposalId2 = res?.data?.proposal_id;
                                this.versionId2 = res?.data.version_id;
                                //    localStorage.removeItem('itemListForDiscount');

                                this.previewDialog(res.data);
                            }
                            this.isSubmitting = false;
                        },
                        (err) => {
                            this.loading = false;
                            if (err.status === 400) {
                                this.toast.error(err?.message);
                            } else if (err.status === 403) {
                                this.toast.error('Already Exists!');
                            } else {
                                this.toast.error(err?.error?.message || 'Something went Wrong');
                            }
                            // localStorage.removeItem('itemListForDiscount');
                            this.isSubmitting = false;
                        }
                    );
                } else {
                    // localStorage.removeItem('itemListForDiscount');
                    this.isSubmitting = false;
                }
            });
        } else {
            data.changed = changed;
            //this.previewDialog(data);

            this.$proposal.updateSalesBooking(data).subscribe(
                (res: any) => {
                    this.loading = false;
                    if (res) {

                        this.proposalId2 = res?.data?.proposal_id;
                        this.versionId2 = res?.data.version_id;
                        // localStorage.removeItem('itemListForDiscount');
                        this.previewDialog(res.data);
                    }
                    this.isSubmitting = false;
                },
                (err) => {
                    this.loading = false;
                    if (err.status === 400) {
                        this.toast.error(err?.message);
                    } else if (err.status === 403) {
                        this.toast.error('Already Exists!');
                    } else {
                        this.toast.error(err?.error?.message || 'Something went Wrong');
                    }
                    this.isSubmitting = false;
                }
            );

        }

    }
    handleProposalSubmission(data: any, changed: boolean, showSuccessAlert: boolean): void {
        data.changed = changed;

        if (showSuccessAlert) {
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
        }

        this.$proposal.createProposal(data).subscribe(
            (res: any) => {
                if (res) {
                    //    localStorage.removeItem('itemListForDiscount');
                    this.previewDialog(res.data);
                }
                this.isSubmitting = false;
            },
            (err) => {
                if (err.status === 400) {
                    this.toast.error(err?.message);
                } else if (err.status === 403) {
                    this.toast.error('Already Exists!');
                } else {
                    this.toast.error(err?.error?.message || 'Something went Wrong');
                }
                this.isSubmitting = false;
            }
        );
    }

    viewImg() {
        window.open(this.baseURL + '/' + this.sales_documents, '_blank');
    }

    createproforma() {
        // let value = this.proposalForm?.value;

        const value = this.proposalForm.getRawValue();

        // 2. Get updated productDetailList by merging extra scheme data
        const updatedProductDetailList = value.productDetailList.map(
            (item: any, index: number) => {
                return {
                    ...item,
                    ...(this.schemeExtraData[index] || {}), // merge scheme extra data
                };
            }
        );


        const updatedFormValue = {
            ...value,
            productDetailList: updatedProductDetailList,
        };


        console.log('Merged form with scheme data:', updatedFormValue);
        console.log(this.proposalForm.getRawValue());

        let department_id = localStorage.getItem('department_id');
        let loginUser: any = localStorage.getItem('signInUser');
        let userData = JSON.parse(loginUser);
        if (this.isSubmitting) return;
        this.isSubmitting = true;

        if (this.proposalForm.status === 'INVALID') {
            this.toast.error('Required fields should not be empty', 'Fields Error');
            this.isSubmitting = false;
            return;
        }

        const gstValidate = this.checkGSTNumber(value?.gst_no);
        const proposalType = this.proposalForm.value.proposal_type_id;
        const gstNo = this.proposalForm.value.gst_no;

        if (proposalType === 'B2B' && (!gstNo || gstNo.trim() === '')) {
            this.toast.error('Enter a valid GST No.', 'Fields Error');
            this.isSubmitting = false;
            return;
        }

        if (proposalType === 'B2B' && gstNo) {
            this.toast.clear();
        }

        let data = {
            ...updatedFormValue,
            additional_charges: Number(value?.additional_charges),
            login_id: this.userLoginId,
            request_type: 'normal',
            department_id: department_id,
            employee_id: userData.employee_id,
            customer_id: this.proposalId,
            version_id: Number(this.version_id) || null,
            proposal_id: Number(this.proposalId),
            expiry_date: moment(value.end_date_pi).format("YYYY-MM-DD"),
            is_so_created: true,
            advance_amount: this.proposalForm.value.advance_amount,
            advance_check: this.isChecked
        };
        let empDetail: any = localStorage.getItem('signInUser');
        if (empDetail != null) {
            const empdetail = JSON.parse(empDetail);
            data.lead_owner = `${empdetail.first_name} ${empdetail.last_name}`;
        }

        if (this.existing_type === 'existing_client') {
            data.existing_client = true;
            data.customer_id = this.client_id;
        }

        if (this.actionType === 'edit') {
            data.id = this.proposalId;
            data.create_lead_id = this.getData?.create_lead_id;
            data.type = 'edit';
        }

        if (Array.isArray(data.productDetailList)) {
            data.productDetailList.forEach((product: any) => {
                if (product.discount_request === '') {
                    delete product.discount_request;
                }
            });
        }
        if (this.productListDetailsRecord?.length) {
            data.id = this.lead_id;
        } else {
            data.create_lead_id = this.leadId;
        }

        if (this.productListDetailsRecord?.length) {
            this.productListDetailsRecord = this.productListDetailsRecord.map(
                (item: any) => {
                    if (item.gst) {
                        const gstValue = parseFloat(item.gst);
                        return {
                            ...item,
                            cgst: parseFloat((gstValue / 2).toFixed(2)),
                            sgst: parseFloat((gstValue / 2).toFixed(2)),
                        };
                    }
                    return item;
                }
            );
            this.productListDetailsRecord.forEach((product: any) => {
                data.productDetailList.forEach((item: any) => {
                    if (product.id == item.id) {
                        item.MASTER_PRODUCT = product.MASTER_PRODUCT;
                        if (product.gst) {
                            item.cgst = product.cgst;
                            item.sgst = product.sgst;
                        }
                    }
                });
            });
        } else {
            data.create_lead_id = this.leadId;
        }
        data.entity_id = this.entityId;
        data.financial_year_id = this.financial_year_id;

        const productDetailsValid = data.productDetailList.every((res: any) => {
            if (res.qty == null || res.qty === undefined) {
                this.toast.error('QTY is required !!', 'Error Msg');
                this.isSubmitting = false;
                return false;
            }
            return true;
        });

        if (!productDetailsValid) return;
        data.create_lead_id = this.leadId;

        this.$proposal.createproforma(data).subscribe(
            (res: any) => {
                if (res) {
                    this.toast.success(res.message);
                    this.proposalForm.reset();
                    if (this.actionType === 'create') {
                        this._router.navigate(['/master/sales/all-proposal']);
                    } else if (this.actionType === 'edit') {
                        this._router.navigate(['/master/sales/proforma-invoice']);
                    }
                    this.proposalForm.patchValue({
                        // total_cost: null,
                        additional_charges: 0,
                        discount: null,
                        // taxable_value: null,
                        sgst: null,
                        cgst: null,
                        igst: null,
                        grant_total: null,
                    });
                }
                this.isSubmitting = false;
            },
            (err) => {
                if (err.status === 400) {
                    this.toast.error(err?.message);
                } else if (err.status === 403) {
                    this.toast.error('Already Exists!');
                } else {
                    this.toast.error(err?.error?.message || 'Something went Wrong');
                }
                this.isSubmitting = false;
            }
        );
    }

    existing_client_data: any = [];

    getAllexistingClientData() {
        this.$proposal
            .getAllproposalById(this.id_existing)
            .subscribe((res: any) => {
                if (res) {
                    this.existing_client_data = res.data;
                }
            });
    }

    getAllActiveProduct(event: any, event2: any, index: any) {
        this.$productionService.getItemsBySubCategory(event?.id ?? event, event2?.item_category_id ?? event2).subscribe((res: any) => {
            if (res.code === 201) {
                this.toast.error(res.message);
                return;
            }
            //console.log(res.data, " res.data<<<<<<<<<<<<")
            const products = res.data || [];
            this.productData[index] = products;

            const firstProduct = products[index];
            //console.log(firstProduct, 'firstProduct');

            this.CF_1.productDetailList.at(index)?.patchValue({
                product_master_id: null,
                product_code: null,
                product_description: null,
                uom_name: null,
                // qty: null,
                hsn_code_id_view: null,
                price_per_unit: null,
                warranty: null,
                igst: null,
                maximum_discount: null,
                select_scheme: null,
                discount_request: null,
                discount_approved: null,
                name_product: firstProduct?.item_name || '',
                // product_master_id: firstProduct?.id
                product_name: firstProduct?.item_name,
            });
            this.calculateQuotationTotals();
        });

    }

    clearAllCategories(event: Event, i: number, clearType: string) {
        event.stopPropagation();
        //this.searchText[i] = '';
        this.searchText = this.searchText.map((val, index) => index === i ? '' : val);
        const inputEl = this.searchInputs.toArray()[i]?.nativeElement;
        if (inputEl) {
            inputEl.value = '';
        }
        this.cdr.detectChanges();

        const formArray = this.CF_1.productDetailList as FormArray;
        const group = formArray.at(i) as FormGroup; // 👈 specific index ka group

        // sirf i-th row ka subCategory aur productData empty karna
        //this.subCategory[i] = [];
        if (clearType != 'product') {
            this.productData[i] = [];
        }

        if (clearType === 'category') {
            group.get('product_sub_category_id')?.reset();
            this.subCategory[i] = [];
        }

        // ab sirf i-th group ke controls reset karenge
        //group.get('product_category_id')?.reset();
        //group.get('product_sub_category_id')?.reset();
        group.get('product_master_id')?.reset();
        group.get('variant_id')?.reset();
        group.get('product_code')?.reset();
        group.get('product_description')?.reset();
        group.get('uom_name')?.reset();
        group.get('qty')?.reset();
        group.get('price_per_unit')?.reset();
        group.get('warranty')?.reset();
        group.get('select_scheme')?.reset();

        this.removeCustomizationBrandingBOM(i);
        this.resetProductDetailAtIndex(i, clearType);
    }

    // use for customization, branding & bom remove from row deleted, deselect category, subcategory, item & quantity
    removeCustomizationBrandingBOM(index: any) {
        const formArrayC = this.proposalForm.get('productDetailList') as FormArray;
        const formGroup = formArrayC.at(index);

        formGroup.patchValue({
            custom_branding: [],
            customizeTotal: '',
            bomArray: []
        });

        // Bom data clear
        this.selectedBomData = this.selectedBomData.filter(
            (x: any) => x.parent_index !== index
        );

        // 1 Mark this control and its parent as dirty/touched
        formGroup.markAsDirty();
        formGroup.markAsTouched();

        // 2 Trigger validation and internal updates
        formGroup.updateValueAndValidity({ onlySelf: false });

        // 3 Update the whole form and FormArray reference
        this.proposalForm.updateValueAndValidity({ onlySelf: false });

        // 4 Force UI refresh if needed
        this.cdr.detectChanges?.();
        // 5 recalc totals or re-render UI
        this.calculateQuotationTotals();
    }

    // use for reset product item list
    resetProductDetailAtIndex(index: number, clearType: any) {
        const productArray = this.proposalForm.get('productDetailList') as FormArray;

        if (productArray && productArray.at(index)) {
            const group = productArray.at(index) as FormGroup;

            // for all key null
            if (clearType === 'category') {
                Object.keys(group.controls).forEach(key => {
                    group.get(key)?.setValue(null);
                });
            }

            // UI & calculation triggers
            group.updateValueAndValidity();
            group.markAsDirty();

            // Force form array reference update
            const newArrayValue = [...productArray.value];
            this.proposalForm.patchValue({
                productDetailList: newArrayValue
            });

            // item list update in existing array
            this.proposalForm.updateValueAndValidity();
            this.cdr.detectChanges?.(); // if using ChangeDetectorRef
        }
        this.calculateQuotationTotals();
    }

    getAllActiveProductView(
        event: any,
        event2: any,
        index: any,
        productId?: any
    ) {
        this.$productionService
            .getItemsBySubCategory(event, event2)
            .subscribe((res: any) => {
                if (res.code === 201) {
                    this.toast.error(res.message);
                    return;
                }

                const products = res.data || [];
                this.productData[index] = products;
                //console.log(this.productData, "this.productData>>>>>>>>>>");

                const matchedProduct = products.find((p: any) => p.id === productId) || products[0];
                //console.log(matchedProduct, "matchedProduct<<<<<<<<<<");

                if (matchedProduct) {

                    const formItem = this.CF_1.productDetailList.at(index);
                    const formItemOut = this.CF_1.copyProductDetailList.at(index);
                    //console.log(formItem, "matchedProduct<<<<<<<<<<formItem");

                    matchedProduct.warranty = formItem?.value?.warranty;

                    this.getpriceSubCategory(matchedProduct, index)


                    formItem?.patchValue({
                        name_product: matchedProduct.item_name || '',
                        product_master_id: matchedProduct.id,
                        product_name: matchedProduct.item_name,
                        warranty: formItem?.value?.warranty

                    });
                    formItemOut?.patchValue({
                        name_product: matchedProduct.item_name || '',
                        product_master_id: matchedProduct.id,
                        product_name: matchedProduct.item_name,
                        warranty: matchedProduct?.warranty
                    });

                }
            });
        const formArrayTwo = this.proposalForm.get('productDetailList') as FormArray;
        //console.log(formArrayTwo, "formArrayTwo<<<<<<<<<22222")
        const hasApplyScheme = formArrayTwo?.value?.some((item: any) => item.apply_scheme === true || item.apply_scheme === 1);

        //console.log(hasApplyScheme, "hasApplyScheme");
        this.hasApplyScheme = hasApplyScheme
    }

    getPriceSubData: any;
    async getProductData(data: any, index: any) {

        await this.getpriceSubCategory(data, index, () => {
            const rate = Number(this.selectedCurrency?.rate || 1);
            const convertedPrice = Number(data?.MRP || 0) * rate;

            // this.CF_1.productDetailList.at(index)?.patchValue({ price_per_unit: convertedPrice });
            const productGroup = (this.CF_1.productDetailList as FormArray).at(index) as FormGroup;

            const qty = +productGroup.value.qty || 0;
            const gstPercent = +productGroup.value.igst || 0;
            const gross = qty * convertedPrice;

            productGroup.patchValue({
                price_per_unit: convertedPrice,
                totalPrice: gross,
                totalWithGst: gross + (gross * gstPercent) / 100
            });

            this.proposalForm.updateValueAndValidity();

            let currentList = this.CF_1.productDetailList.value;
            console.log(currentList);

            const isDuplicate = currentList?.some(
                (item: any, i: number) =>
                    i !== index &&
                    data?.asset_id === item?.product_category_id &&
                    data?.sub_category_id === item?.product_sub_category_id &&
                    data?.id === item?.product_master_id
            );

            if (isDuplicate) {
                this.toast.warning('Item Already Selected');
                this.CF_1.productDetailList
                    .at(index)
                    ?.patchValue({ product_master_id: null });
                return;
            }

            const formArray = this.CF_1.productDetailList as FormArray;
            const group = formArray.at(index) as FormGroup;
            group.get('select_scheme')?.reset();

            this.getSubCategory(data?.asset_id, index);
            this.removeCustomizationBrandingBOM(index);
        })
    }

    getpriceSubCategory(data: any, index: any, callback?: () => void) {
        this._configurationalMasterService.getItemPriceSubcategory(this.client_id, data?.id, data?.sub_category_id, data?.asset_id, this.versionId2 || this.version_id).subscribe((res: any) => {

            if (res?.data) {
                this.getPriceSubData = res.data;
            }
            const rate = Number(this.selectedCurrency?.rate || 1);
            const convertedMrp = Number(res?.data?.MRP || 0) * rate;
            const convertedMvp = Number(res?.data?.MVP || 0) * rate;
            const convertedDbp = Number(res?.data?.DBP || 0) * rate;


            this.CF_1.productDetailList.at(index)?.patchValue({
                product_master_id: data?.id,
                product_sub_category_id: data?.sub_category_id,
                product_category_id: data?.asset_id,
                name_product: data?.item_name,
                uom_name: data?.MASTER_UOM?.uom_name,
                uom_id: data?.uom_id,
                igst: data?.MASTER_HSN_SAC_CODE?.gst_value,
                product_code: data?.item_code,
                warranty: data?.warranty,
                product_description: data?.description,
                price_per_unit: convertedDbp,
                min_price: convertedMvp,
                max_price: convertedMrp,
                original_price_per_unit: res?.data?.DBP,
                original_min_price: res?.data?.MVP,
                original_max_price: res?.data?.MRP,
                // price_per_unit: res?.data?.DBP,
                // min_price: res?.data?.MVP,
                // max_price: res?.data?.MRP,
                discount_1: res?.data?.discount_1,
                discount_2: res?.data?.discount_2,
                discount_3: res?.data?.discount_3,
                discount1Flat: res?.data?.discount1Flat,
                discount2Flat: res?.data?.discount2Flat,
                discount3Flat: res?.data?.discount3Flat,
                image: environment.servralUrl + '/' + data?.image,
                hsn_code_id_view: data?.MASTER_HSN_SAC_CODE?.hsn_sac_code,
                hsn_code_id: this.getHsnCode(data?.hsn_code_id, index),
                hsn_code: data?.MASTER_HSN_SAC_CODE?.hsn_sac_code,
            });
            this.calculateQuotationTotals();
            if (callback) callback();
        })
    }

    subCategory: any[] = [];
    getSubCategory(event: any, index: any) {
        this._configurationalMasterService
            .getSubCategory(event?.value ?? event)
            .subscribe(
                (res: any) => {
                    if (res.code === 201) {
                        this.toast.error(res.message);
                    }
                    this.subCategory[index] = res.data;
                },
                (error) => {
                    this.toast.error(error.message);
                }
            );
        const control = this.CF_1.productDetailList.controls[index];
    }

    getAllCategory() {
        this._configurationalMasterService
            .getActiveAssetMasterList()
            .subscribe((res: any) => {
                this.cetegory = res.data;
            });
    }

    getAllProductVariant(data: any, index: any) {
        this._configurationalMasterService
            .getProductVariantByproduct_id(data?.value ?? data)
            .subscribe(
                (res: any) => {
                    if (res) {
                        this.productVariantData[index] = res.data;
                    }
                },
                (err: any) => {
                }
            );
    }

    bindProductData(index: any) {
        let productDetailList = this.proposalForm.get(
            'productDetailList'
        ) as FormArray;
        let product_id = productDetailList.value[index]?.product_master_id;
        let data = this.productData[index].filter(
            (res: any) => res.id == product_id
        );

        if (data && data.length > 0) {
            const product = data[0];
            productDetailList.at(index).patchValue({
                product_description: product.product_description,
                product_code: product.product_code,
                price_per_unit: product.product_list_price,
                warranty: product.warrenty,
                uom_name: product.uom_name,
                uom_id: product.uom_id,
                hsn_code_id: product?.hsn_code_id,
                igst: product?.igst,
            });
        }
    }

    proposalSelection(e: any) {
        if (e.value === 'EXPORT') {
            this.hideTableColumns = true;
        } else {
            this.hideTableColumns = false;
        }
    }

    getAllScheme = () => {
        this._configurationalMasterService.getAllScheme().subscribe((res: any) => {
            const modifyData: any = [];
            res.data?.filter((data: any) => {
                if (data?.status === 'ACTIVE') {
                    modifyData.push(data);
                }
            });
            this.schemeData = modifyData;
        });
    };

    schemSelection(e: any) {

        this.schemeId = e?.value || e;
        if (this.schemeId) {
            this._configurationalMasterService.getByIdScheme(this.schemeId).subscribe(
                (res: any) => {
                    this.getDataScheme = res.data;
                    this.onScheme = true;
                },
                (err: any) => {
                    // this.toast.error("Something went wrong");
                }
            );
        }
    }

    schemeInfo() {
    }

    applySelect() {
        if (!this.schemeId) {
            this.toast.warning('Please Select Scheme.');
            return;
        }

        let value = this.proposalForm?.value;

        const currentList = this.CF_1.productDetailList.value || [];
        const selectData = this.getDataScheme?.selected_item || [];
        const promoItems = this.getDataScheme?.promo_item || [];
        const requiredMatchCount = Number(
            this.getDataScheme?.no_of_select_item || 0
        );
        const requiredQty = Number(selectData[0]?.selected_number_of_qty || 0); // for 'qty' scheme
        const requiredPrice = Number(selectData[0]?.selected_price_scheme || 0);
        let promoResult: any[] = [];

        if (this.getDataScheme?.scheme_type === 'item') {
            let isSchemeApplicable = false;

            if (requiredMatchCount === 0) {
                isSchemeApplicable = selectData.every((cond: any) => {
                    const currentItem = currentList.find(
                        (item: any) =>
                            item?.product_master_id === cond?.selected_item_id &&
                            Number(item?.qty) >= Number(cond?.selected_qty)
                    );
                    return !!currentItem;
                });
            } else {
                const matchingItemsCount = selectData.filter((cond: any) => {
                    const currentItem = currentList.find(
                        (item: any) =>
                            item?.product_master_id === cond?.selected_item_id &&
                            Number(item?.qty) >= Number(cond?.selected_qty)
                    );
                    return !!currentItem;
                }).length;

                isSchemeApplicable = matchingItemsCount >= requiredMatchCount;
            }

            if (!isSchemeApplicable) {
                this.toast.warning('Scheme is not applicable');
                return;
            }

            promoResult = this.calculatePromoItems(
                currentList,
                selectData,
                promoItems,
                requiredMatchCount
            );
        } else if (this.getDataScheme?.scheme_type === 'qty') {
            const totalQty = currentList.reduce(
                (sum: any, item: any) => sum + Number(item.qty || 0),
                0
            );
            this.totalQty = totalQty;

            if (totalQty < requiredQty) {
                this.toast.warning(
                    'Scheme is not applicable due to insufficient quantity'
                );
                return;
            }

            const timesApplicable = Math.floor(totalQty / requiredQty);

            promoResult = promoItems.map((promo: any) => ({
                product_master_id: promo?.promo_item_id,
                product_category_id: promo?.promo_category_id,
                product_sub_category_id: promo?.promo_subcat_id,
                variant_id: null,
                product_code: promo?.promo_item_code,
                product_description: promo?.promo_item_description,
                promo_item: true,
                new_item: true,
                promo_order_qty: promo?.promo_qty * timesApplicable,
                apply_scheme: true,
                product_name: promo?.promo_item_name,
                hsn_code_id: promo?.hsn_code_id || promo?.promo_item_hsn_sac_code_id,
                igst: promo?.promo_item_igst,
                price_per_unit: promo?.promo_item_price_amount_promo,
                warranty: promo?.warranty,
                uom_name: promo?.uom_name || promo?.promo_item_uom_name,
                // maximum_discount: promo?.maximum_discount,
                hsn_code_id_view: promo?.promo_item_hsn_sac_code,
                version_status: 'safe',
                discount_1: promo?.discount_1,
                discount_2: promo?.discount_2,
                discount_3: promo?.discount_3,
                discount1Flat: promo?.discount1Flat,
                discount2Flat: promo?.discount2Flat,
                discount3Flat: promo?.discount3Flat,

            }));
        } else if (this.getDataScheme?.scheme_type === 'price') {
            const totalAmount = Number(value?.totalAMTAfterDiscount || 0);

            if (totalAmount < requiredPrice) {
                this.toast.warning(
                    'Scheme is not applicable as total amount after discount does not meet the required scheme price.'
                );
                return;
            }

            const timesApplicable = Math.floor(totalAmount / requiredPrice);

            if (timesApplicable < 1) {
                this.toast.warning(
                    'Scheme cannot be applied as the price condition is not met.'
                );
                return;
            }
            promoResult = promoItems.map((promo: any) => ({
                product_master_id: promo?.promo_item_id,
                product_category_id: promo?.promo_category_id,
                product_sub_category_id: promo?.promo_subcat_id,
                variant_id: null,
                product_code: promo?.promo_item_code,
                product_description: promo?.promo_item_description,
                promo_item: true,
                new_item: true,
                promo_order_qty: Number(promo?.promo_qty || 0) * timesApplicable,
                apply_scheme: true,
                product_name: promo?.promo_item_name,
                hsn_code_id: promo?.promo_item_hsn_sac_code_id,
                igst: promo?.promo_item_igst,
                price_per_unit: promo?.promo_item_price_amount_promo,
                warranty: promo?.warranty,
                uom_name: promo?.promo_item_uom_name,
                // maximum_discount: promo?.maximum_discount,
                hsn_code_id_view: promo?.promo_item_hsn_sac_code,
                version_status: 'safe',
                discount_1: promo?.discount_1,
                discount_2: promo?.discount_2,
                discount_3: promo?.discount_3,
                discount1Flat: promo?.discount1Flat,
                discount2Flat: promo?.discount2Flat,
                discount3Flat: promo?.discount3Flat,
            }));
        }

        const finalData: any[] = [];

        promoResult.forEach((promo: any) => {
            finalData.push(promo);
        });

        const restore_data: any = [];
        currentList.forEach((item: any, i: number) => {
            let isMatched = false;

            if (this.getDataScheme?.scheme_type === 'item') {
                isMatched = selectData.some(
                    (cond: any) =>
                        cond.selected_item_id === item.product_master_id &&
                        Number(item.qty) >= Number(cond.selected_qty)
                );
            } else if (
                this.getDataScheme?.scheme_type === 'qty' ||
                this.getDataScheme?.scheme_type === 'price'
            ) {
                isMatched = true;
            }

            const schemeExtra = this.schemeExtraData?.[i] || {};
            const itemPayload: any = {
                product_master_id: item?.product_master_id,
                product_category_id: item?.product_category_id,
                product_sub_category_id: item?.product_sub_category_id,
                variant_id: null,
                product_code: item?.product_code,
                product_description: item?.product_description,
                qty: item?.qty,
                apply_scheme: isMatched,
                select_scheme: item?.select_scheme,
                branding_data: schemeExtra?.branding_data ?? item?.branding_data,
                customization: schemeExtra?.customization ?? item?.customization,
                customisation_data:
                    schemeExtra?.customisation_data ?? item?.customisation_data,
                id_product: item?.id_product,
                custom_branding: item?.custom_branding,
                customizeTotal: item?.customizeTotal,
                product_name: item?.name_product,
                hsn_code_id: item?.MASTER_PRODUCT?.hsn_code_id || item?.hsn_code_id,
                igst: item?.igst,
                warranty: item?.warranty,
                price_per_unit: item?.price_per_unit,
                min_price: item?.min_price,
                max_price: item?.max_price,
                original_price_per_unit: item?.price_per_unit,
                original_min_price: item?.min_price,
                original_max_price: item?.max_price,
                uom_name: item?.uom_name,
                // maximum_discount: item?.maximum_discount,
                hsn_code_id_view: item?.hsn_code_id_view,
                discount_1: item?.discount_1,
                discount_2: item?.discount_2,
                discount_3: item?.discount_3,
                discount1Flat: item?.discount1Flat,
                discount2Flat: item?.discount2Flat,
                discount3Flat: item?.discount3Flat,
            };

            if (!item.id) {
                itemPayload.new_item = true;
            } else {
                itemPayload.id = item.id;
            }

            finalData.push(itemPayload);

            restore_data.push(item?.id_product);
        });

        const appliedSchemeIds =
            this.getDataScheme?.scheme_type === 'item'
                ? currentList
                    .filter((item: any) =>
                        selectData.some(
                            (cond: any) =>
                                cond.selected_item_id === item.product_master_id &&
                                Number(item.qty) >= Number(cond.selected_qty)
                        )
                    )
                    .map((item: any) => item.id)
                    .filter((id: any) => id !== null && id !== undefined)
                : [];

        const uniqueAppliedSchemeIds = [...new Set(appliedSchemeIds)];

        const data = {
            scheme_id: this.schemeId,
            quotation_id: this.leadId,
            createLeadDetails: finalData,
            apply_scheme_id: uniqueAppliedSchemeIds,
            customer_type: this.customer_type,
            customer_id: this.client_id,
            proposal_no: this.proposalForm?.value?.proposal_no,
            action_type: false,
            proposal_id: this.proposalId,
            version_id: this.version_id,
            restore_id: restore_data,
        };

        //console.log(data?.createLeadDetails, 'data');
        this.applySchemeItemsToFormArray(data?.createLeadDetails?.reverse());
    }

    applySchemeItemsToFormArray(createLeadDetails: any[]) {
        const formArray = this.proposalForm.get('productDetailList') as FormArray;

        // Optional: clear existing rows before adding new ones
        formArray.clear();

        createLeadDetails.forEach((x, index) => {
            const group = this.fb.group({
                product_master_id: [x.product_master_id || null],
                product_category_id: [x.product_category_id || null],
                product_sub_category_id: [x.product_sub_category_id || null],
                variant_id: [x.variant_id || null],
                product_code: [x.product_code || null],
                product_description: [x.product_description || null],
                qty: [x.qty || x.promo_order_qty || 0],
                apply_scheme: [x.apply_scheme || false],
                promo_item: [x.promo_item || false],
                new_item: [x.new_item || false],
                uom_name: [x.uom_name || null],
                hsn_code_id: [this.getHsnCode(x.hsn_code_id || null, index)],
                price_per_unit: [x.price_per_unit || null],
                warranty: [x.warranty || null],
                min_price: [x.min_price || null],
                max_price: [x.max_price || null],
                igst: [x.igst || null],
                maximum_discount: 0,//[x.maximum_discount || null],
                select_scheme: [x.select_scheme || []],
                discount_request: [x.discount_request || null],
                discount_approved: [x.discount_approved || null],
                readonly: [false],
                id: [x.id || null],
                // select_scheme:[x?.select_scheme],
                version_status: [x.version_status || null],
                branding_data: [x?.branding_data || null],
                customization: [x?.customization || null],
                customisation_data: [x?.customisation_data || null],
                id_product: [x?.id_product],
                custom_branding: [x?.custom_branding],
                customizeTotal: [x?.customizeTotal],
                product_name: [x?.product_name],
                hsn_code_id_view: [x?.hsn_code_id_view],
                discount_1: [x?.discount_1],
                discount_2: [x?.discount_2],
                discount_3: [x?.discount_3],
                discount1Flat: [x?.discount1Flat],
                discount2Flat: [x?.discount2Flat],
                discount3Flat: [x?.discount3Flat],
                bomArray: [x.bomArray || []]
            });

            formArray.push(group);

            // ✅ After pushing to FormArray, trigger subcategory and item fetching
            const newIndex = formArray.length - 1;
            this.getSubCategory(x.product_category_id, newIndex);
            this.getAllActiveProductView(
                x.product_sub_category_id,
                x.product_category_id,
                newIndex,
                x.product_master_id
            );
        });
        const formArrayTwo = this.proposalForm.get('productDetailList') as FormArray;
        //console.log(formArrayTwo, "formArrayTwo<<<<<<<<<")
        const hasApplyScheme = formArrayTwo?.value?.some((item: any) => item.apply_scheme === true);

        //console.log(hasApplyScheme, "hasApplyScheme");
        this.hasApplyScheme = hasApplyScheme
    }

    calculatePromoItems(
        currentList: any,
        schemeData: any,
        promo_item: any,
        requiredMatchCount: number
    ) {
        const userQtyMap = new Map();

        currentList.forEach((item: any) => {
            userQtyMap.set(item.product_master_id, Number(item.qty) || 0);
        });

        let matchCount = 0;
        const matchedTimes: number[] = [];

        schemeData.forEach((condition: any) => {
            const requiredQty = Number(condition.selected_qty) || 0;
            const userQty = userQtyMap.get(condition.selected_item_id) || 0;

            if (userQty >= requiredQty) {
                matchCount++;
                const applicableTimes = Math.floor(userQty / requiredQty);
                matchedTimes.push(applicableTimes);
            }
        });

        if (matchCount >= requiredMatchCount && matchedTimes.length > 0) {
            const applicableTimes = Math.min(...matchedTimes);

            if (applicableTimes > 0 && promo_item.length > 0) {
                return promo_item.map((promo: any) => ({
                    product_master_id: promo.promo_item_id,
                    promo_order_qty: applicableTimes * promo.promo_qty,
                    promo_item: true,
                    new_item: true,
                    product_category_id: promo?.promo_category_id,
                    product_sub_category_id: promo?.promo_subcat_id,
                    product_code: promo?.promo_item_code,
                    product_description: promo?.promo_item_description,
                    apply_scheme: true,
                    version_status: 'safe',
                    product_name: promo?.promo_item_name,
                    hsn_code_id: promo?.promo_item_hsn_sac_code_id,
                    igst: promo?.promo_item_igst || 0,
                    price_per_unit: promo?.promo_item_price_amount_promo,
                    warranty: promo?.warranty,
                    uom_name: promo?.promo_item_uom_name,
                    hsn_code_id_view: promo?.promo_item_hsn_sac_code,
                }));
            }
        }

        return [];
    }

    quntityCheck(currentList: any) {
        //console.log(currentList, 'currentList');
        const totalQty = currentList.reduce((sum: any, item: any) => {
            return sum + Number(item.qty || 0);
        }, 0);

        //console.log('Total Qty:', totalQty);
        this.totalQty = totalQty;
    }

    removeSelect() {
        const formArray = this.proposalForm.get('productDetailList') as FormArray;

        const keepRows: any[] = [];

        for (let i = 0; i < formArray.length; i++) {
            const row = formArray.at(i) as FormGroup;
            const isPromoItem =
                row.get('promo_item')?.value === true ||
                row.get('promo_item')?.value === 1;

            if (!isPromoItem) {
                // ✅ Keep only non-promo items, and reset apply_scheme flag
                row.get('apply_scheme')?.setValue(false);
                keepRows.push({ ...row.value }); // clone the data
            }
        }

        // ✅ Reset the form array completely
        formArray.clear();

        // ✅ Re-inject only the non-promo rows
        keepRows.forEach((rowData, i) => {
            const group = this.fb.group({
                product_master_id: [rowData.product_master_id || null],
                product_category_id: [rowData.product_category_id || null],
                product_sub_category_id: [rowData.product_sub_category_id || null],
                variant_id: [rowData.variant_id || null],
                product_code: [rowData.product_code || null],
                product_description: [rowData.product_description || null],
                qty: [rowData.qty || 0],
                apply_scheme: [false],
                promo_item: [false],
                new_item: [rowData.new_item || false],
                uom_name: [rowData.uom_name || null],
                hsn_code_id: [rowData.hsn_code_id || null],
                warranty: [rowData.warranty || null],
                price_per_unit: [rowData.price_per_unit || null],
                igst: [rowData.igst || null],
                maximum_discount: 0,//[rowData.maximum_discount || null],
                select_scheme: [rowData.select_scheme || []],
                discount_request: [rowData.discount_request || null],
                discount_approved: [rowData.discount_approved || null],
                readonly: [false],
                id: [rowData.id || null],
                version_status: [rowData.version_status || null],
                branding_data: [rowData.branding_data || null],
                customization: [rowData.customization || null],
                customisation_data: [rowData.customisation_data || null],
                id_product: [rowData.id_product || null],
                custom_branding: [rowData.custom_branding || null],
                customizeTotal: [rowData?.customizeTotal || null],
                product_name: [rowData.product_name || null],
                name_product: [rowData.name_product || null],
                hsn_code_id_view: [rowData?.hsn_code_id_view || null],
                discount_1: [rowData?.discount_1],
                discount_2: [rowData?.discount_2],
                discount_3: [rowData?.discount_3],
                discount1Flat: [rowData?.discount1Flat],
                discount2Flat: [rowData?.discount2Flat],
                discount3Flat: [rowData?.discount3Flat],
                bomArray: [rowData.bomArray || []]
            });

            formArray.push(group);

            // 🔄 Restore dropdown data if required
            this.getSubCategory(rowData.product_category_id, i);
            this.getAllActiveProductView(
                rowData.product_sub_category_id,
                rowData.product_category_id,
                i,
                rowData.product_master_id
            );
        });
        this.onScheme = false;

        // ✅ Clear scheme dropdown
        this.proposalForm.get('schemeData')?.setValue(null);

        // Optional success toast
        this.toast.success('Scheme removed successfully.');
    }

    isClicked: boolean = false;
    updateItemStatus(control: any, status: any, index: number) {
        Swal.fire({
            title: 'Are you sure?',
            html: `
            <p>You won't be able to ${status} this!</p>
            <textarea id="remark" class="swal2-textarea" placeholder="Enter remark" rows="1"></textarea>
          `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${status} it!`,
            preConfirm: () => {
                const remark = (document.getElementById('remark') as HTMLTextAreaElement)?.value.trim();
                if (!remark) {
                    Swal.showValidationMessage('Remark is required');
                    return false;
                }
                return remark;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const remark = result.value;

                // 🔁 Call the backend with the remark if needed
                this.$proposal
                    .updateProposalItemStatus(
                        control,
                        status,
                        control.approval_id,
                        this.version_id,
                        this.proposalId,
                        remark // ➕ You can pass this if your API accepts it
                    )
                    .subscribe({
                        next: (res: any) => {
                            this.toast.success(`${res?.message}`);
                            this.CF_1.productDetailList
                                .at(index)
                                .get('isClicked')
                                .patchValue(true);
                        },
                        error: (err) => {
                            this.toast.error(`${err?.error?.message}`);
                        },
                    });
            }
        });
    }

    reject() {
        this._router.navigate(['/master/sales/discount-request']);
    }

    additionalChargeAll() {
        this.$proposal
            .getAllAdditionalCharge(this.entityId, this.financial_year_id)
            .subscribe((res: any) => {
                this.additionalChargeData = res.data;
            });
    }

    additionalCharge(e: any, i: any) {
        this.$proposal
            .getAllAdditionalChargeGetBy(e.value)
            .subscribe((res: any) => {
                this.additionalChargeDataGetBy = res.data;

                this.CF_2.chargesDetailList.at(i)?.patchValue({
                    charges_hsn_id: res.data?.hsn_sac_code,
                    charges_rate: res.data?.gstRate,
                    charges_desc: res.data?.description_additional,
                    charge_name: res.data?.additional_name
                });
            });
    }

    getAllCountry() {
        this._empRegistration.getAllActivecountry().subscribe((res: any) => {
            if (res) {
                this.countryList = res.data;
            }
        });
    }

    getAllState(countryId: any) {
        this._empRegistration.getStateByCountry(countryId).subscribe((res: any) => {
            if (res && res?.data) {
                this.stateList = res?.data;
            }
        });
    }

    getAllCity(stateId: any) {
        this._empRegistration.getCityByState(stateId).subscribe((res: any) => {
            if (res && res?.data) {
                this.cityList = res?.data;
            }
        });
    }
    getAllShippingState(countryId: any) {
        this._empRegistration.getStateByCountry(countryId).subscribe((res: any) => {
            if (res && res?.data) {
                this.shippingStateList = res?.data;
            }
        });
    }

    getAllShippingCity(stateId: any) {
        this._empRegistration.getCityByState(stateId).subscribe((res: any) => {
            if (res && res?.data) {
                this.shippingCityList = res?.data;
            }
        });
    }

    getCustomerContactById(customerId: any) {
        this.salesService
            .getCustomerContactById(customerId)
            .subscribe((res: any) => {

                if (res && res?.data) {
                    this.customerContactList = res?.data.map((c: any) => ({
                        ...c,
                        displayValue: `${c.title ?? ''} ${c.contact_person_name}`.trim()
                    }));

                    if (this.proposalForm.get('contact_person_id')?.value) {
                        this.proposalForm
                            .get('contact_person_id')
                            .setValue(this.proposalForm.get('contact_person_id')?.value);
                    }
                    else if (this.client_id && this.type_existing === 'existing_client') {
                        this.proposalForm
                            .get('contact_person_id')
                            .setValue(this.customerContactList[0]?.id || null);
                        // this.proposalForm
                        //     .get('contact_person_id')
                        //     .setValue(this.customerContactList[0]?.id || null);
                    }
                }
            });
    }

    acceptedPI() {
        Swal.fire({
            title: 'Are you sure want to Accepted The PI?',
            // text: 'You will not be able to recover this file!',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#063178',
            confirmButtonColor: '#f44336',
            confirmButtonText: 'Yes!',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.value) {
                let status: any = "ACCEPTED"
                let customer_status: any = "APPROVED"
                let booking_status: any = "APPROVED"
                this.accept(status, customer_status, booking_status)
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Swal.fire(
                //   'Cancelled',
                //   'Your imaginary file is safe :)',
                //   'error'
                // )
            }
        });
    }

    accept(status: any, customer_status: any, booking_status: any) {
        let data = {
            email_status: status,
            customer_status: customer_status,
            pi_id: this.routerParams?.idPI,
            version_id: this.version_id,
            proposal_id: this.proposalId,
            booking_status: booking_status
        }
        this.$proposal.updateAcceptPI(data).subscribe((res: any) => {
            // console.log(res)
            this.toast.success(`${res?.message}`)
            this.emailCheckBtn = true;
        },
            ((err: any) => {
                this.toast.error("Something Went To Wrong")
            })
        )
    }

    rejectPI() {
        Swal.fire({
            title: 'Are you sure you want to reject this PI?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f44336', // red
            cancelButtonColor: '#063178',  // blue
            confirmButtonText: 'Yes!',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                let status: any = "REJECTED"
                let customer_status: any = "REJECTED"
                let booking_status: any = "REJECTED"

                this.accept(status, customer_status, booking_status)
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Optionally handle cancel action
                Swal.fire({
                    title: 'Cancelled',
                    text: 'PI rejection was cancelled.',
                    icon: 'info'
                });
            }
        });
    }

    generateSalesBookingNo(financial_year_id: any) {
        this.salesService.generateSalesBookingNo(financial_year_id).subscribe({
            next: (res: any) => {
                this.proposalForm.get('sales_booking_no')?.patchValue(res?.data);
            }, error: (err) => {
                this.toast.error(err.error.message);
            }
        })
    }
    createBookingSales() {

        const value = this.proposalForm.getRawValue();
        if (!value.schedule_delivery_date) {
            this.toast.error("Schedule Delivery Date is mandatory!");
            return;
        }
        const calculateTotal = Number(value?.grant_total) - (value?.sactioned_credit_limit);
        if (this.isSubmitting) return;
        //this.isSubmitting = true;

        let productDetail = value.productDetailList
        let copyProductDetailList = value.copyProductDetailList
        const hasChanges: any = this.isPriceOrQtyChanged(productDetail, copyProductDetailList);
        console.log('Has Changes:', hasChanges)
        let soStatus;
        if (hasChanges === true) {
            soStatus = "PENDING"
        } else {
            soStatus = "PENDING"
        }
        const updatedProductDetailList = value.productDetailList.map(
            (item: any, index: number) => {
                return {
                    ...item,
                    ...(this.schemeExtraData[index] || {}),
                };
            }
        );

        const updatedFormValue = {
            ...value,
            productDetailList: updatedProductDetailList,
        };
        let formData;
        const profit_center_id = this.proposalForm.get('profit_center_id');
        const cost_center_id = this.proposalForm.get('cost_center_id');
        if (this.routerParams?.type === 'WithPO') {
            if (!value.profit_center_id || !value.cost_center_id) {
                this.toast.error("Profit Center and Cost Center are mandatory!");
                return;
            }

            const poNumber = this.proposalForm.get('po_number');
            const poDate = this.proposalForm.get('po_date');
            const documentCtrl = this.proposalForm.get('document');

            // Always set required validators (3 fields always mandatory)
            poNumber?.setValidators([Validators.required]);
            poDate?.setValidators([Validators.required]);
            documentCtrl?.setValidators([Validators.required]);
            profit_center_id?.setValidators([Validators.required]);
            cost_center_id?.setValidators([Validators.required]);

            poNumber?.updateValueAndValidity();
            poDate?.updateValueAndValidity();
            documentCtrl?.updateValueAndValidity();
            profit_center_id?.updateValueAndValidity();
            cost_center_id?.updateValueAndValidity();

            // Since document is file input → value.document will be null until uploaded
            const fileSelected = value.document && value.document !== '' && value.document !== null;

            // If ANY field is empty → show error
            if (!value.po_number || !value.po_date || !fileSelected || !value.profit_center_id || !value.cost_center_id) {
                this.toast.error("PO Number, PO Date, Document, Profit Center and Cost Center are mandatory!");
                return;
            }

            formData = {
                paymentDetails: this.advanceDetails,
                login_id: this.userLoginId,
                customer_id: this.getData?.customer_id,
                financial_id: this.financial_year_id,
                entity_id: this.entityId,
                proposal_id: this.proposalId,
                scheme_id: this.getData?.scheme_id,
                sales_booking_no: value?.sales_booking_no,
                sales_booking_date: moment(new Date()).format("YYYY-MM-DD"),
                notes: "test",
                po_items: value.copyProductDetailList,
                is_deviation: hasChanges,
                is_withPO: true,
                version_id: this.version_id,
                so_status: soStatus,
                send_pi_link: `${this.liveUrl}send-pi-link?proposalId=${this.proposalId}&version_id=${this.version_id}&status=proformaAddMail&idPI=${this.routerParams?.idPI}&pageMode=piLink&type=edit`,
                uploadedFiles: this.uploadedFiles,
                schedule_delivery_date: moment(new Date(value.schedule_delivery_date)).format("YYYY-MM-DD"),
                sanction_credit_id: this.getCreditData?.id,
                ...updatedFormValue
            }
        } else if (this.routerParams?.type === 'WithoutPO') {
            if (!value.profit_center_id || !value.cost_center_id) {
                this.toast.error("Profit Center and Cost Center are mandatory!");
                return;
            }
            formData = {
                paymentDetails: this.advanceDetails,
                login_id: this.userLoginId,
                customer_id: this.getData?.customer_id,
                financial_id: this.financial_year_id,
                entity_id: this.entityId,
                proposal_id: this.proposalId,
                scheme_id: this.getData?.scheme_id,
                sales_booking_no: value?.sales_booking_no,
                is_withPO: false,
                is_book_created: true,
                sales_booking_date: moment(new Date()).format("YYYY-MM-DD"),
                notes: "test",
                version_id: this.version_id,
                schedule_delivery_date: moment(new Date(value.schedule_delivery_date)).format("YYYY-MM-DD"),
                so_status: "DRAFT",
                send_pi_link: `${this.liveUrl}send-pi-link?proposalId=${this.proposalId}&version_id=${this.version_id}&status=proformaAddMail&idPI=${this.routerParams?.idPI}&pageMode=piLink&type=edit`,
                sanction_credit_id: this.getCreditData?.id,
                ...updatedFormValue
            }
        }

        this.$proposal.createAddSo(formData).subscribe({
            next: (res: any) => {
                this.toast.success(res.message)
                this._router.navigate(['/master/sales/sales-booking/all-list']);
            }, error: (err) => {
                this.toast.error(err.error.message)
            },
        })
    }

    isPriceOrQtyChanged(
        productDetail: any[],
        copyProductDetailList: any[]
    ): boolean {
        for (let i = 0; i < productDetail.length; i++) {
            const original = productDetail[i];
            const copied = copyProductDetailList[i];

            if (
                original.price_per_unit !== copied.price_per_unit ||
                original.qty !== copied.qty
            ) {
                return true;
            }
        }

        return false;
    }

    sendSO() {
        const updatedFormValue = {
            booking_status: "APPROVED",
            version_id: this.version_id,
            proposal_id: this.proposalId,
            sales_booking_id: this.versionData.sales_booking_id,
            so_status: "APPROVED",
            pi_id: this.routerParams?.idPI,
            credit_remark: this.proposalForm.get('credit_remark')?.value || ''
        };


        this.$proposal.updateBookingStatus(updatedFormValue).subscribe({
            next: (res: any) => {
                this.toast.success(res.message);
                this._router.navigate(['/master/sales/so']);

            }, error: (err) => {
                this.toast.error(err.error.message);
            },
        })
    }

    rejectBooking() {
        const updatedFormValue = {
            booking_status: "REJECTED",
            version_id: this.version_id,
            proposal_id: this.proposalId,
            so_status: "REJECTED",
            pi_id: this.routerParams?.idPI
        };
        const dialogRef = this.dialog.open(UpdatedSalesBookComponent, { width: '450px', data: { cellData: updatedFormValue, status: "commercialReject" } });
        dialogRef.afterClosed().subscribe(result => {

        })
    }

    getProposalType() {
        this._configurationalMasterService.getProposalType().subscribe(
            (res: any) => {
                this.proposalTypeList = res.data;
            },
            (err: any) => {
                console.log(err);
            }
        )
    }

    imagePreviews: string[] = [];
    imagePath: any;
    uploadProgress: number = 0;
    uploadedFiles: string[] = [];
    // onChange(e: any) {
    //     const files: FileList = e.target.files;
    //     this.imagePreviews = [];
    //     const formData = new FormData();
    //     this.uploadProgress = 0;
    //     for (let i = 0; i < files.length; i++) {
    //         const file = files[i];
    //         const extension = this.getFileExtension(file.name).toLowerCase();

    //         formData.append('file', file);

    //         if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
    //             const reader = new FileReader();
    //             reader.onload = (event: any) => {
    //                 this.imagePreviews.push(event.target.result); // base64 preview
    //             };
    //             reader.readAsDataURL(file);
    //         }
    //     }

    //     this._configurationalMasterService.uploadDocument(formData).subscribe(
    //         (response: any) => {
    //             // if (response?.files?.length) {
    //             //   this.uploadedFiles = response.files; 
    //             // }
    //             if (response.type === HttpEventType.UploadProgress && response.total) {
    //                 this.uploadProgress = Math.round((response.loaded / response.total) * 100);
    //             }

    //             if (response.type === HttpEventType.Response) {
    //                 this.uploadedFiles = response.body?.files || [];
    //                 this.uploadProgress = 0;
    //             }
    //         },
    //         err => console.error(err)
    //     );
    // }

    // getFileExtension(filename: string): string {
    //     const parts = filename?.split('.');
    //     if (parts) {
    //         return parts[parts.length - 1];
    //     }
    //     return "";
    // }

    // seePreview(path: string, imagePath: any) {
    //     if (!this.imagePath) {
    //         if (path) {
    //             Swal.fire({
    //                 imageUrl: environment.servralUrl + path,
    //                 imageHeight: 250,
    //                 imageAlt: 'Uploaded Document',
    //                 confirmButtonColor: "#063178",
    //                 confirmButtonText: 'Ok',
    //             })
    //         }
    //     } else {
    //         Swal.fire({
    //             imageUrl: environment.servralUrl + path,
    //             imageHeight: 250,
    //             imageAlt: 'Profile Image',
    //             confirmButtonColor: "#063178",
    //             confirmButtonText: 'Ok',
    //         })
    //     }
    // };

    // generateFileUrl(uploadDoc: any) {
    //     const servralUrl = environment.servralUrl;
    //     const url = `${servralUrl}${uploadDoc}`;
    //     window.open(url, '_blank')
    // }


    onChange(event: any) {
        const files: FileList = event.target.files;

        // Always clear previous previews + file list
        this.imagePreviews = [];
        this.uploadedFiles = [];
        this.uploadProgress = 0;

        const formData = new FormData();

        if (!files || files.length === 0) return;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const extension = this.getFileExtension(file.name).toLowerCase();

            formData.append('file', file);

            // Image Preview
            if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    this.imagePreviews.push(e.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                // Non-image files only show link
                this.uploadedFiles.push(file.name);
            }
        }

        // Upload API call
        this._configurationalMasterService.uploadDocument(formData).subscribe(
            (response: any) => {
                if (response.type === HttpEventType.UploadProgress && response.total) {
                    this.uploadProgress = Math.round((response.loaded / response.total) * 100);
                }

                if (response.type === HttpEventType.Response) {
                    this.uploadedFiles = response.body?.files || [];
                    this.uploadProgress = 0;
                }
            },
            (err) => console.error(err)
        );
    }


    getFileExtension(filename: string): string {
        const parts = filename.split('.');
        return parts.length > 1 ? parts.pop()!.toLowerCase() : ''; // Get the extension and handle edge cases
    }

    seePreview(path: string, imagePath: any) {
        // Preview logic for images
        if (this.imagePath) {
            Swal.fire({
                imageUrl: environment.servralUrl + path,
                imageHeight: 250,
                imageAlt: 'Uploaded Document',
                confirmButtonColor: "#063178",
                confirmButtonText: 'Ok',
            });
        } else {
            Swal.fire({
                imageUrl: environment.servralUrl + path,
                imageHeight: 250,
                imageAlt: 'Profile Image',
                confirmButtonColor: "#063178",
                confirmButtonText: 'Ok',
            });
        }
    }

    generateFileUrl(uploadDoc: any) {
        const servralUrl = environment.servralUrl;
        const url = `${servralUrl}${uploadDoc}`;
        window.open(url, '_blank');
    }

    onFilePreview(file: any) {
        // Handle non-image files: Generate a link or icon for PDFs, Word docs, etc.
        const fileExtension = this.getFileExtension(file.name).toLowerCase();

        if (['pdf', 'docx', 'txt'].includes(fileExtension)) {
            return (
                `<a href="${this.generateFileUrl(file)}" target="_blank">View ${fileExtension.toUpperCase()} file</a>`
            );
        } else {
            // For other types of files, you can also provide a general "view" link
            return `<a href="${this.generateFileUrl(file)}" target="_blank">View File</a>`;
        }
    }

    //   sales_documents:any
    uploadDoc(event: any) {
        try {
            let isValidExtension = this.$common.checkForValidFile(event);
            if (!isValidExtension) {
                this.proposalForm.patchValue({ sales_documents: null });
                return this.sales_documents = ""
            }
            const formData = new FormData();
            if (event.target.files && event.target.files[0]) {
                formData.append('file', event.target.files[0]);
            }
            this.$miscellaneousService.documents(formData).subscribe((response: any) => {
                if (response) {
                    this.sales_documents = `uploaded_files/${response?.url}`;
                }
            }, err => {
                console.log(err);
            })
        } catch (error) {
            console.log(error);
        }
    }

    leadSourceList: any = [];
    createdByList: any = ['Self', 'Any Other'];
    salesEmployeeList: any = [];
    salesEmployeeList2: any = [];
    postOffice: any[] = [];
    employeList: any = []
    originalDate: Date | null = null;
    termOfDeliveryList: any = [];
    unloadingRespList: any = [];
    paymentSubList: any = [];
    freightList: any = [];
    insuranceList: any = [];
    locationList: any[] = ['Level 1', 'Level 2'];
    getLeadSource(financial_year_id: any, entity_id: any) {
        this.$proposal.getLeadSource(financial_year_id, entity_id).subscribe({
            next: (res) => {
                this.leadSourceList = res.data;
            }, error: (err) => {
                this.toast.error(err.error.message);
                return;
            }
        })
    }

    selectCreatedBy(createdBy: string) {
        if (createdBy === 'Any Other') {
            this.proposalForm.get('created_by_id')?.setValidators([Validators.required]);
            this.$proposal.getSalesCustomers().subscribe({
                next: (res) => {
                    this.salesEmployeeList = res.data;
                    this.salesEmployeeList2 = res.data;
                    this.employeList = res.data.map((res: any) => res.first_name);

                }, error: (err) => {
                    this.toast.error(err.error.message);
                    return;
                }
            })
        } else {
            this.salesEmployeeList = [];
            this.proposalForm.get('created_by_id')?.clearValidators();
        }
        this.proposalForm.get('created_by_id')?.updateValueAndValidity();
    }

    fetchPinDetails2() {
        let country = this.proposalForm.get('country_id')?.value;
        if (country) {
            this.getAllState(country);
        }
        let pin = this.proposalForm.get('pincode')?.value;
        this.$common.getPostOfficeByPincode(pin).subscribe(
            (response: any) => {
                if (response.PostOffice) {
                    this.postOffice = response.PostOffice;
                } else {
                    this.postOffice = [];
                }
            },
            (error: HttpErrorResponse) => {
                console.error(error);
            }
        );
    }

    fetchPinDetails() {
        let pin = this.proposalForm.get('shipping_pin_code')?.value;
        let country = this.proposalForm.get('shipping_country_id')?.value;


        if (!pin || !country) return;
        // State list 
        this.getAllShippingState(country);
        this.$common.getPostOfficeByPincode(pin).subscribe(
            (response: any) => {

                if (response.PostOffice && response.PostOffice.length > 0) {
                    this.postOffice = response.PostOffice;
                    const post = response.PostOffice[0];

                    let state_id = this.shippingStateList.find(
                        (x: any) => x.states_name.toLowerCase() === post.State.toLowerCase()
                    )?.states_id;

                    if (state_id) {
                        this.proposalForm.get('shipping_state_id')?.patchValue(state_id);
                        // this.proposalForm.get('shipping_state_id')?.disable();
                        this.getAllShippingCity(state_id);

                        // City patch 
                        setTimeout(() => {
                            let city_id = this.shippingCityList.find(
                                (x: any) => x.city_name.toLowerCase() === post.District.toLowerCase()
                            )?.city_id;

                            if (city_id) {
                                this.proposalForm.get('shipping_city_id')?.patchValue(city_id);
                            }
                        }, 800);
                        if (this.shippingToggle) {

                            if (this.postOffice && this.postOffice.length) {
                                const sourceData = (this.clientData && Object.keys(this.clientData).length > 0)
                                    ? this.clientData
                                    : this.getData;


                                const shippingPostalAddress = sourceData.postal_address
                                    ?.replace(/\s*,\s*/g, ',')
                                    .toLowerCase()
                                    .trim();

                                const postalAdd = this.postOffice.find((x: any) => {
                                    const combined = `${x.Name},${x.District}`
                                        .toLowerCase()
                                        .trim();
                                    return combined === shippingPostalAddress;
                                });

                                if (postalAdd) {
                                    this.proposalForm.patchValue({
                                        shipping_postal_address: `${postalAdd.Name}, ${postalAdd.District}`
                                    });
                                }
                            }


                        }
                    }
                } else {
                    this.toast.error("Pin code details not found")
                    this.postOffice = [];
                }
            },
            (error: HttpErrorResponse) => {
                console.error(error);
            }
        );
    }

    loadOnChanges() {
        this.proposalForm.get('country_id')?.valueChanges.subscribe((data: any) => {
            if (data) {
                if (data !== 101) {
                    this.proposalForm.get('pincode')?.patchValue(null);
                    this.proposalForm.get('postal_address')?.patchValue(null);
                    this.proposalForm.get('address')?.patchValue(null);
                    this.postOffice = [];
                    this.cityList = [];
                }
                this.getAllState(data);
            }
        });

        this.proposalForm.get('state_id')?.valueChanges.subscribe((data: any) => {
            if (data) {
                this.getAllCity(data);
            }
        });
    }

    state: any;
    selectPostal(event: any) {

        // this.state = event.split(',');

        // let state_id = this.shippingStateList.find((x: any) => x.states_name === this.state[2])?.states_id;
        // this.proposalForm.get('shipping_state_id')?.patchValue(state_id);
        // this.getAllShippingCity(state_id);
    }
    onDateChange(event: MatDatepickerInputEvent<Date>) {
        const selectedDate = event.value;
        if (selectedDate) {
            this.originalDate = selectedDate;
            const newDate = new Date(selectedDate);
            newDate.setDate(newDate.getDate());
            this.proposalForm.get('valid_till_date')?.setValue(newDate, { emitEvent: false });
        }
    }

    unloadingTerms: any[] = []; // second dropdown
    selectedUnloadingId: number | null = null;
    selectedUnloadingTerm: string = "";
    showAmountField: boolean = false;
    deliveryTermUnloadings() {
        this.$proposal.deliveryTermUnloadings().subscribe({
            next: (res: any) => {
                this.termOfDeliveryList = res.data.filter((x: any) => x.type !== 'Unloading')
                //this.unloadingRespList = res.data.filter((x: any) => x.type == 'Unloading')
                const unloadingData = res.data.filter((x: any) => x.type === "Unloading");
                // group by unloading
                this.unloadingRespList = unloadingData.reduce((acc: any, curr: any) => {
                    const found = acc.find((a: any) => a.unloading === curr.unloading);
                    // show/hide amount field
                    this.showAmountField = found?.unloading === "Elanpro";
                    if (found) {
                        found.delivery_terms.push({ id: curr.id, name: curr.delivery_term });
                    } else {
                        acc.push({
                            id: curr.id, // for first dropdown
                            unloading: curr.unloading,
                            delivery_terms: [{ id: curr.id, name: curr.delivery_term }]
                        });
                    }
                    return acc;
                }, []);
                // patch data after call API data
                const unloadingId = this.proposalForm.get('unloading_resp_id')?.value;
                const remark = this.proposalForm.get('unloading_resp_remark')?.value;
                if (unloadingId) {
                    this.onUnloadingChange(unloadingId, remark);
                }
            }, error: (error) => {
                console.log(error);
            }
        })
    }

    onUnloadingChange(unloadingId: number, remark: any) {

        const selected = this.unloadingRespList.find((x: any) => x.id === unloadingId);
        this.unloadingTerms = selected ? selected.delivery_terms : [];
        // Default select first unloading term
        if (this.unloadingTerms.length > 0) {
            this.selectedUnloadingTerm = remark ? remark : this.unloadingTerms[0].name;
            this.proposalForm.get('unloading_resp_remark')?.setValue(this.selectedUnloadingTerm);
        }
        // show/hide amount field
        this.showAmountField = selected?.unloading === "Elanpro";
        if (selected?.unloading !== "Elanpro") {
            this.proposalForm.get('unloading_resp_amount').clearValidators();

            this.proposalForm.get('unloading_resp_amount')?.setValue(null);

        } else {
            this.proposalForm.get('unloading_resp_amount').setValidators([Validators.required, Validators.min(18)]);
        }
        this.proposalForm.get('unloading_resp_amount').updateValueAndValidity();

    }

    paymentMainLists() {
        this.$proposal.paymentMainList().subscribe({
            next: (res: any) => {
                this.paymentMainList = res.data;
                this.mergePayments();
                this.arrangePaymentsInColumns();
                //this.updatePayments();
            }, error: (error) => {
                console.log(error);
            }
        })
    }

    paymentMainSubCategory(payment_main_id: any) {
        this.$proposal.subPaymentMainList(payment_main_id).subscribe({
            next: (res: any) => {
                this.paymentSubList = res.data;
            }, error: (error) => {
                console.log(error);
            }
        })
    }

    insuranceLists() {
        this.$proposal.insuranceList().subscribe({
            next: (res: any) => {
                this.insuranceList = res.data;
            }, error: (error) => {
                console.log(error);
            }
        })
    }

    freightLists() {
        this.$proposal.freightList().subscribe({
            next: (res: any) => {
                this.freightList = res.data;
            }, error: (error) => {
                console.log(error);
            }
        })
    }

    reloadCurrentRoute2() {
        let currentUrl = this.route.url;
        this._router.navigateByUrl('/master/sales/all-proposal', { skipLocationChange: true }).then(() => {
            this._router.navigate([currentUrl]);
        });
    }

    previewDialog(data: any) {
        if (this.existing_type === 'existing_client') {
            data.existing_client = true;
            data.customer_id = this.client_id;
        }

        if (this.actionType === 'edit' || this.routerParams?.status === "clone") {
            data.id = this.proposalId;
            data.create_lead_id = this.getData?.create_lead_id;
            data.type = 'edit';
        }
        if (!this.pi) {

            data.pageMode = this.routerParams?.status === "performance" ? 'pi' : 'quotation';
        } else {
            data.pageMode = 'pi';

        }

        let dialogRef = this.dialog.open(PreviewQuotationComponent, {
            position: { top: '0px' },
            width: "2000px",
            disableClose: true,
            data: {
                data,
                selectedCurrency: { ...this.selectedCurrency }
            }
            // data: data            
        })
        dialogRef.afterClosed().subscribe({
            next: (res: any) => {
                if (res && res.confirmed) {

                    // this.reloadCurrentRoute2();
                    // this._router.navigateByUrl('/master/sales/all-proposal')
                    if (this.dyanamicValue === 'Create Sales Booking' || this.dyanamicValue === 'Edit Sales Booking') {
                        this._router.navigateByUrl('/master/sales/sales-booking/all-list');
                    } else if (this.pi) {
                        this._router.navigateByUrl('/master/sales/proforma-invoice');
                    } else {
                        this._router.navigateByUrl('/master/sales/all-proposal');
                    }
                }
            }, error: (err: any) => {
                this.toast.error(err?.error?.message || 'Something went Wrong');
            }

        })
    }

    warehouseList: any = [];
    selectLocation(event: any) {
        this.$crm.getWarehouseByLocation(event).subscribe({
            next: (res: any) => {
                if (!res.data.length) {
                    this.toast.error('Warehouse not found', 'Fields Error');
                    return;
                }
                this.warehouseList = res.data;
            }, error: (err) => {
                this.warehouseList = [];
            }
        })
    }

    isChecked: boolean = false;
    // IscheckedAdvance(event: any) {
    //     if (event.checked) {
    //         this.isChecked = true;
    //     } else {
    //         this.isChecked = false;
    //         this.proposalForm.get('advance_amount').reset()
    //     }
    // }

    IscheckedAdvance(event: Event) {
        const checked = (event.target as HTMLInputElement).checked;

        if (checked) {
            this.isChecked = true;
        } else {
            this.isChecked = false;
            this.proposalForm.get('advance_amount')?.reset();
        }
    }

    getLocationData: any = [];
    getLocationList() {
        this._empRegistration.getAllLocation().subscribe({
            next: (res: any) => {
                if (!res.data.length) {
                    this.toast.error('Warehouse not found', 'Fields Error');
                    return;
                }
                this.getLocationData = res.data;
            }, error: (err) => {
                this.getLocationData = [];
            }
        })
    }

    creditData: any;
    getCreditData: any;
    getAllSanctionCreditLimits() {
        this._configurationalMasterService.getAllSanctionCreditLimits().subscribe((res: any) => {
            this.creditData = res.data;
            res.data?.forEach((val: any) => {
                if (val?.customer_category_id === this.versionData?.customer_category_id) {
                    this.getCreditData = val
                }
            })
            this.proposalForm.patchValue({
                sactioned_credit_limit: this.getCreditData?.amount,
                // available_credit_limit: this.getCreditData?.amount
            })
        });
    }

    getItemNameById(list: any[], id: number) {
        return list?.find(x => x.id === id)?.item_name || '-';
    }

    reportingManegerExist() {
        this.$crm.reportingManegerExist(this.userLoginId).subscribe(
            (res: any) => {
                if (res) {
                    const levelData = res.trace?.filter((val: any) => val?.exists === true);
                    if (!res.exists) {
                        Swal.fire({
                            title: 'Oops!',
                            text: res.message,
                            icon: 'warning',
                            confirmButtonColor: '#d33',
                            confirmButtonText: 'Ok'
                        });
                        return
                    }
                    this.levelOneData = levelData[0];
                    this.levelOneData.user_id = res.reporting_Man_id;
                    this.forwardSOToRM();
                } else {
                    this.toast.error('Something went wrong');
                }
            }
        )
    }

    forwardSOToRM() {
        if (this.isForwordingToRM) {
            if (!this.levelOneData) {
                this.toast.error('Reporting Manager not found');
                return;
            }
            this.proposalForm.patchValue({
                forward_to_id: this.levelOneData.user_id,
                forward_to_level: this.levelOneData.level
            })
            const grant_total = this.proposalForm.get('grant_total')?.value || 0;
            const sactioned_credit_limit = this.proposalForm.get('sactioned_credit_limit')?.value || 0;
            const available_credit_limit = this.proposalForm.get('available_credit_limit')?.value || 0;

            const data = {
                is_withPO: true,
                proposal_id: this.proposalId,
                version_id: this.version_id,
                forward_to_id: this.levelOneData.user_id,
                forward_to_level: this.levelOneData.level,
                from_user_id: this.userLoginId,
                type: 'SO_TO_RM',
                booking_status: "FORWARD",
                so_status: "FORWARD",
                pi_id: this.routerParams?.idPI,
                credit_approval_status: "Forward",
                grant_total,
                sactioned_credit_limit,
                available_credit_limit,
                customer_id: this.getData?.customer_id,
                sales_booking_id: this.versionData.sales_booking_id,
                remarks: this.proposalForm.get('credit_remark')?.value || ''
            }

            this.$proposal.forwardSOToRM(data).subscribe({
                next: (res: any) => {
                    this.toast.success(res.message);
                    // this.toast.success(`Sending request forwarding to your Reporting Manager Level-${this.levelOneData.level}`);
                    // this.reloadCurrentRoute2();
                    // this._router.navigateByUrl('/master/sales/all-proposal')
                }, error: (err) => {
                    this.toast.error(err.error.message)
                }
            })
        } else {
            this.proposalForm.patchValue({
                forward_to_id: null,
                forward_to_level: null
            })
        }
    }

    get isForwordingToRM(): boolean {
        const grant_total = parseFloat(this.proposalForm.get('grant_total')?.value) || 0;
        const sactioned_credit_limit = parseFloat(this.proposalForm.get('sactioned_credit_limit')?.value) || 0;
        const available_credit_limit = parseFloat(this.proposalForm.get('available_credit_limit')?.value) || 0;
        // console.log(typeof grant_total, typeof sactioned_credit_limit, typeof available_credit_limit);
        // if (available_credit_limit <= 0 || grant_total > available_credit_limit) {
        if (available_credit_limit > 0 && grant_total > available_credit_limit) {
            const percentIncrease = ((grant_total - available_credit_limit) / sactioned_credit_limit) * 100;
            if (this.getData.CLAW_Data && this.getData.CLAW_Data.MASTER_LEVEL) {
                if ((this.getData.CLAW_Data.MASTER_LEVEL?.MASTER_CREDIT_LIMITs[0]?.credit_limit || 0) >= percentIncrease) {
                    return false;
                }
            }
            //console.log('Exceeded by %:', percentIncrease.toFixed(2));
            return true;
        }
        const creditRemarkControl = this.proposalForm.get('credit_remark');
        creditRemarkControl?.addValidators([Validators.required]);
        creditRemarkControl?.updateValueAndValidity();
        return false;
    }

    openDialogSOforword(type: boolean) {
        const dialog = this.dialog.open(SoForwordDialogComponent, {
            width: '700px',
            height: '400px',
            disableClose: true,
            data: {
                type,
                proposal_id: this.proposalId,
                version_id: this.version_id,
                sales_booking_id: this.versionData.sales_booking_id,
            }
        });
        dialog.afterClosed().subscribe((res: any) => {
            if (res.isSubmit) {
                this.proposalForm.patchValue({
                    credit_remark: res.credit_remark
                });
                if (type) {
                    this.reportingManegerExist();
                } else {
                    this.sendSO();
                }
            }
        })
    }

    // select type for payment terms
    selectedType: string = 'value'; // default selected
    onDiscountTypeChange(type: string) {
        this.selectedType = type;
        // this.mergePayments();
        console.log("Selected Type:", type);
    }

    // Master + DB merge
    mergePayments() {
        this.paymentList = this.paymentMainList.map((master: any) => {
            const dbEntry = this.paymentDbList.find((d: any) => Number(d.payment_id) === Number(master.id));
            let value = dbEntry ? dbEntry.payment_value : 0;

            if (master.id === 4) {
                value = Math.floor(Number(value));  // parseInt(value, 10)
            } else {
                value = Number(value).toFixed(2);   // 2 upto decimal
            }

            // if value is 0 or 0.00 → make it empty string
            if (Number(value) === 0) {
                value = '';
            }

            return {
                id: master.id,
                payment_name: master.payment_name,
                payment_value: value
            };
        });

        this.arrangePaymentsInColumns();
        this.updatePayments();
    }

    // Column-wise breakup (UI ke liye)
    arrangePaymentsInColumns() {
        this.paymentRows = [];
        for (let i = 0; i < this.paymentList.length; i += this.columnsNumber) {
            this.paymentRows.push(this.paymentList.slice(i, i + this.columnsNumber));
        }
    }

    onPaymentChange(event: any, payment: any) {
        const newValue = Number(event.target.value) || 0;
        //payment.payment_value = newValue;  // directly object update

        this.paymentList = this.paymentList.map(p =>
            p.id === payment.id ? { ...p, payment_value: newValue } : p
        );
        // total + final array refresh
        this.updatePayments('keyPress');
    }

    // Total & final array update
    updatePayments(event: any = null) {
        this.totalPaymentTab = this.paymentList
            .filter(p => p.id !== 4) // exclude "After Dispatch (Days)"
            .map(p => Number(p.payment_value) || 0)
            .reduce((a, b) => a + b, 0);

        if (event != 'keyPress') {
            this.selectedType = this.totalPaymentTab == 100 ? 'percent' : 'value';
        }

        this.finalPaymentArray = this.paymentList.map(p => ({
            payment_id: p.id,
            payment_value: Number(p.payment_value) || 0
        }));
    }

    formatPaymentValue(value: any) {
        if (this.selectedType === 'percent') {
            // remove .00
            if (value % 1 === 0) {
                return parseInt(value, 10);
            }
        }
        return value;
    }

    employeeSearch(e: any) {
        const aa = e;
        let filteredVariable = this.salesEmployeeList2.filter((item: any) =>
            aa.includes(item.first_name)
        );
        this.salesEmployeeList = filteredVariable;
    }

    isInsuranceAmt: boolean = false;
    selectInsurance(event: any) {
        const insuranceAmount = this.proposalForm.get('insurance_amt');
        if (event === 1) {
            this.isInsuranceAmt = true;
            insuranceAmount?.addValidators([Validators.required]);

        } else {
            this.isInsuranceAmt = false;
            insuranceAmount?.clearValidators([Validators.required]);
            //this.proposalForm.get('insurance_amt').patchValue(null);
        }
        insuranceAmount?.updateValueAndValidity();
    }

    checkSchemeStatusByClientCategory(clientId: any) {
        if (!clientId) {
            this.checkSchcme = false;
            return;
        }

        this.$proposal.checkSchemeStatusByClientCategory(clientId).subscribe((response: any) => {
            this.checkSchcme = response?.data == 'ACTIVE' ? true : false;
        },
            (err) => {
                this.checkSchcme = false;
                console.log(err);
            }
        );
    }

    isDisabledField() {
        if (this.actionType == 'approval' || this.actionType == 'view' || !this.actionType) {
            this.isReadOnly = true;
            this.proposalForm.get('warranty_month_remark')?.disable();
            this.proposalForm.get('location_id')?.disable();
            this.proposalForm.get('warehouse_id')?.disable();
            this.proposalForm.get('shipping_country_id')?.disable();
            this.proposalForm.get('shipping_state_id')?.disable();
            this.proposalForm.get('shipping_city_id')?.disable();
            this.proposalForm.get('shipping_postal_address')?.disable();
            this.proposalForm.get('delivery_term_id')?.disable();
            this.proposalForm.get('unloading_resp_id')?.disable();
            this.proposalForm.get('unloading_resp_remark')?.disable();
            this.proposalForm.get('insurance_id')?.disable();
            this.proposalForm.get('created_by')?.disable();
            this.proposalForm.get('lead_source')?.disable();
            this.proposalForm.get('shipping_address')?.disable();
            this.proposalForm.get('shipping_pin_code')?.disable();
            this.proposalForm.get('valid_till_date')?.disable();
            this.proposalForm.get('advance_check')?.disable();
            this.proposalForm.get('insurance_amt')?.disable();
            this.proposalForm.get('delivery_term_remark')?.disable();
            this.proposalForm.get('gst_no')?.disable();
            this.proposalForm.get('billing_address_id')?.disable();
            this.proposalForm.get('shipping_address_id')?.disable();
        }
    }



    billingAddressList: any = []
    shippingAddressList: any = []
    getsCustomerAddress(customer_id: any) {
        this.$proposal.getsCustomerAddress(customer_id).subscribe({
            next: (res: any) => {
                console.log(res)
                this.billingAddressList = res.data.billingAddress;
                this.shippingAddressList = res.data.shippingAddress;
            }, error: (err) => {
                console.log(err);
            }
        })
    }

    selectBillingAddress(billingAddress: any) {
        
        this.proposalForm.patchValue({
            country_id: billingAddress?.billing_country_id,
            state_id: billingAddress?.billing_state_id,
            city_id: billingAddress?.billing_city_id,
            postal_address: billingAddress?.billing_postal_address,
            pincode: billingAddress?.billing_pin_code,
            address: billingAddress?.billing_address,
        })
  this.updateBillingValidators(billingAddress?.billing_country_id);
    }
    selectShippingAddress(shippingAddress: any) {

        this.getAllShippingState(shippingAddress?.shipping_country_id);
        this.getAllShippingCity(shippingAddress?.shipping_state_id);

        this.proposalForm.patchValue({
            shipping_country_id: shippingAddress?.shipping_country_id || '',
            shipping_state_id: shippingAddress?.shipping_state_id || '',
            shipping_city_id: shippingAddress?.shipping_city_id || '',
            shipping_postal_address: shippingAddress?.shipping_postal_address || '',
            shipping_pin_code: shippingAddress?.shipping_pin_code || '',
            shipping_address: shippingAddress?.shipping_address || '',
            shipping_gst_in: shippingAddress?.shipping_gst_in || '',
        })
        this.updateShippingValidators(shippingAddress?.shipping_country_id);
        this.fetchPinDetails();
    }


    updateBillingValidators(countryId: any) {
        const requiredFields = ['state_id','city_id','postal_address','pincode','address'];

        this.proposalForm.get('country_id')?.setValidators([Validators.required]);

        requiredFields.forEach(field => {
            const control = this.proposalForm.get(field);

            if (countryId == 101) {
                control?.setValidators([Validators.required]);
            } else {
                control?.clearValidators();
            }
            control?.updateValueAndValidity();
        });
    }

    updateShippingValidators(countryId: any) {
        const requiredFields = ['shipping_state_id','shipping_city_id','shipping_postal_address','shipping_pin_code','shipping_address','shipping_gst_in'];

        this.proposalForm.get('shipping_country_id')?.setValidators([Validators.required]);

        requiredFields.forEach(field => {
            const control = this.proposalForm.get(field);

            if (countryId == 101) {
                control?.setValidators([Validators.required]);
            } else {
                control?.clearValidators();
            }
            control?.updateValueAndValidity();
        });
    }
    selectedBomData: any[] = [];
    selectBOMKit(i: any, control: any) {
        let formValue = this.proposalForm?.getRawValue();
        const items = formValue.productDetailList || [];

        const productName = control?.value?.name_product ?? control?.value?.product_name ?? items[i]?.product_name ?? '';
        const productCode = control?.value?.product_code ?? items[i]?.product_code ?? '';

        const data = {
            index: i,
            item_list_id: control?.value?.id ?? control?.value?.id_product ?? items[i]?.product_id ?? null, // CRM_PROPOSAL_LIST_MST
            item_id: control?.value?.product_master_id ?? items[i]?.product_master_id,
            item_name: productCode ? `${productName} | ${productCode}` : productName,
            qty: control?.value?.qty ?? items[i]?.qty ?? 0,
            proposal_no: this.proposalForm?.value?.proposal_no || null,
            actionType: this.actionType,
            version_id: isNaN(Number(this.version_id)) ? 0 : Number(this.version_id),
            proposal_id: isNaN(Number(this.proposalId)) ? 0 : Number(this.proposalId),
            client_id: this.client_id
        };

        if (!data.item_name || Number(data.qty) <= 0) {
            this.toast.warning('Please select item with Qty');
            return;
        }

        const dialogRef = this.dialog.open(InstallationKitBomProposalComponent, {
            width: '95vw',
            maxWidth: '95vw',
            maxHeight: '90vh',
            disableClose: true,
            data: {
                data: data,
                selectedCurrency: this.selectedCurrency,
                selectedBomData: this.selectedBomData
            },
        });

        dialogRef.afterClosed().subscribe((result: any) => {

            if (!result) return;

            const formArray = this.proposalForm.get('productDetailList') as FormArray;
            const formGroup = formArray.at(result.parent_index);
            // Clear BOM
            if (result.clearBom) {
                const index = this.selectedBomData.findIndex(
                    (x: any) => x.parent_index === result.parent_index
                );

                if (index > -1) {
                    this.selectedBomData[index].boms = [];
                } else {
                    this.selectedBomData.push({
                        parent_index: result.parent_index,
                        boms: []
                    });
                }

                formGroup.get('bomArray')?.setValue([]);
                this.calculateQuotationTotals();
                return;
            }

            const index = this.selectedBomData.findIndex(
                (x: any) => x.parent_index === result.parent_index
            );

            if (index > -1) {
                // Existing parent update
                this.selectedBomData[index] = result;
            } else {
                // New parent
                this.selectedBomData.push(result);
            }

            formGroup.get('bomArray')?.setValue([...result.boms]);
            this.calculateQuotationTotals();
        });
    }

    costCenterList: any = [];
    profitCenterList: any = [];
    getAllCostCenter(entityId: any) {
        this.financeService.getAllCostCenter(entityId).subscribe({
            next: (res: any) => {
                console.log(res);
                this.costCenterList = res.data;
            }, error: (err: any) => {
                console.log(err);
            }
        })
    }

    getAllProfitCenter(entityId: any) {
        this.financeService.getAllProfitCenter(entityId).subscribe({
            next: (res: any) => {
                console.log(res);
                this.profitCenterList = res.data;
            }, error: (err: any) => {
                console.log(err);
            }
        })
    }
}