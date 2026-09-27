import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferOnboardingComponent } from './offer-onboarding.component';

describe('OfferOnboardingComponent', () => {
  let component: OfferOnboardingComponent;
  let fixture: ComponentFixture<OfferOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferOnboardingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
