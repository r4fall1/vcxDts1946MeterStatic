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
                <td>Reactive power</td>
                <td><span>{{ energyMeter.reactivePowerL1 | formatNumber }}</span> VAr</td>
                <td><span>{{ energyMeter.reactivePowerL2 | formatNumber }}</span> VAr</td>
                <td><span>{{ energyMeter.reactivePowerL3 | formatNumber }}</span> VAr</td>
                <td><span>{{ energyMeter.totalReactivePower | formatNumber }}</span> VAr</td>
            </tr>
            <tr>
                <td>Apparent power</td>
                <td><span>{{ energyMeter.apparentPowerL1 | formatNumber }}</span> VA</td>
                <td><span>{{ energyMeter.apparentPowerL2 | formatNumber }}</span> VA</td>
                <td><span>{{ energyMeter.apparentPowerL3 | formatNumber }}</span> VA</td>
                <td><span>{{ energyMeter.totalApparentPower | formatNumber }}</span> VA</td>
            </tr>
            <tr>
                <td>Power factor</td>
                <td><span>{{ energyMeter.powerFactorL1 | formatNumber }}</span></td>
                <td><span>{{ energyMeter.powerFactorL2 | formatNumber }}</span></td>
                <td><span>{{ energyMeter.powerFactorL3 | formatNumber }}</span></td>
                <td><span>{{ energyMeter.totalPowerFactor | formatNumber }}</span></td>
            </tr>
            <tr>
                <td>Frequency</td>
                <td></td>
                <td></td>
                <td></td>
                <td><span>{{ energyMeter.frequency | formatNumber }}</span> Hz</td>
            </tr>
            <tr>
                <td>Imported active energy</td>
                <td></td>
                <td></td>
                <td></td>
                <td><span>{{ energyMeter.importActiveEnergy | formatNumber }}</span> kWh</td>
            </tr>
            <tr>
                <td>Exported active energy</td>
                <td></td>
                <td></td>
                <td></td>
                <td><span>{{ energyMeter.exportActiveEnergy | formatNumber }}</span> kWh</td>
            </tr>
            <tr>
                <td>Imported reactive energy</td>
                <td></td>
                <td></td>
                <td></td>
                <td><span>{{ energyMeter.importReactiveEnergy | formatNumber }}</span> kVArh</td>
            </tr>
            <tr>
                <td>Exported reactive energy</td>
                <td></td>
                <td></td>
                <td></td>
                <td><span>{{ energyMeter.exportReactiveEnergy | formatNumber }}</span> kVArh</td>
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
        <div class="accordion pt-4" id="accordionButtons">
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        Navigation
                    </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionButtons">
                    <div class="accordion-body row">
                        <div class="col">
                            <button class="btn btn-sm btn-success ms-2 me-2" type="button" v-on:click="goToSettingsPage">Settings</button>
                            <button class="btn btn-sm btn-outline-secondary ms-2 me-2" type="button" v-on:click="goToActualConfigPage">RAW config</button>
                            <button class="btn btn-sm btn-outline-secondary ms-2 me-2" type="button" v-on:click="goToInfoPage">RAW device info</button>
                            <button class="btn btn-sm btn-outline-secondary ms-2 me-2" type="button" v-on:click="goToEnergyValuesPage">RAW energy values</button>
                        </div>
                        <div class="col">
                            <button class="btn btn-sm btn-danger ms-2 me-2 float-end" type="button" v-on:click="goToUpdatePage">Update</button>
                            <button class="btn btn-sm btn-danger ms-2 me-2 float-end" type="button" v-on:click="restartModule">Restart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xs-12" style="height:50px;"></div>
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
                powerL1: 0,
                powerL2: 0,
                powerL3: 0,
                totalPower: 0,
                reactivePowerL1: 0,
                reactivePowerL2: 0,
                reactivePowerL3: 0,
                totalReactivePower: 0,
                apparentPowerL1: 0,
                apparentPowerL2: 0,
                apparentPowerL3: 0,
                totalApparentPower: 0,
                powerFactorL1: 0,
                powerFactorL2: 0,
                powerFactorL3: 0,
                totalPowerFactor: 0,
                frequency: 0,
                importActiveEnergy: 0,
                exportActiveEnergy: 0,
                importReactiveEnergy: 0,
                exportReactiveEnergy: 0
            }
        }
    },
    mounted() {
        axios.get('/actual-config')
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
        let readValues = function () {
            axios.get('/energy')
                    .then(function (response) {
                        return response.data;
                    }).catch(function (error) {
                // eslint-disable-next-line no-console
                console.log(error);
            }).then(body => {
                app.energyMeter.voltageL1 = body.vL1
                app.energyMeter.voltageL2 = body.vL2
                app.energyMeter.voltageL3 = body.vL3
                app.energyMeter.currentL1 = body.cL1
                app.energyMeter.currentL2 = body.cL2
                app.energyMeter.currentL3 = body.cL3
                app.energyMeter.powerL1 = body.pL1
                app.energyMeter.powerL2 = body.pL2
                app.energyMeter.powerL3 = body.pL3
                app.energyMeter.totalPower = body.tP
                app.energyMeter.reactivePowerL1 = body.rPL1
                app.energyMeter.reactivePowerL2 = body.rPL2
                app.energyMeter.reactivePowerL3 = body.rPL3
                app.energyMeter.totalReactivePower = body.tRP
                app.energyMeter.apparentPowerL1 = body.aPL1
                app.energyMeter.apparentPowerL2 = body.aPL2
                app.energyMeter.apparentPowerL3 = body.aPL3
                app.energyMeter.totalApparentPower = body.tAP
                app.energyMeter.powerFactorL1 = body.pFL1
                app.energyMeter.powerFactorL2 = body.pFL2
                app.energyMeter.powerFactorL3 = body.pFL3
                app.energyMeter.totalPowerFactor = body.tPF
                app.energyMeter.frequency = body.f
                app.energyMeter.importActiveEnergy = body.iAE
                app.energyMeter.exportActiveEnergy = body.eAE
                app.energyMeter.importReactiveEnergy = body.iRE
                app.energyMeter.exportReactiveEnergy = body.eRE
            });
        }
        setInterval(readValues, 5500);
        readValues();
    },
    filters: {
        formatNumber(value) {
            return numeral(value).format('0.00');
        }
    },
    methods: {
        goToSettingsPage() {
            window.location.href = '/config';
        },
        goToUpdatePage() {
            window.location.href = '/update';
        },
        restartModule() {
            window.location.href = '/restart';
        },
        goToActualConfigPage() {
            window.location.href = '/actual-config';
        },
        goToEnergyValuesPage() {
            window.location.href = '/energy';
        },
        goToInfoPage() {
            window.location.href = '/info';
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