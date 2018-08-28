/* eslint-disable no-undef */
/**
 * 工具类
 * Created by wangmingliang 2018-01-08
 */
(function (ROOT, factory) {
  if (typeof exports === 'object') {
    // Node.
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else {
    // Browser globals (root is window)
    ROOT.WMLUtil = factory();
  }
})((0,eval)(this),function () {
  /**
   * 静态方法
   */
  var utils = {
    /**
     * 时间格式化
     * @param date日期格式的字符串,时间戳或者Date类型
     * @param formatter 转换格式，默认'yyyy-MM-dd HH:mm:ss'
     * @param isZero 是否补零，默认补零
     * @returns {*}
     * yyyy或yy:年, MM:月, dd:日, HH:小时（24小时制）, hh:小时（12小时制）, mm:分, ss:秒, ms:毫秒
     *
     */
    dateFormat: function(date, formatter, isZero) {
      if(!date || (typeof date!=='string' && isNaN(date) && !(date instanceof Date))) throw new Error('invalid data. "date"!');
      formatter = formatter||'yyyy-MM-dd HH:mm:ss';
      var dateJson = this.splitDate(date, isZero!=false?true:false);
      var formatters = ['yyyy', 'MM', 'dd', 'HH', 'mm', 'ss', 'ms', 'cw', 'cap', 'ap', 'yy'];
      for(var i=0;i<formatters.length;i++){
        formatter =  this.replaceAll(formatter,formatters[i], dateJson[formatters[i]]);
      }
      return formatter;
    },
    /**
     * 提取日期的年月日时分秒
     * @param date日期格式的字符串,时间戳或者Date类型
     * @param Boolean isZero是否补零
     * @returns {*}
     * yyyy或yy:年, MM:月, dd:日, HH:小时（24小时制）, hh:小时（12小时制）, mm:分, ss:秒, ms:毫秒
     */
    splitDate: function (date, isZero) {
      if(!date || (typeof date!=='string' && isNaN(date) && !(date instanceof Date))) throw new Error('invalid data. "date"!');
      if(!(date instanceof Date)){
        if(!isNaN(date)){//xx时间
          // 时间戳
          date = new Date((date+"").length==10?date*1000:date*1);
        }else{
          var ds = date.split(/-|\/|\s|:/g);
          var ts = 'new Date(';
          ds.forEach(function (d,i) {
            if(i!=0){
              ts += ',';
            }
            if(i==1){
              d=d*1-1;
            }
            ts += d;
          });
          ts += ')'
          date = eval(ts);

        }
      }
      var yyyy, MM, dd, hh, HH, mm, ss, ms, ap, cap, yy;
      var chineseWeekNames = ['周日','周一','周二','周三','周四','周五','周六'];
      if (isZero) {
        yyyy = String(date.getFullYear());
        MM = this.addZeroLeft(String(date.getMonth() + 1), 2);
        dd = this.addZeroLeft(String(date.getDate()), 2);
        HH = this.addZeroLeft(String(date.getHours()), 2);
        var _HH = parseInt(HH);
        hh = _HH > 12 ? this.addZeroLeft(String(_HH-12), 2) : HH;
        mm = this.addZeroLeft(String(date.getMinutes()), 2);
        ss = this.addZeroLeft(String(date.getSeconds()), 2);
        ms = this.addZeroLeft(String(date.getMilliseconds()), 3);
        cap = _HH > 12 ? '下午' : '上午';
        ap = _HH > 12 ? 'am' : 'pm';
        yy = yyyy.substr(2,4);
      } else {
        yyyy = String(date.getFullYear());
        MM = String(date.getMonth() + 1);
        dd = String(date.getDate());
        HH = String(date.getHours());
        hh = String(HH > 12 ? HH-12 : HH);
        mm = String(date.getMinutes());
        ss = String(date.getSeconds());
        ms = String(date.getMilliseconds());
        cap = HH > 12 ? '下午' : '上午';
        ap = HH > 12 ? 'am' : 'pm';
        yy = yyyy.substr(2,4);
      }
      return {
        'yyyy': yyyy,
        'yy': yy,
        'MM': MM,
        'dd': dd,
        'HH': HH,
        'hh': hh,
        'mm': mm,
        'ss': ss,
        'ms': ms,
        'cw': chineseWeekNames[date.getDay()],
        'cap': cap,
        'ap': ap
      };
    },
    /**
     * 正则替换内容
     * @param value
     * @param raRegExp
     * @param replaceText
     */
    replaceAll: function (value,raRegExp, replaceText) {
      if (typeof raRegExp === "undefined" || raRegExp == null || !value || !replaceText) return;
      if (!( raRegExp instanceof RegExp)) raRegExp = new RegExp(raRegExp, "g");
      return value.replace(raRegExp, replaceText);
    },
    /**
     * 字符串左边补零
     * @param value
     * @param resultLength
     */
    addZeroLeft: function(value, resultLength) {
      if(!value) throw new Error('Missing important parameters!');
      resultLength = resultLength || 1;
      var result = value.toString();
      if(result.length < resultLength) {
        var i = result.length;
        while(i++ < resultLength) {
          result = "0" + result;
          if(result.length == resultLength){
            break;
          }
        }
      }
      return result;
    },
    /**
     * 复制合并对象
     * false：浅复制， true: 深层复制, 默认深层复制如extend(obj1,obj2);
     * @returns {*|Object}
     * extend(obj1,obj2) === extend(true,obj1,obj2);
     * extend(false,obj1,obj2);
     */
    extend: function() {
      var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false,
        toString = Object.prototype.toString,
        hasOwn = Object.prototype.hasOwnProperty,
        push = Array.prototype.push,
        slice = Array.prototype.slice,
        trim = String.prototype.trim,
        indexOf = Array.prototype.indexOf,
        class2type = {
          "[object Boolean]": "boolean",
          "[object Number]": "number",
          "[object String]": "string",
          "[object Function]": "function",
          "[object Array]": "array",
          "[object Date]": "date",
          "[object RegExp]": "regexp",
          "[object Object]": "object"
        },
        jQuery = {
          isFunction: function (obj) {
            return jQuery.type(obj) === "function"
          },
          isArray: Array.isArray ||
          function (obj) {
            return jQuery.type(obj) === "array"
          },
          isWindow: function (obj) {
            return obj != null && obj == obj.window
          },
          isNumeric: function (obj) {
            return !isNaN(parseFloat(obj)) && isFinite(obj)
          },
          type: function (obj) {
            return obj == null ? String(obj) : class2type[toString.call(obj)] || "object"
          },
          isPlainObject: function (obj) {
            if (!obj || jQuery.type(obj) !== "object" || obj.nodeType) {
              return false
            }
            try {
              if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false
              }
            } catch (e) {
              return false
            }
            var key;
            for (key in obj) {}
            return key === undefined || hasOwn.call(obj, key)
          }
        };
      if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        i = 2;
      }
      if (typeof target !== "object" && !jQuery.isFunction(target)) {
        target = {}
      }
      if (length === i) {
        target = this;
        --i;
      }
      for (i; i < length; i++) {
        if ((options = arguments[i]) != null) {
          for (name in options) {
            src = target[name];
            copy = options[name];
            if (target === copy) {
              continue
            }
            if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
              if (copyIsArray) {
                copyIsArray = false;
                clone = src && jQuery.isArray(src) ? src : []
              } else {
                clone = src && jQuery.isPlainObject(src) ? src : {};
              }
              // WARNING: RECURSION
              target[name] = extend(deep, clone, copy);
            } else if (copy !== undefined) {
              target[name] = copy;
            }
          }
        }
      }
      return target;
    },
    /**
     * 金额格式化
     * @param s 金额
     * @param n 保留小数位数
     * @returns {String}
     */
    fmoney: function(s, n){
      if(!s){
        return '0.00';
      }
      n = n > 0 && n <= 20 ? n : 2;
      s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";//更改这里n数也可确定要保留的小数位
      var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
      var t = "";
      for(var i = 0; i < l.length; i++ ){
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
      }
      return t.split("").reverse().join("") + "." + r.substring(0, n);
    },
    /**
     *金额格式化万元
     *
     */
    towan:function(num){

      var val = Number(num);

      if(val != '0'){
        if(val>=10000){
          if(val%10000>=100){
            return parseInt(val/10000)+'.'+(val%10000>=1000?parseInt(val%10000/100):'0'+parseInt(val%10000/100))+'万';
          }
          return parseInt(val/10000)+'万';
        }
        //将val中的$,去掉，将val变成一个纯粹的数据格式字符串
        val = val.toString().replace(/\$|\,/g,'');

        //如果val不是数字，则将val置0，并返回
        if(''==val || isNaN(val)){return '--';}

        //如果val是负数，则获取她的符号
        var sign2 = val.indexOf("-")> 0 ? '-' : '';
        //如果存在小数点，则获取数字的小数部分
        var cents2 = val.indexOf(".")> 0 ? val.substr(val.indexOf(".")) : '';
        cents2 = cents2.length == 2 ? cents2+'0' : cents2;
        cents2 = cents2.length>1 ? cents2 : '.00' ;//注意：这里如果是使用change方法不断的调用，小数是输入不了的
        //获取数字的整数数部分
        val = val.indexOf(".")>0 ? val.substring(0,(val.indexOf("."))) : val ;
        //如果没有小数点，整数部分不能以0开头
        if('' == cents2){ if(val.length>1 && '0' == val.substr(0,1)){return '--';}}
        //如果有小数点，且整数的部分的长度大于1，则整数部分不能以0开头
        else{if(val.length>1 && '0' == val.substr(0,1)){return '--';}}
        //加入逗号
        for (var i = 0; i < Math.floor((val.length-(1+i))/3); i++){
          val = val.substring(0,val.length-(4*i+3))+','+val.substring(val.length-(4*i+3));
        }

        return (sign2 + val + cents2);
      }else{
        return val + '.00';
      }

    },
    /**
     * 手机号（*）代替
     * @param phone 手机号
     * @param rval  替换样式，默认 $1****$2
     * @param reg   替换正则，默认 /([0-9]{3})[0-9]{4}([0-9]{4})/
     * @returns {String} 例如：159****2486
     * 例子：
     * phoneHide(15912345678); // 结果：159****5678
     * phoneHide(15912345678, '$1####$2'); // 结果：159####5678
     * phoneHide(15912345678, '$1*$2#$3', /([0-9]{3})[0-9]{2}([0-9]{2})[0-9]{2}([0-9]{2})/); // 结果：159*###5678
     */
    phoneHide: function (phone, rval, reg) {
      if(!phone){
        return '';
      }
      if(!rval || typeof rval!=='string'){
        rval='$1****$2';
      }
      var reg = reg||/([0-9]{3})[0-9]{4}([0-9]{4})/;
      return phone.toString().replace(reg, rval);
    },
    /**
     * 身份证号（*）代替
     * @param idcard 身份证号
     * @param rval  替换样式，默认 $1****$2
     * @param reg   替换正则，默认 /^([0-9]{6})[0-9]{7,10}([0-9X]{2})$/
     * @returns {String} 例如：342501****14
     * 例子：
     * idcardHide('610923197505151031'); // 结果：610923****31
     * idcardHide('37132619910613445X', '$1####$2'); // 结果：371326####5X
     * idcardHide('440253850213582', '$1*******$2', /^([0-9]{6})[0-9]{5,8}([0-9X]{4})$/); // 结果："440253*******3582"
     */
    idcardHide: function (idcard, rval, reg) {
      if(!idcard){
        return '';
      }
      if(!rval || typeof rval!=='string'){
        rval='$1****$2';
      }
      var reg = reg||/^([0-9]{6})[0-9]{7,10}([0-9X]{2})$/;
      return idcard.toString().replace(reg, rval);
    },
    /**
     * 解析身份证号
     * @param idcard 身份证号
     * @param opts => {systemTime:"系统时间，用于计算年龄,默认当前系统时间"}
     * @returns {Object}
     * 例子：
     * parseIdcard('37132619910613445X');
     * {"isIdcard":true,"idcard":"37132619910613445X","birthday":"1991-06-13","cw":"周四","sex":"male","sexCN":"男","year":"1991","month":"06","day":"13","zipcode":"371326","nage":27,"age":26}
     */
    parseIdcard: function (idcard, opts) {
      var cardInfo = {
        isIdcard:false,
        idcard: idcard
      }
      var options = {
        systemTime: new Date()
      }
      this.extend(options, opts);
      if (!idcard) {
        return cardInfo;
      }
      if (15 != idcard.length && 18 != idcard.length) {
        return cardInfo;
      }
      if (15 == idcard.length) {
        var year = idcard.substring(6, 8);
        var month = idcard.substring(8, 10);
        var day = idcard.substring(10, 12);
        var sex = idcard.substring(14, 15); //性别位
        var birthday = new Date(year, parseFloat(month) - 1,
          parseFloat(day));
        // 对于老身份证中的年龄则不需考虑千年虫问题而使用getYear()方法
        if (birthday.getYear() != parseFloat(year)
          || birthday.getMonth() != parseFloat(month) - 1
          || birthday.getDate() != parseFloat(day)) {
          return cardInfo;
        } else {
          cardInfo.isIdcard = true;
          cardInfo.birthday = this.dateFormat(birthday);
          cardInfo.sex = sex%2==1?'male':'female';
          cardInfo.sexCN = sex%2==1?'男':'女';
          cardInfo.year = year;
          cardInfo.month = month;
          cardInfo.day = day;
          cardInfo.zipcode = idcard.substring(0,6);
          cardInfo.nage = this.dateFormat(options.systemTime, 'yyyy')-year+1;
          var _x = 0;
          if(this.dateFormat(options.systemTime, 'MM')*1>month*1 || (this.dateFormat(options.systemTime, 'MM')*1==month*1 && this.dateFormat(options.systemTime, 'dd')*1>=day)){
            _x = 1;
          }
          cardInfo.age = this.dateFormat(options.systemTime, 'yyyy')-year-1+_x;
          return cardInfo;
        }
      }else if (18 == idcard.length) {
        var year = idcard.substring(6, 10);
        var month = idcard.substring(10, 12);
        var day = idcard.substring(12, 14);
        var sex = idcard.substring(16, 17);
        var birthday = new Date(year, parseFloat(month) - 1,
          parseFloat(day));
        // 这里用getFullYear()获取年份，避免千年虫问题
        if (birthday.getFullYear() != parseFloat(year)
          || birthday.getMonth() != parseFloat(month) - 1
          || birthday.getDate() != parseFloat(day)) {
          return cardInfo;
        }
        var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];// 加权因子
        var Y = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];// 身份证验证位值.10代表X
        // 验证校验位
        var sum = 0; // 声明加权求和变量
        var _cardNo = idcard.split("");
        if (_cardNo[17].toLowerCase() == 'x') {
          _cardNo[17] = 10;// 将最后位为x的验证码替换为10方便后续操作
        }
        for (var i = 0; i < 17; i++) {
          sum += Wi[i] * _cardNo[i];// 加权求和
        }
        var i = sum % 11;// 得到验证码所位置
        if (_cardNo[17] != Y[i]) {
          return cardInfo;
        }
        cardInfo.isIdcard = true; // 是否为正确的身份证号码
        cardInfo.birthday = this.dateFormat(birthday, 'yyyy-MM-dd'); // 生日
        cardInfo.cw = this.dateFormat(birthday, 'cw'); // 周几
        cardInfo.sex = sex%2==1?'male':'female'; // 性别
        cardInfo.sexCN = sex%2==1?'男':'女'; // 性别（中文）
        cardInfo.year = year; // 出生年
        cardInfo.month = month; // 月
        cardInfo.day = day;  // 日
        cardInfo.zipcode = idcard.substring(0,6); // 区号
        cardInfo.nage = this.dateFormat(options.systemTime, 'yyyy')-year+1; // 虚岁
        var _x = 0;
        if(this.dateFormat(options.systemTime, 'MM')*1>month*1 || (this.dateFormat(options.systemTime, 'MM')*1==month*1 && this.dateFormat(options.systemTime, 'dd')*1>=day)){
          _x = 1;
        }
        cardInfo.age = this.dateFormat(options.systemTime, 'yyyy')-year-1+_x; // 周岁
        return cardInfo;
      }
    },
    /**
     * 规范json,将带有"."的json转换成对象
     * @param json
     * @returns {*}
     * 例如：
     * normJson({"a":"1", "b.id":"1", "b.name":"张三"});
     * 结果：{"a":"1","b":{"id":"1","name":"张三"}}
     */
    normJson: function (params) {
      var _t = /\[(\d+)\]$/;
      for (var p in params) {
        var obj = params;
        var setParams = function (v, i, array) {
          var _isarray, name, index;
          if (_isarray = _t.test(v)) {// is Array
            index = _t.exec(v)[1];
            name = v.substr(0, v.length - index.length - 2);
          } else {
            name = v;
          }
          if(array.length == i + 1 && !_isarray){
            obj[name] = params[p];
          }
          if (_isarray) {
            obj = !obj[name] ? obj[name] = [] : obj[name];
            if(array.length != i + 1){
              obj = !obj[parseInt(index)] ? obj[parseInt(index)] = {} : obj[parseInt(index)];
            }else{
              obj[parseInt(index)] = params[p];
            }
          } else {
            obj = obj[name] == null ? obj[name] = {} : obj[name];
          }
        };
        if (p.indexOf('.') != -1) {
          p.split('.').forEach(setParams);
          delete params[p];
        }else if(_t.test(p)){
          setParams(p,0,[p]);
          delete params[p];
        }
      }
      return params;
    },
    /**
     * 验证手机号格式是否正确
     * @param mobile 手机号码
     * @returns { code: 1, msg: '手机号格式正确' }
     *  code==> 1:手机号格式正确, 2:手机号为空, 3:手机号格式错误
     */
    checkMobile: function (mobile) {
      var res = {
        code: 1,
        msg: '手机号格式正确'
      };
      if(!mobile){
        res.code = 2;
        res.msg = '手机号为空';
        return res;
      }
      if(!/^[1][3|4|5|7|8|9]\d{9}$/.test(mobile.toString())){
        res.code = 3;
        res.msg = '手机号格式错误';
        return res;
      }
      return res;
    },
    /**
     * 验证固定电话格式是否正确
     * @param phone 固定电话
     * @returns { code: 1, msg: '固定电话格式正确' }
     * code==> 1:手机号格式正确, 2:手机号为空, 3:手机号格式错误
     */
    checkPhone: function (phone) {
      var res = {
        code: 1,
        msg: '固定电话格式正确'
      };
      if(!phone){
        res.code = 2;
        res.msg = '固定电话为空';
        return res;
      }
      if(!/^0\d{2,3}-?\d{7,8}$/.test(phone.toString())){
        res.code = 3;
        res.msg = '手机号格式错误';
        return res;
      }
      return res;

    },
    /**
     * 依据某种（字符串）格式来转换数字。
     * 例子 (123456.789):
     * 0 - (123456) 只显示整数，没有小数位
     * 0.00 - (123456.78) 显示整数，保留两位小数位
     * 0.0000 - (123456.7890) 显示整数，保留四位小数位
     * 0,000 - (123,456) 只显示整数，用逗号分开
     * 0,000.00 - (123,456.78) 显示整数，用逗号分开，保留两位小数位
     * 0,0.00 - (123,456.78) 快捷方法，显示整数，用逗号分开，保留两位小数位
     * 在一些国际化的场合需要反转分组（,）和小数位（.），那么就在后面加上/i
     * 例如： 0.000,00/i
     *
     * @method format
     * @param {Number} v 要转换的数字。
     * @param {String} format 格式化数字的“模”。
     * @return {String} 已转换的数字。
     * @public
     */
    numberFormat: function (v, format) {
      if (!format) {
        return v;
      }
      v *= 1;
      if (typeof v !== 'number' || isNaN(v)) {
        return '';
      }
      var comma = ',';
      var dec = '.';
      var i18n = false;

      if (format.substr(format.length - 2) == '/i') {
        format = format.substr(0, format.length - 2);
        i18n = true;
        comma = '.';
        dec = ',';
      }

      var hasComma = format.indexOf(comma) != -1,
        psplit = (i18n ? format.replace(/[^\d\,]/g, '') : format.replace(/[^\d\.]/g, '')).split(dec);

      if (1 < psplit.length) {
        v = v.toFixed(psplit[1].length);
      }
      else if (2 < psplit.length) {
        throw('NumberFormatException: invalid format, formats should have no more than 1 period: ' + format);
      }
      else {
        v = v.toFixed(0);
      }

      var fnum = v.toString();

      if (hasComma) {
        psplit = fnum.split('.');

        var cnum = psplit[0],
          parr = [],
          j = cnum.length,
          m = Math.floor(j / 3),
          n = cnum.length % 3 || 3;

        for (var i = 0; i < j; i += n) {
          if (i != 0) {
            n = 3;
          }
          parr[parr.length] = cnum.substr(i, n);
          m -= 1;
        }
        fnum = parr.join(comma);
        if (psplit[1]) {
          fnum += dec + psplit[1];
        }
      }
      return format.replace(/[\d,?\.?]+/, fnum);
    },
    /**
     * 小数计算
     * @example:
     * 0.1+0.2     //0.30000000000000004
     * var a=Decimal('0.1');var b=Decimal('0.2');
     * a.add(b).toNumber()    //0.3
     *
     * 四舍五入，保留一位小数
     * a.add(b).add(0.14).toNumber(1)  //0.4
     *
     * Decimal.add(0.1,0.2,0.3).toNumber()  //0.6
     * Decimal.add([0.1,0.2,0.3]).toNumber()  //0.6
     *
     * (0.1+0.2+0.3)*2/0.5      //2.4000000000000004
     * Decimal.add([0.1,0.2,0.3]).mul(2).div(0.5).toNumber() //2.4
     * */
    decimal: (function () {
      var DECIMAL_SEPARATOR = '.';

      // Decimal
      var Decimal = function (num) {
        if (this.constructor != Decimal) {
          return new Decimal(num);
        }

        if (num instanceof Decimal) {
          return num;
        }

        this.internal = String(num);
        this.as_int = as_integer(this.internal);

        this.add = function (target) {
          var operands = [this, new Decimal(target)];
          operands.sort(function (x, y) {
            return x.as_int.exp - y.as_int.exp
          });

          var smallest = operands[0].as_int.exp;
          var biggest = operands[1].as_int.exp;

          var x = Number(format(operands[1].as_int.value, biggest - smallest));
          var y = Number(operands[0].as_int.value);

          var result = String(x + y);

          return Decimal(format(result, smallest));
        };

        this.sub = function (target) {
          return Decimal(this.add(target * -1));
        };

        this.mul = function (target) {
          target = new Decimal(target);
          var result = String(this.as_int.value * target.as_int.value);
          var exp = this.as_int.exp + target.as_int.exp;

          return Decimal(format(result, exp));
        };

        this.div = function (target) {
          target = new Decimal(target);

          var smallest = Math.min(this.as_int.exp, target.as_int.exp);

          var x = Decimal.mul(Math.pow(10, Math.abs(smallest)), this);
          var y = Decimal.mul(Math.pow(10, Math.abs(smallest)), target);
          return Decimal(x / y);
        };

        this.toString = function (precision) {
          if (isNumber(precision)) {
            return ''+toFixed(Number(this.internal), precision);
          }
          return this.internal;
        };

        this.toNumber = function (precision) {
          if (isNumber(precision)) {
            return toFixed(Number(this.internal), precision);
          }
          return Number(this.internal);
        }
      };

      var as_integer = function (number) {
        number = String(number);

        var value,
          exp,
          tokens = number.split(DECIMAL_SEPARATOR),
          integer = tokens[0],
          fractional = tokens[1];

        if (!fractional) {
          var trailing_zeros = integer.match(/0+$/);

          if (trailing_zeros) {
            var length = trailing_zeros[0].length;
            value = integer.substr(0, integer.length - length);
            exp = length;
          } else {
            value = integer;
            exp = 0;
          }
        } else {
          value = parseInt(number.split(DECIMAL_SEPARATOR).join(''), 10);
          exp = fractional.length * -1;
        }

        return {
          'value': value,
          'exp': exp
        };
      };

      // Helpers
      var neg_exp = function (str, position) {
        position = Math.abs(position);

        var offset = position - str.length;
        var sep = DECIMAL_SEPARATOR;

        if (offset >= 0) {
          str = zero(offset) + str;
          sep = '0.';
        }

        var length = str.length;
        var head = str.substr(0, length - position);
        var tail = str.substring(length - position, length);
        return head + sep + tail;
      };

      var pos_exp = function (str, exp) {
        var zeros = zero(exp);
        return String(str + zeros);
      };

      var format = function (num, exp) {
        num = String(num);
        var func = exp >= 0 ? pos_exp : neg_exp;
        return func(num, exp);
      };

      var zero = function (exp) {
        return new Array(exp + 1).join('0');
      };

      var methods = ['add', 'mul', 'sub', 'div'];
      for (var i = 0; i < methods.length; i++) {
        (function (method) {
          Decimal[method] = function () {
            var args = [].slice.call(arguments);
            if (isArray(args[0])) {
              args = args[0];
            }
            if (args.length == 1) {
              return new Decimal(args[0]);
            }
            var option = args[args.length - 1];

            var sum = new Decimal(args[0]),
              index = 1;
            while (index < args.length) {
              sum = sum[method](args[index]);
              index++;
            }
            return sum;
          };
        })(methods[i]);
      }

      var toFixed = function (number, precision) {
        var multiplier = Math.pow(10, precision + 1),
          wholeNumber = Math.floor(number * multiplier);
        return Math.round(wholeNumber / 10) * 10 / multiplier;
      };
      var isNumber = function (o) {
        return Object.prototype.toString.call(o).slice(8, -1) === 'Number';
      };
      var isArray = function (o) {
        return Object.prototype.toString.call(o).slice(8, -1) === 'Array';
      };
      var isObject = function (o) {
        return Object.prototype.toString.call(o).slice(8, -1) === 'Object';
      };
      return Decimal;
    })(),
    /**
     * 金额转大写
     * @param n 金额
     * @param head 前缀，默认 n < 0 ? '欠人民币' : '人民币'
     * @returns {string} 大写的金额
     * 例如：upDigit(120020.01)==>"人民币壹拾贰万零贰拾元壹分"
     */
    upDigit: function (n, head) {
      var fraction = ['角', '分', '厘'];
      var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
      var unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
      ];
      head = head || (n < 0 ? '欠人民币' : '人民币');
      n = Math.abs(n);
      var s = '';
      for (var i = 0; i < fraction.length; i++) {
        // 小数部分计算会有计算精度的问题
        s += (digit[Math.floor(this.decimal(n).mul(10).mul(Math.pow(10, i)).toNumber()) % 10] + fraction[i]).replace(/零./, '');
      }
      s = s || '整';
      n = Math.floor(n);
      for (var i = 0; i < unit[0].length && n > 0; i++) {
        var p = '';
        for (var j = 0; j < unit[1].length && n > 0; j++) {
          p = digit[n % 10] + unit[1][j] + p;
          n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
        //s = p + unit[0][i] + s;
      }
      return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
    }
  }
  /**
   * 扩展数组方法
   */
  var array = {
    /**
     * 删除
     * @param arr 数组数据
     * @param comp 比较器/待删的数据
     * @returns [] 返回删除的数据
     * var arr = [{"name":"x1", "id":"1"},{"name":"x2", "id":"2"}];
     * front.array.remove(arr, function(a){return a.id==2});
     * 方法返回删除的数据：[{"name":"x2", "id":"2"}]
     * arr的值为[{"name":"x1", "id":"1"}]
     * 或
     * var arr2 = ["a","b","c","b"];
     * front.array.remove(arr2, "b");
     * 方法返回：["b","b"]
     * arr2的值为["a","c"];
     */
    remove: function (arr, comp) {
      if(!Array.isArray(arr)){
        throw new Error('Array is invalid!');
      }
      if(comp===''){
        return arr;
      }
      if(typeof comp!=='function'){
        comp = (function (comp) {
          return function (a) {
            return a==comp;
          }
        })(comp);
      }
      return arr.filter(comp).reduce(function(acc, val) {
        arr.splice(arr.indexOf(val), 1);
        return acc.concat(val);
      }, []);
    },
    /**
     * 把一个数组分块成指定大小的小数组
     * @param arr
     * @param size
     * @returns [[]]
     * front.array.chunk([1,2,3,4,5,6,7], 4);
     * 结果：[[1,2,3,4],[5,6,7]]
     */
    chunk: function (arr, size) {
      if(!Array.isArray(arr)){
        throw new Error('Array is invalid!');
      }
      if(!size||typeof size!=='number'){
        return arr;
      }
      return Array.from({
        length: Math.ceil(arr.length / size)
      }, function(v, i){
        return arr.slice(i * size, i * size + size)
      });
    },
    /**
     * 查询单个数据/对象
     * @param arr [数据]
     * @param comp 比较器
     * @returns {*}
     * front.array.find([{"id":"1","name":"x1"},{"id":"2","name":"x2"},{"id":"3","name":"x3"}], function(a){return a.id==3})
     * 结果：{id: "3", name: "x3"}
     */
    find: function (arr, comp) {
      if(!Array.isArray(arr)){
        throw new Error('Array is invalid!');
      }
      if(comp===''){
        throw new Error('comp is undefined');
      }
      typeof comp !== 'function' ? comp=(function (comp) {
        return function (a) {
          return a==comp;
        }
      })(comp) : '';
      var as = arr.filter(comp);
      return as.length>0 ? as[0] : undefined;
    },
    /**
     * 去重
     * @param arr [数据]
     * @param key 数据对象的唯一属性
     * @returns []
     * front.array.noRepeat(["a","b","c","b","c"]);
     * 结果：["a","b","c"]
     * 或
     * front.array.noRepeat([{"id":"1","x":"x"},{"id":"1","x":"x"},{"id":"2","x":"x2"}], "id");
     * 结果：[{"id":"1","x":"x"},{"id":"2","x":"x2"}]
     */
    noRepeat: function (arr, key) {
      // es6语法
      // return [...new Set(arr)];
      if(!Array.isArray(arr)){
        throw new Error('Array is invalid!');
      }
      var res = [], zhis = this;
      arr.forEach(function (v) {
        if(!zhis.find(res, function (d) {
            return d==v || (v[key]&&v[key]==d[key]);
          })){
          res.push(v);
        }
      });
      return res;
    }
  };

  var WMLUtil = function () {
    if (this.constructor != WMLUtil) {
      return new WMLUtil();
    }
    // 工具方法
    this.utils = utils;
    // 数组方法扩展
    this.array = array;
    // 页面方法
    this.awt = {};
  }
  return WMLUtil;
})
