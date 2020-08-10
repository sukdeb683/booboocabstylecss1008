import { ToastController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

import { MysharedserviceService } from './../services/mysharedservice.service';
import { Mydata } from '../shared/models/mydata.model';

//import { map } from 'rxjs/operators';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AuthService } from '../services/auth.service';
//import { Map, tileLayer, marker, polyline, Marker  } from 'leaflet';
import * as L from 'leaflet';

///////   test on esri 
import * as esri from 'esri-leaflet';
import  * as esri2 from 'esri-leaflet-geocoder';
import { Router } from '@angular/router';
//////


@Component({
  selector: 'app-tab1-drop',
  templateUrl: './tab1-drop.page.html',
  styleUrls: ['./tab1-drop.page.scss'],
})
export class Tab1DropPage implements OnInit {


  map: L.Map;
  marker: L.Marker;
  latLong: any[];

  mydata: Mydata;

  pickupMarker: L.Marker;

  dropLocName: string ="";

  icon = L.icon({
    iconUrl: 'assets/img/markers/marker-icon-green.png',
    shadowUrl: 'assets/img/markers/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });



  constructor(
    private auth: AuthService,
    private router: Router,
    private geolocation: Geolocation,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private mysharedserviceService: MysharedserviceService,
  ) 
  {
    this.mydata = this.mysharedserviceService.getMydata();
  }

  ngOnInit() {
  }




  ionViewDidEnter(){
    this.mydata = this.mysharedserviceService.getMydata();
    
    this.showMap();
    this.showPickupMarker();
    this.latLong = [];
  }

  ionViewWillLeave(){
  }

  logout() {
    this.auth.logout();
  }

  
  showMap(){
    
    this.map?.remove();


    //this.map = new Map('myMap2').setView([22.723968, 88.4850196], 6);  // kolkata
    if(this.mydata.pickupLocName.length >= 1 ){
    this.map = new L.Map('myMap2').setView( <L.LatLngExpression>this.mydata.pickupLatLong, 12);
    }
    else{
      this.map = new L.Map('myMap2').setView([6.458465879581817, 3.3691165200434634], 12);
      this.map.locate({setView: true, maxZoom: 12});
      
    }
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    this.map.on('click', (e) => {   
      ///remove previous marker
      if (this.marker != undefined) {
        this.map.removeLayer(this.marker);
      };
      
      //console.log('Event is working', e );  
      this.latLong = [ e['latlng']['lat'],  e['latlng']['lng'] ];
      console.log(' latLong: ', this.latLong );
      this.showMarker( this.latLong );




      this.mydata = {
        id: -1, 
        pickupDate: this.mydata?.pickupDate,
        pickupLocName: this.mydata?.pickupLocName,
        pickupLatLong: this.mydata?.pickupLatLong,

        dropLocName: this.dropLocName,
        dropLatLong: this.latLong
      };
      this.mysharedserviceService.setMydata( this.mydata );

      this.auth.setNewAccess();


    });



  }

  getPositions(){

    console.log(' get position...');
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

      this.auth.setNewAccess();

      /////my service update
      // this.mysharedserviceService.setMydata(
      //   { 
      //     pickupDate: this.myDate,
      //     dropDate:'',
      //     pickupLatLong:latlng,
      //     dropLatLong:[] 
      //   }
      // );
      /////


    
    });





  }



  showMarker(lat_lng: any){
      this.marker = L.marker(lat_lng, {icon: this.icon} );
      this.marker.addTo(this.map).bindPopup(`Drop here`);
  }

  showPickupMarker(){
    console.log("show pick up ", this.mydata?.pickupLatLong);
    if( this.mydata?.pickupLatLong?.length >= 2 ){
      this.pickupMarker = L.marker( <any>this.mydata?.pickupLatLong   );
      this.pickupMarker.addTo(this.map).bindPopup(`I selected Pickup Here`).openPopup();
    }
    else{
      this.presentToastWithOptions("Error", "Pickup point not selected", "alert-circle-outline", "close-outline");
    }
    
    
  }

  locateMap(mapOb: any) {

    console.log(' locate is working...');
    mapOb.locate({setView: true, maxZoom: 18});

  }



  drop(){

    this.mydata = {
      id: -1, 
      pickupDate: this.mydata?.pickupDate,
      pickupLocName: this.mydata?.pickupLocName,
      pickupLatLong: this.mydata?.pickupLatLong,

      dropLocName: this.dropLocName,
      dropLatLong: this.latLong
    };
    this.mysharedserviceService.setMydata( this.mydata );



    //console.log("pickupLatLong: ", this.mysharedserviceService.getMydata()?.pickupLatLong );
    //console.log("pickupDate: ", this.mysharedserviceService.getMydata()?.pickupDate );
    //console.log("pickupLocName: ", this.mysharedserviceService.getMydata()?.pickupLocName );

    //console.log("dropLatLong: ", this.mysharedserviceService.getMydata()?.dropLatLong );
    //console.log("dropLocName: ", this.mysharedserviceService.getMydata()?.dropLocName );


    if( this.mysharedserviceService.getMydata()?.pickupLatLong?.length >= 2
      && this.mysharedserviceService.getMydata()?.dropLatLong.length >= 2
      && this.mysharedserviceService.getMydata()?.pickupDate.length >=1
    ){
      

      
      console.log('ok');

      // this.mysharedserviceService.createRide().subscribe(
      //   async res => { console.log("test res: ", res ); },
      //   err => {},
      //   () => {}
      // );

      this.presentLoading(500);
      this.mysharedserviceService.createRide().subscribe(
        async res => { 
          console.log("test res: ", res );

          if(res['status'] == 201   ){
            this.presentToast("Thank you! Your request has been saved!", 6000, 'success' );
            //// rout to tab1-drop
            
            setTimeout(() => {
              this.router.navigateByUrl('/members/tab2');
            }, 6000);
          }
          else{
            //this.presentToast("Some thing went wrong...", 2000, 'dark');
            this.presentToast(res['msg'], 12000, 'danger');
            this.router.navigateByUrl('/members/tab2');
          }

          
        },
        err => {},
        () => { }

      );

      //ok //this.presentToast("Your request have been saved");
      // this.presentToast("Your request have been saved");
      //this.presentToastWithOptions("work in progresss", " ...message...", "alert-circle-outline", "close-outline");


    }
    else{
      console.log("please select pickup location first!");
      this.presentToastWithOptions("Error", "Please select all mandatory fields", "alert-circle-outline", "close-outline");
    }

    
  }


  async presentToast(mesage: string, duration: number, color: string) {
    const toast = await this.toastController.create({
      message: mesage,
      duration: duration,
      position: 'middle',
      color: color
    });
    toast.present();
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





}
