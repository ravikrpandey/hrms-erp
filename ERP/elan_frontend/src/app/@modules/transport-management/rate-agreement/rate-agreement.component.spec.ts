import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateAgreementComponent } from './rate-agreement.component';

describe('RateAgreementComponent', () => {
  let component: RateAgreementComponent;
  let fixture: ComponentFixture<RateAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateAgreementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
