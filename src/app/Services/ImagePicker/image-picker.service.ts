import { Injectable } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

@Injectable({
  providedIn: 'root'
})
export class ImagePickerService {
  private options: any = {
    maximumImagesCount: 1,
    outputType: 1,
    // width: 150,
    // height: 150,
    quality: 30
  };

  private base64Wraper: string = "data:image/jpeg;base64,";

  public defaultImage: string = "assets/images/default.jpg";

  constructor(private imagePicker: ImagePicker) {
  }

  openImagePicker(Options: any = this.options) {
    return this.imagePicker.getPictures(Options);
  }

  convertBase64ToByteArray(base64string: string) {

    let binary_string = atob(base64string);
    let len = binary_string.length;
    let bytes = new Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  }

  wrapBase64string(base64string: string) {
    return this.base64Wraper + base64string;
  }

  // this one is not used
  convertbase64toUint8Buffer(base64) {
    var binary_string = atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

}
