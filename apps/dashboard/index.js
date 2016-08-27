/* ===== DASHBOARD PLUGIN ===== */

var path = require('path')
var ejs = require('ejs');
var fs = require('fs');

exports.name = "Dashboard";
exports.slug = "dashboard";

exports.icon = "tachometer";

exports.load = 'first';
exports.load_before = null;
exports.load_after = null;

var display = [];

exports.run = function(callback){
    callback();
}

var i = 0;
exports.displayText = function(o, callback) {
    display.push(o);
    
    callback(i);
    ++i;
}

exports.displayText2 = function(index, o, callback) {
    display[index] = o;
    if(callback != undefined)
        callback(index);
}

exports.render = function(mobile, user){
    var templateString = fs.readFileSync(__dirname + '/views/index.ejs', 'utf-8');
    var renderedejs = ejs.render(templateString, {
        mobile: mobile,
        display: display
    });
    return renderedejs;  
}



/* ===== DASHBOARD PLUGIN ===== */