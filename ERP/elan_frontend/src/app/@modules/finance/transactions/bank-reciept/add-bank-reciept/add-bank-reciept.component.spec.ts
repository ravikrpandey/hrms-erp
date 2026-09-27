import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankRecieptComponent } from './add-bank-reciept.component';

describe('AddBankRecieptComponent', () => {
  let component: AddBankRecieptComponent;
  let fixture: ComponentFixture<AddBankRecieptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBankRecieptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBankRecieptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
