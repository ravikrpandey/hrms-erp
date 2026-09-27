import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RbacModule } from 'src/app/@shared/interface/core.interface';
import { MenuDialogComponent } from '../menu-dialog/menu-dialog.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MenuManagementService } from 'src/app/@shared/services/menu-management.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-menu-list-card',
  templateUrl: './menu-list-card.component.html',
  styleUrls: ['./menu-list-card.component.scss'],
})
export class MenuListCardComponent implements OnInit {
  @Input() menu: RbacModule;

  @Input() createButton: boolean = false;

  constructor(
    private dialog: MatDialog,
    private menuApi: MenuManagementService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
  }

  onStatusChange(menu: RbacModule, event: MatSlideToggleChange) {
    const newStatus = event.checked; // true/false
    menu.status = newStatus;

    // Call API to update status
    this.updateModuleStatus(menu.id, newStatus);
  }

  updateModuleStatus(id: number, status: boolean) {
    this.menuApi.updateStatus(id, status).subscribe({
      next: () => this.toast.success('Status updated'),
      error: () => this.toast.error('Update failed'),
    });
  }

  onEdit(menu: RbacModule) {
    this.openDialog(menu, 'update');
  }

  onCreate(parent: RbacModule) {
    this.openDialog(parent, 'create', true);
  }

  openDialog(menu: any, mode: 'create' | 'update', isChild: boolean = false) {
    const dialogRef = this.dialog.open(MenuDialogComponent, {
      width: '500px',
      data: {
        mode: mode,
        isChild: isChild,
        menu,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Dialog data:', result);
        // Call API or update UI
      }
    });
  }
}
