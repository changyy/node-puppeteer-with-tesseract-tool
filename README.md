# Installation

macOS:

```
% sudo port install tesseract tesseract-eng tesseract-chi-tra tesseract-chi-sim

% sw_vers 
ProductName:		macOS
ProductVersion:		13.5.1
BuildVersion:		22G90

% tesseract --version
tesseract 5.3.2
 leptonica-1.82.0
  libgif 5.2.1 : libjpeg 8d (libjpeg-turbo 2.1.5.1) : libpng 1.6.40 : libtiff 4.5.1 : zlib 1.2.11 : libwebp 1.3.1 : libopenjp2 2.5.0
 Found SSE4.1
 Found libarchive 3.6.2 zlib/1.2.11 liblzma/5.4.1 bz2lib/1.0.8 liblz4/1.9.4 libzstd/1.5.4
 Found libcurl/8.1.2 SecureTransport (LibreSSL/3.3.6) zlib/1.2.11 nghttp2/1.51.0
```

node.js:

```
% nvm use v20
Now using node v20.5.1 (npm v9.8.0)
% npm install
% npm run main    

> main
> node main.js

Usage> node /private/tmp/node-puppeteer-with-tesseract-tool/main.js "WebURL" "ImageObjectID"

% node main.js 
Usage> node /private/tmp/node-puppeteer-with-tesseract-tool/main.js "WebURL" "ImageObjectID"
```

# Usage

```
% node main.js 'https://xxx/login' 'verifyImgCode'
[INFO] WebURL: "https://xxx/login", The id of the DOM <img>: "verifyImgCode"

  Puppeteer old Headless deprecation warning:
    In the near future `headless: true` will default to the new Headless mode
    for Chrome instead of the old Headless implementation. For more
    information, please see https://developer.chrome.com/articles/new-headless/.
    Consider opting in early by passing `headless: "new"` to `puppeteer.launch()`
    If you encounter any bugs, please report them to https://github.com/puppeteer/puppeteer/issues/new/choose.

on.domcontentloaded
on.framenavigated: about:blank
on.load
...
page.screenshot
browser.close
tesseract.recognize result:  058B47
```

output:

- webpage snapshot: /tmp/full-webpage.png
- image: /tmp/verify-code.png

# tesseract command usage 

```
% tesseract /tmp/verify-code.png stdout -c tessedit_char_whitelist=0123456789

% tesseract --help-extra
Usage:
  tesseract --help | --help-extra | --help-psm | --help-oem | --version
  tesseract --list-langs [--tessdata-dir PATH]
  tesseract --print-parameters [options...] [configfile...]
  tesseract imagename|imagelist|stdin outputbase|stdout [options...] [configfile...]

OCR options:
  --tessdata-dir PATH   Specify the location of tessdata path.
  --user-words PATH     Specify the location of user words file.
  --user-patterns PATH  Specify the location of user patterns file.
  --dpi VALUE           Specify DPI for input image.
  -l LANG[+LANG]        Specify language(s) used for OCR.
  -c VAR=VALUE          Set value for config variables.
                        Multiple -c arguments are allowed.
  --psm NUM             Specify page segmentation mode.
  --oem NUM             Specify OCR Engine mode.
NOTE: These options must occur before any configfile.

Page segmentation modes:
  0    Orientation and script detection (OSD) only.
  1    Automatic page segmentation with OSD.
  2    Automatic page segmentation, but no OSD, or OCR. (not implemented)
  3    Fully automatic page segmentation, but no OSD. (Default)
  4    Assume a single column of text of variable sizes.
  5    Assume a single uniform block of vertically aligned text.
  6    Assume a single uniform block of text.
  7    Treat the image as a single text line.
  8    Treat the image as a single word.
  9    Treat the image as a single word in a circle.
 10    Treat the image as a single character.
 11    Sparse text. Find as much text as possible in no particular order.
 12    Sparse text with OSD.
 13    Raw line. Treat the image as a single text line,
       bypassing hacks that are Tesseract-specific.

OCR Engine modes:
  0    Legacy engine only.
  1    Neural nets LSTM engine only.
  2    Legacy + LSTM engines.
  3    Default, based on what is available.

Single options:
  -h, --help            Show minimal help message.
  --help-extra          Show extra help for advanced users.
  --help-psm            Show page segmentation modes.
  --help-oem            Show OCR Engine modes.
  -v, --version         Show version information.
  --list-langs          List available languages for tesseract engine.
  --print-parameters    Print tesseract parameters.
```
