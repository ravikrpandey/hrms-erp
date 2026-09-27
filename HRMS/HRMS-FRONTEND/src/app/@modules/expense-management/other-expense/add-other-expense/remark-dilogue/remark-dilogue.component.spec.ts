import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemarkDilogueComponent } from './remark-dilogue.component';

describe('RemarkDilogueComponent', () => {
  let component: RemarkDilogueComponent;
  let fixture: ComponentFixture<RemarkDilogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemarkDilogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemarkDilogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
