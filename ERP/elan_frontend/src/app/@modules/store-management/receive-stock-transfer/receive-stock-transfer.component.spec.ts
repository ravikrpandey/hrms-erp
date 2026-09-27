import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveStockTransferComponent } from './receive-stock-transfer.component';

describe('ReceiveStockTransferComponent', () => {
  let component: ReceiveStockTransferComponent;
  let fixture: ComponentFixture<ReceiveStockTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveStockTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiveStockTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
