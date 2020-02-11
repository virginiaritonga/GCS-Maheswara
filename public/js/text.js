var mytext = ""
function updateText(data){
    $('#map_tinggi').html("Ketinggian: <br>" + parseInt(data["Ketinggian"]) + " m");
    $('#map_latitude').html("Latitude: <br>" + parseFloat(data["Lintang"]).toFixed(5));
    $('#map_longitude').html("Longitude: <br>" + parseFloat(data["Bujur"]).toFixed(5));
    $('#terminal').html(mytext)
}

function terminal_update(data){
    mytext = data['Id'] + "  " + data['Waktu']+ "  " + data['Ketinggian']+ "  " + data['Temperatur']+ "  " + data['Kelembapan Relatif']+ "  " + data['Tekanan']+ "  " + data['Arah Angin']+ "   " + data['Kecepatan Angin'] + "  " + data['Lintang'] + "  " + data['Bujur'] + '\n' + mytext;
}
