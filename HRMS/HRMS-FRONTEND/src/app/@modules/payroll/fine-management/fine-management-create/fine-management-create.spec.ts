import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FineManagementCreate } from './fine-management-create';

describe('FineManagementCreate', () => {
  let component: FineManagementCreate;
  let fixture: ComponentFixture<FineManagementCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FineManagementCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FineManagementCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
