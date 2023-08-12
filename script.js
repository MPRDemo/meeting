let content = []; // Initialize an empty array to hold the content
const storedContent = localStorage.getItem('bookedSlots');
if (storedContent) {
  content = JSON.parse(storedContent);
}

const date = new Date();
const timeSlots = [
  { time: "9:30 am - 10:00 am", booked: false, bookedBy: null },
  { time: "10:00 am - 10:30 am", booked: false, bookedBy: null },
  { time: "10:30 am - 11:00 am", booked: false, bookedBy: null },
  { time: "11:00 am - 11:30 am", booked: false, bookedBy: null },
  { time: "11:30 am - 12:00 pm", booked: false, bookedBy: null },
  { time: "12:00 pm - 12:30 pm", booked: false, bookedBy: null },
  { time: "12:30 pm - 1:00 pm", booked: false, bookedBy: null },
  { time: "1:00 pm - 1:30 pm", booked: false, bookedBy: null },
  { time: "1:30 pm - 2:00 pm", booked: false, bookedBy: null },
  { time: "2:00 pm - 2:30 pm", booked: false, bookedBy: null },
  { time: "2:30 pm - 3:00 pm", booked: false, bookedBy: null },
  { time: "3:00 pm - 3:30 pm", booked: false, bookedBy: null },
  { time: "3:30 pm - 4:00 pm", booked: false, bookedBy: null },
  { time: "4:00 pm - 4:30 pm", booked: false, bookedBy: null },
  { time: "4:30 pm - 5:00 pm", booked: false, bookedBy: null },
  { time: "5:00 pm - 5:30 pm", booked: false, bookedBy: null },
  { time: "5:30 pm - 6:00 pm", booked: false, bookedBy: null },
  { time: "6:00 pm - 6:30 pm", booked: false, bookedBy: null },
  { time: "6:30 pm - 7:00 pm", booked: false, bookedBy: null },
  { time: "7:00 pm - 7:30 pm", booked: false, bookedBy: null },
  { time: "7:30 pm - 8:00 pm", booked: false, bookedBy: null },
  { time: "8:00 pm - 8:30 pm", booked: false, bookedBy: null },
  { time: "8:30 pm - 9:00 pm", booked: false, bookedBy: null },
  { time: "9:00 pm - 9:30 pm", booked: false, bookedBy: null }
];

const teams = [
  "Info",
  "Incident",
  "Food & Procurement",
  "Security & Laundry",
  "IT",
  "Account SBHL",
  "Account AE",
  "Account RAH",
  "MPR",
  "Maintenance",
  "Care Support",
  "Training",
  "Data Analyst",
  "Developer",
  "AEX & CEX",
  "HR/GM"
];

const showDateContent = (date) => {
  const dateContent = document.getElementById("dateContent");

  // Convert the clicked date to a string in the "YYYY-MM-DD" format
  const clickedDateString = date.toISOString().split('T')[0];
  const key = `bookedSlots_${clickedDateString}`;
  const selectedSlots = JSON.parse(localStorage.getItem(key)) || [];

  const slotsHtml = timeSlots.map((slot) => {
    const slotTime = slot.time;
    const isSlotBooked = selectedSlots.some((bookedSlot) => bookedSlot.time === slotTime);
    if (isSlotBooked) {
      const bookedSlot = selectedSlots.find((bookedSlot) => bookedSlot.time === slotTime);
      return `<div class="booked-slot">${slot.time} - Booked by ${bookedSlot.team}</div>`;
    } else {
      return `<div class="time-slot" data-booked="${slot.booked}" onclick="bookSlotConfirmation('${slot.time}', '${clickedDateString}')">${slot.time}</div>`;
    }
  }).join('');

  dateContent.innerHTML = `<h2 class="date-heading">${date.toDateString()}</h2><div class="slots-container">${slotsHtml}</div>`;
  dateContent.style.display = "block";
};

const bookSlotConfirmation = (slot, date) => {
  const teamNameModal = document.getElementById('teamNameModal');
  const teamNameSelect = document.getElementById('teamNameSelect');

  // Clear selected team and show the team selection modal
  teamNameSelect.value = '';
  teamNameModal.style.display = 'block';

  // Handle submit and cancel buttons
  const teamNameSubmit = document.getElementById('teamNameSubmit');
  const teamNameCancel = document.getElementById('teamNameCancel');

  teamNameSubmit.onclick = () => {
    const selectedTeam = teamNameSelect.value;
    if (selectedTeam) {
      // Set confirmation message
      const confirmationMessage = `Do you want to book the slot: ${slot} for Team: ${selectedTeam}?`;
      document.getElementById('confirmationMessage').textContent = confirmationMessage;

      // Hide the team selection modal
      teamNameModal.style.display = 'none';

      // Show the confirmation modal
      const confirmationModal = document.getElementById('confirmationModal');
      confirmationModal.style.display = 'block';

      // Handle confirm and cancel buttons for confirmation modal
      const confirmButton = document.getElementById('confirmButton');
      const cancelButton = document.getElementById('cancelButton');

      confirmButton.onclick = () => {
        // Code to book the slot and update the UI
        bookSlot(slot, date, selectedTeam);
        confirmationModal.style.display = 'none';
      };

      cancelButton.onclick = () => {
        confirmationModal.style.display = 'none';
      };
    }
  };

  teamNameCancel.onclick = () => {
    teamNameModal.style.display = 'none';
  };
};

const bookSlot = (time, date, team) => {
  const clickedDateString = date.toISOString().split('T')[0];
  const key = `bookedSlots_${clickedDateString}`;

  // Retrieve existing booked slots for the date
  const existingSlots = JSON.parse(localStorage.getItem(key)) || [];

  // Add the booked slot and booking team to the list of existing slots
  existingSlots.push({ time, team });

  // Update local storage with the modified slots for the date
  localStorage.setItem(key, JSON.stringify(existingSlots));

  // Mark the time slot as booked
  const slotIndex = timeSlots.findIndex((slot) => slot.time === time);
  if (slotIndex !== -1) {
    timeSlots[slotIndex].booked = true;
    timeSlots[slotIndex].bookedBy = team;
  }

  // Re-render the calendar
  renderCalendar();
};

const renderCalendar = () => {
  date.setDate(1);

  const daysDiv = document.querySelector(".days");
  const monthDays = document.querySelector(".days");
  const yearLabel = document.querySelector(".year-label");
  const currentYear = date.getFullYear();
  yearLabel.querySelector("p").textContent = currentYear;

  let days = ""; 

  
  
// Click event listener for date cells
monthDays.addEventListener('click', (event) => {
  const target = event.target;
  if (target.classList.contains('prev-date') || target.classList.contains('next-date')) {
    // Clicked on a previous or next month date, handle as needed
  } else if (target.classList.contains('today')) {
    const currentDate = new Date(); // Get the current date
    showDateContent(currentDate);   // Pass the current date to the function
  } else {
    const day = parseInt(target.textContent);
    const selectedDate = new Date(date.getFullYear(), date.getMonth(), day);
    showDateContent(selectedDate); // Pass the selected date to the function
  }
});

// Click event listener for time slots
document.addEventListener('click', (event) => {
  const target = event.target;
  if (target.classList.contains('time-slot')) {
    const slot = target.textContent;
    const currentDate = new Date(); // Get the current date
    showDateContent(currentDate);   // Pass the current date to the function
    bookSlotConfirmation(slot, currentDate); // Call the confirmation function with the slot and current date
  }
});



  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  const prevLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();

  const firstDayIndex = date.getDay();

  const lastDayIndex = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();

  const nextDays = 7 - lastDayIndex - 1;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  document.querySelector(".date h1").innerHTML = months[date.getMonth()];
  yearLabel.querySelector("p").textContent = date.getFullYear();

  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDay; i++) {
    const currentDate = new Date(date.getFullYear(), date.getMonth(), i);
    const today = new Date();

    if (
      currentDate.toDateString() === today.toDateString() &&
      date.getMonth() === today.getMonth()
    ) {
      days += `<div class="today">${i}</div>`;
    } else {
      days += `<div>${i}</div>`;
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="next-date">${j}</div>`;
  }

  const currentDate = new Date();

  // Open the date container for the current date
  showDateContent(currentDate);

  monthDays.innerHTML = days;

  // Click event listener for previous year
  document.querySelector(".prev-year").addEventListener("click", () => {
    date.setFullYear(date.getFullYear() - 1);
    renderCalendar();
  });

  // Click event listener for next year
  document.querySelector(".next-year").addEventListener("click", () => {
    date.setFullYear(date.getFullYear() + 1);
    renderCalendar();
  });

};



// Click event listener for previous month
document.querySelector(".prev").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  if (date.getMonth() === 11) {
    date.setFullYear(date.getFullYear() - 1);
  }
  renderCalendar();
});

// Click event listener for next month
document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  if (date.getMonth() === 0) {
    date.setFullYear(date.getFullYear() + 1);
  }
  renderCalendar();
});

// Initial rendering of the calendar
renderCalendar();
