import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllResignationCreateComponent } from './all-resignation-create.component';

describe('AllResignationCreateComponent', () => {
  let component: AllResignationCreateComponent;
  let fixture: ComponentFixture<AllResignationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllResignationCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllResignationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
