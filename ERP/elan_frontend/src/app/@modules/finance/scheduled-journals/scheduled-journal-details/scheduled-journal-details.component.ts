import { Component } from '@angular/core';
import {GridApi,GridReadyEvent} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-scheduled-journal-details',
  templateUrl: './scheduled-journal-details.component.html',
  styleUrls: ['./scheduled-journal-details.component.scss']
})
export class ScheduledJournalDetailsComponent {
  errorMessage: any;
  products: any = [];
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  assignAction:any;
  publish: boolean = true;
  scheduleForm: FormGroup;
  journal_id: any;
  scheduledDate: any;
  scheduledDataList: any = [];
  incrementDays: number;
  // roleData: any;
  constructor(
    private _finaceService: FinaceService,
   public dialog: MatDialog,
   private location: Location,
   private route: Router,
   private activeroute : ActivatedRoute,
   private fb : FormBuilder,
   private toasterService:ToastrService
    ) {
    this.rowClass = 'rowClass'
    this.scheduleForm = this.fb.group({
      document_type: [''],
      start_date : [''],
      reference_document : [''],
      end_date : [''],
      frequency : [''],
      next_schedule_date : [''],
    })
  }
  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.journal_id = Number(params.id);
    });
    this._finaceService.getScheduledJournalDeatils(this.journal_id).subscribe((res: any) => {
      if(res.code == 200){
        this.scheduledDate =  res.data[0];
        if (this.scheduledDate.end_date) {
          if(this.scheduledDate.frequency_type == 'daily'){
            this.incrementDays = 1;
          }
          else if(this.scheduledDate.frequency_type == 'weekly'){
            this.incrementDays = 7;
          }
          else if(this.scheduledDate.frequency_type == 'monthly'){
            const startDate:any = new Date(this.scheduledDate.start_date);
             this.incrementDays = 1;
          }
          else if(this.scheduledDate.frequency_type == 'quarterly'){
            this.incrementDays = 3;
          }
          else if(this.scheduledDate.frequency_type == 'half-yearly'){
            this.incrementDays = 6;
          }
          else if(this.scheduledDate.frequency_type == 'yearly'){
            this.incrementDays = 12;
          }
          
          const startDate:any = new Date(this.scheduledDate.scheduled_date);
          const endDate:any = new Date(this.scheduledDate.end_date);  
          const differenceInTime = endDate - startDate;
          const numberOfSchedules = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
          this.scheduledDataList = []; 
          for (let i = 0; i <= numberOfSchedules; i++) {
            const newStartDate = new Date(startDate);
            if(this.scheduledDate.frequency_type == 'daily' || this.scheduledDate.frequency_type == 'weekly'){
              newStartDate.setDate(newStartDate.getDate() + i * this.incrementDays);
            }
            else{
              newStartDate.setMonth(newStartDate.getMonth() + i * this.incrementDays);
            }
            const newEndDate = new Date(endDate);
            const newScheduledDate = {
                ...this.scheduledDate,
                start_date: newStartDate,
                end_date: newEndDate,
                currentDate: newStartDate
            };
            if(newStartDate >= endDate && this.scheduledDate.frequency_type == 'daily'){
              break;
            }
            else if(newStartDate > endDate){
              break;
            }
            else{
              this.scheduledDataList.push(newScheduledDate);
            }
          }
          // const current_date = new Date();
          // const newlist:any = this.scheduledDataList.filter((data: any) => {
          //   const dataStartDate = new Date(data.start_date);
          //   return dataStartDate > current_date;
          // });
          this.rowData = this.scheduledDataList;
        }
        else{
          if(this.scheduledDate.frequency_type == 'once'){
            this.incrementDays = 0;
          }
          if(this.scheduledDate.frequency_type == 'daily'){
            this.incrementDays = 1;
          }
          else if(this.scheduledDate.frequency_type == 'weekly'){
            this.incrementDays = 7;
          }
          else if(this.scheduledDate.frequency_type == 'monthly'){
            const startDate:any = new Date(this.scheduledDate.start_date);
            const days = this.getDaysInMonthFromDate(startDate);
            this.incrementDays = days*1;
          }
          else if(this.scheduledDate.frequency_type == 'quarterly'){
            const startDate:any = new Date(this.scheduledDate.start_date);
            const days = this.getDaysInMonthFromDate(startDate);
            this.incrementDays = days*3;
          }
          else if(this.scheduledDate.frequency_type == 'half-yearly'){
            const startDate:any = new Date(this.scheduledDate.start_date);
            const days = this.getDaysInMonthFromDate(startDate);
            this.incrementDays = days*6;
          }
          else if(this.scheduledDate.frequency_type == 'yearly'){
            const startDate:any = new Date(this.scheduledDate.start_date);
            const days = this.getDaysInMonthFromDate(startDate);
            this.incrementDays = days*12;
          }
          const startDate:any = new Date(this.scheduledDate.start_date);
          const newStartDate = new Date(startDate);
          newStartDate.setDate(newStartDate.getDate() + 1 * this.incrementDays);
          const newScheduledDate = {
            ...this.scheduledDate,
            start_date: newStartDate,
            end_date: null,
            currentDate: newStartDate
          };
          this.scheduledDataList.push(newScheduledDate);
          this.rowData = this.scheduledDataList;
        }
        let nextScheduleDate :any=null;
       let startDate :any =null;
        if(this.scheduledDataList.length >1){
          const sDate = new Date(this.scheduledDate.start_date);
          const eDate = new Date(this.scheduledDate.end_date);
          if(sDate>=eDate){
            nextScheduleDate = this.scheduledDate.end_date;
          }
          else{
            // const current_date = new Date();
            // const newlist:any = this.scheduledDataList.filter((data: any) => {
            //   const dataStartDate = new Date(data.start_date);
            //   return dataStartDate > current_date;
            // });
            // startDate = new Date(newlist[0].start_date);
            startDate = new Date(this.scheduledDate.start_date);
            nextScheduleDate = startDate.toISOString().split('T')[0];
          }
        }
        else{
          const st_date = res.data[0].start_date;
          startDate = new Date(st_date);
          nextScheduleDate = startDate.toISOString().split('T')[0];
        }
       
        this.scheduleForm.patchValue({
          document_type: this.scheduledDate.journal_book_status,
          start_date : this.scheduledDate.scheduled_date,
          reference_document : this.scheduledDate.journal_no,
          end_date : this.scheduledDate.end_date,
          frequency :this.scheduledDate.frequency_type,
          next_schedule_date :nextScheduleDate,
        });
      }
      else{
        this.toasterService.error('No record found!');
        this.rowData = []
        return
      }
    },err => {
      this.toasterService.error('No record found!');
      this.rowData = []
      return
    })
  }

  public columnDefs = [
    {
      headerName: 'S. no',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth:150
    },
    {
      headerName: 'Reference Document',
      field: 'journal_no',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    }, 
    {
      headerName: 'Frequency',
      field: 'frequency_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Next Scheduled Date',
      field: 'start_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      valueFormatter: (params:any) => {
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
    }
  ];

  getDaysInMonthFromDate(startDate: Date): number {
    const year = startDate.getFullYear();
    const month = startDate.getMonth(); // 0-indexed (0 for January, 1 for February, etc.)
    return new Date(year, month + 1, 0).getDate(); // Last day of the month
  }
  
  deleteJournal(){
    Swal.fire({
      title: 'Are you sure want to Remove?',
      // text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#063178',
      confirmButtonColor: '#f44336',
      confirmButtonText: 'Delete!',
      cancelButtonText: 'Skip',
    }).then((result) => {
      if (result.value) {
        this._finaceService.deleteJournalScheduling(this.journal_id).subscribe((data:any)=>{
            if(data){
              this.toasterService.success('scheduling deleted successfully');
              this.route.navigate(["/master/finance/journal/scheduled-journals"]);
            }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  
    // this.leadService.deleteMandays(e)
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
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
}


