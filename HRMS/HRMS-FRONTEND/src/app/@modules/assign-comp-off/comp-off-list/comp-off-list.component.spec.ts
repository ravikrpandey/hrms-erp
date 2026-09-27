import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompOffListComponent } from './comp-off-list.component';

describe('CompOffListComponent', () => {
  let component: CompOffListComponent;
  let fixture: ComponentFixture<CompOffListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompOffListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompOffListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
