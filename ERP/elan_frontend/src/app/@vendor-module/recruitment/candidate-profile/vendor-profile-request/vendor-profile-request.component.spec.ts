import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorProfileRequestComponent } from './vendor-profile-request.component';

describe('VendorProfileRequestComponent', () => {
  let component: VendorProfileRequestComponent;
  let fixture: ComponentFixture<VendorProfileRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorProfileRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorProfileRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
