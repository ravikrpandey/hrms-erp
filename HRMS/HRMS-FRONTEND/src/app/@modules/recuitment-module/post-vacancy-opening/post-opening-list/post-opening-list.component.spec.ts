import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostOpeningListComponent } from './post-opening-list.component';

describe('PostOpeningListComponent', () => {
  let component: PostOpeningListComponent;
  let fixture: ComponentFixture<PostOpeningListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostOpeningListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostOpeningListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
