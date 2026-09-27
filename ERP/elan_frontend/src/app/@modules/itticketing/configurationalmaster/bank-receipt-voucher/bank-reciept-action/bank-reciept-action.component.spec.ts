import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankRecieptActionComponent } from './bank-reciept-action.component';

describe('BankRecieptActionComponent', () => {
  let component: BankRecieptActionComponent;
  let fixture: ComponentFixture<BankRecieptActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankRecieptActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankRecieptActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
