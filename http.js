var http = require("http"),
    url = require("url"),
    fs = require("fs");

var weekday =[];
// For todays date;
weekday[0]=  "Zondag";
weekday[1] = "Maandag";
weekday[2] = "Dinsdag";
weekday[3] = "Woensdag";
weekday[4] = "Donderdag";
weekday[5] = "Vrijdag";
weekday[6] = "Zaterdag";

var newDate = new Date();
var datetime = "Tijd: " + weekday[newDate.getDay()]+" "+newDate.getDate() + "/" + (newDate.getMonth()+1) +" "+ newDate.getHours()+":"+((newDate.getMinutes() < 10)?"0":"") +newDate.getMinutes();

console.log(datetime);

console.log("Starting Node.");
// Create the server.
http.createServer(function (request, response) {
    request.on("data", function(){
        console.log("data");
    });
    // Attach listener on end event.
    request.on('end', function () {
        if (request.url) {
            console.log(request.url);
        }
        if (request.url.substring(0,2) === '/?'){
            fs.readFile("/mnt/sync/jscript/button/test.txt", 'utf-8', function (error, data) {

                var get = url.parse(request.url, true).query;
                console.log("data is "+get.data);
                //console.log(data[0]);
                if (get.data[0] == "X"){
                    for (i=0;i<data.length;i++){
                        if (data[i] === "\n"){
                            break;
                        }
                    }
                    fs.writeFile('/mnt/sync/jscript/button/test.txt',  data.substring(i+1) );
                    response.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    response.end('Removed a line.');
                }
                else if (get.data.substring(0,3) === "R__" || get.data.substring(0,3) === "L__" ||
                         get.data.substring(0,3) === "LR_" || get.data.substring(0,3) === "RL_" ||
                         get.data.substring(0,3) === "F__" ){
                    var newDate = new Date();
                    if (get.data.substring(3)[2] != ":"){
                        time= get.data.substring(3,5)+":"+get.data.substring(5);
                    }else{
                        time= get.data.substring(3);
                    }
                    var datetime = weekday[newDate.getDay()]+" "+newDate.getDate() + "/" + (newDate.getMonth()+1) + " "+time;
                    if (data.substring(0,5) !== datetime.substring(0,5)){
                        newline = "\n";
                    }
                    else{
                        newline ="";
                    }
                    fs.writeFile('/mnt/sync/jscript/button/test.txt',datetime + "-> " + get.data.substring(0,2).replace("_","").replace("F","Flesje") + "\n" +newline+ data );
                    // End response with some nice message.
                    response.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    response.end('Writen to file : ' + get.data+".");
                }
            });
        }
    });
// Listen on the 8080 port.
}).listen(8080);
