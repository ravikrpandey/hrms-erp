import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueActionComponent } from './issue-action.component';

describe('IssueActionComponent', () => {
  let component: IssueActionComponent;
  let fixture: ComponentFixture<IssueActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
