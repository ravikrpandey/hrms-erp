import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankDailogComponent } from './bank-dailog.component';

describe('BankDailogComponent', () => {
  let component: BankDailogComponent;
  let fixture: ComponentFixture<BankDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankDailogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
