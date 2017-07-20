import { Device } from '@ionic-native/device';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the NotificationProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class NotificationProvider {
    constructor (
        public http: Http,
        public push: Push,
        public device: Device
    ) { }

    init () {
        const options: PushOptions = {
            android: {
                senderID: '1028888612054'
            }
        };

        const pushObject: PushObject = this.push.init(options);

	    pushObject.on('registration').subscribe((registration: any) => {
	        this.saveToken(registration.registrationId);
	    });
    }

	saveToken (token) {
	    // build the headers for our api call to make sure we send json data type to our api
	    const headers = new Headers();
	    headers.append("Accept", 'application/json');
	    headers.append('Content-Type', 'application/json' );
	    const options = new RequestOptions({ headers });

	    // this is our payload for the POST request to server
	    const device = {
	        platform: this.device.platform,
	        model: this.device.model,
	        uuid: this.device.uuid,
	        token
	    };
	    const url = "http://192.168.1.107:3000/devices.json";

	    this.http.post(url, {device}, options)
	        .subscribe(data => {
	            console.log('token saved');
	        }, error => {
	            console.log('error saving token', error);
	        });
	}
}
