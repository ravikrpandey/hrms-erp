import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenaceCheckComponent } from './maintenace-check.component';

describe('MaintenaceCheckComponent', () => {
  let component: MaintenaceCheckComponent;
  let fixture: ComponentFixture<MaintenaceCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenaceCheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenaceCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
