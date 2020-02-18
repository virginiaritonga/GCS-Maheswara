<script src="/socket.io/socket.io.js" charset="utf-8"></script>
const socket = io();
var mytext = ""
socket.on('arduino:data',function (dataSerial) {
    $('#map_tinggi').html("Ketinggian: <br>" + dataSerial. + " m");
    $('#map_latitude').html("Latitude: <br>" + data.Bujur.toFixed(5));
    $('#map_longitude').html("Longitude: <br>" + parseFloat(data["Bujur"]).toFixed(5));
    $('#terminal').html(mytext)
});


function terminal_update(data){
    mytext = data['Id'] + "  " + data['Waktu']+ "  " + data['Ketinggian']+ "  " + data['Temperatur']+ "  " + data['Kelembapan Relatif']+ "  " + data['Tekanan']+ "  " + data['Arah Angin']+ "   " + data['Kecepatan Angin'] + "  " + data['Lintang'] + "  " + data['Bujur'] + '\n' + mytext;
}
