const fs = require('fs');

let rawdata = fs.readFileSync('data.json');
let books = JSON.parse(rawdata).Books;
var datasetTitle = ['BookID','BookName',"Status"]
var x = Object.keys(books)
for (i = 0; i < x.length; i++) {
  cats = books[x[i]].categories
  
  if(cats!=undefined){
      cats=cats.split(",") 
  for(j=0;j<cats.length-1;j++){
      if(!(datasetTitle.includes(cats[j]))){
          if(cats[j]!=''){
            datasetTitle.push(cats[j])
          }
      }
  }
}
}
dataset=[]
dataset.push(datasetTitle)
for (i = 0; i < x.length; i++) {
    cats = books[x[i]].categories
    if(cats!=undefined){
        var row = []
        row.push(i)
        row.push(books[x[i]].name)
        if(Math.floor(Math.random() * 10)<5){
            row.push(0)
        }else{
            row.push(1)
        }
        for(j=3;j<datasetTitle.length;j++){
            if(cats.includes(datasetTitle[j])){
                row.push(1)
            }else{
                row.push(0)
            }
        }
        dataset.push(row)
    }
}
console.log(dataset.length)
var out = require('ya-csv');
var writer = out.createCsvFileWriter('dataset.csv', {
     'quote': ''
});
dataset.forEach(function(item) {
     writer.writeRecord(item);
});
console.log("done")
