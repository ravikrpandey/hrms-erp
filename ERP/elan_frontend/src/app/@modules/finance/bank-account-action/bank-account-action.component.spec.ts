import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountActionComponent } from './bank-account-action.component';

describe('BankAccountActionComponent', () => {
  let component: BankAccountActionComponent;
  let fixture: ComponentFixture<BankAccountActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankAccountActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankAccountActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
