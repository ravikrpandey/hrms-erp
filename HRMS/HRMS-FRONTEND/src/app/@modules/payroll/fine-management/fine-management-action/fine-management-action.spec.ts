import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FineManagementAction } from './fine-management-action';

describe('FineManagementAction', () => {
  let component: FineManagementAction;
  let fixture: ComponentFixture<FineManagementAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FineManagementAction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FineManagementAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
