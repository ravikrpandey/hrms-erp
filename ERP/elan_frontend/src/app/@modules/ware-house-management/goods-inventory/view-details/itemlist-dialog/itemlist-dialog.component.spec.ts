import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemlistDialogComponent } from './itemlist-dialog.component';

describe('ItemlistDialogComponent', () => {
  let component: ItemlistDialogComponent;
  let fixture: ComponentFixture<ItemlistDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemlistDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemlistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
