import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInvoiceComponent } from './shared-invoice.component';

describe('SharedInvoiceComponent', () => {
  let component: SharedInvoiceComponent;
  let fixture: ComponentFixture<SharedInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
