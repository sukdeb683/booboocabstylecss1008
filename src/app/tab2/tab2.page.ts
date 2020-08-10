import { Mydata } from './../shared/models/mydata.model';
import { MysharedserviceService } from './../services/mysharedservice.service';
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

import { ViewChild } from '@angular/core';
import { IonSlides, LoadingController, AlertController, ToastController } from '@ionic/angular';

import * as L from 'leaflet';
 
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  user = null;
 
  constructor(
    private auth: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
    private mysharedserviceService: MysharedserviceService
  ){
  }


  mySlideOptions = {  initialSlide: 0, loop: true, effect: 'flip', };

  @ViewChild('slides') slides: IonSlides;

  mydata: Mydata;
  mylistdata: Mydata[] = [];

  map: L.Map;
  pickupMarker: L.Marker;
  dropMarker: L.Marker;


  //menuClicked: boolean = true;

  hideDeleteIcon: boolean = true; 

  icon = L.icon({
    iconUrl: 'assets/img/markers/marker-icon-green.png',
    shadowUrl: 'assets/img/markers/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  ionViewWillEnter() {
    this.user = this.auth.getUser();
    //this.slides.lockSwipes(true);
    
    console.log("  ionViewWillEnter  : ");

    try {
      this.auth.setNewAccess();
      this.mylistdata= [];
    } catch (error) {
      console.log(error);
    }
    finally {
      setTimeout(()=>{ this.loadListPassengers(); }, 2000);
      
    }
  }

  

  ionViewDidEnter(){
  }

  ionViewWillLeave(){
    //this.slides.lockSwipes(false);
  }

  logout() {
    this.auth.logout();
  }

  next() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();

    console.log(this.mylistdata);
  }
  prev() {
    this.slides.slidePrev();
  }

  // openMenu() {
  //   this.menuClicked= !this.menuClicked;
  // }

  async presentToast(mesage: string, duration: number, color: string) {
    const toast = await this.toastController.create({
      message: mesage,
      duration: duration,
      position: 'middle',
      color: color
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

  async presentDeleteAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-confirm-class-1',
      header: 'Are you sure!',
      message: '<strong> Delete this ride?</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
            this.deleteRideComfirm();
          }
        }
      ]
    });

    await alert.present();
  }



  loadListPassengers(){

    //this.mydata.ListPassengers()
    this.presentLoading(500);
    this.mysharedserviceService.ListPassengers().subscribe(
      async res => { 
        //console.log("test res: ", res );

        ///params.push({code: 'dateType', name: 'CHECKIN'});
        //this.mylistdata.push();
        let i = 0;
        res.forEach(element => {
          i++;
          console.log(i);
          console.log(element);

          let regExp = /\(([^)]+)\)/;
          let matches = regExp.exec( element['pickuppiont'] );
          let a = matches[1].split(" ");
          //console.log("a: ", a);

          let matches2 = regExp.exec( element['droppoint'] );
          let b = matches2[1].split(" ");
          //console.log("b: ", b);

          this.mydata = {
            id: element['id'],
            pickupDate: element['request_time'],
            pickupLocName: element['pickup_point_local_name'],
            pickupLatLong: [a[1], a[0]],  //////  because leflet and django is not same!!!!
    
            dropLocName: element['drop_point_local_name'],
            dropLatLong: [b[1], b[0]],
          };

          this.mylistdata.push( this.mydata );

          

        });

        console.log("i=", i);
        if( i> 0){
          this.hideDeleteIcon = false;
        }
        else{
          this.hideDeleteIcon = true;
        }
        
      },
      err => { console.log(" eeerr: ", err);  this.showListMap();},
      () => {  this.showListMap(); } // on complete

    );

  }

  showListMap(){
    this.map?.remove();

    //this.map = new Map('myMap').setView([22.723968, 88.4850196], 6);  // kolkata
    
    if(this.mylistdata.length >= 1 ){
      //console.log("wwww: ",this.mylistdata[0]);
      this.map = new L.Map('Maplist0').setView( <L.LatLngExpression>this.mylistdata[0].pickupLatLong , 12);
    }
    else{
      this.map = new L.Map('Maplist0').setView([6.458465879581817, 3.3691165200434634], 12);
      this.map.locate({setView: true, maxZoom: 12});
    }
    
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    this.showPickupMarker();
    this.showDropMarker();
  }
  
  

  showPickupMarker(){
    console.log("show pick up ", this.mylistdata );
    if( this.mylistdata?.length >= 1 ){
      this.pickupMarker = L.marker( <any>this.mylistdata[0].pickupLatLong   );
      this.pickupMarker.addTo(this.map).bindPopup(`I selected Pickup Here`).openPopup();
    }
    else{
    }
  }
  showDropMarker(){
    console.log("show drop up ", this.mylistdata );
    if( this.mylistdata?.length >= 1 ){
      this.dropMarker = L.marker( <any>this.mylistdata[0].dropLatLong, {icon: this.icon}  );
      this.dropMarker.addTo(this.map).bindPopup(`I selected Drop Here`);
    }
    else{
    }
  }


  trackRide(){
    try {
      this.auth.setNewAccess();
      this.mylistdata= [];
    } catch (error) {
      console.log("trackRide: ", error);
    }
    finally {
      this.loadListPassengers();
    }
  }


  deleteRide(){
    console.log("delete");

    this.presentDeleteAlertConfirm();
    this.presentLoading(500);

    
  }

  deleteRideComfirm(){
    this.mysharedserviceService.deletePassenger( this.mylistdata[0].id ).subscribe(
      async res => { 
        console.log(res );
        
        if(res['status'] == 202 ){
          this.presentToast("Ride request has been deleted!", 6000, 'success' );
          this.trackRide();
        }
        else{
          this.presentToast(res['msg'], 12000, 'danger');
        }
      
      },
      err => {},
      () => { } // on complete
    );

  }



}