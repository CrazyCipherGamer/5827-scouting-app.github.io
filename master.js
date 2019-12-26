var data = [];
var tData;
var sort = new Tablesort(document.getElementById('datTable'));
function launchAddModal() {
    $('#addDataModal').toggleClass('is-active')
    $('#success').html('');

    var video = document.createElement("video");
    var canvasElement = document.getElementById("canvas");
    var canvas = canvasElement.getContext("2d");

    // Use facingMode: environment to attemt to get the front camera on phones
    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: "environment"
        }
    }).then(function (stream) {
        video.srcObject = stream;
        video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
        video.play();
        requestAnimationFrame(tick);
    });

    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvasElement.hidden = false;

            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            var code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });
            if (code) {
                let tmp = JSON.parse(code.data);
                tData = tmp;
                $('#success').html('Found QR code! ' + code.data);
            }
        }
        requestAnimationFrame(tick);
    }
}

function exportData() {
    //qr code gen with the data array
}

function importData() {
    var tmp = tData;
    var team = tData.teamNum;
    var create = true;
    var index = -1;
    for (var i = 0; i < data.length; i++) {
        if (data[i].team == team) {
            create = false;
            index = i;
            break;
        }
    }

    //What is the average data going to look like?
    /*
    {
        team: 1111,
        drivetrain: "",
        pHatch: 0,
        pCargo: 0,
        played: 12,
        tHatch: 132,
        tCargo: 110,
    }                
    */
    if (create) {
        var obj = {
            team: tmp.teamNum,
            drivetrain: "",
            pHatch: 0,
            pCargo: 0,
            played: 0,
            tHatch: 0,
            tCargo: 0,
            fHatch: 0,
            fCargo: 0,
            aHatch: 0,
            aCargo: 0,
            pCycles: 0,
            tCycles: 0,
            matches: [],
            mScouts: [],
            pScouts: [],
            wins: 0,
            draw: 0,
            loss: 0,
            aClimbs: [],
            didClimb: 0
        }
        if (tmp.type == 0) {
            obj.played++;
            obj.mScouts.push(tmp.scoutName)
            obj.matches.push(tmp.matchNum)
            obj.tHatch += tmp.successfulHatch
            obj.tCargo += tmp.successfulCargo
            obj.fHatch += tmp.failedHatch
            obj.fCargo += tmp.failedCargo
            obj.tCycles += tmp.cycles
        } else {
            obj.pScouts.push(tmp.scoutName)
            obj.pHatch = tmp.hatch
            obj.pCargo = tmp.cargo
            obj.pCycles = tmp.cycles
        }
        data.push(obj)
    } else {
        if (tmp.type == 0) {
            data[index].played++;
            data[index].mScouts.push(tmp.scoutName)
            data[index].matches.push(tmp.matchNum)
            data[index].tHatch += tmp.successfulHatch
            data[index].tCargo += tmp.successfulCargo
            data[index].fHatch += tmp.failedHatch
            data[index].fCargo += tmp.failedCargo
            data[index].tCycles += tmp.cycles
        } else {
            data[index].pScouts.push(tmp.scoutName)
            data[index].pHatch = tmp.hatch
            data[index].pCargo = tmp.cargo
            data[index].pCycles = tmp.cycles
        }
    }
    $('#addDataModal').toggleClass('is-active')
    refreshTable();
}

function refreshTable() {
    //clear table
    //add each element to table
    $('#numTableBod').empty();
    $('#datTableBod').empty();

    for(var i = 0; i < data.length; i++) {
        var num = '<tr><td>' + (i+1) + '</td></tr>'
        $('#numTable').append(num);
        //
        //

        var xx = '<tr><td>' + data[i].team + '</td><td>TODO</td><td>' + data[i].wins + '</td><td>' + data[i].draw + '</td><td>' + data[i].loss + '</td><td>' + (data[i].aHatch / data[i].played) + '</td><td>' + (data[i].aCargo/data[i].played) + '</td><td>' + (data[i].tHatch/data[i].played) + '</td><td>' + (data[i].tCargo/data[i].played) + '</td><td>' + data[i].aClimbs.toString() + '</td><td>' + (data[i].didClimb / data[i].played) + '</td><td>TODO</td>'
        $('#datTable').append(xx);
    }
    //sort = new Tablesort(document.getElementById('datTable'));
    sort.refresh();
}