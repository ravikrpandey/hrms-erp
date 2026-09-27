import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapAddressQtyDialogComponent } from './map-address-qty-dialog.component';

describe('MapAddressQtyDialogComponent', () => {
  let component: MapAddressQtyDialogComponent;
  let fixture: ComponentFixture<MapAddressQtyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapAddressQtyDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapAddressQtyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
