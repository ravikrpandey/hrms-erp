import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCenterAddComponent } from './assign-center-add.component';

describe('AssignCenterAddComponent', () => {
  let component: AssignCenterAddComponent;
  let fixture: ComponentFixture<AssignCenterAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignCenterAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignCenterAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
