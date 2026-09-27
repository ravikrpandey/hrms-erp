import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostingPeriodComponent } from './posting-period.component';

describe('PostingPeriodComponent', () => {
  let component: PostingPeriodComponent;
  let fixture: ComponentFixture<PostingPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostingPeriodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostingPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
