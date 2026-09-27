import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProfileVendorComponent } from './add-profile-vendor.component';

describe('AddProfileVendorComponent', () => {
  let component: AddProfileVendorComponent;
  let fixture: ComponentFixture<AddProfileVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProfileVendorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProfileVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
