import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import Swal from 'sweetalert2';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SignatureApproverRemarkDialogComponent } from '../signature-approver-remark-dialog/signature-approver-remark-dialog.component';

@Component({
  selector: 'app-emp-digital-action',
  template: `
    <div style="display: flex; gap: 8px; align-items: center;">
      <svg
        *ngIf="
          ['Pending', 'Rejected', 'Resubmit'].includes(params?.data?.status)
        "
        (click)="edit(params?.data)"
        xmlns="http://www.w3.org/2000/svg"
        height="20"
        viewBox="0 0 24 24"
        width="20"
        fill="#00a0b0"
        style="cursor:pointer;"
        matTooltip="Edit"
      >
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path
          d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71
         7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959
         0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
        />
      </svg>

      <svg
        *ngIf="['Pending', 'Approved'].includes(params?.data?.status)"
        xmlns="http://www.w3.org/2000/svg"
        height="20"
        viewBox="0 0 24 24"
        width="20"
        fill="#00a0b0"
        style="cursor: pointer;"
        (click)="delete(params?.data, $event)"
        matTooltip="Delete"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1zM18
         7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"
        />
      </svg>
      <!-- VIEW REMARK -->
      <div
        *ngIf="['Approved', 'Rejected'].includes(params?.data?.status)"
        (click)="viewRemark({ data: params?.data, event: $event })"
        style="cursor: pointer;"
        [attr.data-action]="'view-remark'"
        matTooltip="Remark"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20"
          viewBox="0 0 24 24"
          width="20"
          fill="#00a0b0"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path
            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11
       11-7.5c-1.73-4.39-6-7.5-11-7.5zm0
       13c-2.48 0-4.5-2.02-4.5-4.5S9.52 8.5 12
       8.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5zm0-7c-1.38
       0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12
       2.5-2.5S13.38 10.5 12 10.5z"
          />
        </svg>
      </div>
    </div>
  `,
})
export class EmpDigitalActionComponent implements ICellRendererAngularComp {
  params: any;

  constructor(
    private router: Router,
    private _empService: EmpRegistrationService,
    private toast: ToastrService,
    private route: Router,
    public dialog: MatDialog,
    private activeRoute: ActivatedRoute
  ) {}

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    return false;
  }

  viewRemark(e: any) {
    e.event?.stopPropagation();

    const isIconClick =
      e.event?.currentTarget?.getAttribute('data-action') === 'view-remark'; // use currentTarget here

    if (isIconClick) {
      const dialogRef = this.dialog.open(
        SignatureApproverRemarkDialogComponent,
        {
          width: '500px',
          data: e.data,
        }
      );

      dialogRef.afterClosed().subscribe((result: any) => {
        // Optional
      });
    }
  }

  edit(data: any) {
    this.router.navigate([
      '/master/hrms/employee-master/employee-digital-signature/edit',
      data?.digital_signature_id,
    ]);
  }

  delete(data: any, e: any) {
    e.stopPropagation();

    const payload = {
      isDeleted: 'true',
    };

    Swal.fire({
      title: 'Are you sure you want to delete it?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: '#f44336',
      confirmButtonColor: '#3f51b5',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this._empService
          .deleteDigitalSignature(data?.digital_signature_id, payload)
          .subscribe(
            (res: any) => {
              this.reloadCurrentRoute();
              this.toast.success(res.message);
            },
            (err: any) => {
              this.toast.error(err.error.message);
            }
          );
      }
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
}
