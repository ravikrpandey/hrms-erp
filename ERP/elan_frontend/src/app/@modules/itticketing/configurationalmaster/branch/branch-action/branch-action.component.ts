import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import Swal from 'sweetalert2';
// import { BranchDialogComponent } from '../branch-dialog/branch-dialog.component';

@Component({
  selector: 'app-branch-action',
  templateUrl: './branch-action.component.html',
  styleUrls: ['./branch-action.component.scss'],
})
export class BranchActionComponent {
  paramsVal: any;
  public cellValue: any;

  constructor(
    private route: Router,
    private config: ConfigurationalmasterService,
    private toast: ToastrService,
  ) {}

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  agInit(params: ICellRendererParams): void {
    this.paramsVal = params.data.id;
    this.cellValue = params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = params.data;
    return true;
  }

  onView() {
    this.route.navigate(['/master/configurational-master/branch/branch-form'], {
      queryParams: { id: this.paramsVal, mode: 'view' },
    });
  }
  onEdit() {
    this.route.navigate(['/master/configurational-master/branch/branch-form'], {
      queryParams: { id: this.paramsVal, mode: 'edit' },
    });
  }
  onDelete() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this imaginary file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
        this.config.deleteBranchSetup(this.paramsVal).subscribe((res: any) => {
          this.toast.success('Branch Deleted Successfully!');
          this.reloadCurrentRoute();
        });
      }
    });
  }
}
