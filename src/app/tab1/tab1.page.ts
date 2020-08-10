import { LoadingController, ToastController } from '@ionic/angular';
import { MysharedserviceService } from './../services/mysharedservice.service';
import { Mydata } from '../shared/models/mydata.model';

//import { map } from 'rxjs/operators';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
//import { Map, tileLayer, marker, polyline, Marker  } from 'leaflet';
import * as L from 'leaflet';

///////   test on esri 
import * as esri from 'esri-leaflet';
import  * as esri2 from 'esri-leaflet-geocoder';
//////

import { Router } from '@angular/router';

/// beaware of duplicate imports

 

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  map: L.Map;
  marker: L.Marker;
  latLong: any[];

  myDate: String = new Date().toISOString();
  currentYear: number = new Date().getFullYear();
  currentDate = new Date();

  mydata: Mydata;

  pickupLocName: string ="";

  constructor(
    private router: Router,
    private auth: AuthService,
    private geolocation: Geolocation,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private mysharedserviceService: MysharedserviceService 
  )
  { 


    this.mysharedserviceService.setMydata(  
        { 
          id: -1,
          pickupDate: this.myDate,
          pickupLocName: '',
          pickupLatLong:this.latLong,

          dropLocName: '',
          dropLatLong:[] 
        }
    );


  }





  


  ionViewDidEnter(){
    this.showMap();
    this.latLong = [];
  }

  ionViewWillLeave(){
  }

  logout() {
    this.auth.logout();
  }

  showMap(){
    
    this.map?.remove();

    //this.map = new Map('myMap').setView([22.723968, 88.4850196], 6);  // kolkata
    this.map = new L.Map('myMap').setView([6.458465879581817, 3.3691165200434634], 12); 
    this.map.locate({setView: true, maxZoom: 12});
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    

    this.map.on('click', (e) => {   
      ///remove previous marker
      if (this.marker !== undefined) {
        this.map.removeLayer(this.marker);
      };
      
      //console.log('Event is working', e );  
      this.latLong = [ e['latlng']['lat'],  e['latlng']['lng'] ];
      console.log(' latLong: ', this.latLong );
      this.showMarker( this.latLong );


      this.mysharedserviceService.setMydata(
        { 
          id: -1,
          pickupDate: this.myDate,
          pickupLocName: '',
          pickupLatLong:this.latLong,

          dropLocName: '',
          dropLatLong:[] 
        }
      );




    });



  }

  getPositions(){

    console.log('get potion');
    ///remove previous marker  
    if (this.marker != undefined) {
      this.map.removeLayer(this.marker);
    };


    this.geolocation.getCurrentPosition({
      enableHighAccuracy: true,

    }).then( (res) =>{
      return this.latLong = [
        res.coords.latitude,
        res.coords.longitude
      ]
    }).then( (latlng)=>{
      this.locateMap(this.map);

      this.showMarker(latlng);


      /////my service update
      this.mysharedserviceService.setMydata(
        { 
          id: -1,
          pickupDate: this.myDate,
          pickupLocName: this.pickupLocName,
          pickupLatLong:latlng,

          dropLocName: '',
          dropLatLong:[]
        }
      );
      /////


    
    });





  }



  showMarker(lat_lng: any){
      this.marker = L.marker(lat_lng);
      this.marker.addTo(this.map).bindPopup(`I'm here`);
  }

  locateMap(mapOb: any) {

    console.log(' locate is working...');
    mapOb.locate({setView: true, maxZoom: 18});

  }


  esriSearch(){
    
    //let searchControl = esri2.Geocoding.geosearch().addTo(this.map);
    //let results = L.layerGroup().addTo(this.map);

    // searchControl.on('results', function (data) {
    //   results.clearLayers();
    //   for (var i = data.results.length - 1; i >= 0; i--) {
    //     results.addLayer(L.marker(data.results[i].latlng));
    //   }
    // });

    console.log('esri test');
  }



  pickup(){

    this.mydata = {
      id: -1,
      pickupDate: this.myDate,
      pickupLocName: this.pickupLocName,
      pickupLatLong:this.latLong,

      dropLocName: '',
      dropLatLong:[] 
    }; 
    this.mysharedserviceService.setMydata( this.mydata );

    console.log('...',  this.mysharedserviceService.getMydata()?.pickupDate ) ;
    console.log('...',  this.mysharedserviceService.getMydata()?.pickupLocName ) ;
    console.log('...',  this.mysharedserviceService.getMydata()?.pickupLatLong ) ;
    //console.log(this.auth.getUser()?.user_id );


    if(this.mysharedserviceService.getMydata()?.pickupLatLong?.length >= 2 ){

      this.presentLoading(500);
      console.log('test: ', this.mysharedserviceService.getMydata()?.pickupLatLong );

      //// rout to tab1-drop
      this.router.navigateByUrl('/members/tab1/tab1-drop');

    }
    else{
      //this.presentToastWithOptions("header", " ...message...");
      this.presentToastWithOptions("  Info:  ", "Pickup point not selected! ", "alert-circle-outline", "close-outline" );
    }

  }



  async presentToastWithOptions(header:string, message:string, icon1:string, icon2:string ) {
    const toast = await this.toastController.create({
      header: header,
      message: message,
      mode: 'ios',
      duration: 6000,
      position: 'middle',
      buttons: [
        {
          side: 'start',
          icon: icon1,
          text: ' ',
          handler: () => {
            console.log('Favorite clicked');
          }
        }, {
          icon: icon2,
          text: ' ',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ],
      color: 'light'
    });
    toast.present();
  }



  async presentLoading( duration: number ) {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: duration
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      spinner: null,
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
      backdropDismiss: true
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed with role:', role);
  }







}
