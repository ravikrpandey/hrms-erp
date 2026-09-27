import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierServiceNameComponent } from './courier-service-name.component';

describe('CourierServiceNameComponent', () => {
  let component: CourierServiceNameComponent;
  let fixture: ComponentFixture<CourierServiceNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierServiceNameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourierServiceNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
