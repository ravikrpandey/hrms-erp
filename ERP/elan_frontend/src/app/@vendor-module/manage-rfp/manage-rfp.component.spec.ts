import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRfpComponent } from './manage-rfp.component';

describe('ManageRfpComponent', () => {
  let component: ManageRfpComponent;
  let fixture: ComponentFixture<ManageRfpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRfpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageRfpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
