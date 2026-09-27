import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedIndentComponent } from './assigned-indent.component';

describe('AssignedIndentComponent', () => {
  let component: AssignedIndentComponent;
  let fixture: ComponentFixture<AssignedIndentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedIndentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
