import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorActionComponent } from './vendor-action.component';

describe('VendorActionComponent', () => {
  let component: VendorActionComponent;
  let fixture: ComponentFixture<VendorActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
