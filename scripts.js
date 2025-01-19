document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const mapArea = document.getElementById('map-area');
    const toggleBtn = document.getElementById('toggle-sidebar');
    const closeBtn = document.getElementById('close-events');

    function toggleSidebar() {
        sidebar.classList.toggle('closed');
        mapArea.classList.toggle('expanded');
    }

    toggleBtn.addEventListener('click', toggleSidebar);
    closeBtn.addEventListener('click', toggleSidebar);


//Display Map
const map = L.map('map-area').setView([51.960664, 7.600351], 13); 

//Defining the OSM and Satellite BaseMaps
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; <a href="https://www.esri.com/">ESRI</a>',
    });

    let currentLayer = osmLayer;
    currentLayer.addTo(map);

    // toggle the basemaps
    document.getElementById('toggle-btn').style.backgroundImage = "url('satellite-preview.png')"; 

    document.getElementById('toggle-btn').addEventListener('click', function() {
        if (currentLayer === osmLayer) {
            map.removeLayer(osmLayer); 
            satelliteLayer.addTo(map);
            currentLayer = satelliteLayer; 
            this.innerHTML = '<img src="default-preview.png" alt="Satellite Layer">';
        } else {
            map.removeLayer(satelliteLayer); 
            osmLayer.addTo(map); 
            currentLayer = osmLayer; 
            this.innerHTML = '<img src="satellite-preview.png" alt="OSM Layer">';
        }
    });
});


   
  



