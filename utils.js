// var md5 = require('blueimp-md5');

var utils = {
  /*
   * @Get now timestamp
   */
  now: function(){
    return (Date.now() + '').substr(0, 10);
  },
  /*
   * @Get an random strings
   * @param len{Number}  string length
   * @param upperCase{Boolean}  string have upper case
   */
  getRandomStr: function(len, upperCase){
    var str = '0123456789abcdefghijklmnopqrstuvwxyz'
    str += upperCase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '';
    var l = str.length, i, outstr = '';
    for (i = 0; i < len; i++){
      outstr += str.charAt(Math.floor(Math.random() * l));
    }
    return outstr;
  },
  setDateToUnixTimestamp: function(){
    let date, args = arguments;
    if (args.length == 1){
      date = new Date(args[0]).getTime() + '';
    }else {
      date = new Date(...args).getTime() + '';
    }
    return date.substr(0, 10);
  },
  /*
   * @String to md5
   * @param str{String}  md5 string
   */
  md5: function(str){
    // return md5(str);
  },
  token: null
};

module.exports = utils;