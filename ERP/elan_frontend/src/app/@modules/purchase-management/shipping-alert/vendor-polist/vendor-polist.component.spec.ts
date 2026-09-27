import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorPolistComponent } from './vendor-polist.component';

describe('VendorPolistComponent', () => {
  let component: VendorPolistComponent;
  let fixture: ComponentFixture<VendorPolistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorPolistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorPolistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
