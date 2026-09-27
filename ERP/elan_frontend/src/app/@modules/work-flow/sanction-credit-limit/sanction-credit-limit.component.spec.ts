import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionCreditLimitComponent } from './sanction-credit-limit.component';

describe('SanctionCreditLimitComponent', () => {
  let component: SanctionCreditLimitComponent;
  let fixture: ComponentFixture<SanctionCreditLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SanctionCreditLimitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanctionCreditLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
