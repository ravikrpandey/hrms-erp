import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FineManagementList } from './fine-management-list';

describe('FineManagementList', () => {
  let component: FineManagementList;
  let fixture: ComponentFixture<FineManagementList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FineManagementList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FineManagementList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
