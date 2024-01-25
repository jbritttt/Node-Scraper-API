/* const PORT = process.env.PORT || 8000;
const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const allTheData = require("./data.json");
const filteredData = require("./filteredData.json");
const url = require('./url.js');





app.get("/", function (req, res) {
  res.json(allTheData);
});



app.get("/results", (req, res) => {
  res.json(filteredData);
});


//  1. Get data

//  2. Save data

//  3. Filter data


let data = [];


// scrape page and return the html 
setInterval(function () {getData()}, 15000);

 async function getData() {
   await axios(url)
    .then((response) => {
      const html = response.data;
      console.log(html)
      const $ = cheerio.load(html);
// traverse through the html using cheerio
      $(".product", html).each(function () {
        const code = $(this).attr("id").slice(2, -4);
        const avail = $(this).children("input").last().attr("value");

        data.push({
          code,
          avail,
        });
      });

      saveData(data);
    })
    .catch((err) => {
      
      
      console.log(err)
     
    });
}



// Save data on JSON file
function saveData(val) {
  if (val == [] || val == "") {
    console.log("array was empty");
    getData()
 return
  } else {

    fs.writeFileSync("data.json", JSON.stringify(val), (err) => {
      if (err) throw err;

      console.log("File Saved (all data)");

     
    });


    
    filterTheData();
  }
}


// Filter data and get product codes with a quantity of 5 or less then save on JSON file
function filterTheData() {
  
  let quantityLessThanFive = allTheData.filter((item) => item.avail <= 5);

  console.log(quantityLessThanFive);

  if (!allTheData == [] || !allTheData == "") {
    data = []
    fs.writeFileSync(
      "filteredData.json",
      JSON.stringify(quantityLessThanFive),
      
      (err) => {
        if (err) throw err;

        console.log("File Saved (filtered data)");
      }
    );
  
  }

}






app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
 */
