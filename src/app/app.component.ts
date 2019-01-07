import { Component, OnInit, NgZone } from '@angular/core';
import {
  HttpClient, HTTP_INTERCEPTORS, HttpEventType, HttpErrorResponse,
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpClientModule, HttpParams
} from '@angular/common/http';
import { Kinvey, CacheStore } from 'kinvey-angular2-sdk';
Kinvey.init({
  appKey: 'kid_HkXB1x-XQ',
  appSecret: '311020ed9d26404aaf0e932cad204b03'
});
interface Contact {
  _id;
  Name: string;
  MailingCity: string;

}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  city = ['shrewsbury', 'chicago', 'boston', 'waltham', 'dartmouth', 'riverside', 'Austin'];
public coord: Array<any> = [];
dataStore: CacheStore<Contact>;
  constructor(private zone: NgZone, private http: HttpClient) {
    this.dataStore = Kinvey.DataStore.collection<Contact>('context');


  }

  ngOnInit(): void {
    if (Kinvey.User.getActiveUser()) {
      const subscription = this.dataStore.find()
      .subscribe(data => {
        const citylist = data;
    for (let i = 0, size = citylist.length; i < size; i++) {
      const cityName = citylist[i].MailingCity;
  const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + cityName + '&key=AIzaSyBFrbYpwgOoQUukE139oGYIsrgQn6Al2SE';
      this.http.get(url).subscribe((response: any) => {
        const loc = response.results[0].geometry.location;
        this.zone.run(() => {
          this.coord.push(loc.lat);
        });
      } );

    }
    console.log(this.coord);
  }, (error) => {
    alert(error);
  }, () => {
    // ...
  }); } else {
  Kinvey.User.login('admin', 'admin').then(() => { const subscription = this.dataStore.find()
    .subscribe(data => {
      for (let i = 0, size = this.city.length; i < size; i++) {
        const cityName = this.city[i];
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + cityName + '&key=AIzaSyBFrbYpwgOoQUukE139oGYIsrgQn6Al2SE';
        this.http.get(url).subscribe((response: any) => {
          const loc = response.results[0].geometry.location;
          this.zone.run(() => {
            this.coord.push(loc.lat);
          });
        } );

      }
      console.log(this.coord);
    }, (error) => {
      alert(error);
    }, () => {
      // ...
    });
  } ); }
  }
}
