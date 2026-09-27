import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsComponent } from './lms.component';

describe('LmsComponent', () => {
  let component: LmsComponent;
  let fixture: ComponentFixture<LmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LmsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
