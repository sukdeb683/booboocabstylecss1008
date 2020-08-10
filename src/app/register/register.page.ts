import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  credentials = {
    email: '',
    pw: '',
    pw2: '',
    username:'',
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
  ) {}

  ngOnInit() { }

  private async showAlert(header:string , msg:string ) {

    const alert = await this.alertCtrl.create({
      header: header,
      message: msg,
      buttons: ['OK']
    });
    await alert.present();

  }


  register() {
    //console.log(" Register : ", this.credentials.email, this.credentials.pw, this.credentials.pw2);
    if(this.credentials.pw2 === this.credentials.pw){
      this.credentials.username = this.credentials.email;
      this.auth.userRegister({
                email: this.credentials.email,
                pw: this.credentials.pw,
                pw2: this.credentials.pw2,
                username: this.credentials.username,
      }).subscribe(
        async res => {
          console.log(' response ', res);

          this.showAlert("Registration Success!", "Thank you for registration");
          this.router.navigate(['/'] );

        },
        async error => { 

          let msg:any =  error.error[Object.keys( error.error )[0]]; //// first error

          console.log('error', error);
          this.showAlert("Error", msg);
          
        },

      );

    }
    else{
      this.showAlert("Error", 'Password not same');
      
    }
    
  }

}