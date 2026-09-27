import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyListRemarkComponent } from './my-list-remark.component';

describe('MyListRemarkComponent', () => {
  let component: MyListRemarkComponent;
  let fixture: ComponentFixture<MyListRemarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyListRemarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyListRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
