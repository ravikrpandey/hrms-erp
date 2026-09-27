import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllResignationComponent } from './all-resignation.component';

describe('AllResignationComponent', () => {
  let component: AllResignationComponent;
  let fixture: ComponentFixture<AllResignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllResignationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllResignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
