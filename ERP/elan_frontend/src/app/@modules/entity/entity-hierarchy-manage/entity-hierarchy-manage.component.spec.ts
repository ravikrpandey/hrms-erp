import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityHierarchyManageComponent } from './entity-hierarchy-manage.component';

describe('EntityHierarchyManageComponent', () => {
  let component: EntityHierarchyManageComponent;
  let fixture: ComponentFixture<EntityHierarchyManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityHierarchyManageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityHierarchyManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
