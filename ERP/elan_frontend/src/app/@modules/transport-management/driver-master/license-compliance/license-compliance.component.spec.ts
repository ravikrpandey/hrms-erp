import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseComplianceComponent } from './license-compliance.component';

describe('LicenseComplianceComponent', () => {
  let component: LicenseComplianceComponent;
  let fixture: ComponentFixture<LicenseComplianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicenseComplianceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenseComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
