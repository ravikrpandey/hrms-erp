import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandingMasterActionComponent } from './branding-master-action.component';

describe('BrandingMasterActionComponent', () => {
  let component: BrandingMasterActionComponent;
  let fixture: ComponentFixture<BrandingMasterActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandingMasterActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandingMasterActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
