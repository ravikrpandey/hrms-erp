import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierContainComponent } from './courier-contain.component';

describe('CourierContainComponent', () => {
  let component: CourierContainComponent;
  let fixture: ComponentFixture<CourierContainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierContainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourierContainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
