$(document).ready(function(){
    var sock = io.connect('http://localhost:5000');
    sock.on('data enter', function(data){    

        addData(tempChart, data["Temperatur"], data["Ketinggian"]);
        addData(humidChart, data["Kelembapan_Relatif"], data["Ketinggian"]);
        addData(pressureChart, data["Tekanan"], data["Ketinggian"]);
        addData(windDirChart, data["Arah_Angin"], data["Ketinggian"]);
        addData(windSpeedChart, data["Kecepatan_Angin"], data["Ketinggian"]);
        updateText(data);
        updateMap(data);
        terminal_update(data);
        $('#Connect').html('Disconnect');
        $('#Connect').css('background-color','#ff0000');
    });
    // change mode
    $('#Connect').on('click', function(data){

        // change mode: stop -> start
        if($('#Connect').html() == 'Connect'){
            $('#Connect').html('Disconnect');
            $('#Connect').css('background-color','red');
            sock.emit('change connection', {'Connection': 'Connected'});
        }
        // change mode: start -> stop
        else{
            $('#Connect').html('Connect');
            $('#Connect').css('background-color','#07575b');
            sock.emit('change connection', {'Connection': 'Disconnected'});
        }
    });

    $("#settingan").on('click', function(tes){
        var data = {};
        data["muatan_port"] = $('#port_muatan').val();
        data["muatan_baudrate"] = parseInt($('#baudrate_muatan').val());
        data["ats_port"] = $('#port_ats').val();
        data["ats_baudrate"] = parseInt($('#baudrate_ats').val());
        data["origin_latitude"] = parseFloat($('#latitude_ats').val());
        data["origin_longitude"] = parseFloat($('#longitude_ats').val());
        sock.emit('setting', data);
        console.log(data)
    });
});