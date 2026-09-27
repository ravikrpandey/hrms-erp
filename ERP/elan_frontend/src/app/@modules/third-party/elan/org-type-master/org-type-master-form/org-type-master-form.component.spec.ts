import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgTypeMasterFormComponent } from './org-type-master-form.component';

describe('OrgTypeMasterFormComponent', () => {
  let component: OrgTypeMasterFormComponent;
  let fixture: ComponentFixture<OrgTypeMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgTypeMasterFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgTypeMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
