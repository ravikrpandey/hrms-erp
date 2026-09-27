import { Component, OnInit } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-closed-deals',
  templateUrl: './closed-deals.component.html',
  styleUrls: ['./closed-deals.component.scss'],
})
export class ClosedDealsComponent implements OnInit {
  private gridApi!: GridApi<any>;
  rowData: any = [];
  candidate_id?: number;
  assignAction: any;
  rowClass: any;
  leadSummaryForm: FormGroup;
  userLoginId: any;

  constructor(
    private fb: FormBuilder,
    private $proposal: ProposalService,
    private location: Location,
    private router: Router,

  ) {
    this.rowClass = 'rowClass';
    this.leadSummaryForm = this.fb.group({
      branch_id: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.userLoginId = localStorage.getItem('EmpMainId')
    if (this.userLoginId) {
      this.getDealClosedList1(this.userLoginId)
    }
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  // Get all start
  getDealClosedList1(status:any) {
    try {
      this.$proposal.getDealClosedList1(this.userLoginId).subscribe((response: any) => {
        if (response) {
          this.rowData = response.data;
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  // Get all end
  matBtnColor:any;
  getAllDealClosedData(status:any){
    this.matBtnColor=status
    if(status==0){
      this.getDealClosedList1(status)
    }else{
      this.getDealClosedList1(status)

    }
    
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
      headerName: 'Proposal Number',
      field: 'proposal_no', // Replace with your actual field name
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      cellRenderer: this.customCellRenderer.bind(this), // Ensure correct 'this' context
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
      headerName: 'Created By',
      field: 'lead_owner',
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
      headerName: 'Status',
      field: 'existing_client',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      cellRenderer: this.customCellRendererStatus.bind(this)
    },
    // {
    //   headerName: 'Created Date',
    //   field: 'createdAt',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    // },
  ];

  // Custome render start
  clickIt(params: any) {
    if(params.data.existing_client){
      console.log(params.data,'fff');
      this.router.navigate(["master/crm/create-proposal"], { queryParams: { proposalId: params?.data?.id, actionType: 'dealClose',existing:params.data.existing_client, } })
    }else{
      this.router.navigate(["master/crm/create-proposal"], { queryParams: { proposalId: params?.data?.id, actionType: 'dealClose' } })
    }
  }


  customCellRendererStatus(params:any)
{
    
       return params.data.status?'Direct':'Indirect'
       
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




}
