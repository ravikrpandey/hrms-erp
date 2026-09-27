import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierContainStatusComponent } from './courier-contain-status.component';

describe('CourierContainStatusComponent', () => {
  let component: CourierContainStatusComponent;
  let fixture: ComponentFixture<CourierContainStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierContainStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourierContainStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
