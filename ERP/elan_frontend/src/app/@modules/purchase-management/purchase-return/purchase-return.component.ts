import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PurchaseReturnService } from '../services/purchase-return.service';
import { CryptoService } from 'src/app/@shared/services/crypto/crypto.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-purchase-return',
  templateUrl: './purchase-return.component.html',
  styleUrls: ['./purchase-return.component.scss'],
})
export class PurchaseReturnComponent implements OnInit {
  viewMode: 'list' | 'create' | 'edit' | 'view' = 'list';
  isVendor: boolean = false;
  vendorId: number | null = null;
  vendor_id_header: any;
  loginUser: any = {};

  returnsList: any[] = [];
  vendorsList: any[] = [];
  grnsList: any[] = [];
  statusList: string[] = [
    'DRAFT',
    'SUBMITTED',
    'APPROVED',
    'REJECTED',
    'CANCELLED',
    'COMPLETED',
  ];

  stats = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  selectedReturn: any = null;

  constructor(
    private toast: ToastrService,
    private returnService: PurchaseReturnService,
    private cryptoService: CryptoService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.checkLoginUser();
    this.loadDropdowns();
    this.fetchReturns();
  }

  checkLoginUser() {
    try {
      const loginDataStr = localStorage.getItem('loginData');
      if (loginDataStr) {
        const loginData = JSON.parse(loginDataStr);
        if (loginData.loginID) {
          this.isVendor = true;
          this.vendor_id_header = loginData.loginID;
          const decryptedId = this.cryptoService.decrypt(loginData.loginID);
          this.vendorId = decryptedId ? parseInt(decryptedId, 10) : null;
          return;
        }
      }

      const userStr = localStorage.getItem('signInUser');
      if (userStr) {
        this.loginUser = JSON.parse(userStr);
        this.isVendor =
          this.loginUser.type === 'VENDOR' || !!this.loginUser.vendor_id;
        this.vendorId = this.loginUser.vendor_id || null;
      }
    } catch (e) {
      console.error('Error reading session user:', e);
    }
  }

  loadDropdowns() {
    if (this.isVendor && this.vendorId) {
      this.returnService
        .getGrnsByVendor(this.vendorId)
        .subscribe((res: any) => {
          if (res.code === 200) this.grnsList = res.data;
        });
    } else {
      this.returnService.getVendorsWithGrns().subscribe((res: any) => {
        if (res.code === 200) this.vendorsList = res.data;
      });
    }

    this.returnService.getStatusList().subscribe((res: any) => {
      if (res.code === 200) this.statusList = res.data;
    });
  }

  fetchReturns() {
    const params: any = {};
    if (this.isVendor && this.vendorId) {
      params.vendor_id = this.vendorId;
    }

    const request = this.isVendor
      ? this.returnService.getVendorReturnsList(params)
      : this.returnService.getReturnsList(params);

    request.subscribe((res: any) => {
      if (res.code === 200) {
        this.returnsList = res.data;
        this.calculateStats();
      } else {
        this.returnsList = [];
      }
    });
  }

  calculateStats() {
    this.stats.total = this.returnsList.length;
    this.stats.pending = this.returnsList.filter(
      (r) => r.status === 'SUBMITTED',
    ).length;
    this.stats.approved = this.returnsList.filter(
      (r) => r.status === 'APPROVED' || r.status === 'COMPLETED',
    ).length;
    this.stats.rejected = this.returnsList.filter(
      (r) => r.status === 'REJECTED',
    ).length;
  }

  toggleView(
    mode: 'list' | 'create' | 'edit' | 'view',
    recordId: number | null = null,
  ) {
    this.viewMode = mode;
    if (mode === 'create') {
      this.selectedReturn = null;
    } else if (recordId) {
      this.returnService.getReturnById(recordId).subscribe((res: any) => {
        if (res.code === 200) {
          this.selectedReturn = res.data;
        }
      });
    }
  }

  saveReturn(event: { payload: any; submitDirectly: boolean }) {
    const { payload, submitDirectly } = event;
    const savePayload = {
      ...payload,
      employee_id: this.loginUser?.employee_id || 1,
      entity_id: this.loginUser?.primary_entity_id || 1,
      financial_year_id: localStorage.getItem('financial_id') || 3,
    };

    const isEdit = this.viewMode === 'edit';
    const request = isEdit
      ? this.returnService.updateReturn(this.selectedReturn.id, savePayload)
      : this.returnService.createReturn(savePayload);

    request.subscribe((res: any) => {
      if (res.code === 200 || res.code === 201) {
        const returnId = isEdit ? this.selectedReturn.id : res.data.id;

        if (submitDirectly) {
          this.returnService
            .submitReturn(returnId, {
              remarks: 'Auto-submitted on creation',
              employee_id: savePayload.employee_id,
            })
            .subscribe((subRes: any) => {
              this.toast.success(
                'Purchase Return created and submitted successfully',
              );
              this.viewMode = 'list';
              this.fetchReturns();
            });
        } else {
          this.toast.success(
            isEdit
              ? 'Purchase Return updated successfully'
              : 'Purchase Return Draft saved successfully',
          );
          this.viewMode = 'list';
          this.fetchReturns();
        }
      } else {
        this.toast.error(res.message || 'Failed to save return');
      }
    });
  }

  submitRecord(id: number) {
    if (confirm('Are you sure you want to submit this return for approval?')) {
      const payload = {
        remarks: 'Submitted for approval',
        employee_id: this.loginUser?.employee_id || 1,
      };
      this.returnService.submitReturn(id, payload).subscribe((res: any) => {
        if (res.code === 200) {
          this.toast.success('Purchase Return submitted successfully');
          this.fetchReturns();
          if (this.viewMode === 'view') {
            this.toggleView('view', id);
          }
        } else {
          this.toast.error(res.message);
        }
      });
    }
  }

  completeRecord(id: number) {
    if (
      confirm(
        'Are you sure you want to ACKNOWLEDGE and APPROVE this return on your vendor panel?',
      )
    ) {
      const payload = {
        remarks: 'Acknowledged and Completed by Vendor',
        employee_id: 1,
      };
      this.returnService.completeReturn(id, payload).subscribe((res: any) => {
        if (res.code === 200) {
          this.toast.success('Purchase Return completed and acknowledged!');
          this.viewMode = 'list';
          this.fetchReturns();
        } else {
          this.toast.error(res.message || 'Action failed.');
        }
      });
    }
  }

  approveRecord(id: number) {
    if (
      confirm(
        'Are you sure you want to APPROVE this purchase return? This will deduct stock and issue a credit note.',
      )
    ) {
      const payload = {
        remarks: 'Approved by manager',
        employee_id: this.loginUser?.employee_id || 1,
      };
      this.returnService.approveReturn(id, payload).subscribe((res: any) => {
        if (res.code === 200) {
          this.toast.success(
            'Purchase Return approved and stock ledger updated!',
          );
          this.viewMode = 'list';
          this.fetchReturns();
        } else {
          this.toast.error(res.message || 'Approval failed.');
        }
      });
    }
  }

  rejectRecord(id: number) {
    const remarks = prompt('Please enter rejection remarks:');
    if (remarks === null) return;

    const payload = {
      remarks: remarks || 'Rejected by manager',
      employee_id: this.loginUser?.employee_id || 1,
    };
    this.returnService.rejectReturn(id, payload).subscribe((res: any) => {
      if (res.code === 200) {
        this.toast.success('Purchase Return rejected');
        this.viewMode = 'list';
        this.fetchReturns();
      } else {
        this.toast.error(res.message);
      }
    });
  }

  cancelRecord(id: number) {
    if (confirm('Are you sure you want to CANCEL this return?')) {
      const payload = {
        remarks: 'Cancelled by creator',
        employee_id: this.loginUser?.employee_id || 1,
      };
      this.returnService.cancelReturn(id, payload).subscribe((res: any) => {
        if (res.code === 200) {
          this.toast.success('Purchase Return cancelled');
          this.viewMode = 'list';
          this.fetchReturns();
        } else {
          this.toast.error(res.message);
        }
      });
    }
  }

  deleteRecord(id: number) {
    if (confirm('Are you sure you want to delete this Draft return record?')) {
      this.returnService.deleteReturn(id).subscribe((res: any) => {
        if (res.code === 200) {
          this.toast.success('Purchase Return record deleted');
          this.fetchReturns();
        } else {
          this.toast.error(res.message);
        }
      });
    }
  }

  onBack() {
    this.location.back();
  }
}
