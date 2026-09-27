import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostingPeriodActionComponent } from './posting-period-action.component';

describe('PostingPeriodActionComponent', () => {
  let component: PostingPeriodActionComponent;
  let fixture: ComponentFixture<PostingPeriodActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostingPeriodActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostingPeriodActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
