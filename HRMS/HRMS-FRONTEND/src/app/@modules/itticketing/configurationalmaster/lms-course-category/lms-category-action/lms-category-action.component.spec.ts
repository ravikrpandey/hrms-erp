import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsCategoryActionComponent } from './lms-category-action.component';

describe('LmsCategoryActionComponent', () => {
  let component: LmsCategoryActionComponent;
  let fixture: ComponentFixture<LmsCategoryActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LmsCategoryActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LmsCategoryActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
