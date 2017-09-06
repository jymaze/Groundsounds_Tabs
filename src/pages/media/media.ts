import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the MediaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-media',
  templateUrl: 'media.html',
})

export class MediaPage {

  content: any;

  constructor(params: NavParams, public viewCtrl: ViewController) {
    this.content = params.get('iframe');
    console.log('param passed:', this.content[0]);
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

}
