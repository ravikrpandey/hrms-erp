import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KtAssignmentList } from './kt-assignment-list';

describe('KtAssignmentList', () => {
  let component: KtAssignmentList;
  let fixture: ComponentFixture<KtAssignmentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KtAssignmentList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KtAssignmentList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
