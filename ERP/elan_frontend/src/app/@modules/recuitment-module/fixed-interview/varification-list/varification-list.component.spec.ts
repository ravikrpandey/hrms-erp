import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedInterviewComponent } from './varification-list.component';

describe('VarificationListComponent', () => {
  let component: FixedInterviewComponent;
  let fixture: ComponentFixture<FixedInterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixedInterviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
