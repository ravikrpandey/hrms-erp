import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSidebarMenuComponent } from './vendor-sidebar-menu.component';

describe('VendorSidebarMenuComponent', () => {
  let component: VendorSidebarMenuComponent;
  let fixture: ComponentFixture<VendorSidebarMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorSidebarMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorSidebarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
