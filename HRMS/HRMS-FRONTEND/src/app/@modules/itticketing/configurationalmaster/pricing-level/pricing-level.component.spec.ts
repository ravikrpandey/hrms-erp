import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingLevelComponent } from './pricing-level.component';

describe('PricingLevelComponent', () => {
  let component: PricingLevelComponent;
  let fixture: ComponentFixture<PricingLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricingLevelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
