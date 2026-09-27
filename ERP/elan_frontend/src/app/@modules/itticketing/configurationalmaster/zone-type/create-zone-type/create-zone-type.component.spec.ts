import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateZoneTypeComponent } from './create-zone-type.component';

describe('CreateZoneTypeComponent', () => {
  let component: CreateZoneTypeComponent;
  let fixture: ComponentFixture<CreateZoneTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateZoneTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateZoneTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
