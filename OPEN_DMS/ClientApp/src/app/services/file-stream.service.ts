import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileStreamService {


  base64ToArrayBuffer = (base64): Uint8Array => {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
       var ascii = binaryString.charCodeAt(i);
       bytes[i] = ascii;
    }
    return bytes;
 }

 saveByteArray = (bytes, contentType, fileName) => {
  var blob = new Blob([bytes], {type: contentType });
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
 }


}
