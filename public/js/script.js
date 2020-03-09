function ChangeButtonOne(){
  //document.getElementById("Map").hidden = false;
  document.getElementById("Graph").hidden = true;
  document.getElementById("Detail").hidden = true;
}

function toManual(){
  document.getElementById("Manual").hidden = false;
  document.getElementById("Graph").hidden = true;
}

function ChangeButtonTwo(){
  KotakSatu.style.opacity = "1";
  KotakSatu.style.cursor = "pointer";
  KotakSatu.disabled = false;

  KotakDua.style.opacity = "0.6";
  KotakDua.style.cursor = "default";
  KotakDua.disabled = true;

  KotakTiga.style.opacity = "1";
  KotakTiga.style.cursor = "pointer";
  KotakTiga.disabled = false;

  //document.getElementById("Map").hidden = true;
  document.getElementById("Graph").hidden = false;
  document.getElementById("Detail").hidden = true;
}
function ChangeButtonThree(){
  KotakSatu.style.opacity = "1";
  KotakSatu.style.cursor = "pointer";
  KotakSatu.disabled = false;

  KotakDua.style.opacity = "1"
  KotakDua.style.cursor = "pointer";
  KotakDua.disabled = false;

  KotakTiga.style.opacity = "0.6";
  KotakTiga.style.cursor = "default";
  KotakTiga.disabled = true;

  //document.getElementById("Map").hidden = true;
  document.getElementById("Graph").hidden = true;
  document.getElementById("Detail").hidden = false;

  Papa.parse("http://localhost:5000/first", {
    download: true,
    header: true,
	  complete: function(results) {
      results['data'].forEach(element => {
        if ( element['Id'] != "") {	
					var d = new Date();
					var months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
					$('#init_tanggal').html('Tanggal Peluncuran : ' + d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear())
					$('#init_time').html('Waktu Peluncuran : ' + element['Waktu']);
					$('#init_latitude').html('Latitude : ' + parseFloat(element['Lintang']).toFixed(5));
					$('#init_longitude').html('Longitude : ' + parseFloat(element['Bujur']).toFixed(5));	
        }
      });
	  }
  });
}

function Peluncuran(){
  if((document.getElementById("TanggalLuncur").textContent == "Tanggal Peluncuran: -") && (document.getElementById("WaktuStart").textContent == "Start Time: -") ){
    var Waktu = new Date();
    document.getElementById("TanggalLuncur").textContent = "Tanggal Peluncuran: " + Waktu.getDate() + "/" + (Waktu.getMonth()+1) + "/" + Waktu.getFullYear();
    document.getElementById("WaktuStart").textContent = "Start Time: " + Waktu.getHours() + ":" + Waktu.getMinutes() + ":" + Waktu.getSeconds();
  }
}

function download_csv(){
  window.open("http://localhost:5000/csv_filter.csv", "_blank")
}

function download_graph(){
  tempCanvas.toBlob(function(value){
    saveAs(value, "Grafik temperatur.jpg");
  })
  humidCanvas.toBlob(function(value){
    saveAs(value, "Grafik kelembapan.jpg");
  })
  pressureCanvas.toBlob(function(value){
    saveAs(value, "Grafik tekanan.jpg");
  })
  windDirCanvas.toBlob(function(value){
    saveAs(value, "Grafik arah angin.jpg");
  })
  windSpeedCanvas.toBlob(function(value){
    saveAs(value, "Grafik kecepatan angin.jpg");
  })
}

function map_auto(){
  if ($('#autohand').html() == 'Auto'){
    $('#autohand').html('Manual')
    $('#autohand').removeClass('btn-success')
    $('#autohand').addClass('btn-danger')
  } else{
    $('#autohand').html('Auto')
    $('#autohand').addClass('btn-success')
    $('#autohand').removeClass('btn-danger')
  }
}
