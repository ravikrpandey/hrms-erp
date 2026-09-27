import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashCreateTravelRequestComponent } from './dash-create-travel-request.component';

describe('DashCreateTravelRequestComponent', () => {
  let component: DashCreateTravelRequestComponent;
  let fixture: ComponentFixture<DashCreateTravelRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashCreateTravelRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashCreateTravelRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
