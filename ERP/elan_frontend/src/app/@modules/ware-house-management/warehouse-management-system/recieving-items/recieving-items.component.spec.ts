import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecievingItemsComponent } from './recieving-items.component';

describe('RecievingItemsComponent', () => {
  let component: RecievingItemsComponent;
  let fixture: ComponentFixture<RecievingItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecievingItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecievingItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
