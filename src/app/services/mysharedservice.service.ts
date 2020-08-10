import { Storage } from '@ionic/storage';
//import { Router } from '@angular/router';
//import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { AuthService } from './auth.service';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { Injectable } from '@angular/core';

//import { take, map, switchMap } from 'rxjs/operators';

import { Mydata } from '../shared/models/mydata.model';

import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from '../../environments/environment';

const helper = new JwtHelperService();
const TOKEN_KEY = 'jwt-token';
const TOKEN_REFRESH = 'jwt-token-refresh';

@Injectable({
  providedIn: 'root'
})
export class MysharedserviceService {

  public user: Observable<any>;
  public userData = new BehaviorSubject(null);

  access: string = '';
  refresh: string = '';

  public newaccess:string = '';
  

  //public sharedData = new BehaviorSubject(null);
  constructor(
    private storage: Storage,
    private http: HttpClient,
    //private plt: Platform,
    //private router: Router,
    private auth:AuthService) {

      this.apiEndPoint = environment.apiEndPoint;
      
      //this.auth.loadStoredToken();

      //this.loadTokenRefresh();

    }

  apiEndPoint: string="";  

  mydata: Mydata;


  

  getMydata(){
    return this.mydata;
  }

  setMydata(data: Mydata){
    this.mydata = data;
  }


  // loadTokenRefresh(){

  //   this.storage.get('jwt-token').then((result) => {
  //     this.access = result;
  //   });


  //   this.storage.get('jwt-token-refresh').then((result) => {
  //     this.refresh = result;
  //   });

  // }

  // setNewAccess(){

  //   let refreshdata: any = {
  //     "refresh": this.refresh
  //   };


  //   this.http.post(`${this.apiEndPoint}token/refresh/`, refreshdata)
  //   .subscribe(
  //     async res => {
  //        this.newaccess = res.hasOwnProperty('access') ? res['access'] : '';
  //        console.log("newaccess->  ", this.newaccess  );

  //     },
  //     err => { console.log(err) },
  //     () => { console.log('complete', this.newaccess);  }

  //   );

  // }




  /*
  ////snippet
  createRide() {

    console.log("@createRide : ", this.auth.newaccess);

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer  ' + this.auth.newaccess
      })
    };
    return this.http.post(`${this.apiEndPoint}hello/`, JSON.stringify({}), httpOptions);
  }
  */



  createRide() {

    console.log("@createRide : ", this.auth.newaccess);

    let data = this.mydata;

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer  ' + this.auth.newaccess
      })
    };
    return this.http.post(`${this.apiEndPoint}rest_createride/`, JSON.stringify(data), httpOptions);
  }


  ListPassengers(){
    console.log("@ListPassengers...");

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer  ' + this.auth.newaccess
      })
    };

    return this.http.get<any[]>(`${this.apiEndPoint}rest_listpassengers/`, httpOptions);

  }

  deletePassenger(pk: number){

    console.log("@deletePassenger : ", this.auth.newaccess);

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer  ' + this.auth.newaccess
      })
    };
    return this.http.post(`${this.apiEndPoint}rest_deleteride/${pk}/`, JSON.stringify({}), httpOptions);
  }










}
