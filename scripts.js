//Sidebar Toggle section
const sidebar = document.getElementById('sidebar');
const mapArea = document.getElementById('map-area');
const toggleSidebar = document.getElementById('toggle-sidebar');
const closeSidebar = document.getElementById('close-events');


toggleSidebar.addEventListener('click', () => {
    sidebar.classList.toggle('sidebar-closed');
    mapArea.classList.toggle('map-area-full');
});

closeSidebar.addEventListener('click', () => {
    sidebar.classList.add('sidebar-closed');
    mapArea.classList.add('map-area-full');
});







//Display Map
const map = L.map('map-area').setView([51.960664, 7.600351], 13); 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);


