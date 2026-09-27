import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatFrequencyComponent } from './repeat-frequency.component';

describe('RepeatFrequencyComponent', () => {
  let component: RepeatFrequencyComponent;
  let fixture: ComponentFixture<RepeatFrequencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepeatFrequencyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepeatFrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
