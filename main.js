// https://pptr.dev/
import puppeteer from 'puppeteer';
// https://pptr.dev/api/puppeteer.knowndevices
import {KnownDevices} from 'puppeteer';
const device = KnownDevices['iPad'];

import fs from 'fs';

//
// macos: % sudo port install tesseract tesseract-eng tesseract-chi-tra tesseract-chi-sim
//
// https://www.npmjs.com/package/node-tesseract-ocr
import tesseract from 'node-tesseract-ocr';

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

let targetURL = '';
let targetImgId = '';
const targetImgLocalPath = '/tmp/verify-code.png';
const targetWebpageSnapshotImagePath = '/tmp/full-webpage.png';

const args = process.argv;
if (args.length >= 4) {
    targetURL = args[2];
    targetImgId = args[3];
}

(async () => {
    if (targetURL.length == 0 || targetImgId.length == 0) {
        console.log('Usage> node '+args[1] + ' "WebURL" "ImageObjectID"'); 
        return;
    }
    console.log('[INFO] WebURL: "'+ targetURL + '", The id of the DOM <img>: "'+targetImgId+'"');

    const browser = await puppeteer.launch({
    	// https://stackoverflow.com/questions/58045551/puppeteer-page-evaluate-not-working-as-expected
        //dumpio: true
    });
    const page = await browser.newPage();
    await page.emulate(device);

    page.on('domcontentloaded', () => {
        console.log('on.domcontentloaded');
    });
    page.on('load', async () => {
        console.log('on.load');
    });
    page.on('framenavigated', frame => {
        console.log('on.framenavigated: '+frame.url());
    });

    await page.goto(
        targetURL,
        {
            waitUntil: 'networkidle0',
        }
    );
    const conImgBase64Data = await page.evaluate(async(imgId) => {
        const targetObject = document.getElementById(imgId);
        if (targetObject) {
            //console.log('targetObject width:' + targetObject.clientWidth +', height:' + targetObject.clientHeight );
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            canvas.width = targetObject.clientWidth;
            canvas.height = targetObject.clientHeight;
            context.drawImage(targetObject, 0, 0, targetObject.width, targetObject.height);
            var base64Data = canvas.toDataURL("image/png");
            return base64Data;
        } else {
            //console.log('targetObject not found');
            return null;
        }
    }, targetImgId);
    // console.log(conImgBase64Data);
    if (conImgBase64Data != null) {
        //fs.writeFileSync(targetImgLocalPath, conImgBase64Data);
        //fs.writeFileSync(targetImgLocalPath, Buffer.from(conImgBase64Data, 'base64'));
        fs.writeFileSync(targetImgLocalPath, Buffer.from(conImgBase64Data.replace(/^data:image\/png;base64,/, ""), 'base64'));

        //
        // % tesseract --list-langs
        // % tesseract --help-extra
        //
        const config = {
           lang: "chi_tra",
           oem: 1,
           psm: 6,
        }
        const img = fs.readFileSync(targetImgLocalPath);
        tesseract.recognize(img, config).then((text) => {
            console.log('tesseract.recognize result: ', text)
        }).catch((error) => {
            console.log('tesseract.recognize error: ' + error.message)
        });
    }

    // await sleep(5000);
    //await page.waitForNavigation(15);
    console.log('page.screenshot');
    await page.screenshot({path: targetWebpageSnapshotImagePath});
    console.log('browser.close');
    await browser.close();

})();
