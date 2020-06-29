import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageViewService } from './page-view.service';
import { PageView } from './page-view';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private pageViewService: PageViewService
  ) {}

  pageId: string;

  newPageView = {};

  createPageView(): void {
    this.pageViewService
      .createPageView({ pageId: this.pageId } as PageView)
      .subscribe((pageView) => {
        this.newPageView = pageView;
      });
  }

  ngOnInit() {
    this.route.url.subscribe((url) => {
      this.pageId = url[0].path;
      this.createPageView();
    });
  }
}
