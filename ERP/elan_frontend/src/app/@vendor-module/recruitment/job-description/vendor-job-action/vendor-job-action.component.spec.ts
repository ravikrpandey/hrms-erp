import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorJobActionComponent } from './vendor-job-action.component';

describe('VendorJobActionComponent', () => {
  let component: VendorJobActionComponent;
  let fixture: ComponentFixture<VendorJobActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorJobActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorJobActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
