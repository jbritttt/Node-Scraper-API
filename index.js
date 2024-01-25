const PORT = process.env.PORT || 8000;
require("dotenv").config()
const fs = require("fs");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const allTheData = require("./data.json");
const filteredData = require("./filteredData.json");
const url = require('./url.js');
const puppeteer = require("puppeteer");



(async () => {
  let allData = []
  let data = []

  app.get("/all", function (req, res) {
    res.json(allData);
  });
  
  
  
  app.get("/results", (req, res) => {
    res.json(data);
  });
  
  
  const browser = await puppeteer.launch({ 
 

    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],

    //protocolTimeout: 240000,

    executablePath: process.env.NODE_ENV === 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
   });

   
  const page = await browser.newPage();
  await page.goto("");

  await page.waitForSelector(".icon.icon-account");
  await page.click(".icon.icon-account");

  await page.waitForSelector("#email");
  await page.type("#email", "");
  await page.waitForSelector("#password");
  await page.type("#password", "");
  page.keyboard.press("Enter");

  //await browser.close()

  const myTimeout = setTimeout(run, 80000);

  
  async function run() {
    await page.goto(url, { timeout: 220000 }//This was 80000 before but there is alot of products now
    );

    //I would leave this here as a fail safe
    await page.content(80000);

    innerText = await page.evaluate(() => {
      return document.querySelector("body").innerText;
    });

    console.log("innerText now contains the JSON");
    allData = []
allData.push(JSON.parse(innerText))
  /*   fs.writeFileSync("data.json", innerText, err => {
      if (err) {
        console.error(err);
      }
      console.log('all data written successfully')
    }); */


     data = [];

 
       let prodLessThanSix = allData[0].cart.items.forEach((item) => {
         let sentenceSplit = item.message.split(" ");
         let lastItem = sentenceSplit.pop();
         
         if( !isNaN(item.product_sku.charAt(0))){

          item.product_sku = 'x' + item.product_sku
        }

         if (item.message !== "" && lastItem !== "stock.") {
           data.push({
             code: item.product_sku,
             avail: sentenceSplit[4],
           });
         } else if (item.message !== "" && lastItem == "stock.") {
           data.push({
             code: item.product_sku,
             avail: "0",
           });
         }else if( item.qty < 6 && item.message == "" ){
          data.push({
            code: item.product_sku,
            avail: `${item.qty}`,
          });
        
          
          }else; 

         // if( item.product_sku.charAt(0) == 'x'){
          //  console.log(item.product_sku)
        //  }
  


       });
     
        /*  fs.writeFileSync("data.json", JSON.stringify(data), (err) => {
         if (err) {
           console.error(err);
     
         }
     
         
       })  */  
      
       setTimeout(run, 30000);
     
    
    //await browser.close();
  

    

  }
  
})();



 

app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
