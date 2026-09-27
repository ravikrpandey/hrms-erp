import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DurationToggleComponent } from './duration-toggle.component';

describe('DurationToggleComponent', () => {
  let component: DurationToggleComponent;
  let fixture: ComponentFixture<DurationToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DurationToggleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DurationToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
