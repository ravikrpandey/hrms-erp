import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemQuestionDialogComponent } from './item-question-dialog.component';

describe('ItemQuestionDialogComponent', () => {
  let component: ItemQuestionDialogComponent;
  let fixture: ComponentFixture<ItemQuestionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemQuestionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemQuestionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
