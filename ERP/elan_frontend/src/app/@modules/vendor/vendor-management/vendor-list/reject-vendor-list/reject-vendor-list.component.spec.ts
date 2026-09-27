import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectVendorListComponent } from './reject-vendor-list.component';

describe('RejectVendorListComponent', () => {
  let component: RejectVendorListComponent;
  let fixture: ComponentFixture<RejectVendorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectVendorListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectVendorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
