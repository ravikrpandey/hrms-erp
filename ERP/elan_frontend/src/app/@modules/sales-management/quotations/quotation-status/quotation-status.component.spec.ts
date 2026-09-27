import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationStatusComponent } from './quotation-status.component';

describe('QuotationStatusComponent', () => {
  let component: QuotationStatusComponent;
  let fixture: ComponentFixture<QuotationStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
