import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectEmployessComponent } from './reject-employess.component';

describe('RejectEmployessComponent', () => {
  let component: RejectEmployessComponent;
  let fixture: ComponentFixture<RejectEmployessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectEmployessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectEmployessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
