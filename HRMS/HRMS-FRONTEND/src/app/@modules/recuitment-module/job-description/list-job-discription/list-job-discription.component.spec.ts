import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListJobDiscriptionComponent } from './list-job-discription.component';

describe('ListJobDiscriptionComponent', () => {
  let component: ListJobDiscriptionComponent;
  let fixture: ComponentFixture<ListJobDiscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListJobDiscriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListJobDiscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
