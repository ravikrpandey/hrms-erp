import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionStatusComponent } from './region-status.component';

describe('RegionStatusComponent', () => {
  let component: RegionStatusComponent;
  let fixture: ComponentFixture<RegionStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
