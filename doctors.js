const puppeteer = require('puppeteer')
const fs = require('node:fs/promises');
const { get } = require('http');
const { cluster } = require('puppeteer-cluster');






async function start() {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto("https://practitioners.health.gov.il/Practitioners");

    // First wait for the selectors to load
    await page.waitForSelector("div.cardDiv.ng-star-inserted mat-card");

    /*Navigate to the first page that you will collect info from
     allSpecialties is array of the first level buttons to navigate to the information we're looking for.
    We will return to the main page and go inside all 25 buttons in allSpecialties */
    let allSpecialties = await page.$$("div.cardDiv.ng-star-inserted");

    //Click the first button from the allSpecialties array of buttons
    await allSpecialties[0].click();

    //Wait until the selector you are waiting for loads
    await page.waitForSelector("div.propertyValueDiv label");

    /*When the selector in the new page loads, create a new labels array.
    The new labels array consists of all the elements that were picked by the selector.
    The reason why we use the $$eval method is that it allows us to take the text content of the elements that populate the array
    And convert them to strings. They are no longer "Elements" but actual text content of the "Elements": */
    let labels = await page.$$eval("div.propertyValueDiv label", (txt) => {
        return txt.map(x => x.innerText)
    });

    /*labels array is actually a fully workable array.
     We now want to create a doctorNames array from the existing labels array and populate it with each sixth element in the array.
     */
    let doctorNames = [];
    for (let label = 0; label < 120; label += 6) {
        doctorNames.push(labels[label]);
    }

    //Move to the next page with clicking the next button 
    await page.click(".mat-paginator-navigation-next.mat-icon-button");



    /*Do the whole label operation again..
        let allLabels = []
    do {
        await page.waitForSelector("div.propertyValueDiv label");
        let newLabels = await page.$$eval("div.propertyValueDiv label", (txt) => {
            return txt.map(x => x.innerText)
        });
        allLabels.concat(newLabels);
        await page.click(".mat-paginator-navigation-next.mat-icon-button");
    }

    while (document.querySelector(".mat-paginator-navigation-next.mat-icon-button") != null);*/

    for (let label = 0; label < 120; label += 6) {
        doctorNames.push(labels[label]);
    }

    /*- In other words we want to:
        - loop through the pages array
        - open the page in a new page.
        - scrape the doctor names 
        - close that page 
        - open a new page for the next page element in the array*/


    /* - Below is the function that scrapes only doctor names
     - In the future we might need to write a forEach loop to get the
    all doctorNames from all pages(not sure) */

    await fs.writeFile("doctorNames.txt", doctorNames.join("\r\n"));
    await browser.close()
}
start();