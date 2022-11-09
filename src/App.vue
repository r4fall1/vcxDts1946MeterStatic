<template>
    <div id="app" class="h-100 container">
        <div class="pt-3 pb-2 d-flex align-items-center">
            <span class="display-5 me-3">Energy meter</span>
        </div>
        <table class="table table-striped table-hover">
            <thead>
            <tr>
                <th scope="col">Data description</th>
                <th scope="col" class="phase-value">L1</th>
                <th scope="col" class="phase-value">L2</th>
                <th scope="col" class="phase-value">L3</th>
                <th scope="col" class="total-value">Total</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Voltage</td>
                <td><span>{{ energyMeter.voltageL1 | formatNumber }}</span> V</td>
                <td><span>{{ energyMeter.voltageL2 | formatNumber }}</span> V</td>
                <td><span>{{ energyMeter.voltageL3 | formatNumber }}</span> V</td>
                <td></td>
            </tr>
            <tr>
                <td>Current</td>
                <td><span>{{ energyMeter.currentL1 | formatNumber }}</span> A</td>
                <td><span>{{ energyMeter.currentL2 | formatNumber }}</span> A</td>
                <td><span>{{ energyMeter.currentL3 | formatNumber }}</span> A</td>
                <td><span>{{ (energyMeter.currentL1 + energyMeter.currentL2 + energyMeter.currentL3) | formatNumber }}</span> A</td>
            </tr>
            <tr>
                <td>Power</td>
                <td><span>{{ energyMeter.powerL1 | formatNumber }}</span> kW</td>
                <td><span>{{ energyMeter.powerL2 | formatNumber }}</span> kW</td>
                <td><span>{{ energyMeter.powerL3 | formatNumber }}</span> kW</td>
                <td><span>{{ energyMeter.totalPower | formatNumber }}</span> kW</td>
            </tr>
            <tr>
                <td>Frequency</td>
                <td></td>
                <td></td>
                <td></td>
                <td><span>{{ energyMeter.frequency | formatNumber }}</span> Hz</td>
            </tr>
            <tr>
                <td>Imported energy</td>
                <td></td>
                <td></td>
                <td></td>
                <td><span>{{ energyMeter.importActiveEnergy | formatNumber }}</span> kWh</td>
            </tr>
            <tr>
                <td>Exported energy</td>
                <td></td>
                <td></td>
                <td></td>
                <td><span>{{ energyMeter.exportActiveEnergy | formatNumber }}</span> kWh</td>
            </tr>
            </tbody>
        </table>

        <div class="flex flex-column mt-5">
            <div class="row justify-content-end mb-2">
                <div class="col-auto mt-1"><span>Refresh interval:</span></div>
                <div class="col-auto m-0 p-0">
                    <select class="form-select form-select-sm" id="max-data-age">
                        <option value="-1">None</option>
                        <option value="10">10 Seconds</option>
                        <option value="60">1 Minute</option>
                        <option value="600">10 Minutes</option>
                        <option selected value="3600">1 Hour</option>
                    </select>
                </div>
                <div class="col-auto ms-3">
                    <button type="button" class="btn btn-primary btn-sm" id="refresh-button">Refresh</button>
                </div>
            </div>
        </div>

        <div class="h-100" id="content">
            <div class="h-100" id="dashboard"></div>
        </div>
    </div>
</template>

<script>
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import axios from "axios";

const numeral = require("numeral");

export default {
    name: "App",
    data() {
        return {
            dashboard: {
                url: String,
                id: String
            },
            energyMeter: {
                voltageL1: 0,
                voltageL2: 0,
                voltageL3: 0,
                currentL1: 0,
                currentL2: 0,
                currentL3: 0,
                currentTotal: 0,
                powerL1: 0,
                powerL2: 0,
                powerL3: 0,
                totalPower: 0,
                frequency: 0,
                importActiveEnergy: 0,
                exportActiveEnergy: 0
            }
        }
    },
    mounted() {
        axios.get('/config/actual')
                .then(function (response) {
                    return response.data;
                }).catch(function (error) {
            // eslint-disable-next-line no-console
            console.log(error);
        }).then(body => {
            this.dashboard.url = body.dashboardBaseUrl
            this.dashboard.id = body.dashboardId
            let sdk = new ChartsEmbedSDK({
                baseUrl: this.dashboard.url,
            });

            let dashboard = sdk.createDashboard({
                dashboardId: this.dashboard.id,
            });

            async function renderDashboard() {
                await dashboard.render(document.getElementById("dashboard"));
                await dashboard.setTheme("light")
                await dashboard.setHeightMode("scale");
                await dashboard.setWidthMode("scale");
                await dashboard.setChartsBackground("transparent");
                await dashboard.setMaxDataAge(3600);
            }

            renderDashboard().catch((e) => window.alert(e.message));

            document.getElementById("refresh-button")
                    .addEventListener("click", async function () {
                        await dashboard.refresh();
                    });

            document.getElementById("max-data-age")
                    .addEventListener("change", async (e) => {
                        await dashboard.setMaxDataAge(Number(e.target.value));
                    });
        });
    },
    created: function () {
        const app = this;
        setInterval(function () {
            axios.get('/energy-meter/get')
                    .then(function (response) {
                        return response.data;
                    }).catch(function (error) {
                // eslint-disable-next-line no-console
                console.log(error);
            }).then(body => {
                app.energyMeter = body
            });
        }, 3000);
    },
    filters: {
        formatNumber(value) {
            return numeral(value).format('0.00');
        }
    }
}
</script>

<style>
html, body {
    height: 100%;
}

.phase-value {
    width: 15%;
}

.total-value {
    width: 20%;
}
</style>