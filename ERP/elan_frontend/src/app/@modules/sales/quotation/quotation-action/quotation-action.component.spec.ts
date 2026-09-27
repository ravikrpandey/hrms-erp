import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationActionComponent } from './quotation-action.component';

describe('QuotationActionComponent', () => {
  let component: QuotationActionComponent;
  let fixture: ComponentFixture<QuotationActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
