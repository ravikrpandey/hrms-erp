import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableactionbuttonComponent } from './tableactionbutton.component';

describe('TableactionbuttonComponent', () => {
  let component: TableactionbuttonComponent;
  let fixture: ComponentFixture<TableactionbuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableactionbuttonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableactionbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
