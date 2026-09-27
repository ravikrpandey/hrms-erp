import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandingMasterCreateComponent } from './branding-master-create.component';

describe('BrandingMasterCreateComponent', () => {
  let component: BrandingMasterCreateComponent;
  let fixture: ComponentFixture<BrandingMasterCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandingMasterCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandingMasterCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
