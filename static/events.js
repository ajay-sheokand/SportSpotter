// create event only for logged in users
async function addEvent(eventData) {
    // Check if user is logged in
    if (!currentUser || !currentUser.token) {
        alert("Please login first to add events!");
        showAuthPopup('login'); 
        return;  
    }

    try {
        const response = await fetch('http://localhost:8000/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}` // Include auth token
            },
            body: JSON.stringify(eventData)
        });

        if (response.ok) {
            const newEvent = await response.json();
            fetchEvents(); // Refresh the events list
            hideAddEventForm();
            updateUIForLoggedInUser(currentUser); 
        } else {
            const errorData = await response.json();
            alert('Failed to add event: $(errorData.detail || response.statusText)');
        }
    } catch (error) {
        console.error('Error adding event:', error);
        alert('Failed to add event. Please try again.')
    }
}

// Example usage:
document.getElementById('addEventForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const eventData = {
        title: document.getElementById('eventTitle').value,
        location: document.getElementById('eventLocation').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        tag: document.getElementById('eventTag').value
    };
    addEvent(eventData);
});


// events.js (fetchEvents)
async function fetchEvents() {
    try {
        const response = await fetch('http://localhost:8000/api/events');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const events = await response.json();
        if (!events || events.length === 0) {
            console.log("No events found.");
            displayNoEventsMessage(); 
        } else {
            displayEvents(events);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Failed to load events. Please try again.');
    }
}
// for No events found
function displayNoEventsMessage() {
    const eventsContainer = document.querySelector('.events-sidebar');
    eventsContainer.innerHTML = `
        <div class="event-card">
            <div class="event-date">Saturday, March 16 • 3:00 PM</div>
            <h3 class="event-title">Sports Name</h3>
            <div class="event-location">Location</div>
            <span class="event-sport soccer">No Sports available</span>
        </div> 
        <div class="no-events-message">
            <p>No events found. Be the first to add one!</p>
        </div>
    `;

    // Add the "Add Event" button dynamically
    const addEventButton = document.createElement('button');
    addEventButton.className = 'add-event-btn';
    addEventButton.textContent = 'Add Event';
    addEventButton.onclick = showAddEventForm;
    eventsContainer.appendChild(addEventButton);
}

//for events available
function displayEvents(events) {
    const eventsContainer = document.querySelector('.events-sidebar');
    eventsContainer.innerHTML = ''; // Clear existing events


    // Add the "Add Event" button
    const addEventButton = document.createElement('button');
    addEventButton.className = 'add-event-btn';
    addEventButton.textContent = 'Add Event';
    addEventButton.onclick = showAddEventForm;
    eventsContainer.appendChild(addEventButton);

    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
            <div class="event-date">${event.date} • ${event.time}</div>
            <h3 class="event-title">${event.title}</h3>
            <div class="event-location">${event.location}</div>
            <span class="event-sport">${event.tag}</span>
            ${currentUser && event.created_by === currentUser.username ? `
                <button onclick="editEvent(${event.id})">Edit</button>
                <button onclick="deleteEvent(${event.id})">Delete</button>
            ` : ''}
        `;
        eventsContainer.appendChild(eventCard);
    });
}



//Edit events by owed users:
async function editEvent(eventId, updatedData) {
    try {
        const response = await fetch(`http://localhost:8000/api/events/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}` // Include auth token
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            fetchEvents(); // Refresh the events list
        } else {
            console.error('Failed to edit event:', response.statusText);
        }
    } catch (error) {
        console.error('Error editing event:', error);
    }
}

// Example usage:
function openEditModal(eventId) {
    const event = events.find(e => e.id === eventId);
    if (event) {
        // Populate a modal form with event details
        document.getElementById('editEventTitle').value = event.title;
        document.getElementById('editEventLocation').value = event.location;
        document.getElementById('editEventDate').value = event.date;
        document.getElementById('editEventTime').value = event.time;
        document.getElementById('editEventTag').value = event.tag;

        // Show the modal
        document.getElementById('editEventModal').style.display = 'block';
    }
}

document.getElementById('editEventForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const updatedData = {
        title: document.getElementById('editEventTitle').value,
        location: document.getElementById('editEventLocation').value,
        date: document.getElementById('editEventDate').value,
        time: document.getElementById('editEventTime').value,
        tag: document.getElementById('editEventTag').value
    };
    editEvent(eventId, updatedData);
});

//Deletion of Event by owed user:
async function deleteEvent(eventId) {
    try {
        const response = await fetch(`http://localhost:8000/api/events/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${currentUser.token}` // Include auth token
            }
        });

        if (response.ok) {
            fetchEvents(); // Refresh the events list
        } else {
            console.error('Failed to delete event:', response.statusText);
        }
    } catch (error) {
        console.error('Error deleting event:', error);
    }
}


function showAddEventForm() {
    document.getElementById('addEventModal').style.display = 'block';
}

function hideAddEventForm() {
    document.getElementById('addEventModal').style.display = 'none';
}
