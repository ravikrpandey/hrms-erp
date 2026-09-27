import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorRfplistComponent } from './vendor-rfplist.component';

describe('VendorRfplistComponent', () => {
  let component: VendorRfplistComponent;
  let fixture: ComponentFixture<VendorRfplistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorRfplistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorRfplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
