import { Component } from '@angular/core';
import { MenuManagementService } from 'src/app/@shared/services/menu-management.service';
import { ToastrService } from 'ngx-toastr';
import { RbacModule } from 'src/app/@shared/interface/core.interface';
import { MatDialog } from '@angular/material/dialog';
import { MenuDialogComponent } from '../menu-dialog/menu-dialog.component';

@Component({
  selector: 'app-listing-menu',
  templateUrl: './listing-menu.component.html',
  styleUrls: ['./listing-menu.component.scss'],
})
export class ListingMenuComponent {
  menuList: RbacModule[] = [];
  openModuleIndex: number | null = null;
  openMenuIndices: { [moduleIndex: number]: number | null } = {};
  showPopup = false;
  popupMode: 'create' | 'update' = 'create';
  popupData = {
    id: null,
    name: '',
    sequencing: '',
    link: '',
    icon: '',
  };
  createButton: boolean = false;

  constructor(
    private menuApi: MenuManagementService,
    private toaster: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    if (window.location.origin === 'http://localhost:4200') {
      this.createButton = true;
    }
    this.getMenuList();
  }

  getMenuList() {
    this.menuApi.allMenuList().subscribe((res: any) => {
      this.menuList = res.data;
    });
  }

  toggleModule(moduleIndex: number) {
    this.openModuleIndex =
      this.openModuleIndex === moduleIndex ? null : moduleIndex;
    this.openMenuIndices[moduleIndex] = null;
  }

  toggleMenu(moduleIndex: number, menuIndex: number) {
    if (this.openMenuIndices[moduleIndex] === menuIndex) {
      this.openMenuIndices[moduleIndex] = null;
    } else {
      this.openMenuIndices[moduleIndex] = menuIndex;
    }
  }

  changeStatus(menuType: 'Parent' | 'Child' | 'Sub', data: any) {
    const newStatus = data.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.popupData = {
      id:
        menuType == 'Sub'
          ? data.submenu_master_id
          : menuType == 'Child'
          ? data.menu_master_id
          : data.role_module_master_id || null,
      name: '',
      sequencing: '',
      link: '',
      icon: '',
    };

    Object.assign(this.popupData, {
      menuMode: 'Status',
      menuType: menuType,
      newStatus: newStatus,
    });

    this.savePopup();
    data.status = newStatus;
  }

  openPopup(mode: 'create' | 'update', data: any = null, menuType: any) {
    const dialogRef = this.dialog.open(MenuDialogComponent, {
      width: '500px',
      data: {
        mode: mode,
        type: 'parent',
        isChild: false
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Dialog data:', result);
        // Call API or update UI
      }
    });
  }

  closePopup() {
    this.showPopup = false;
  }

  savePopup() {
    this.menuApi.createUpdateMenu(this.popupData).subscribe(
      (res: any) => {
        this.toaster.success(res.message);
        this.closePopup();
      },
      (error) => {
        this.toaster.error(error.error.message);
      }
    );
  }

  SequenceWiseSort(clickType: any) {
    if (clickType === 'OrderBy') {
      this.getMenuList();
    } else {
      window.location.reload();
    }
  }
}
