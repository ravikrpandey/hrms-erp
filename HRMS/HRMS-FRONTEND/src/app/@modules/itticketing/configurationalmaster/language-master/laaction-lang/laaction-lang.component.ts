import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { LangDailogComponent } from '../lang-dailog/lang-dailog.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-laaction-lang',
  templateUrl: './laaction-lang.component.html',
  styleUrls: ['./laaction-lang.component.scss']
})
export class LaactionLangComponent {
  singleId: any;
  cellValue1: any;
  assignAction: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService,
  ) { }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }
  public cellValue: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.cellValue1 = params.data;

  }

  getValueToDisplay(params: ICellRendererParams) {


    return params.valueFormatted ? params.valueFormatted : params.data.language_id
  }

  refresh(params: ICellRendererParams): boolean {

    // this.singleId = params.data.dept_id
    // wrirte code to modify cell 

    if (params) {
      const data: any = {
        language_name: params.data.language_name.trim(),
        status: params.data.status,
      }

      if (params.data.color === null && params.data.color !== "") {

        this.create_new_language(data);
      } else {
        const language_id: number = Number(params.data.language_id);
      }

    } else {
      this.toaster.error("Language is All Ready Exits!", 'Error Message');
    }


    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  create_new_language(data: any) {
    this._configurationalMasterService.create_new_language(data).subscribe(
      (res: any) => {

        this.toaster.success('Language Created Successfully');
        this.reloadCurrentRoute();
      }, (err: any) => {

        this.toaster.error("Language is All Ready Exits!", 'Error Message');
      }
    )
  };

  openDialog() {

    const dialogRef
      = this.dialog.open(LangDailogComponent, {
        width: '30%',
        // maxWidth: '100vw',
        // maxHeight: '100vh',
        // height: '100%',
        // panelClass: 'full-screen-modal',
        data: { id: this.cellValue }

      });

    dialogRef.afterClosed().subscribe(result => {

    });


  }
  edit(e: any) {

    const dialogRef = this.dialog.open(LangDailogComponent, {
      data: { id: this.cellValue },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }
  view(e: any) {
    const dialogRef = this.dialog.open(LangDailogComponent, {
      data: { id: this.cellValue, view: "view" },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }
  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure you want to Remove it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this._configurationalMasterService.Deletelang(this.cellValue).subscribe(
          (res) => {

            this.toaster.success('Deleted successfully ');
            this.reloadCurrentRoute();
          },
          (err) => {
            this.toaster.error("Somthing went wrong Please try agin", "Error Message")

          }
        )
      }
    });
  }
}
