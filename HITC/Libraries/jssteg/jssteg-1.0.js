/**
 * jsSteg Javascript Library v1.0
 * https://github.com/owencm/js-steg
 * Copyright 2014, Owen Campbell-Moore and other contributors
 * Released under the MIT license
 *
 * Usage:
 * jsSteg provides two public functions, getCoefficients and reEncodeWithModifications.
 * Refer to their documentation below to understand their usage.
 *
 * Note:
 * This library depends on jsstegdecoder-1.0.js and jsstegencoder-1.0.js which have different
 * licences and must be included before this library.
 */
var jsSteg = (function() {
  /**
   * Use the JPEG decoding library and pass on the coefficients to coeffReader
   * - url: the blob URL from which to read the image
   * - coeffReader: a function which will be called with the coefficients as an argument
   */
  var getCoefficients = function(url, coeffReader) {
    var image;
    image = new JpegImage();
    image.onload = function(coefficients) {
      return coeffReader(coefficients);
    };
    return image.load(url, true);
  };

  /**
   * Convert an image in any format to bmp data for encoding
   * - image: img element. [AHMED: edited on 14/04/2018]
   * - callback: called with the resulting data
   */
   // [AHMED: function edited on 14/04/2018]
  var getImageDataFromImage = function(image, callback) {
    var ctx, cvs;
    cvs = document.createElement("canvas");
    cvs.width = image.width;
    cvs.height = image.height;
    ctx = cvs.getContext("2d");
    ctx.drawImage(image, 0, 0);
    callback(ctx.getImageData(0, 0, cvs.width, cvs.height));
  };

  /**
   * Decode the provided JPEG to raw data and then re-encode it with the JPEG encoding library,
   * running coefficientModifier on the coefficients while encoding
   * - image: img element [AHMED: edited on 14/04/2018]
   * - coefficientModifier: this will be called with the coefficients as an argument which it can
   * modify before the encoding is completed
   */
  var reEncodeWithModifications = function(image, quality, coefficientModifier, callback) {
    getImageDataFromImage(image, function(data) {
      var encoder = new JPEGEncoder();
      var jpegURI = encoder.encodeAndModifyCoefficients(data, quality, coefficientModifier);
      callback(jpegURI);
    });
  }

  return {
    getCoefficients: getCoefficients,
    reEncodeWithModifications: reEncodeWithModifications
  };
})();
