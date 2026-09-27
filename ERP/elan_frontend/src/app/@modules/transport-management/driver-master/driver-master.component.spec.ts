import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverMasterComponent } from './driver-master.component';

describe('DriverMasterComponent', () => {
  let component: DriverMasterComponent;
  let fixture: ComponentFixture<DriverMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
