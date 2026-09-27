import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnapprovedListComponent } from './unapproved-list.component';

describe('UnapprovedListComponent', () => {
  let component: UnapprovedListComponent;
  let fixture: ComponentFixture<UnapprovedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnapprovedListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnapprovedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
