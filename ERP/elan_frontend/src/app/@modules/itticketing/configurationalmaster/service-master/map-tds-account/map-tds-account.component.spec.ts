import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTdsAccountComponent } from './map-tds-account.component';

describe('MapTdsAccountComponent', () => {
  let component: MapTdsAccountComponent;
  let fixture: ComponentFixture<MapTdsAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapTdsAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapTdsAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
