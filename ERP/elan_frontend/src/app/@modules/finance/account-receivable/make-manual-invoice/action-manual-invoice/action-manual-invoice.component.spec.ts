import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionManualInvoiceComponent } from './action-manual-invoice.component';

describe('ActionManualInvoiceComponent', () => {
  let component: ActionManualInvoiceComponent;
  let fixture: ComponentFixture<ActionManualInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionManualInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionManualInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
