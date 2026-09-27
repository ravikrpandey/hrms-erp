import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PandingManualInvoiceComponent } from './panding-manual-invoice.component';

describe('PandingManualInvoiceComponent', () => {
  let component: PandingManualInvoiceComponent;
  let fixture: ComponentFixture<PandingManualInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PandingManualInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PandingManualInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
