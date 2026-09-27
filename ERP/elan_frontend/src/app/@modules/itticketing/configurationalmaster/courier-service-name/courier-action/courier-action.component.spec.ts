import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierActionComponent } from './courier-action.component';

describe('CourierActionComponent', () => {
  let component: CourierActionComponent;
  let fixture: ComponentFixture<CourierActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourierActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
