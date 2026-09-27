import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelTypeActionComponent } from './travel-type-action.component';

describe('TravelTypeActionComponent', () => {
  let component: TravelTypeActionComponent;
  let fixture: ComponentFixture<TravelTypeActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelTypeActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelTypeActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
