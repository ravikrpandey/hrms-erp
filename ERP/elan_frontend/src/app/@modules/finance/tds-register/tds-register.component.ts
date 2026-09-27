import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-tds-register',
  templateUrl: './tds-register.component.html',
  styleUrls: ['./tds-register.component.scss']
})
export class TdsRegisterComponent implements OnInit {
    
  currencySymbol: any = '₹';
  currencyCode: any = 'INR';
  currencyData: any;
  currencyRate: any = 1;
  rowData: any[] = [];

  constructor(
    public dialog: MatDialog,
    private _finaceservice: FinaceService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private _configurationalMasterService: ConfigurationalmasterService,
  ){}

  ngOnInit(): void {
    let entity_id = localStorage.getItem('selectedEntityId');
    this.getAllTdsRegiter(entity_id);
    this._configurationalMasterService.currency$
      .subscribe((currency: any) => {
        this.currencyData = currency;
        this.currencyCode = currency.Currency_Type || 'INR';
        this.currencyRate = Number(currency.rate) || 1;
        this.currencySymbol = currency.symbols || '₹';
      
        if (entity_id) {
          this.getAllTdsRegiter(entity_id);
        }
      });
  }

  convertAmount(amount: number): number {
    if (!amount) return 0;
    return this.currencyRate ? amount * this.currencyRate : amount;
  }

  getAllTdsRegiter(entity_id: any) {
    this._finaceservice.tdsRegisterData(entity_id).subscribe((res: any) => {
      if (res && res.data) {
  
        this.rowData = res.data.map((item: any) => ({
          ...item,
          total_amount: this.convertAmount(item.total_amount),
          tds_rate_amount: this.convertAmount(item.tds_rate_amount)
        }));
      } else {
        this.rowData = [];
      }
    }, (err: any) => {
      console.error("Error fetching TDS Register data:", err);
      this.toast.error(err.error?.message || 'Error loading TDS Register data');
    });
  }
}