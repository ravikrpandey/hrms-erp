import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllResignationActionComponent } from './all-resignation-action.component';

describe('AllResignationActionComponent', () => {
  let component: AllResignationActionComponent;
  let fixture: ComponentFixture<AllResignationActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllResignationActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllResignationActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
