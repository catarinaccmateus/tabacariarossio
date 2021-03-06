export const squarePicture = (imageURL)  => {
  let firstPart = imageURL.substring(0, imageURL.indexOf('upload/') + 7);
  //7 is the number of characters in upload/, so it will include it
  let middle = 'c_fill,w_300,h_300/';
  let lastPart = imageURL.split('upload').pop();
  return firstPart + middle + lastPart;
};