import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Chart } from 'chart.js/auto'; 
import { NotificationDialogComponent } from './notification-dialog/notification-dialog.component';
import { DashboardpageService } from './dashboardpage.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent {
  @ViewChild('barChart') private barChartRef: any;
  @ViewChild('pieChart') private pieChartRef: any;
  public barChart: any;
  public pieChart:any;
  navWidth: number = 0;
  allNotification: any = [];
  cardCalander: any = [];
  cardData: any;

  constructor(public dialog: MatDialog, private dashboardService : DashboardpageService, private toast: ToastrService,) { }

  ngOnInit() {
    // this.getAllNotification();
    // this.getCelender()
    this.getcardData();
  }

  getAllNotification(){
    this.dashboardService.getallNotification().subscribe((res)=>{
      if(res.code == 200){
        this.allNotification = res.data;
        this.toast.success(res.message);
      }
      else{
        this.toast.error(res.message);
      }
      },(err)=>{
        this.toast.error(err.message);
      }
    )
  }

  getCelender(){
    this.dashboardService.getCardCelender().subscribe((res)=>{
      if(res.code == 200){
        this.cardCalander = res.data;
        this.toast.success(res.message);
      }
      else{
        this.toast.error(res.message);
      }
      },(err)=>{
        this.toast.error(err.message);
      }
    )
  }

  getcardData(){
    this.dashboardService.getcardData().subscribe((res)=>{
      if(res.code == 200){
        this.cardData = res.data;
      }
      else{
        this.toast.error(res.message);
      }
      },(err)=>{
        this.toast.error(err.message);
      }
    )
  }

  openNav() {
    this.navWidth = 300;
  }

  closeNav() {
    this.navWidth = 0;
  }

  openDialog() {
    const dialogRef
      = this.dialog.open(NotificationDialogComponent, {
        data: { id: 'this.cellValue' }
      });
    dialogRef.afterClosed().subscribe(result => {

    });
  }



}



