import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { HelpdeskService } from 'src/app/@shared/services/HelpDeskService/helpdesk.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { EmptDialogComponent } from '../../employement-type/empt-dialog/empt-dialog.component';
import { TicketCategoryComponent } from '../ticket-category.component';
import { TicketCategoryDialogComponent } from '../ticket-category-dialog/ticket-category-dialog.component';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
})
export class ActionComponent {
  constructor(
    private helpdeskservice: HelpdeskService,
    private _commonService: CommonService,
    public toaster: ToastrService,
    public dialog: MatDialog,
    private _rbackService: RbacMasterService,
    private route: Router,
  ) {}
  
  params: any;
  id: any;
  assignAction: any;
  editDataParams: any = 'edit';
  public cellValue: any;
  
  agInit(params: any): void {
    this.params = params;
    this.id = params.data.id;
    this.cellValue = this.getValueToDisplay(params);
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }

  edit(event: any): void {
    console.log('Edit action triggered');
  }

  
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  
  getValueToDisplay(params: ICellRendererParams) {
    console.log(params.value,"ashdjs param")
    return params.value
    ? params.value
    : params.data.id;
  }
  refresh(params: ICellRendererParams): boolean {
    if (params) {
      const data: any = {
        emptype_name: params.data.emptype_name.trim(),
        status: params.data.status,
      };
      if (params.data.color === null && params.data.color !== '') {
      } else {
        const emptype_id: number = Number(params.data.emptype_id);
      }
    } else {
      this.toaster.error('emptype_name is All Ready Exits!', 'Error Message');
    }
    
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  
  editData() {
    const dialogRef = this.dialog.open(TicketCategoryDialogComponent, {
      width: '30%',
      data :{ id : this.cellValue,actionType : "edit"}
    });
    
    dialogRef.afterClosed().subscribe((result) => {});
    }
    
    openDialog() {
      const dialogRef = this.dialog.open(TicketCategoryDialogComponent, {
        width: '30%',
        data :{ id : this.cellValue,actionType : "view"}
      });
      
      dialogRef.afterClosed().subscribe((result) => {});
    }
    delete(): void {
      const confirmed = confirm('Are you sure you want to delete this item?');
      if (confirmed) {
        this.helpdeskservice.deleteTheTicketCategory(this.id).subscribe(
          (res: any) => {
            console.log('Deleted successfully with ID:', this.id);
            this.toaster.success('Ticket Deleted Successfully');
            window.location.reload();
          },
          (error: any) => {
            console.error('Error occurred while deleting:', error);
            this.toaster.error(
              'Failed to delete the ticket. Please try again later.'
            );
          }
        );
      } else {
        console.log('Deletion canceled by user.');
        this.toaster.info('Ticket deletion canceled.');
      }
    }
  }
  