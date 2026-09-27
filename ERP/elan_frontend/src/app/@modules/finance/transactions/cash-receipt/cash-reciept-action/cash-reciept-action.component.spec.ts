import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRecieptActionComponent } from './cash-reciept-action.component';

describe('CashRecieptActionComponent', () => {
  let component: CashRecieptActionComponent;
  let fixture: ComponentFixture<CashRecieptActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashRecieptActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashRecieptActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
