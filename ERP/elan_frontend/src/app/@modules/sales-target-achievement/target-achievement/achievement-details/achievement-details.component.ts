import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CryptoService } from 'src/app/@shared/services/crypto/crypto.service';
import { SalesTargetService } from 'src/app/@shared/services/sales-target.service';

@Component({
  selector: 'app-achievement-details',
  templateUrl: './achievement-details.component.html',
  styleUrls: ['./achievement-details.component.scss']
})
export class AchievementDetailsComponent {

  actions: {
    label: string;
    icon?: string;
    callback: () => void;
    color?: string;
  }[] = [];

  getData: any = [];
  target_id: any;
  selectedInvoices: any[] = [];
  isSOModalOpen = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private STService: SalesTargetService,
    private cryptoService: CryptoService
  ) { }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe({
      next: (res: any) => {
        this.target_id = this.cryptoService.decrypt(res?.id);
        if (this.target_id) {
          this.getDataById(this.target_id);
        }
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  getDataById(id: any) {
    this.STService.getAchievementDetails(id)
      .subscribe({
        next: (res: any) => {
          this.getData = res.data;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
  }

  openSOPopup(item: any) {
    this.selectedInvoices = item.invoice_list || [];
    this.isSOModalOpen = true;
  }

  closeSOPopup() {
    this.isSOModalOpen = false;
    this.selectedInvoices = [];
  }

}