import { Component, OnInit } from '@angular/core';
import { PageViewService } from '../page-view.service';
import { PageView } from '../page-view';

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.scss'],
})
export class PlotComponent implements OnInit {
  view: any[] = [0, 400];
  pageList: string[];
  pageViews: PageView[];
  selectedPageId: string;
  activeUsers: number = 0;
  returningUsers: number = 0;

  // plot options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Views';
  yAxisTickFormatting = this.axisFormat;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C'],
  };

  constructor(private pageViewService: PageViewService) {}

  // rounded numbers for y axis
  axisFormat(val: number): string {
    if (val % 1 === 0) {
      return val.toLocaleString();
    } else {
      return '';
    }
  }

  getPageViewsByPageId(pageId: string): void {
    this.pageViewService
      .getPageViews({ where: { pageId: pageId } })
      .subscribe((pageViews) => {
        this.pageViews = this.pageViewService.aggregateByAttribute(
          pageViews,
          'country'
        );
      });
  }

  getActiveUsersCountByPageId(pageId: string): void {
    this.pageViewService.getLastPageViews(pageId).subscribe((pageViews) => {
      this.activeUsers = [
        ...new Set(pageViews.map((view) => view.userId)),
      ].length;
    });
  }

  getReturningUsersByPageId(pageId: string): void {
    this.pageViewService.getReturningRate(pageId).subscribe((rate) => {
      this.returningUsers = rate.rate;
    });
  }

  loadData(): void {
    this.getPageViewsByPageId(this.selectedPageId);
    this.getActiveUsersCountByPageId(this.selectedPageId);
    this.getReturningUsersByPageId(this.selectedPageId);
  }

  onPageChange(pageId: string) {
    this.selectedPageId = pageId;
    this.loadData();
  }

  onSelect(event: Event) {
    console.log(event);
  }

  ngOnInit(): void {
    this.pageViewService.getAllPages().subscribe((pageList) => {
      this.pageList = pageList;
      this.selectedPageId = this.pageList[0];
      this.loadData();
    });
  }
}
