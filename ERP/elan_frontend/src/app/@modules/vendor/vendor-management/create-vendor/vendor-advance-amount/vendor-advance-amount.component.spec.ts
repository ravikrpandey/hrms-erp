import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAdvanceAmountComponent } from './vendor-advance-amount.component';

describe('VendorAdvanceAmountComponent', () => {
  let component: VendorAdvanceAmountComponent;
  let fixture: ComponentFixture<VendorAdvanceAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorAdvanceAmountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorAdvanceAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
