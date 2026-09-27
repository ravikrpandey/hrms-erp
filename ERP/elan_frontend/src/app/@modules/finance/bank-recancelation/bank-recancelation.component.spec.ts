import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankRecancelationComponent } from './bank-recancelation.component';

describe('BankRecancelationComponent', () => {
  let component: BankRecancelationComponent;
  let fixture: ComponentFixture<BankRecancelationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankRecancelationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankRecancelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
