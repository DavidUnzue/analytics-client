import { Injectable } from '@angular/core';
import { PageView } from './page-view';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root',
})
export class PageViewService {
  constructor(private http: HttpClient) {}

  private apiUrl = `${environment.apiRoot}/page-views`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // send api token for authorization
      'Api-Token': environment.apiToken,
    }),
    params: new HttpParams(),
  };

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a message with to the console */
  private log(message: string) {
    console.log(`PageViewService: ${message}`);
  }

  aggregateByAttribute(pageViews: any[], attributeName: string): any[] {
    const byAttribute = {};
    pageViews.forEach((view) => {
      const value = view[attributeName];
      if (!byAttribute[value]) {
        byAttribute[value] = 0;
      }
      // count how often the current value appears in the pageViews list (# of views)
      byAttribute[value] += 1;
    });
    // transform to list of counts by attribute (to use with plot)
    const aggregatedViews = Object.keys(byAttribute).map((attributeValue) => ({
      name: attributeValue,
      value: byAttribute[attributeValue],
    }));
    return aggregatedViews;
  }

  getAllPages(): Observable<string[]> {
    let options = { ...this.httpOptions };
    // create a projection of page views to get back the pageId of each view only
    options.params = options.params.set('projection', '{"pageId": 1}');
    return this.http.get<PageView[]>(this.apiUrl, options).pipe(
      map((pageViews) => [
        ...new Set(pageViews.map((pageView) => pageView.pageId)),
      ]),
      catchError(this.handleError<string[]>('getAllPages', []))
    );
  }

  createPageView(pageView: PageView): Observable<PageView> {
    return this.http
      .post<PageView>(this.apiUrl, pageView, this.httpOptions)
      .pipe(
        tap((newPageView: PageView) =>
          this.log(`created PageView w/ pageId=${newPageView.pageId}`)
        ),
        catchError(this.handleError<PageView>('createPageView'))
      );
  }

  // get all page views from api
  getPageViews(queryparams: object): Observable<PageView[]> {
    let options = { ...this.httpOptions };
    // set all given query params to http options
    if (queryparams) {
      Object.keys(queryparams).forEach((paramKey) => {
        options.params = options.params.set(
          paramKey,
          JSON.stringify(queryparams[paramKey])
        );
      });
    }
    return this.http
      .get<PageView[]>(this.apiUrl, options)
      .pipe(catchError(this.handleError<PageView[]>('getPageViews', [])));
  }

  getRate(queryparams: object): Observable<PageView[]> {
    let options = { ...this.httpOptions };
    // set all given query params to http options
    if (queryparams) {
      Object.keys(queryparams).forEach((paramKey) => {
        options.params = options.params.set(
          paramKey,
          JSON.stringify(queryparams[paramKey])
        );
      });
    }
    return this.http
      .get<any>(`${this.apiUrl}/rate`, options)
      .pipe(catchError(this.handleError<any>('getRate', [])));
  }

  // active users in the last 30 minutes
  getLastPageViews(pageId): Observable<PageView[]> {
    return this.getPageViews({
      where: {
        pageId: pageId,
        viewedAt: {
          $gte: moment().tz('Europe/Berlin').subtract(30, 'minutes').valueOf(),
        },
      },
      projection: { userId: 1 },
    });
  }

  // rate between the number of returning users and all users for current day
  getReturningRate(pageId): Observable<any> {
    return this.getRate({
      where: {
        pageId: pageId,
        viewedAt: {
          $gte: moment().tz('Europe/Berlin').startOf('day').valueOf(),
        },
      },
    });
  }
}
