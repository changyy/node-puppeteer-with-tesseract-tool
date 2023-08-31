// https://pptr.dev/
import fs from 'fs';

//
// macos: % sudo port install tesseract tesseract-eng tesseract-chi-tra tesseract-chi-sim
//
// https://www.npmjs.com/package/node-tesseract-ocr
import tesseract from 'node-tesseract-ocr';

(async () => {
    //
    // % tesseract --list-langs
    //
    const config = {
       lang: "chi_tra",
       oem: 1,
       psm: 6,
    }
    const img = fs.readFileSync('/tmp/verify-code.png');
    tesseract.recognize(img, config).then((text) => {
        console.log('tesseract.recognize result: ', text)
    }).catch((error) => {
        console.log('tesseract.recognize error: ' + error.message)
    });
})();
