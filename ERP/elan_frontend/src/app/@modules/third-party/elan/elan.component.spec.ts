import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElanComponent } from './elan.component';

describe('ElanComponent', () => {
  let component: ElanComponent;
  let fixture: ComponentFixture<ElanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
