import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailFarmingContractsComponent } from './detail-farming-contracts.component';

describe('DetailFarmingContractsComponent', () => {
  let component: DetailFarmingContractsComponent;
  let fixture: ComponentFixture<DetailFarmingContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailFarmingContractsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailFarmingContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
