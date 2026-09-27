import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-purchase-return-view',
  templateUrl: './purchase-return-view.component.html',
  styleUrls: ['./purchase-return-view.component.scss']
})
export class PurchaseReturnViewComponent implements OnInit {
  @Input() selectedReturn: any = null;
  @Input() isVendor: boolean = false;

  @Output() onBack = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<number>();
  @Output() onApprove = new EventEmitter<number>();
  @Output() onReject = new EventEmitter<number>();
  @Output() onCancelRecord = new EventEmitter<number>();
  @Output() onComplete = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  printReturn() {
    window.print();
  }
}
