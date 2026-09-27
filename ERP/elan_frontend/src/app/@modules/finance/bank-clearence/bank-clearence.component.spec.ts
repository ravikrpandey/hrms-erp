import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankClearenceComponent } from './bank-clearence.component';

describe('BankClearenceComponent', () => {
  let component: BankClearenceComponent;
  let fixture: ComponentFixture<BankClearenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankClearenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankClearenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
