import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyCreate } from './safety-create';

describe('SafetyCreate', () => {
  let component: SafetyCreate;
  let fixture: ComponentFixture<SafetyCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafetyCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SafetyCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
