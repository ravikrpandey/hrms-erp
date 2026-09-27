import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Location } from '@angular/common';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { Router } from '@angular/router';
import { ActionViewProposalVersionComponent } from '../../proposal/action-proposal/action-view-proposal-version/action-view-proposal-version.component';
import { SalesBookingActionComponent } from '../sales-booking-action/sales-booking-action.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

interface ProposalRow {
  [key: string]: any;
  grant_total_original: number;
  currency_id_original: number;
  grant_total: number;
  displayed_currency_id: number;
}
@Component({
  selector: 'app-sales-booking-pending',
  templateUrl: './sales-booking-pending.component.html',
  styleUrls: ['./sales-booking-pending.component.scss'],
})
export class SalesBookingPendingComponent {
  private gridApi!: GridApi<any>;
  rowData: any = [];
  rowClass: any;
  userLoginId: any;
  rowData2: any = [];
  orderNumberList: any = [];
  customerList: any = [];
  itemList: any = [];
  currentTab: 'Without_PO' | 'With_PO' = 'With_PO';
  salesBookingForm: FormGroup;
  role_master_id: any;


  private destroy$ = new Subject<void>();
  selectedCurrency: any;
  constructor(
    private $proposal: ProposalService,
    private location: Location,
    private router: Router,
    private _configurationalMasterService: ConfigurationalmasterService,

    private fb: FormBuilder
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.userLoginId = localStorage.getItem('EmpMainId');
    this.role_master_id = localStorage.getItem('role_master_id');
    this.salesBookingForm = this.fb.group({
      customer: [''],
      orderNumber: [''],
      in_status: [''],
      fDate: [''],
      tDate: [''],
    });
    this.userLoginId = localStorage.getItem('EmpMainId');
    let financial_id: any = localStorage.getItem('financial_id');
    if (this.userLoginId) {
      this.getList('With_PO');

      this._configurationalMasterService.currency$.pipe(takeUntil(this.destroy$)).subscribe(currency => {

        console.log('Currency Changed', currency);

        if (!currency) return;

        this.selectedCurrency = currency;

        if (this.rowData?.length) {
          this.updateCurrencyRate();

          this.gridApi?.refreshCells({
            force: true
          });
        }
      });

    }



  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  updateCurrencyRate() {

    this.rowData =
      this._configurationalMasterService.prepareRows(
        this.rowData,
        'grant_total',
        'currency_id',
        this.selectedCurrency.Currency_Convert_id,

      );
  }

  showFilter: boolean = false;
  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  // Get all start
  getProposalList() {
    try {
      let data: any = 'PENDING';
      this.$proposal
        .getAllBookingSales(this.userLoginId, this.role_master_id, data)
        .subscribe(
          (response: any) => {
            this._configurationalMasterService.currencyData.next({ currency_id: 1 });


            if (response) {
              const rowData: any = [];
              response.data?.filter((pro: any) => {
                // if(pro?.booking_status === "APPROVED"){
                // rowData.push(pro);
                // }
              });
              this.rowData = response?.data;
              this.rowData2 = response?.data;
              this.customerList = [];
              const uniqueCompanies = Array.from(
                new Map(
                  this.rowData.map((item: any) => [item.company_name, item])
                ).values()
              );
              this.customerList = new Set(uniqueCompanies);
              this.rowData = this._configurationalMasterService.prepareRows(
                response.data,
                'grant_total',
                'currency_id',
                this.selectedCurrency?.Currency_Convert_id || 1,

              );

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
  getList(tab: any) {
    try {
      let data: any = tab;

      this.$proposal.getList(this.userLoginId, data).subscribe(
        (response: any) => {
          if (response) {
            this._configurationalMasterService.currencyData.next({ currency_id: 1 });

            const rowData: any = [];
            response.data?.filter((pro: any) => {
              // if(pro?.booking_status === "APPROVED"){
              // rowData.push(pro);
              // }
            });

            this.customerList.length = 0;
            this.rowData = response?.data;
            this.rowData2 = response?.data;
            const uniqueCompanies = Array.from(
              new Map(
                this.rowData.map((item: any) => [item.company_name, item])
              ).values()
            );

            this.customerList = new Set(uniqueCompanies);



            this.rowData = this._configurationalMasterService.prepareRows(
              response.data,
              'grant_total',
              'currency_id',
              this.selectedCurrency?.Currency_Convert_id || 1,

            );

          }
        },
        (err) => {
          console.log(err);
          this.rowData = [];
          this.rowData2 = [];
          this.customerList = [];
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  // Get all end
  public columnDefs: ColDef[] = [
    {
      headerName: 'S. No.',
      valueGetter: (params: any) => params.node.rowIndex + 1,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 75,
    },
    {
      headerName: 'PI No.',
      field: 'pi_number', // Replace with your actual field name
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      minWidth: 150,
      tooltipField: 'proposal_no',
      cellRenderer: (params: any) => this.customCellRenderer(params),
    },
    {
      headerName: 'Ver.',
      field: 'version',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 60,
    },
    {
      headerName: 'Company Name',
      field: 'company_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      minWidth: 120,
      tooltipField: 'company_name',
    },
    {
      headerName: 'Quotation Amount',
      field: 'grant_total',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 2,
      minWidth: 120,
      valueFormatter: (params: any) => {
        if (params.value != null) {
          return `${this.selectedCurrency?.symbols || '₹'} ${Number(params.value).toLocaleString('en-IN')}`;
        }
        return '';
      },
      // valueFormatter: (params: any) => {
      //   if (params.value == null) return '';
      //   return new Intl.NumberFormat('en-IN', {
      //     style: 'currency',
      //     currency: 'INR',
      //     maximumFractionDigits: 2,
      //   }).format(params.value);
      // },
      cellStyle: { textAlign: 'right' },
    },
    {
      headerName: 'Created Date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1.5,
      minWidth: 100,
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        return !isNaN(date.getTime())
          ? date.toLocaleDateString('en-GB') // ✅ dd/MM/yyyy
          : '';
      },
    },
    {
      headerName: 'Created By',
      field: 'lead_owner',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1.5,
      minWidth: 120,
      tooltipField: 'lead_owner',
    },
    // {
    //   headerName: 'Customer Email Status',
    //   field: 'email_status',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 2,
    //   minWidth: 100,
    //   tooltipField: 'email_status',
    //   cellStyle: { whiteSpace: 'normal', lineHeight: '1.4em' },
    // },
    // {
    //   headerName: 'Approval Status',
    //   field: 'so_status',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 2,
    //   minWidth: 100,
    //   tooltipField: 'so_status',
    //   cellStyle: { whiteSpace: 'normal', lineHeight: '1.4em' },
    // },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 180,
      pinned: 'right', // ✅ Always visible on the right
      cellRenderer: SalesBookingActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },
  ];

  // Custome render start
  clickIt(params: any) {
    this.router.navigate(['master/sales/create-proposal'], {
      queryParams: {
        proposalId: params?.data?.proposal_id,
        version_id: params?.data?.version_id,
        proposalApprovelId: null,
      },
    });
  }
  setTab(tab: 'Without_PO' | 'With_PO') {
    this.currentTab = tab;
    this.getList(tab);
  }

  customCellRenderer(params: any) {
    const cellValue = params.value;
    const clickableContent = document.createElement('div');
    clickableContent.style.cursor = 'pointer';
    clickableContent.style.textDecoration = 'underline';
    clickableContent.innerText = cellValue;
    clickableContent.addEventListener('click', () => {
      this.clickIt(params);
    });
    return clickableContent;
  }
  // Custome render end

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  goBack() {
    this.location.back();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onSelectedOrderNo(event: any) {
    const orderNo = this.salesBookingForm.get('orderNumber')?.value;
    const customer = this.salesBookingForm.get('customer')?.value;
    const itemName = this.salesBookingForm.get('itemName')?.value;
    const fDate = this.salesBookingForm.get('fDate')?.value;
    const tDate = this.salesBookingForm.get('tDate')?.value;
    const inStatus = this.salesBookingForm.get('in_status')?.value;

    let initialData = this.rowData2;

    // Apply filters
    this.rowData = this.filterAndSortData(
      initialData,
      orderNo,
      customer,
      itemName,
      fDate,
      tDate,
      inStatus
    );
  }

  private filterAndSortData(
    rowData: any[],
    orderNo: any,
    customer: any,
    itemName: any,
    fDate: Date | null,
    tDate: Date | null,
    inStatus: string
  ): any[] {
    let filteredData = [...rowData];

    if (orderNo) {
      filteredData = filteredData.filter((item) => item.proposal_no == orderNo);
    }

    if (customer) {
      filteredData = filteredData.filter(
        (item) => item.company_name == customer
      );
    }

    if (itemName) {
      filteredData = filteredData.filter((item) => item.itemId == itemName);
    }

    const from = fDate ? this.formatDateToDDMMYYYY(new Date(fDate)) : null;
    const to = tDate ? this.formatDateToDDMMYYYY(new Date(tDate)) : null;

    if (from || to) {
      filteredData = filteredData.filter((item) => {
        const itemDate = this.formatDateToDDMMYYYY(new Date(item.createdAt));

        if (from && to) {
          return itemDate >= from && itemDate <= to;
        } else if (from) {
          return itemDate >= from;
        } else if (to) {
          return itemDate <= to;
        }

        return true;
      });
    }

    if (filteredData.length > 1) {
      return filteredData.sort((a, b) => {
        const dateStrA = this.formatDateToDDMMYYYY(new Date(a.createdAt));
        const dateStrB = this.formatDateToDDMMYYYY(new Date(b.createdAt));

        // Convert formatted string back to date (without time)
        const partsA = dateStrA.split('-');
        const partsB = dateStrB.split('-');

        const dateA = new Date(+partsA[2], +partsA[1] - 1, +partsA[0]);
        const dateB = new Date(+partsB[2], +partsB[1] - 1, +partsB[0]);

        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;

        return inStatus === 'firstIn'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      });
    }

    return filteredData;
  }

  formatDateToDDMMYYYY(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  clear() {
    this.salesBookingForm.reset();
    this.onSelectedOrderNo('');
  }
}
