import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRequestCreateComponent } from './my-request-create.component';

describe('MyRequestCreateComponent', () => {
  let component: MyRequestCreateComponent;
  let fixture: ComponentFixture<MyRequestCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyRequestCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyRequestCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
