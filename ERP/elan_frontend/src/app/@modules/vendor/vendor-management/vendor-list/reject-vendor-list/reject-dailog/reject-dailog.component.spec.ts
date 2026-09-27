import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectDailogComponent } from './reject-dailog.component';

describe('RejectDailogComponent', () => {
  let component: RejectDailogComponent;
  let fixture: ComponentFixture<RejectDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectDailogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
