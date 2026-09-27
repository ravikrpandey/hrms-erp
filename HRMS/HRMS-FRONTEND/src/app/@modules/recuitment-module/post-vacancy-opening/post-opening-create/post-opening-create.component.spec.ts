import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostOpeningCreateComponent } from './post-opening-create.component';

describe('PostOpeningCreateComponent', () => {
  let component: PostOpeningCreateComponent;
  let fixture: ComponentFixture<PostOpeningCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostOpeningCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostOpeningCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
