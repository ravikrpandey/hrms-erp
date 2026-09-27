import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankRecieptComponent } from './bank-reciept.component';

describe('BankRecieptComponent', () => {
  let component: BankRecieptComponent;
  let fixture: ComponentFixture<BankRecieptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankRecieptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankRecieptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
