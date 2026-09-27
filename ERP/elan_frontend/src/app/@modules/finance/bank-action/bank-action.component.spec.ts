import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankActionComponent } from './bank-action.component';

describe('BankActionComponent', () => {
  let component: BankActionComponent;
  let fixture: ComponentFixture<BankActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
