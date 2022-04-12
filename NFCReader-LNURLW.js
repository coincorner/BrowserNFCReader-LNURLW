//Checks if NFC is present, reveals button and adds event listener
if ('NDEFReader' in window) {
    var nfcBTCBtn = document.getElementById('nfcBTCBtn')
    nfcBTCBtn.classList.remove('hidden')
    nfcBTCBtn.addEventListener('click', async () => { nfcClick(true) })
}

//Handle NFC reading and posting data to server
var listening = false
var ndef
async function nfcClick() {
    var buttonBtc = document.getElementById('nfcBTCBtn')
    var logoBtc = document.getElementById('nfcBTCLogo')
    var loaderBtc = document.getElementById('nfcBTCLoader')
    try {
        if (!listening) {

            //User feedback, show NFC listening icon
            swap(buttonBtc, logoBtc)

            //Start NFC reader, add event listeners
            ndef = new NDEFReader()
            await ndef.scan()

            ndef.addEventListener('readingerror', () => {
                resetNFC()
            })

            ndef.addEventListener('reading', ({ message, serialNumber }) => {
                //Decode NDEF data from tag
                var record = message.records[0]
                const textDecoder = new TextDecoder('utf-8')
                var lnurl = textDecoder.decode(record.data)

                //User feedback, show loader icon
                swap(logoBtc, loaderBtc)

                //Post LNURLW data to server
                var xhr = new XMLHttpRequest()
                xhr.open('POST', '{URL GOES HERE}', true)
                xhr.setRequestHeader('Content-Type', 'application/json')
                xhr.send(JSON.stringify({
                    lnurl: lnurl
                }))

                //User feedback, reset on failure
                xhr.onload = function () {
                    var response = this.responseText
                    if (response == 'False') {
                        resetNFC()
                    }
                }
            })
            //Prevent multiple NDEFReader objects from being created
            listening = true
        } else {
            //This state shouldn't be reached, if it is, hide the button
            swap(buttonBtc, logoBtc)
        }
    } catch (e) {
        resetNFC()
    }
}

//Show one element, hide another
function swap(hide, show) {
    hide.classList.add('hidden')
    show.classList.remove('hidden')
}

//Reset the buttons and icons back to original state
function resetNFC() {
    button = document.getElementById('nfcBTCBtn')
    logo = document.getElementById('nfcBTCLogo')
    loader = document.getElementById('nfcBTCLoader')
    logo.classList.add('hidden')
    loader.classList.add('hidden')
    button.classList.remove('hidden')
}