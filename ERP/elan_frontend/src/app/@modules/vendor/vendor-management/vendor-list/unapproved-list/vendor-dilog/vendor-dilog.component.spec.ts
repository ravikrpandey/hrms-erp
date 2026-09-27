import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorDilogComponent } from './vendor-dilog.component';

describe('VendorDilogComponent', () => {
  let component: VendorDilogComponent;
  let fixture: ComponentFixture<VendorDilogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorDilogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorDilogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
