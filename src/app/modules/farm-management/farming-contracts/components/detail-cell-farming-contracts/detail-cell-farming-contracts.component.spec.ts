import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCellFarmingContractsComponent } from './detail-cell-farming-contracts.component';

describe('DetailCellFarmingContractsComponent', () => {
  let component: DetailCellFarmingContractsComponent;
  let fixture: ComponentFixture<DetailCellFarmingContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailCellFarmingContractsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCellFarmingContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
