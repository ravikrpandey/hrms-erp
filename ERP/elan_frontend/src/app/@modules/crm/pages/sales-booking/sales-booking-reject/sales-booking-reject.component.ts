import { Component, OnInit } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Location } from '@angular/common';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { Router } from '@angular/router';
import { ActionViewProposalVersionComponent } from '../../proposal/action-proposal/action-view-proposal-version/action-view-proposal-version.component';
import { SalesBookingActionComponent } from '../sales-booking-action/sales-booking-action.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sales-booking-reject',
  templateUrl: './sales-booking-reject.component.html',
  styleUrls: ['./sales-booking-reject.component.scss']
})
export class SalesBookingRejectComponent {
 
    private gridApi!: GridApi<any>;
     rowData: any = [];
     rowClass: any;
     rowData2: any = [];
     customerList: any = [];
     userLoginId: any;
     salesBookingForm:FormGroup;

     role_master_id:any

     constructor(
       private $proposal: ProposalService,
       private location: Location,
       private router: Router,
       private fb:FormBuilder
   
     ) {
       this.rowClass = 'rowClass';
     }
   
     ngOnInit(): void {
       this.userLoginId = localStorage.getItem('EmpMainId')

       this.role_master_id= localStorage.getItem('role_master_id')


       this.salesBookingForm = this.fb.group({
        customer: [''],
        orderNumber: [''],
        in_status: [''],
        fDate: [''],
        tDate: [''],
      })
       if (this.userLoginId) {
         this.getProposalList();
       }
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
         let data:any="REJECTED"
         this.$proposal.getAllBookingSales(this.userLoginId,this.role_master_id, data).subscribe((response: any) => {
           if (response) {
             const rowData:any=[]
             
             response.data?.filter((pro:any)=>{
               if(pro?.email_status === "REJECTED" || pro?.so_status === "REJECTED"){
                 rowData.push(pro);
   
               }
             })
             this.rowData=rowData
             this.rowData2=rowData

             const uniqueCompanies = Array.from(new Map(this.rowData.map((item:any) => [item.company_name, item])).values());
            
             this.customerList = new Set(uniqueCompanies);
           }
         }, err => {
           console.log(err);
         })
       } catch (error) {
         console.log(error);
       }
     }
     // Get all end
   
     public columnDefs = [
       {
         headerName: 'S. No.',
         valueGetter: 'node.rowIndex + 1',
         sortable: true,
         resizable: true,
         wrapHeaderText: true,
         autoHeaderHeight: true,
         cellClass: 'grid-cell-centered ',
         flex: 0.5,
       },
       {
         headerName: 'PI No.',
         field: 'pi_number', // Replace with your actual field name
         sortable: true,
         resizable: true,
         wrapHeaderText: true,
         autoHeaderHeight: true,
         cellClass: 'grid-cell-centered',
         flex: 1,
         cellRenderer: this.customCellRenderer.bind(this), // Ensure correct 'this' context
       },
       {
         headerName: 'Ver.',
         field: 'version',
         sortable: true,
         resizable: true,
         wrapHeaderText: true,
         autoHeaderHeight: true,
         cellClass: 'grid-cell-centered',
         flex: 0.8,
       },
       {
         headerName: 'Company Name',
         field: 'company_name',
         sortable: true,
         resizable: true,
         wrapHeaderText: true,
         autoHeaderHeight: true,
         cellClass: 'grid-cell-centered',
         flex: 1,
       },
       {
         headerName: 'Quotation Amount',
         field: 'grant_total',
         sortable: true,
         resizable: true,
         wrapHeaderText: true,
         autoHeaderHeight: true,
         cellClass: 'grid-cell-centered',
         flex: 1,
       },
       {
         headerName: 'Created Date',
         field: 'createdAt',
         sortable: true,
         resizable: true,
         wrapHeaderText: true,
         autoHeaderHeight: true,
         cellClass: 'grid-cell-centered',
         flex: 1,
         valueFormatter: (params: any) => {
          if (!params.value) return '';
          const date = new Date(params.value);
          return date.toLocaleDateString('en-GB'); // ✅ dd/MM/yyyy
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
         flex: 1,
       },
      //  {
      //    headerName: 'Email Status',
      //    field: 'email_status',
      //    sortable: true,
      //    resizable: true,
      //    wrapHeaderText: true,
      //    autoHeaderHeight: true,
      //    cellClass: 'grid-cell-centered',
      //    flex: 1,
      //  },
       {
         headerName: 'Reject Reason',
         field: 'sales_reason',
         sortable: true,
         resizable: true,
         wrapHeaderText: true,
         autoHeaderHeight: true,
         cellClass: 'grid-cell-centered',
         flex: 1,
       },
       {
         headerName: 'Reject Remarks',
         field: 'reason_remarks',
         sortable: true,
         resizable: true,
         wrapHeaderText: true,
         autoHeaderHeight: true,
         cellClass: 'grid-cell-centered',
         flex: 1,
       },
      //  {
      //   headerName: 'Approval Status',
      //   field: 'so_status',
      //   sortable: true,
      //   resizable: true,
      //   wrapHeaderText: true,
      //   autoHeaderHeight: true,
      //   cellClass: 'grid-cell-centered',
      //   flex: 1,
      // },
      //  {
      //    headerName: 'Action',
      //    field: 'id',
      //    flex: 1,
      //    minWidth: 300,
      //    cellRenderer: SalesBookingActionComponent,
      //    cellRendererParams: {
      //      className: 'mat-blue',
      //      hideRequestButton: true,
      //      hideDetailsButton: false,
      //      hideDownloadIcon: false,
      //      showCustomIcon: false,
      //    },
      //  },
     ];
   
     // Custome render start
     clickIt(params: any) {
       this.router.navigate(["master/sales/create-proposal"], { queryParams: { proposalId: params?.data?.proposal_id , version_id:params?.data?.version_id,proposalApprovelId:null} })
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
    this.rowData = this.filterAndSortData(initialData, orderNo, customer, itemName, fDate, tDate, inStatus);
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
      filteredData = filteredData.filter(item => item.proposal_no == orderNo);
    }

    if (customer) {
      filteredData = filteredData.filter(item => item.company_name == customer);
    }

    if (itemName) {
      filteredData = filteredData.filter(item => item.itemId == itemName);
    }

    const from = fDate ? this.formatDateToDDMMYYYY(new Date(fDate)) : null;
    const to = tDate ? this.formatDateToDDMMYYYY(new Date(tDate)) : null;

    if (from || to) {
      filteredData = filteredData.filter(item => {
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

  clear(){
    this.salesBookingForm.reset();
    this.onSelectedOrderNo('');
  }
   }
