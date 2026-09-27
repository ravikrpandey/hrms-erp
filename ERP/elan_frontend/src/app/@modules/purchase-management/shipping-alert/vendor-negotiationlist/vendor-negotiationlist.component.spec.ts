import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorNegotiationlistComponent } from './vendor-negotiationlist.component';

describe('VendorNegotiationlistComponent', () => {
  let component: VendorNegotiationlistComponent;
  let fixture: ComponentFixture<VendorNegotiationlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorNegotiationlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorNegotiationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
