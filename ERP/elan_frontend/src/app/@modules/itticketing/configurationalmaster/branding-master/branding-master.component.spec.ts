import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandingMasterComponent } from './branding-master.component';

describe('BrandingMasterComponent', () => {
  let component: BrandingMasterComponent;
  let fixture: ComponentFixture<BrandingMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandingMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
