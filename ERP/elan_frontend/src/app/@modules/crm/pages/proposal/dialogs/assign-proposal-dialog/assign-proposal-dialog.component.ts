import { map } from 'rxjs';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { environment } from 'src/app/environments/environment';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AssignUserService } from 'src/app/@shared/services/crm/assign-user.service';
import { ToastrService } from 'ngx-toastr';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
// import { RecruitService } from 'src/app/@service/recruitment.service';
@Component({
  selector: 'app-assign-proposal-dialog',
  templateUrl: './assign-proposal-dialog.component.html',
  styleUrls: ['./assign-proposal-dialog.component.scss'],
})
export class AssignProposalDialogComponent {
  private gridApi!: GridApi<any>;
  singleData: any;
  fileUrl;
  rowData: any = [];
  rowClass: any;
  loading: boolean = false;
  nameSearch: any = '';
  filterControl = new FormControl();
  assignProposalForm: FormGroup = new FormGroup({});
  leadId: any;
  userLoginId: any;
  proposalId: any;
  actionType: any;
  maximumDescountErr: boolean = false;
  loginUser: any;
  filteredEmployees: any;
  financial_year_id: any;
  entityId: any
  constructor(
    private $productionService: ProductionService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastrService,
    private $crm: CrmService,
    private $proposal: ProposalService,
    private $assignUser: AssignUserService,
    public dialog: MatDialogRef<AssignProposalDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data,"data<<<<<<<<<<<<<");
    
    this.fileUrl = environment.servralUrl+'/uploadDoc/';
    this.rowClass = 'rowClass';
    this.getProductData();

    this.assignProposalForm = this.fb.group({
      employee_id: new FormControl(null,),
    });

  }
  existing_client: any;
  create_leas_data: any
  ngOnInit(): void {

    let data = localStorage
    this.userLoginId = localStorage.getItem('EmpMainId')
    this.route.queryParams.subscribe((params: any) => {
      this.leadId = params.id;

      this.proposalId = params.proposalId;
      this.actionType = params.actionType;
      if (this.leadId || this.proposalId) {
        this.getEmployee();
      }
      this.getEmployee();
    });

    this.filterControl.valueChanges.subscribe((value) => {
      this.nameSearch = value;
      this.filterEmployees(value);
    });
  }

  filterEmployees(searchValue: string): void {
    if (!searchValue) {
      this.filteredEmployees = this.employeeList;
    } else {
      this.filteredEmployees = this.employeeList.filter((employee: any) =>
        (employee.first_name + ' ' + employee.last_name).toLowerCase().includes(searchValue.toLowerCase())
      );
    }
  }

  getProductData() {

    this.entityId = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.route.queryParams.subscribe((params: any) => {
      this.proposalId = params?.proposalId;
      this.actionType = params?.actionType;
    });
    
    this.rowData = this.data?.value?.productDetailList;




    
    
            let itemsList:any = [];
    
            for (const elem of this.data?.value?.productDetailList || []) {
              let subItems2 :any = [];
            
              if (elem?.custom_branding?.[0]?.customisation_data?.length) {
                elem.custom_branding[0].customisation_data.forEach((x: any) => {
                  subItems2.push({
                    subItemName: elem?.item_name,
                    subItemCode: '',
                    qty: x?.qty,
                    accessory_in_name:x?.accessory_in_name,
                    customization_type:x?.customization_type,
                    dbp: x.price_per_unit,
                    minPrice: x?.price_per_unit,
                    maxPrice: x?.price_per_unit,
                    discount1: x?.discount,
                    gst: x?.gst,
                    applyDiscount1: false,
                    type:'customisation'
                    
                  });
                });
              }
              if(elem?.custom_branding?.[0]?.branding_data){
                subItems2.push({
                  subItemName: elem?.custom_branding?.[0]?.branding_data?.branding_description,
                  subItemCode: '',
                  qty: 0,
                  accessory_in_name:'',
                  customization_type:'',
                  dbp: elem?.custom_branding?.[0]?.branding_data?.branding_amt,
                  minPrice:  elem?.custom_branding?.[0]?.branding_data?.branding_amt,
                  maxPrice:  elem?.custom_branding?.[0]?.branding_data?.branding_amt,
                  discount1:0,
                  gst: 0,
                  applyDiscount1: false,
                   type:'branding'
                });
              }
            
              itemsList.push({
                itemName: elem?.item_name,
                itemCode: elem?.product_code,
                qty: elem?.qty,
                dbp: elem?.price_per_unit,
                minPrice: elem?.price_per_unit,
                maxPrice: elem?.price_per_unit,
                discount1: elem?.maximum_discount,
                discount2: elem?.maximum_discount5,
                discount3: elem?.maximum_discount2,
                gst: elem?.igst,
                applyDiscount1: false,
                applyDiscount2: false,
                applyDiscount3: false,
                discount2Mode: '',
                discount2Flat: 0,
                discount3Mode: '',
                discount3Flat: 0,
                subItems: subItems2,
                select_scheme:elem?.select_schemes
              });
            }
            
            
    this.rowData?.forEach((item: any) => {
      this.$productionService
        .getAllActiveProduct(item.product_category_id, this.entityId)
        .subscribe((res: any) => {
          const data = res.data;
          const matchingProduct = data.find((r: any) => r.id == item.product_master_id);
          if (matchingProduct) {
            item.product_name = matchingProduct.product_name;
          }
        },(error)=>{
          
          console.log(error)
        });
    });

  }

  public columnDefs = [
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered ',
      flex: 1,
    },
    {
      headerName: 'Product Name',
      field: 'product_name',
      minWidth: 175,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Product Code',
      field: 'product_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'QTY',
      field: 'qty',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      cellRenderer: this.customHtmlCellRenderer.bind(this),
    },
    {
      headerName: 'Product Price',
      field: 'price_per_unit',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Discount Required (%)',
      field: 'maximum_discount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
  ];

  customHtmlCellRenderer(params: any): HTMLElement {
    const element = document.createElement('div');
    element.innerHTML = params.value;
    return element;
  }


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPanelClose() {
    this.filterControl.setValue('');
  }

  // Get user start
  employeeList: any = [];
  getEmployee() {
    try {
      this.$assignUser.getSuperUserList().subscribe((response: any) => {
        if (response) {
          this.employeeList = response.data;
          this.filteredEmployees = this.employeeList;
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  // Get user end

  createProposal() {
    // this.rowData.forEach((element: any) => {
    //   if (element.discount_request <= element.maximum_discount) {
    //     this.maximumDescountErr = true;
    //     return
    //   }
    // });
    if (this.maximumDescountErr === true) {
      return
    }
    // if (this.assignProposalForm.status === 'INVALID') {
    //   this.toast.error('Required fields should not be empty', 'Fields Error');
    //   return;
    // }
    let empdetail
    let empDetail = localStorage.getItem('signInUser')
    let department_id = localStorage.getItem('department_id')


    if (empDetail != null && empDetail !== undefined) {
      empdetail = JSON.parse(empDetail)
    }
    let loginUser :any =  localStorage.getItem('signInUser');
    let userData = JSON.parse(loginUser);
    let data = {
      ...this.data?.value,
      additional_charges: Number(this.data.value?.additional_charges),
      department_id: department_id,
      entity_id: this.entityId,
      financial_year_id: this.financial_year_id,
      create_lead_id: this.leadId,
      login_id: this.userLoginId,
      type:this.actionType,
      employee_id:userData.employee_id,
      request_type: 'discount',

    };
    if (this.data.existing_type == 'existing_client') {
      data.existing_client = true
    }
    data.lead_owner = empdetail.first_name + ' ' + empdetail.last_name
    if (this.actionType == 'edit') {
      data.id = Number(this.proposalId);
      data.create_lead_id = this.data?.create_lead_id;
    }

    this.$proposal.createProposal(data).subscribe((res: any) => {
      if (res) {
        this.toast.success(res.message);
        this.router.navigate(['master/sales/discount-request']);
        this.dialog.close();
      }
    },
      (err) => {
        if (err.status == 400) {
          this.toast.error(err?.message);
        } else if (err.status == 403) {
          this.toast.error('Already Exits!');
        }
        else {
          this.toast.error(err?.error?.message || 'Something went Wrong');
        }
      }
    );
  }

  // to restrict user from entering strings
  keyPress(event: Event | any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  validateDiscount(data: any): void {
    const discountRequest = parseFloat(data.discount_request);
    const maximumDiscount = parseFloat(data.maximum_discount);

    if (discountRequest <= maximumDiscount) {
      this.maximumDescountErr = true;
    }
    else {
      this.maximumDescountErr = false;
    }
  }

  // Handle discount request
  // createDiscount(event: any, data: any) {
  //
  //   this.rowData?.map((item: any) => {
  //     if (item?.product_master_id == data?.product_master_id) item.discount_request = Number(event.target.value);
  //   })
  // }

}
