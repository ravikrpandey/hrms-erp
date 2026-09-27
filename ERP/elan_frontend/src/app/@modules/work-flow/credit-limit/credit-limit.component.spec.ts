import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditLimitComponent } from './credit-limit.component';

describe('CreditLimitComponent', () => {
  let component: CreditLimitComponent;
  let fixture: ComponentFixture<CreditLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditLimitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
