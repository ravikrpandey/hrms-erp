import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationMasterCreateComponent } from './location-master-create.component';

describe('LocationMasterCreateComponent', () => {
  let component: LocationMasterCreateComponent;
  let fixture: ComponentFixture<LocationMasterCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationMasterCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationMasterCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
