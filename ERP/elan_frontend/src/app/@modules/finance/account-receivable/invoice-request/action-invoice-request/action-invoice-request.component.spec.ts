import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionInvoiceRequestComponent } from './action-invoice-request.component';

describe('ActionInvoiceRequestComponent', () => {
  let component: ActionInvoiceRequestComponent;
  let fixture: ComponentFixture<ActionInvoiceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionInvoiceRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionInvoiceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
