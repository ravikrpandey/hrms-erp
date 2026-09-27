import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationMasterActionComponent } from './location-master-action.component';

describe('LocationMasterActionComponent', () => {
  let component: LocationMasterActionComponent;
  let fixture: ComponentFixture<LocationMasterActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationMasterActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationMasterActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
