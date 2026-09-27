import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { QueryEncryptService } from 'src/app/@shared/services/transport-management/query-encrypt.service';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';

@Component({
  selector: 'app-vh-transporter-request-link',
  templateUrl: './vh-transporter-request-link.component.html',
  styleUrls: ['./vh-transporter-request-link.component.scss']
})
export class VhTransporterRequestLinkComponent implements OnInit {

  planningList: any = [];
  chargeMasterList: any = [];
  agreementDetails: any;
  planning_id!: string;
  transporter_id!: string;
  transporter = {
    amount: 0,
    remarks: '',
    tcAccepted: false
  };
  totalChargeAmount:any;
  planningForm: FormGroup;
  constructor(
    private router: Router,
    private toast: ToastrService,
    private transport_service: TransportManagementService,
    private route: ActivatedRoute,
    private encryptService: QueryEncryptService,
    private configMaster: ConfigurationalmasterService,
    private fb: FormBuilder
  ) { }
  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      let { planning, transporter } = params;
      this.transporter_id = transporter;
      if (planning && transporter) {
        this.getPlanningByTransporter(planning, transporter);
      } else {
        console.error('Missing planning_id or transporter_id in URL');
      }
    });

    this.planningForm = this.fb.group({
      charges: this.fb.array([])
    });

    this.addCharge();
    this.getTransportCharge();
     this.charges.valueChanges.subscribe(() => {
    this.calculateTotal();
  });
  }
  get charges(): FormArray {
    return this.planningForm.get('charges') as FormArray;
  }
 addCharge() {
  if (this.charges.length > 0) {

    const lastRow = this.charges.at(this.charges.length - 1) as FormGroup;

    if (lastRow.invalid) {
      lastRow.markAllAsTouched();
      return;
    }
  }

  this.charges.push(
    this.fb.group({
      charge_id: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]]
    })
  );
   this.calculateTotal();
}
  removeCharge(index: number) {
     if (this.charges.length > 1) {
    this.charges.removeAt(index);
    this.calculateTotal();
  }
  }
  onChargeChange(event: any, index: number) {
    this.charges.at(index).patchValue({
      charge_name: event.charge_name
    });
  }
  calculateTotal() {

  this.totalChargeAmount = this.charges.controls.reduce((total, control) => {

    const amount = Number(control.get('amount')?.value) || 0;

    return total + amount;

  }, 0);

}
  isChargeSelected(chargeId: number, currentIndex: number): boolean {

    return this.charges.controls.some((control, index) => {
      if (index === currentIndex) {
        return false; // current row ignore
      }

      return control.get('charge_id')?.value === chargeId;
    });

  }
  getTransportCharge() {

    this.configMaster.getTransportChargeList().subscribe({
      next: (res: any) => {

        this.chargeMasterList = res.data

      }, error: (err: any) => {
        console.log('hello');

      },
    })
  }
  getPlanningByTransporter(planning_id: any, transporter_id: any) {

    this.transport_service.getPlanningByTransporter(planning_id, transporter_id).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.code === 200 && !res.data) {
          const msg = this.encryptService.encrypt(res.message);
          const type = this.encryptService.encrypt(res.type);
          const queryParams = { status: msg, type: type };
          this.router.navigate(["/transporter-response"], { queryParams, replaceUrl: true });
        }
        this.planningList = res.data
        //  this.transporter = {
        //     amount: this.planningList?.rateAgreement?.rate?.rateAgreementDetails?.rate,
        //     remarks: this.planningList?.rateAgreement?.rate?.rateAgreementDetails?.extra_charge,
        //     tcAccepted: false
        //   };
      }, error: (err: any) => {

        const msg = this.encryptService.encrypt(err.error.message);
        const queryParams = { status: msg };
        this.router.navigate(["/transporter-response"], { queryParams, replaceUrl: true });
      },
    })
  }



  remarks: string = '';
  status: 'PENDING' | 'ACCEPTED' | 'ON_HOLD' | 'REJECTED' = 'PENDING';

  getPriorityLabel(priority: number): string {
    if (priority >= 8) return 'HIGH';
    if (priority >= 4) return 'MEDIUM';
    return 'LOW';
  }

  getPriorityClass(priority: number): string {
    if (priority >= 8) return 'high';
    if (priority >= 4) return 'medium';
    return 'low';
  }

  isAcceptEnabled(): boolean {
    return this.transporter.amount != null && this.transporter.amount >= 0 && this.transporter.tcAccepted && this.transporter.remarks != null;
  }

  preventNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }

  onAction(action: 'ACCEPTED' | 'REJECTED') {
    if (action === 'REJECTED' && (!this.transporter.remarks || this.transporter.remarks.trim() === '')) {
      this.toast.warning("Please provide remarks for rejection!");
      return;
    }
    
    console.log(this.planningForm.value);
    const today = new Date().toISOString().split('T')[0];
    const formData = {
      ...this.planningForm.value,
      amount: this.transporter.amount,
      remark: this.transporter.remarks,
      transporter_status: action,
      transporter_status_date: today
    };
    this.transport_service.transporterAcceptance(this.transporter_id, formData).subscribe({
      next: () => {
        this.toast.success(action === 'ACCEPTED' ? "Transporter request accepted!" : "Transporter request rejected!");
        const queryParams = {
          status: this.encryptService.encrypt(action === 'ACCEPTED' ? 'a' : 'r')
        };
        this.router.navigate(["/transporter-response"], { queryParams, replaceUrl: true });
      },
      error: () => {
        this.toast.error(action === 'ACCEPTED' ? "Failed to accept transporter request!" : "Failed to HOLD transporter request!");
      }
    });
  }
}
