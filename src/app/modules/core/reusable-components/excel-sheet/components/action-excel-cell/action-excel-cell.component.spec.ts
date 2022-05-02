import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionExcelCellComponent } from './action-excel-cell.component';

describe('ActionExcelCellComponent', () => {
  let component: ActionExcelCellComponent;
  let fixture: ComponentFixture<ActionExcelCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionExcelCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionExcelCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
