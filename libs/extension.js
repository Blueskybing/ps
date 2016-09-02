//系统库函数的扩展
String.prototype.deleteCharAt = function (index) {
    if (index < 0 || index > this.length) {
        return this;
    }
    return this.slice(0, index) + this.slice(index + 1);
};

//20150808121205(yyyyMMddhhmmss)
String.prototype.toDate = function () {
    if (!isNaN(this)) {
        return new Date(this.substr(0, 4) || 0,
            parseInt(this.substr(4, 2) || 0) - 1,
            this.substr(6, 2) || 0,
            this.substr(8, 2) || 0,
            this.substr(10, 2) || 0)
    }
};

Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(
                RegExp.$1, RegExp.$1.length == 1
                    ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

Date.prototype.addDate = function (count) {
    if (!isNaN(count)) {
        this.setDate(this.getDate() + count);
    }
};

String.prototype.containsIgnoreCase = function (str) {
    if (str && this.match(new RegExp(str, 'i'))) {
        return true;
    }
    return false;
};

String.prototype.equalsIgnoreCase = function (str) {
    if (str && this.match(new RegExp('^' + str + '$', 'i'))) {
        return true;
    }
    return false;
};
