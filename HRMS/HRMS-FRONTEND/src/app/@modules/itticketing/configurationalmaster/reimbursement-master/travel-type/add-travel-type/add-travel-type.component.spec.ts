import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTravelTypeComponent } from './add-travel-type.component';

describe('AddTravelTypeComponent', () => {
  let component: AddTravelTypeComponent;
  let fixture: ComponentFixture<AddTravelTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTravelTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTravelTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
