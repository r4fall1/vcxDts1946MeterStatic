fetch("template.html")
    .then(stream => stream.text())
    .then(html => define(html));

function define(html) {
    $("#energy-meter").html(html)
}

function msToTime(s) {
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

function updateValues() {
    $.get('/energy-meter/get', function(data) {
        const vals = data.split(';')
        $('#phase1Voltage').html(vals[0])
        $('#phase2Voltage').html(vals[1])
        $('#phase3Voltage').html(vals[2])
        $('#phase1ToPhase2Voltage').html(vals[3])
        $('#phase2ToPhase3Voltage').html(vals[4])
        $('#phase3ToPhase1Voltage').html(vals[5])
        $('#waterTemperature').html(vals[6])
        $('#heaterOperatingTime').html(msToTime(vals[7]))
        $('#heaterStatus').html(vals[8] > 0 ? "ON" : "OFF")
    });
}

setInterval(updateValues, 2000)