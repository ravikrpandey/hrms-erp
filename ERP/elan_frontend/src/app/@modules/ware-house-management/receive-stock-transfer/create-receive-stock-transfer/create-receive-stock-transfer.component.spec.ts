import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReceiveStockTransferComponent } from './create-receive-stock-transfer.component';

describe('CreateReceiveStockTransferComponent', () => {
  let component: CreateReceiveStockTransferComponent;
  let fixture: ComponentFixture<CreateReceiveStockTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateReceiveStockTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateReceiveStockTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
