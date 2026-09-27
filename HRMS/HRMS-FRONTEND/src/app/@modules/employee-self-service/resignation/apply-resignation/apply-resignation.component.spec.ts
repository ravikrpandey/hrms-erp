import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyResignationComponent } from './apply-resignation.component';

describe('ApplyResignationComponent', () => {
  let component: ApplyResignationComponent;
  let fixture: ComponentFixture<ApplyResignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyResignationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyResignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
