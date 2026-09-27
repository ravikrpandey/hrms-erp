import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelTypeComponent } from './travel-type.component';

describe('TravelTypeComponent', () => {
  let component: TravelTypeComponent;
  let fixture: ComponentFixture<TravelTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
