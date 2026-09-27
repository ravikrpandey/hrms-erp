import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankAccountComponent } from './add-bank-account.component';

describe('AddBankAccountComponent', () => {
  let component: AddBankAccountComponent;
  let fixture: ComponentFixture<AddBankAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBankAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBankAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
