import { Component, OnInit } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProposalStatusDialogComponent } from '../dialogs/proposal-status-dialog/proposal-status-dialog.component';

@Component({
  selector: 'app-discount-request',
  templateUrl: './discount-request.component.html',
  styleUrls: ['./discount-request.component.scss'],
})
export class DiscountRequestComponent implements OnInit {
  private gridApi!: GridApi<any>;
  rowData: any = [];
  rowData2: any = [];
  candidate_id?: number;
  assignAction: any;
  rowClass: any;
  leadSummaryForm: FormGroup;
  userLoginId: any;
  currentTab: 'Quotation' | 'PI'|'SB' = 'Quotation';
status:any;
  constructor(
    private fb: FormBuilder,
    private $proposal: ProposalService,
    private location: Location,
    private router: Router,
    private dialog : MatDialog

  ) {
    this.rowClass = 'rowClass';
    this.leadSummaryForm = this.fb.group({
      branch_id: new FormControl('3'),
    });
  }

  ngOnInit(): void {
    this.userLoginId = localStorage.getItem('EmpMainId')
    if (this.userLoginId) {
      this.status='0';
      if(this.status=='0'){
         this.actionType = 'approval'
      }
      this.getProposalList('0','Quotation');
    }
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }


  // Get all start
  getProposalList(status: any, action:any) {
    try {
      let data:any="WorkFlow"
      this.$proposal.getProposalList(status, 'status', this.userLoginId,data,action).subscribe((response: any) => {
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
      headerName: 'Quotation No.',
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
      headerName: 'Ver.',
      field: 'version',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 0.5,
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
      headerName: 'Requested By',
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
      headerName: 'Created Date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    // {
    //   headerName: 'Status',
    //   field: 'proposal_status',
    //   sortable: true,
    //   resizable: true,
    //   wrapHeaderText: true,
    //   autoHeaderHeight: true,
    //   cellClass: 'grid-cell-centered',
    //   flex: 1,
    // },
    {
      headerName: 'Action',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      cellRenderer: this.customCellRenderer2.bind(this), 
    },
  ];
  customCellRenderer2(params: any) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.gap = '10px';
  
    // Edit Icon
    const editIcon = document.createElement('i');
    editIcon.className = 'material-icons'; 
    editIcon.textContent = 'edit';
    editIcon.style.cursor = 'pointer';
    editIcon.style.color = '#00644d';
    editIcon.title = 'Edit';
    editIcon.onclick = () => {
      console.log('Edit clicked', params.data); 
      this.clickIt(params)  ;  
    };
  
    // Delete Icon
    const deleteIcon = document.createElement('span');
    deleteIcon.className = 'material-icons';
deleteIcon.textContent = 'visibility';
deleteIcon.style.cursor = 'pointer';
deleteIcon.style.color = '#00644d'
deleteIcon.title = 'View Status';
    deleteIcon.onclick = () => {
      console.log('View Status clicked', params.data);      
      this.statusCellClicked(params);      
    };
  
    container.appendChild(editIcon);
    container.appendChild(deleteIcon);
  
    return container;
  }
  
  // Custome render start
  clickIt(params: any) {
    
    this.router.navigate(["master/sales/create-proposal"], { queryParams: { proposalId: params?.data?.id, actionType: this.actionType,proposal_approval_id :params?.data?.proposal_approvel_id,version_id:params?.data?.version_id } })
  }
 

  statusCellClicked(e: any) {


      const dialogRef = this.dialog.open(ProposalStatusDialogComponent, { width: '800px', data: e.data });
      dialogRef.afterClosed().subscribe(result => {
      })
    
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
  getList(tab: any) {
    try {
      
      let data: any = tab;
      this.getProposalList(this.status,data);
    
    } catch (error) {
      console.log(error);
    }
  }
  setTab(tab: 'Quotation' | 'PI'|'SB') {
    this.currentTab = tab;
    this.getList(tab);
  }
  goBack() {
    this.location.back();
  }

  tabs: any[] = [
    { label: 'Pending' },
    { label: 'Approved' },
    { label: 'Rejected' },
    { label: 'My List' },
  ];

  actionType: String = 'view';

  tabChange(event: MatTabChangeEvent): void {
    let label = event?.tab?.textLabel;
    let status = "";
    if (label == "Pending") status = "0";
    else if (label == "Approved") status = "1";
    else if (label == "Rejected") status = "2";
    else status = "3";
    this.status=status;
    this.getProposalList(status,'Quotation');
    if (label == 'Pending') this.actionType = 'approval';
    else this.actionType = 'view'
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

}
