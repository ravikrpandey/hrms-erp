import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoaHierarchyActionComponent } from './coa-hierarchy-action.component';

describe('CoaHierarchyActionComponent', () => {
  let component: CoaHierarchyActionComponent;
  let fixture: ComponentFixture<CoaHierarchyActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoaHierarchyActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoaHierarchyActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
