import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';

import { take, map, switchMap } from 'rxjs/operators';
//import { createDiffieHellman } from 'crypto';

import { environment } from '../../environments/environment';


const helper = new JwtHelperService();
const TOKEN_KEY = 'jwt-token';
const TOKEN_REFRESH = 'jwt-token-refresh';



@Injectable({
  providedIn: 'root'
})
export class AuthService {


  public user: Observable<any>;
  public userData = new BehaviorSubject(null);

  apiEndPoint: string="";


  access:string = '';
  refresh:string = '';
  newaccess:string = '';



  constructor(
    private storage: Storage,
    private http: HttpClient,
    private plt: Platform,
    private router: Router) { 
      this.apiEndPoint = environment.apiEndPoint;
      
      this.loadStoredToken();
  }


  loadStoredToken(){
    let PlatformObj =  from( this.plt.ready() );


    this.user = PlatformObj.pipe(
      switchMap(
        () => {
          return from(this.storage.get(TOKEN_KEY))      
      }),
      map( token =>{
        console.log('Token from storage:  ', token);

        if(token){

          this.loadTokenRefresh();/////// refresh acess

          let decoded = helper.decodeToken(token);
          console.log('Decoded: ', decoded);
          this.userData.next(decoded); 
          return true;
        }
        else{
          return null;
        }

      })
    );

  }

  login(credentials:{email: string, pw:string }):Observable<any>{
    // if(credentials.email != 'TU1@company.com' || credentials.pw !='Testing321' ){
    //   return of(null);
    // }


    let data :any = { email: credentials.email,
      username: credentials.email,
      password:credentials.pw,
    };

    return this.http.post(`${this.apiEndPoint}token/`, data ).pipe(  
      take(1),
      map(res => {

        console.log("res : ", res );
        //console.log("res : ", res.hasOwnProperty('access')  );
        let access = res.hasOwnProperty('access') ? res['access'] : '';
        let refresh = res.hasOwnProperty('refresh') ? res['refresh'] : '';
        console.log(" got access token : ", access);
        console.log(" got refresh token : ", refresh);


        return {access:access, refresh:refresh };
      }),
      switchMap( token => {

        let access_decoded = helper.decodeToken(token.access);
        console.log('login Decoded: ', access_decoded);
        let refresh_decoded = helper.decodeToken(token.refresh);
        console.log('login Decoded: ', refresh_decoded);

        this.userData.next(access_decoded);

        let  storageObs =  from( this.storage.set(TOKEN_KEY, token.access) ); 
        let  storageObs2 =  from( this.storage.set(TOKEN_REFRESH, token.refresh) ); 

        return storageObs;
      })



    );


  }

  getUser(){
    return this.userData.getValue();
  }

  logout(){

    this.storage.remove(TOKEN_REFRESH);

    this.storage.remove(TOKEN_KEY).then( ()=>{
      this.router.navigateByUrl('/'),
      this.userData.next(null);
    });
  }


  
  userRegister(credentials:{email: string, pw:string, pw2:string, username:string }):Observable<any>{
    
    let data :any = { email: credentials.email,
      username: credentials.email,
      password:credentials.pw,
    };
    
    if(credentials.pw === credentials.pw2 && credentials.pw != null ){
      console.log('inside auth resister', data );

      //return this.http.post(this.apiEndPoint+'users/', data);
      return this.http.post(`${this.apiEndPoint}users/`, data);
    }

    return of(null);
    

    
  }


  loadTokenRefresh(){

    this.storage.get('jwt-token').then((result) => {
      this.access = result;
    });

    this.storage.get('jwt-token-refresh').then((result) => {
      this.refresh = result;
    });

  }



  setNewAccess(){

    let refreshdata: any = {
      "refresh": this.refresh
    };


    this.http.post(`${this.apiEndPoint}token/refresh/`, refreshdata)
    .subscribe(
      async res => {
         this.newaccess = res.hasOwnProperty('access') ? res['access'] : '';
         console.log("newaccess->  ", this.newaccess  );

      },
      err => { console.log(err) },
      () => { console.log('complete: ', this.newaccess);  }

    );

  }

  





}
