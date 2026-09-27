import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierDailogComponent } from './courier-dailog.component';

describe('CourierDailogComponent', () => {
  let component: CourierDailogComponent;
  let fixture: ComponentFixture<CourierDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierDailogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourierDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
