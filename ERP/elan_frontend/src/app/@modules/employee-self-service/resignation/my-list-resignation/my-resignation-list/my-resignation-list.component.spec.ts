import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyResignationListComponent } from './my-resignation-list.component';

describe('MyResignationListComponent', () => {
  let component: MyResignationListComponent;
  let fixture: ComponentFixture<MyResignationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyResignationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyResignationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
