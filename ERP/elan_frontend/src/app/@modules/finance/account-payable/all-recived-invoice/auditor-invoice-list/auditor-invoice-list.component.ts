import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { ActionPayableComponent } from '../../action-payable/action-payable.component';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { LeadService } from 'src/app/@shared/services/lead.service';
@Component({
  selector: 'app-auditor-invoice-list',
  templateUrl: './auditor-invoice-list.component.html',
  styleUrls: ['./auditor-invoice-list.component.scss'],
})
export class AuditorInvoiceListComponent {
  private gridApi!: GridApi<any>;
  rowData: any;
  rowData2: any;
  rowData1: any;
  personalIdData: any;
  propertyManager: any;
  text: any;
  firstLastName: any;
  rowClass: any;
  clicked: boolean = false;
  id: any;
  lead_id: any;
  menuAccessData: any;
  employId: string | null;
  userId: any;
  assignById: any;
  rowDataCopy: any;
  constructor(
    private activeroute: ActivatedRoute,
    public route: Router,
    public dialog: MatDialog,
    private _finaceService: FinaceService,
    private leadService: LeadService
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;

      this.lead_id = this.id.lead_id;
    });
    this.getListExpense();
  }
  // getListExpense(){
  //   this._itteketService.getApproved().subscribe((res:any)=>{
  //
  //     this.rowData=res.result;
  //

  //   })
  // }
  getListExpense() {
    // this.leadService.getVerifiedDqsData().subscribe((res:any)=>{
    //   this.rowData =res.result;
    // })

    this._finaceService.getAuditorIntercompany().subscribe((res: any) => {
      console.log(res, 'ressss');
      this.rowData = res.data;
      console.log(this.rowData, 'this.rowData');

      let newVar: any = [];
      console.log(this.rowData[152].leadmanagement2s, 'leadv');

      for (let a = 0; a < this.rowData.length; a++) {
        console.log('okkook');
        if (this.rowData[a]?.leadmanagement2s.length > 0) {
          this.rowData[a].leadmanagement2s[0].associated_company =
            this.rowData[a]?.associated_company;
          this.rowData[a].leadmanagement2s[0].customer_type =
            this.rowData[a]?.customer_type;
          this.rowData[a].leadmanagement2s[0].contact_owner =
            this.rowData[a]?.contact_owner;
          this.rowData[a].leadmanagement2s[0].mobile_number =
            this.rowData[a]?.mobile_number;
          this.rowData[a].leadmanagement2s[0].customer_category =
            this.rowData[a]?.customer_category;
          this.rowData[a].leadmanagement2s[0].br_number =
            this.rowData[a]?.br_number;
        }

        if (this.rowData[a]?.leadmanagement2s.length > 0) {
          newVar.push(this.rowData[a]?.leadmanagement2s[0]);
        }

        // this.rowData[a].leadmanagement2s[0].associatedcompany.push(this.rowData[a]?.associated_company)
        // this.rowData[a].leadmanagement2s[0].customertype.push(this.rowData[a]?.customer_type)
      }

      console.log(this.rowData, 'newVar');
      console.log(newVar, 'newVar second');

      // for (let a = 0; a < this.rowData.length; a++) {
      //   // if (this.rowData[a]?.leadmanagement2s[0].intercompany_status == "yes") {

      //     // this.rowData[a].push(this.rowData[a]?.leadmanagement2s[0])
      //   // }
      // }

      console.log(this.rowData, 'rowDataaa');

      const intercompanyStatus: any = [];
      for (let b = 0; b < newVar.length; b++) {
        // console.log(newVar[b], 'newVar[b]');

        if (newVar[b].inter_company_status === 'yes') {
          intercompanyStatus.push(newVar[b]);
        }
      }

      console.log(intercompanyStatus, 'intercompanyStatus');
      this.rowDataCopy = intercompanyStatus;

      //   const allData:any=[]
      //   for(let c=0; c<=intercompanyStatus.length;c++){
      // allData.
      //   }

      // let newVar:any=[]
      //  newVar=this.rowData.map((res:any)=>res.leadmanagement2s)
      // console.log(newVar,"new check")

      // console.log(this.rowData[0][152]?.leadmanagement2s[0],'this.rowData');
      // const val= this.rowData;
      // console.log(val,'val row');

      //   val.forEach(i=>{
      //     console.log(i,'iiiii<<<<<<<<<')
      //     i['leadmanagement2s'].forEach((j:any)=>{
      //         console.log(j.inter_company_status,'j.inter_company_status')
      //     })
      // })
      // const interData:any=[];

      // for(let i=0;i<=this.rowData.length;i++){
      //   interData.push(this.rowData[i])
      // console.log(this.rowData[i],'loop rowdata');

      //  for(let j=0; j<=this.rowData[i]?.length;j++){
      //     console.log(interData[j],'loop rowdata 2nd');
      //   }

      // console.log(interData,'interData under');

      // }

      let Arr: any = [];
      for (let i = 0; i < this.rowData.length; i++) {
        // console.log(A[i].leadmanagement2s.length)
        // console.log(this.rowData[i], 'this.rowData[i]');

        for (let a = 0; a <= this.rowData[i].length; a++) {
          // console.log(this.rowData[i][a], 'this.rowData[i][a]');
          let val = this.rowData[i][a];
          Arr.push(this.rowData[i][a]);
          // console.log(val,'val111111111111111111');

          for (
            let p = 0;
            p <= this.rowData[i][a].leadmanagement2s?.length;
            p++
          ) {
            // console.log(this.rowData[i][a],'this.rowData[i][a] copy');
          }
        }
        // for(let j=0;j<this.rowData[i].leadmanagement2s.length;j++){
        //     // console.log(A[i].leadmanagement2s[j].inter_company_status)
        //     if(this.rowData[i].leadmanagement2s[j].inter_company_status=="yes"){
        //         // console.log(A[i])
        //     Arr.push(this.rowData[i])
        //     }
        //     // console.log(A[i].leadmanagement2s[j])

        // }
      }
      console.log(Arr, 'arrrr copy');

      // console.log(interData,'interData');

      // const interDataSecond:any=[]
      // for(let j=0;j<=interData.length;j++){
      //   interDataSecond.push(interData[j])
      //   console.log(interDataSecond,'interDataSecond');

      // }
    });
  }

  openCreate() {
    this.route.navigate(
      ['master/lead/lead-management/assign-lead/assign-lead'],
      { queryParams: { lead_id: this.lead_id } }
    );
  }

  public columnDefs = [
    {
      headerName: 'S.No',
      field: 'lead_genration_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Associated Company',
      field: 'associated_company',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Customer Type',
      field: 'customer_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Contact Owner',
      field: 'contact_owner',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Mobile Number',
      field: 'mobile_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Customer Category',
      field: 'customer_category',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'BR No.',
      field: 'br_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
    },
    {
      headerName: 'Action',
      field: 'myexpense_id',
      cellRenderer: ActionPayableComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
      cellClass: 'grid-cell-centered',
    },
  ];

  dateFormatter(createdAt: any) {
    return moment(createdAt).format('DD/MM/YYYY');
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
