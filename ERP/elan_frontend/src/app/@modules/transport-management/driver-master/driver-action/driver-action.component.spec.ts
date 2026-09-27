import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverActionComponent } from './driver-action.component';

describe('DriverActionComponent', () => {
  let component: DriverActionComponent;
  let fixture: ComponentFixture<DriverActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
