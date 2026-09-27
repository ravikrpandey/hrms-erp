import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDoList } from './all-do-list.component';

describe('AllDoList', () => {
  let component: AllDoList;
  let fixture: ComponentFixture<AllDoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllDoList ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllDoList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
