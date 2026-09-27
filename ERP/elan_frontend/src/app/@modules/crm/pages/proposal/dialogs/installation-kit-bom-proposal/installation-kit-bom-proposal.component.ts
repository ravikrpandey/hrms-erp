import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { ToastrService } from 'ngx-toastr';
import { ProposalService } from 'src/app/@shared/services/crm/proposal.service';
import Swal from 'sweetalert2';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CreateKitComponent } from 'src/app/@modules/itticketing/configurationalmaster/installation-kit-bom/create-kit/create-kit.component';

@Component({
  selector: 'app-installation-kit-bom-proposal',
  templateUrl: './installation-kit-bom-proposal.component.html',
  styleUrls: ['./installation-kit-bom-proposal.component.scss']
})
export class InstallationKitBomProposalComponent {

  getAllData: any;
  entity_id: any;
  financial_year_id: any;
  accessControl: any;  // use for create new / update BOM Master
  currency: any;
  bomList: any[] = [];
  selectedID: any;
  isViewMode: boolean;

  constructor(
    private accessData: AccessControlService,
    private toastr: ToastrService,
    private proService: ProposalService,
    private configMaster: ConfigurationalmasterService,
    private dialog: MatDialog,
    public dialogs: MatDialogRef<InstallationKitBomProposalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.getAllData = data.data;
    this.isViewMode = [undefined, 'view'].includes(this.getAllData?.actionType); // default OR || condition and, with ! && condition
    this.currency = data.selectedCurrency;
  }

  ngOnInit() {
    this.entity_id = this.accessData.getEntityId();
    this.financial_year_id = this.accessData.getFinancialId();
    this.accessControl = this.accessData.canWrite('configurational-master/installation-kit');

    this.getBOMList();
  }

  getBOMList() {
    this.proService.getAllKitBomList(this.entity_id, this.getAllData).subscribe((res: any) => {
      this.bomList = res.data.map((x: any) => ({
        ...x,
        old_bom_price: x.bom_price,
        bom_price: this.configMaster.convertAmount(
          x.bom_price,
          1,
          this.currency.Currency_Convert_id
        )
      }));

      const parent = this.data.selectedBomData?.find(
        (x: any) => x.parent_index === this.getAllData.index
      );

      if (parent) {
        this.bindUnsavedSelection();
      } else {
        this.bindDbSelection();
      }

      // View Mode
      if (this.isViewMode) {
        // Show only selected BOMs
        this.bomList = this.bomList.filter((bom: any) => bom.selected);
        // Expand all selected BOMs
        this.bomList.forEach((bom: any) => {
          bom.expanded = true;
        });
      }
    })
  }

  bindDbSelection() {
    this.bomList.forEach((bom: any) => {
      bom.expanded = !!bom.selected;
      bom.items.forEach((item: any) => {
        item.selected = !!item.selected;
        item.selectedSubstitute =
          item.substitute_bom?.find(
            (x: any) => x.id == item.substitute_item_id
          ) ?? null;
      });
    });
  }

  bindUnsavedSelection() {
    const parent = this.data.selectedBomData?.find(
      (x: any) => x.parent_index === this.getAllData.index
    );

    if (!parent) {
      return;
    }

    // first reset
    this.bomList.forEach((bom: any) => {
      bom.selected = false;
      bom.expanded = false;

      bom.items.forEach((item: any) => {
        item.selected = false;
        item.selectedSubstitute = null;
      });
    });

    // stop all clear data
    if (parent.boms.length === 0) {
      return;
    }

    parent.boms.forEach((savedBom: any) => {
      const bom = this.bomList.find(
        (x: any) => x.id === savedBom.bom_id
      );

      if (!bom) {
        return;
      }

      // BOM Selected
      bom.selected = true;
      bom.expanded = true;

      savedBom.items.forEach((savedItem: any) => {
        const item = bom.items.find(
          (x: any) => x.id === savedItem.item_id
        );

        if (!item) {
          return;
        }

        item.selected = true;
        if (savedItem.substitute_item_id) {
          item.selectedSubstitute =
            item.substitute_bom?.find(
              (x: any) => x.id === savedItem.substitute_item_id
            ) || null;
        }
      });
    });
  }

  toggleBom(row: any) {
    row.expanded = !row.expanded;
  }

  onBomSelection(row: any) {
    row.expanded = row.selected;
    row.items.forEach((item: any) => {
      item.selected = row.selected;
    });
  }

  onItemSelection(row: any) {
    row.selected = row.items.some((item: any) => item.selected);
    row.expanded = row.selected;
  }

  onSubstituteChange(row: any, item: any) {
    item.selected = true;
    row.selected = true;
  }

  getSelectedItemName(item: any): string {
    if (item.selectedSubstitute) {
      return item.selectedSubstitute.item_name;
    }

    return item.item_name;
  }

  get selectedBomCount(): number {
    return this.bomList.filter((x: any) => x.selected).length;
  }

  get totalBomQty(): number {
    return this.selectedBomCount * (+this.getAllData.qty || 0);
  }

  get totalBomAmount(): number {
    return this.bomList
      .filter((x: any) => x.selected)
      .reduce((sum: number, x: any) => {
        return sum + ((+x.bom_price || 0) * (+this.getAllData.qty || 0));
      }, 0);
  }

  get totalBomAmountWithGST(): number {
    return this.bomList
      .filter((x: any) => x.selected)
      .reduce((sum: number, x: any) => {
        const amount = (+x.bom_price || 0) * (+this.getAllData.qty || 0);
        const gst = amount * ((+x.gst || 0) / 100);
        return sum + amount + gst;
      }, 0);
  }

  saveAllBom() {
    const selectedBom = this.bomList.filter((x: any) => x.selected);
    if (selectedBom.length == 0) {
      this.toastr.warning("Please select at least one BOM.");
      return;
    }

    const invalid = selectedBom.find((bom: any) =>
      !bom.items.some((item: any) => item.selected)
    );

    if (invalid) {
      this.toastr.warning("Each selected BOM must have at least one item.");
      return;
    }

    const payload = {
      parent_index: this.getAllData.index,
      boms: selectedBom.map((bom: any) => {

        const qty = Number(this.getAllData.qty || 0);
        const price =bom.bom_price ;
        // const price =this.configMaster.convertAmount(bom.bom_price,1,this.currency.Currency_Convert_id) ;
        const gst = Number(bom.gst || 0);

        // Without GST
        const total_price = qty * price;

        // GST Amount
        const gstAmount = (total_price * gst) / 100;

        // With GST
        const totalWithGst = total_price + gstAmount;

        return {
          bom_id: bom.id,
          item_list_id: this.getAllData.item_list_id,
          bom_name: `${bom.bom_name} (${bom.bom_code})`,
          price_per_unit: price,
          gst,
          hsn_code: bom.hsn_code,
          qty,
          discountType: null,
          discount: null,
          totalDiscountAmountPerQTY: null,
          totalDiscountAmount: null,
          total_price,          // WITHOUTGST
          totalWithGst,         // WITHGST
          items: bom.items
            .filter((x: any) => x.selected)
            .map((item: any) => ({
              item_id: item.id,
              item_name: item.item_name,
              qty: item.quantity,
              substitute_item_id: item.selectedSubstitute?.id ?? null,
              substitute_item_name: item.selectedSubstitute?.item_name ?? null
            }))
        };
      })
    };

    console.log(payload);
    this.dialogs.close(payload);
  }

  clearBom() {
    Swal.fire({
      title: 'Remove BOM?',
      text: 'This will remove all selected BOMs.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      reverseButtons: true
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.dialogs.close({
          clearBom: true,
          parent_index: this.getAllData.index
        });
      }
    });
  }

  createBom(){
    const dialogRef = this.dialog.open(CreateKitComponent, {
        width: '95vw',
        maxWidth: '1400px',
        disableClose: true,
        autoFocus: false,
        data: {
            mode: 'salesCRM'
        }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res?.refresh) {
        this.getBOMList();
      } 
    });
  }

  editBom(row: any){
    const dialogRef = this.dialog.open(CreateKitComponent, {
        width: '95vw',
        maxWidth: '1400px',
        disableClose: true,
        autoFocus: false,
        data: {
            mode: 'salesCRM',
            bomId: row.id
        }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res?.refresh) {
        this.getBOMList();
      } 
    });
  }

}