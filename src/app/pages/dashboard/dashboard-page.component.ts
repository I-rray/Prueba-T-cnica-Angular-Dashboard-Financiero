import { Component } from '@angular/core';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { TabSwitcherComponent } from '../../components/tab-switcher/tab-switcher.component';
import { ChartComponent } from '../../components/chart/chart.component';
import { SummaryComponent } from '../../components/summary/summary.component';
import { InstrumentListComponent } from '../../components/instrument-list/instrument-list.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    SearchBarComponent,
    HeaderComponent,
    TabSwitcherComponent,
    ChartComponent,
    SummaryComponent,
    InstrumentListComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {

}
