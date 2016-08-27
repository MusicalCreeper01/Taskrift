var colors = require('colors');
var fs = require('fs');


function logging(){

    var wstream = fs.createWriteStream('log.txt');

    var visableLogLevel = 0;

    var logLevel = 2;

    this.setLoggingLevel = (r) => logLevel = r;
    this.setVisableLevel = (r) => visableLogLevel = r;

    var infof = function(msg, prefix){

        if(prefix != undefined){
            wstream.write('[INFO] ' + stamp() + "[" + prefix + "] " + msg + '\n');
            if(visableLogLevel > logLevel)
                return;    
            console.log(stamp().bold.grey + "[" + prefix + "] " + msg.grey);
        }else{
            wstream.write('[INFO] ' + stamp() + msg + '\n');
            if(visableLogLevel > logLevel)
                return;
            console.log(stamp().bold.grey + msg.grey);
        }


    }
    this.info = infof;

    var warningf = function(msg, prefix){
        if(visableLogLevel > logLevel)
            return;
        if(prefix != undefined){
            wstream.write('[WARNING] ' + stamp() + "[" + prefix + "] " + msg + '\n');
            if(visableLogLevel > logLevel)
                return;
            console.log(stamp().bold.yellow + "[" + prefix + "] " + msg.yellow);
        }else{
            wstream.write('[WARNING] ' + stamp()+ msg + '\n');
            if(visableLogLevel > logLevel)
                return;
            console.log(stamp().bold.yellow + msg.yellow);
        }
    }
    this.warning = warningf;

    var errorf = function(msg, prefix){
        if(visableLogLevel > logLevel)
            return;
        if(prefix != undefined){
            wstream.write('[ERROR] ' + stamp() + "[" + prefix + "] " + msg + '\n');
            if(visableLogLevel > logLevel)
                return;
            console.log(stamp().bold.red + "[" + prefix + "] " + msg.red);
        }else{
             wstream.write('[ERROR] ' + stamp() + msg + '\n');
            if(visableLogLevel > logLevel)
                return;
            console.log(stamp().bold.red + msg.red);
        }
    }
    this.error = errorf;

    var successf = function(msg, prefix){
        if(visableLogLevel > logLevel)
            return;
        if(prefix != undefined){
             wstream.write('[SUCCESS] ' + stamp() + "[" + prefix + "] " + msg + '\n');
            if(visableLogLevel > logLevel)
                return;
            console.log(stamp().bold.green + "[" + prefix + "] " + msg.green);
        }else{
            wstream.write('[SUCCESS] ' + stamp() + msg + '\n');
            if(visableLogLevel > logLevel)
                return;
            console.log(stamp().bold.green + msg.green);
        }
    }
    this.success = successf;

    return this;
}

module.exports = logging;

function stamp(){
    var d = new Date();
    var dstr = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + " " + d.getDay() + "/" + d.getMonth() + "/" + d.getFullYear();
    return "[" + dstr + "] ";
}