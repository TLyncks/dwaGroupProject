function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'card event-card';

    card.innerHTML = `
      ${event.image_url ? `<img src="/uploads/${event.image_url}" class="card-img-top" alt="${event.title}">` : ''}
      <div class="card-body">
        <h5 class="card-title">${event.title}</h5>
        <p class="card-text">${event.description}</p>
        <p class="card-text">
          <small class="text-muted">
            Start: ${event.start_date} | End: ${event.end_date} | Time: ${event.end_time}
          </small>
        </p>
      </div>
    `;
    return card;
  }

  // fetch and display events hopefully
  async function loadUserEvents() {
    const hostedEventCounter = 0;
    const attendedEventCounter = 0;
    try {
      
      const response = await fetch('/member/My-Events');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const myEventsData = await response.json();

      // Populate header values
      document.getElementById('user-name').innerText = myEventsData.user.UserName;
      document.getElementById('hosted-count').innerText = myEventsData.user.eventsHosted;
      document.getElementById('attended-count').innerText = myEventsData.user.eventsAttended;
      console.log("events hosted" + myEventsData.user.eventsHosted);
      console.log("events attended" + myEventsData.user.eventsAttended);

      // Populate hosted events
      const hostedContainer = document.getElementById('hosted-events-container');
      myEventsData.hostedEvents.forEach(event => {
        const card = createEventCard(event);
        hostedContainer.appendChild(card);
        hostedEventCounter++;
      });

      // Populate attended events
      const attendedContainer = document.getElementById('attended-events-container');
      myEventsData.attendedEvents.forEach(event => {
        const card = createEventCard(event);
        attendedContainer.appendChild(card);
        attendedEventCounter++;
      });
    } catch (error) {
      console.error('Error loading user events:', error);
    }
        if (myEventsData.user.eventsHosted != hostedEventCounter){
            myEventsData.user.eventsHosted = hostedEventCounter;
            document.getElementById('hosted-count').innerText = myEventsData.user.eventsHosted;
            console.log("new events hosted" + myEventsData.user.eventsHosted);
        }
        if (myEventsData.user.eventsAttended != attendedEventCounter){
            myEventsData.user.eventsAttended = attendedEventCounter;
            document.getElementById('attended-count').innerText = myEventsData.user.eventsAttended;
            console.log("new events attended" + myEventsData.user.eventsAttended);
        }

  }

  // Load events on page load
  document.addEventListener('DOMContentLoaded', loadUserEvents);