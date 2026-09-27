import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTransferNewComponent } from './stock-transfer-new.component';

describe('StockTransferNewComponent', () => {
  let component: StockTransferNewComponent;
  let fixture: ComponentFixture<StockTransferNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockTransferNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockTransferNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
