import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EInvoiceActionComponent } from './action.component';

describe('EInvoiceActionComponent', () => {
  let component: EInvoiceActionComponent;
  let fixture: ComponentFixture<EInvoiceActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EInvoiceActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EInvoiceActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
