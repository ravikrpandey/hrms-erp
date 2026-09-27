import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSalesAccountDialogComponent } from './map-sales-account-dialog.component';

describe('MapSalesAccountDialogComponent', () => {
  let component: MapSalesAccountDialogComponent;
  let fixture: ComponentFixture<MapSalesAccountDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapSalesAccountDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapSalesAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
