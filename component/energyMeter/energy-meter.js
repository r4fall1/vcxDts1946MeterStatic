fetch("https://cdn.jsdelivr.net/gh/r4fall1/vcxDts1946MeterWeb@v0/component/energyMeter/template.html")
    .then(stream => stream.text())
    .then(text => define(text));

function define(html) {
    class XBody extends HTMLElement {
        set value(value) {
            this._value = value;
            this.valueElement.innerText = this._value;
        }

        get value() {
            return this._value;
        }

        constructor() {
            super();
            this._value = 0;

            let shadow = this.attachShadow({mode: 'open'});
            shadow.innerHTML = html;

            this.valueElement = shadow.querySelector('p');
            let incrementButton = shadow.querySelectorAll('button')[1];
            let decrementButton = shadow.querySelectorAll('button')[0];

            incrementButton.onclick = () => this.value++;
            decrementButton.onclick = () => this.value--;
        }

        updateHtmlField(id, value) {
            if (value !== 'nan') {
                this.shadowRoot.getElementById(id).innerHTML = value
            }
        }

        msToTime(s) {
            function pad(n, z) {
                z = z || 2;
                return ('00' + n).slice(-z);
            }

            let ms = s % 1000;
            s = (s - ms) / 1000;
            let secs = s % 60;
            s = (s - secs) / 60;
            let mins = s % 60;
            let hrs = (s - mins) / 60;

            return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
        }

        updateValues() {
            let app = this;
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    console.log("params = " + this.responseText);
                    const vals = this.responseText.split(';');
                    app.updateHtmlField("phase1Voltage", vals[0]);
                    app.updateHtmlField("phase2Voltage", vals[1]);
                    app.updateHtmlField("phase3Voltage", vals[2]);
                    app.updateHtmlField("phase1ToPhase2Voltage", vals[3]);
                    app.updateHtmlField("phase2ToPhase3Voltage", vals[4]);
                    app.updateHtmlField("phase3ToPhase1Voltage", vals[5]);
                    app.updateHtmlField("waterTemperature", vals[6]);
                    app.updateHtmlField("heaterOperatingTime", app.msToTime(vals[7]));
                    app.updateHtmlField("heaterStatus", vals[8] > 0 ? "ON" : "OFF");
                }
            }
            xhttp.open("GET", "/params", false);
            xhttp.send();
        }

        heaterTest() {
            let app = this;
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    console.log("status = " + this.responseText);
                    app.updateValues();
                }
            }
            xhttp.open("GET", "/test", false);
            xhttp.send();
        }
    }

    customElements.define('x-body', XBody);

    let meter = document.createElement('x-body');
    setInterval(meter.updateValues(), 5000)
    meter.updateValues()
}
