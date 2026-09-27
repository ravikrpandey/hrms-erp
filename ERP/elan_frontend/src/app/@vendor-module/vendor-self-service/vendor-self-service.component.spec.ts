import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSelfServiceComponent } from './vendor-self-service.component';

describe('VendorSelfServiceComponent', () => {
  let component: VendorSelfServiceComponent;
  let fixture: ComponentFixture<VendorSelfServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorSelfServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorSelfServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
