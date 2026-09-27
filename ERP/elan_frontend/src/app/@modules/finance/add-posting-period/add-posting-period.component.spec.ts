import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPostingPeriodComponent } from './add-posting-period.component';

describe('AddPostingPeriodComponent', () => {
  let component: AddPostingPeriodComponent;
  let fixture: ComponentFixture<AddPostingPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPostingPeriodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPostingPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
