# Browser NFC Reader - LNURLW

Javascript for listening to incoming NFC NDEF data in the browser utilising 'Web NFC' (https://w3c.github.io/web-nfc/) for accepting NFC Bitcoin lightning payments via LNURLW (https://github.com/fiatjaf/lnurl-rfc/blob/luds/03.md). 

## Compatibility
Browser compatibility will depend on implementation of Web NFC, currently only Chrome for Android is compatible (https://caniuse.com/webnfc).

## How to use
1. Include the JS code within your project on the payment screen (where a lightning invoice is present).
2. Create an HTML button with an id attribute of `nfcBTCBtn` and class `hidden` on the payment page. 
    - `<button id="nfcBTCBtn" class="hidden">Pay by NFC</button>`
3. Add img tags for displaying icons during the process
    - `nfcBTCLogo` should be used as the attribute id for the NFC logo image shown once the browser has activated NFC listening.
    - `nfcBTCLoader` should be used as the attribute id for the NFC loading image shown once a tag has been read and awaiting server response.
4. Add your backend server URL into the POST request to handle the lnurlw payment (include any additional required parameters here too).
    - `xhr.open('POST', '{URL GOES HERE}', true)`
5. Handle lnurlw on backend server to request a payment to the required lightning invoice.

## LNURLW
The backend server should follow the standard lnurlw flow (https://github.com/fiatjaf/lnurl-rfc/blob/luds/03.md) using the lightning invoice for the order as the payment request (pr) in the second GET request. This will instruct the user's wallet to pay the required invoice. Ideally, the server should handle both bech32 encoded lnurlw and non bech32 encoded lnurlw (https://github.com/fiatjaf/lnurl-rfc/blob/luds/17.md)

## Security
Even though the lightning invoice should be available on the client side, it is recommended to re request this on the server side before attempting the lnurlw flow to avoid any malicious attempts to change the invoice client side. This can be done by passing additional parameters across in the POST request to identify the order and retrieve the invoice server side (such as an orderid).
