import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierServiceStatusComponent } from './courier-service-status.component';

describe('CourierServiceStatusComponent', () => {
  let component: CourierServiceStatusComponent;
  let fixture: ComponentFixture<CourierServiceStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierServiceStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourierServiceStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
