$(document).ready(function(){
    $("#settingan").on('click', function(tes){
        var data = {};
        data["muatan_port"] = $('#port_muatan').val();
        data["muatan_baudrate"] = parseInt($('#baudrate_muatan').val());
        data["ats_port"] = $('#port_ats').val();
        data["ats_baudrate"] = parseInt($('#baudrate_ats').val());
        data["origin_latitude"] = parseFloat($('#latitude_ats').val());
        data["origin_longitude"] = parseFloat($('#longitude_ats').val());
        console.log(data)
    });
});