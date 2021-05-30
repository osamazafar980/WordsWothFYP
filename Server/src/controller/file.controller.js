var https = require("https");
const fs = require("fs");
const pdf = require("pdf-parse");

const baseUrl = "http://localhost:8080/files/";

var getFile = function (url, dest, callback) {
  url = url.split("$").join("/");
  console.log(url);
  var file = fs.createWriteStream(dest);
  https.get(url, function (response) {
    response.pipe(file);
    file.on("finish", function () {
      file.close();
      callback();
    });
  });
};

var getsFile = function (url, dest, arr, callback) {
  url = url.split("$").join("/");
  console.log(url);
  var file = fs.createWriteStream(dest);
  https.get(url, function (response) {
    response.pipe(file);
    file.on("finish", function () {
      file.close();
      console.log(arr);
      callback(arr);
    });
  });
};

const getListFiles = async (req, res) => {
  let data = req.params.data.split("||")[0];
  let name = req.params.data.split("||")[1];
  console.log(data);
  wait = false;
  let fileInfos = [];
  await getFile(
    data,
    data.endsWith("txt")
      ? __basedir + "/resources/static/assets/downloads/file.pdf"
      : __basedir + "/resources/static/assets/downloads/file.txt",
    () => {
      let dataBuffer = fs.readFileSync(
        data.endsWith("txt")
          ? __basedir + "/resources/static/assets/downloads/file.pdf"
          : __basedir + "/resources/static/assets/downloads/file.txt",
        "utf8"
      );
      var dictionary = require(__basedir + "/Words/words_dictionary.json");
      if (data.endsWith("txt")) {
        var txt = dataBuffer.split("\n");
        var i = 0;
        while (i < txt.length) {
          if (
            txt[i].replace(/[^0-9a-z]/gi, "").length != 0 &&
            txt[i].replace(/[^0-9a-z]/gi, "").length < 10
          ) {
            var word = txt[i].split(" ");
            var j = 0;
            var accept = false;
            while (j < word.length) {
              if (
                word[j].replace(/[^A-Za-z]/gi, "").toLowerCase().length != 1 &&
                word[j].replace(/[^A-Za-z]/gi, "").toLowerCase() in dictionary
              ) {
                accept = true;
                break;
              }
              j = j + 1;
            }
            if (!accept) {
              delete txt[i];
            }
          }
          i = i + 1;
        }
        console.log(txt.length);
        txt = txt.filter((line) => line != undefined);
        console.log(txt.length);
        i = 0;
        var cache = [];
        while (i < txt.length) {
          if (txt[i].length == 0) {
            if (cache.length < 4 && cache.length > 0) {
              for (x in cache) {
                delete txt[x];
              }
            }
            cache = [];
            delete txt[i];
          } else {
            cache.push(i);
          }
          i = i + 1;
        }
        txt = txt.filter((line) => line != undefined);

        var count = 0;
        var partCounter = 0;
        while (count < txt.length) {
          var entry = {
            key: name + "-Part" + partCounter,
            start: count,
            end: count + 499 < txt.length ? count + 499 : txt.length,
          };
          fileInfos.push(entry);
          partCounter = partCounter + 1;
          count = count + 500;
          wait = false;
        }
        wait = true;
        console.log(fileInfos);
        res.status(200).send(fileInfos);
      } else {
        let dataBuffer = fs.readFileSync(
          data.endsWith("txt")
            ? __basedir + "/resources/static/assets/downloads/file.pdf"
            : __basedir + "/resources/static/assets/downloads/file.txt"
        );
        pdf(dataBuffer).then(function (data) {
          var txt = data.text.split("\n");

          var i = 0;
          while (i < txt.length) {
            if (
              txt[i].replace(/[^0-9a-z]/gi, "").length != 0 &&
              txt[i].replace(/[^0-9a-z]/gi, "").length < 10
            ) {
              var word = txt[i].split(" ");
              var j = 0;
              var accept = false;
              while (j < word.length) {
                if (
                  word[j].replace(/[^A-Za-z]/gi, "").toLowerCase().length !=
                    1 &&
                  word[j].replace(/[^A-Za-z]/gi, "").toLowerCase() in dictionary
                ) {
                  accept = true;
                  break;
                }
                j = j + 1;
              }
              if (!accept) {
                delete txt[i];
              }
            }
            i = i + 1;
          }
          console.log(txt.length);
          txt = txt.filter((line) => line != undefined);
          console.log(txt.length);
          i = 0;
          var cache = [];
          while (i < txt.length) {
            if (txt[i].length == 0) {
              if (cache.length < 4 && cache.length > 0) {
                for (x in cache) {
                  delete txt[x];
                }
              }
              cache = [];
              delete txt[i];
            } else {
              cache.push(i);
            }
            i = i + 1;
          }
          txt = txt.filter((line) => line != undefined);

          var count = 0;
          var partCounter = 0;
          while (count < txt.length) {
            var entry = {
              key: name + "-Part" + partCounter,
              start: count,
              end: count + 499 < txt.length ? count + 499 : txt.length,
            };
            fileInfos.push(entry);
            partCounter = partCounter + 1;
            count = count + 500;
            wait = false;
          }
          wait = true;
          console.log(fileInfos);
          res.status(200).send(fileInfos);
        });
      }
    }
  );
};
const sendAudioFileReq = async (req, res) => {
  const info = req.params.data.split("||");
  console.log(info);
  const link = info[0];
  const fileName = info[1] + ".wav";
  console.log(fileName);
  await getsFile(
    link,
    link.endsWith("txt")
      ? __basedir + "/resources/static/assets/downloads/file.txt"
      : __basedir + "/resources/static/assets/downloads/file.pdf",
    [],
    () => {
      if (link.endsWith("txt")) {
        let dataBuffer = fs.readFileSync(
          link.endsWith("txt")
            ? __basedir + "/resources/static/assets/downloads/file.pdf"
            : __basedir + "/resources/static/assets/downloads/file.txt",
          "utf8"
        );
        var dictionary = require(__basedir + "/Words/words_dictionary.json");
        var txt = dataBuffer.split("\n");
        var i = 0;
        while (i < txt.length) {
          if (
            txt[i].replace(/[^0-9a-z]/gi, "").length != 0 &&
            txt[i].replace(/[^0-9a-z]/gi, "").length < 10
          ) {
            var word = txt[i].split(" ");
            var j = 0;
            var accept = false;
            while (j < word.length) {
              if (
                word[j].replace(/[^A-Za-z]/gi, "").toLowerCase().length != 1 &&
                word[j].replace(/[^A-Za-z]/gi, "").toLowerCase() in dictionary
              ) {
                accept = true;
                break;
              }
              j = j + 1;
            }
            if (!accept) {
              delete txt[i];
            }
          }
          i = i + 1;
        }
        console.log(txt.length);
        txt = txt.filter((line) => line != undefined);
        console.log(txt.length);
        i = 0;
        var cache = [];
        while (i < txt.length) {
          if (txt[i].length == 0) {
            if (cache.length < 4 && cache.length > 0) {
              for (x in cache) {
                delete txt[x];
              }
            }
            cache = [];
            delete txt[i];
          } else {
            cache.push(i);
          }
          i = i + 1;
        }
        txt = txt.filter((line) => line != undefined);
        console.log(txt.length);
        console.log(info[2]);
        console.log(info[3]);
        var test = txt.slice(info[2], info[3] + 1).join(" ");
        const say = require("say");
        const directoryPath = __basedir + "/resources/static/assets/uploads/";
        console.log("abou tot say ");
        console.log(test.length);
        console.log(directoryPath + "" + fileName);
        say.export(
          test,
          info[4].split("$").join(" "),
          1.0,
          directoryPath + "" + fileName,
          (err) => {
            if (err) {
              console.log(err);
              return console.error(err);
            }

            const directoryPath =
              __basedir + "/resources/static/assets/uploads/";
            console.log(directoryPath + fileName + "||" + fileName);
            res.status(200).send(fileName);
          }
        );
      } else {
        console.log("got");
        console.log(info);
        console.log(fileName);
        var dictionary = require(__basedir + "/Words/words_dictionary.json");
        let dataBuffer = fs.readFileSync(
          __basedir + "/resources/static/assets/downloads/file.pdf"
        );

        pdf(dataBuffer).then(function (data) {
          var txt = data.text.split("\n");
          var i = 0;
          while (i < txt.length) {
            if (
              txt[i].replace(/[^0-9a-z]/gi, "").length != 0 &&
              txt[i].replace(/[^0-9a-z]/gi, "").length < 10
            ) {
              var word = txt[i].split(" ");
              var j = 0;
              var accept = false;
              while (j < word.length) {
                if (
                  word[j].replace(/[^A-Za-z]/gi, "").toLowerCase().length !=
                    1 &&
                  word[j].replace(/[^A-Za-z]/gi, "").toLowerCase() in dictionary
                ) {
                  accept = true;
                  break;
                }
                j = j + 1;
              }
              if (!accept) {
                delete txt[i];
              }
            }
            i = i + 1;
          }
          console.log(txt.length);
          txt = txt.filter((line) => line != undefined);
          console.log(txt.length);
          i = 0;
          var cache = [];
          while (i < txt.length) {
            if (txt[i].length == 0) {
              if (cache.length < 4 && cache.length > 0) {
                for (x in cache) {
                  delete txt[x];
                }
              }
              cache = [];
              delete txt[i];
            } else {
              cache.push(i);
            }
            i = i + 1;
          }
          txt = txt.filter((line) => line != undefined);
          console.log(txt.length);
          console.log(info[2]);
          console.log(info[3]);
          var test = txt.slice(info[2], info[3] + 1).join(" ");
          const say = require("say");
          const directoryPath = __basedir + "/resources/static/assets/uploads/";
          console.log("abou tot say ");
          console.log(test.length);
          console.log(directoryPath + "" + fileName);
          console.log(info[4]);
          say.export(
            test,
            info[4].split("$").join(" "),
            1.0,
            directoryPath + "" + fileName,
            (err) => {
              if (err) {
                console.log(err);
                return console.error(err);
              }

              const directoryPath =
                __basedir + "/resources/static/assets/uploads/";
              console.log(directoryPath + fileName + "||" + fileName);
              res.status(200).send(fileName);
            }
          );
        });
      }
    }
  );
};

const sendAudioFile = async (req, res) => {
  const info = req.params.data;
  console.log(info);
  const directoryPath = __basedir + "/resources/static/assets/uploads/";
  const fileName = info;
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

const details = (req, res) => {
  const directoryPath = __basedir + "/resources/static/assets/uploads/";
  console.log("details");
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  console.log(fileName);
  const directoryPath = __basedir + "";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};
var parse = require("csv-parse");

const getRecommendation = (req, res) => {
  const info = req.params.data;
  console.log(info);
  const directoryPath = __basedir + "/resources/static/assets/dataset.csv";
  fs.readFile(directoryPath, function (err, fileData) {
    parse(fileData, { columns: false, trim: true }, function (err, rows) {
      var rows = rows.map(function (val) {
        return val.slice(0, -1);
      });
      var X = rows.map(function (val) {
        return val.slice(3);
      });
      var Y = rows.map(function (val) {
        if (info.includes(val[1])) {
          return 1;
        } else {
          return 0;
        }
      });
      console.log(info.length);
      console.log(Y);
      Y = Y.slice(1);
      X = X.slice(1);
      var U = [];
      var DF = [];
      for (var i = 0; i < X.length; i++) {
        for (var j = 0; j < X[0].length; j++) {
          X[i][j] = X[i][j] / 4.0;
        }
      }
      console.log(X[41][37]);

      for (var i = 0; i < X[0].length; i++) {
        var sum = 0.0;
        var df = 0.0;
        for (var j = 0; j < Y.length; j++) {
          if (Y[j] == 1) {
            sum = sum + X[j][i];
          }
          if (X[j][i] != 0) {
            df = df + 1;
          }
        }
        if (df == 0) {
          df = 1;
        }
        U.push(sum);
        DF.push(df);
      }

      var IDF = [];
      for (var i = 0; i < DF.length; i++) {
        IDF.push(Math.log(97.0 / DF[i]));
      }
      var Ratings = [];
      var s = 0;
      for (var n = 0; n < X.length; n++) {
        var sum = 0;
        for (var i = 0; i < X[0].length; i++) {
          p = IDF[i] * X[n][i] * U[i];
          sum = sum + p;
        }
        Ratings.push(sum);
        s = s + sum;
      }
      var rec = [];
      for (var j = 0; j < Ratings.length; j++) {
        var max = 0;
        var maxR = 0;
        var found = false;
        for (var i = 0; i < 97; i++) {
          if (Ratings[i] > maxR && rows[i + 1][2] == 0) {
            max = i;
            maxR = Ratings[i];
            found = true;
          }
        }
        if (!found) {
          break;
        }
        rec = [...rec, rows[max + 1][1]];
        Ratings[max] = 0;
      }
      res.send(rec);
    });
  });
};
const msg = (req, res) => {
  console.log("nsg");
  res.status(200).send({
    message: "Could not download the file. ",
  });
};
const update = (req, res) => {
const firebase = require("firebase");
const request = require("request");
const cheerio = require("cheerio");
const url="https://snewd.com/ebooks/";
var fs = require('fs');
var cat = []
var books = []
var Names = []
var New = 0
// Configuration for Fire Base
var config = {
    apiKey: "AIzaSyBLwWyP1YuWZrqvpo_zsNJIyEf8Xi_Lpco",
    authDomain: "gyradosvpn.firebaseapp.com",
    databaseURL: "https://gyradosvpn.firebaseio.com",
    projectId: "gyradosvpn",
    storageBucket: "gyradosvpn.appspot.com",
    messagingSenderId: "50961203679",
    appId: "1:50961203679:web:5889613169c3eeb168c46a"
  };

//Write Data to firebase
function writeUserData(id,obj) {
  firebase.database().ref('Books/'+id).set(obj);
 Names.push({});
 Names[Names.length-1].name = obj.name;
 Names[Names.length-1].id = id;
  firebase.database().ref('Names/').set(Names);
  New++;
 firebase.database().ref('New/').set(New);
}

//Write Data to firebase
function writeBookDataHalf(id,obj) {
  firebase.database().ref('Books/'+id).set({
        name: obj.name,
        author : obj.name.split("- by ")[1],
        file: obj.file,
        image: obj.image

    });
 Names.push({});
 Names[Names.length-1].name = obj.name;
 Names[Names.length-1].id = id;
 firebase.database().ref('Names/').set(Names);
 New++;
 firebase.database().ref('New/').set(New);
 
}
//Getting categories function
function getCategories(callback){
    try{
    index=-1;
    request(url,(error,response,html)=> {
    if(!error && response.statusCode == 200 ){
        const $ =  cheerio.load(html);
        $('.elementor-heading-title').find('a').each(function (i, elem) {
        // Range Name
        if($(this).attr('href').trim()!=''){
            index++;
            cat.push({});
            cat[index].name=$(this).text().trim();         
            cat[index].page=$(this).attr('href').trim();
        }
        });        
        //Calling Get Pages Function
        callback(0,-1,getBooksPages);
    }
    });
  }catch(error){
        callback(0,-1,getBooksPages);
  }
}
  //Getting page books list function
function getBooksPages(pg,ind,callback){
    if(pg<cat.length){
    try{
    var TempIndex = ind;
    var index=ind;
    var url=cat[pg].page;
    console.log(url)
    request(url,(error,response,html)=> {
    if(!error && response.statusCode == 200 ){
        const $ =  cheerio.load(html);
        $('.elementor-icon-list-items').find('span').each(function (i, elem) {
        try{
          foundBook=false;
          if(!($(this).text().startsWith("\n"))){    
          if(Names!=null){
          for(var x=0;x<Names.length;x++){
          if($(this).text()==Names[x].name){
            console.log(Names[x].name+" Skipped")
            foundBook=true
            break;           
          }
          }
          }  
        if(!foundBook){
          index++;
          books.push({});
          books[index].name=$(this).text();
        }
        }
        }catch(error){console.log(error)}
        });
    console.log("books"+index+"temp"+TempIndex)
    const max = index;
    index=TempIndex;
    $('.elementor-icon-list-items').find('a').each(function (i, elem) {
        // Range Name
        if($(this).attr('href').trim()!='' && index<max){
            index++;
            books[index].book=$(this).attr('href').trim();
        }
        });
    }else{
        console.log("error");
    }
    callback(pg+1,index,getBooksPages);
    });}catch(error){
        callback(pg+1,index,getBooksPages);
    }
    }else{
        //Calling Get Download Links For Each books
        getBooksDownload(0,getBooksDownload);        
    }
  }
//Getting page download book function
function getBooksDownload(index,callback){
    if(index<books.length){
    try{
    var bUrl = books[index].book;
    console.log(bUrl)
    request(bUrl,(error,response,html)=> {
    if(!error && response.statusCode == 200 ){
        const $ =  cheerio.load(html);
        $('.elementor-image').find('img').each(function (i, elem) {
            if(books[index].image==undefined){
            books[index].image='https://snewd.com/'+$(this).attr('src').trim();
        }
    });
    $('.elementor-button-wrapper').find('a').each(function (i, elem) {
            if(books[index].file==undefined){
            books[index].file=$(this).attr('href').trim();
        }
    });
    }
    
    setTimeout(() => {  
        callback(index+1,getBooksDownload)
      }, 3000);
    });
    }catch(error){
        setTimeout(() => {  
        callback(index+1,getBooksDownload)
      }, 3000);
    }}else{
        goodReadsSearch(0,goodReadInformation)
    }
}
//Good Reads 
function goodReadsSearch(index, callback){
if(index<books.length){
    console.log("callin")
    var name = books[index].name.split("-")[0].trim().replace(/ /g,'+')
var url="https://www.goodreads.com/search?q="+name+"&search_type=books";
console.log(url)
var book = "https://www.goodreads.com"
request(url,(error,response,html)=> {
    if(!error && response.statusCode == 200 ){
        const $ =  cheerio.load(html);
        $('body > div.content > div.mainContentContainer > div.mainContent > div.mainContentFloat > div.leftContainer > table > tbody > tr:nth-child(1) > td:nth-child(1) > a').each(function (i, elem) {
        console.log($(this).attr('href').trim())
        book=book+$(this).attr('href').trim()
        });
        counter=0
        $('body > div.content > div.mainContentContainer > div.mainContent > div.mainContentFloat > div.leftContainer > table > tbody > tr:nth-child(1) > td:nth-child(2) > span:nth-child(4) > div > a > span').each(function (i, elem) {
      if(counter<1)
          books[index].author = $(this).text().trim()
          counter++;
      });
      console.log("call")
        callback(index,book,goodReadsSearch)
      }else{
          console.log("error search")
          writeBookDataHalf(Math.round((Math.pow(36, 10 + 1) - Math.random() * Math.pow(36, 10))).toString(36).slice(1),books[index]);
        display(books[index]);
        console.log("out")
        goodReadsSearch(index+1,goodReadInformation)
    }
    });
}else{
    firebase.database().ref('updateStatus/').set('false');
    console.log("Doni bro")
}  
}

function goodReadInformation(index,book,callback){
  console.log("in")
    request(book,(error,response,html)=> {
    if(!error && response.statusCode == 200 ){
        const $ =  cheerio.load(html);
        counter = 0;
        $('#description').find('span').each(function (i, elem) {
          if(counter<1){
          books[index].description=$(this).text().trim()
        counter++;  
        }
        });
        var cat = ""
        counter=0;
        $('.elementList').find('a').each(function (i, elem) {
        if(($(this).attr('href').trim().startsWith("/genres"))&&counter<4){
          cat=cat+$(this).text().trim()+","
          counter++;
        }
        books[index].categories=cat
        
      });
      console.log("writing")
      writeUserData(Math.round((Math.pow(36, 10 + 1) - Math.random() * Math.pow(36, 10))).toString(36).slice(1),books[index]);
      display(books[index]);
      console.log("info Out")
      callback(index+1,goodReadInformation)
    }else{console.log("error info")
    goodReadInformation(index,book,goodReadsSearch)
}
    });
}

//Display Function
function display(obj){
    console.log(obj);
}
//read Names
function readData(){
  firebase.database().ref('Names').on('value', (snapshot) => {
    Names= snapshot.val();
  });
  setTimeout(()=>{
    if(Names==null){
      Names=[]
    }
    getCategories(getBooksPages)
  }, 3000);
}
//Initialize Firebase
firebase.initializeApp(config);
//Get Categories
readData()

};
const test = (req, res) => {
  const info = req.params.data.split("$").join(" ");
  const directoryPath = __basedir + "/resources/static/assets/uploads/";
  const fileName = "Test.wav";
  const say = require("say");
  say.export(
    "Hi I am " + info + ". I will be your Narrator.",
    info,
    1.0,
    directoryPath + "" + fileName,
    (err) => {
      if (err) {
        console.log(err);
        return console.error(err);
      }

      const directoryPath = __basedir + "/resources/static/assets/uploads/";
      console.log(directoryPath + fileName + "||" + fileName);

      console.log(info);
      res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
          res.status(500).send({
            message: "Could not download the file. " + err,
          });
        }
      });
    }
  );
};
module.exports = {
  getListFiles,
  sendAudioFile,
  sendAudioFileReq,
  details,
  download,
  getRecommendation,
  msg,
  test,
  update,
};
