const update_events = "";


// create event only for logged in users
async function addEvent(eventData) {
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
        displayEvents(events);
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Failed to load events. Please try again.');
    }
}


function displayEvents(events) {
    const eventsContainer = document.querySelector('.events-sidebar');
    eventsContainer.innerHTML = ''; // Clear existing events

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

// User logged in or not
function updateUIForLoggedInUser(user) {
    const authButton = document.querySelector('.button-3');
    authButton.textContent = `${user.username}`;
    authButton.onclick = logout;

    // Show the "Add Event" button if the user is logged in
    const addEventButton = document.querySelector('.add-event-btn');
    if (addEventButton) {
        addEventButton.style.display = 'block';
    }

    // Add a logout option
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'button-3';
    logoutBtn.textContent = 'Logout';
    logoutBtn.onclick = logout;
    authButton.parentNode.appendChild(logoutBtn);
}

function logout() {
    currentUser = null;
    const authButton = document.querySelector('.button-3');
    authButton.textContent = 'SignIn';
    authButton.onclick = () => showAuthPopup('signup');

    // Hide the "Add Event" button when the user logs out
    const addEventButton = document.querySelector('.add-event-btn');
    if (addEventButton) {
        addEventButton.style.display = 'none';
    }

    // Remove logout button
    const logoutBtn = authButton.parentNode.querySelector('button:last-child');
    if (logoutBtn && logoutBtn.textContent === 'Logout') {
        logoutBtn.remove();
    }
}