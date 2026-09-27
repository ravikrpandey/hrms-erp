import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCashRecieptComponent } from './add-cash-reciept.component';

describe('AddCashRecieptComponent', () => {
  let component: AddCashRecieptComponent;
  let fixture: ComponentFixture<AddCashRecieptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCashRecieptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCashRecieptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
