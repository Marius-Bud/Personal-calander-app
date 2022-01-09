const cale = document.getElementById('run')

let monthOn = 0;
let clicked = null;
let events = sessionStorage.getItem('events') ? JSON.parse(sessionStorage.getItem('events')) : [];

const newEventModal = document.getElementById('new-event');
const deleteEventModal = document.getElementById('deleteEventModal');
const modal = document.getElementById('modal'); 

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday', 'Sunday'];

// Event Properties
const eventTitleInput = document.getElementById('eventTitleInput');
const eventDateInput = document.getElementById('eventDateInput');
const eventStartTimeInput = document.getElementById('eventStartTimeInput');
const eventEndTimeInput = document.getElementById('eventEndTimeInput');
const eventTypeInput = document.getElementById('eventTypeInput');
const eventDescriptionInput = document.getElementById('eventDescriptionInput');
const deleteAlert = document.getElementById('DeletePopUpBackground');

const requiredFields = [eventTitleInput, eventDateInput, eventStartTimeInput, eventEndTimeInput, eventTypeInput];

let errorswitch = [];

let convertedDate = '';
let inputdate = '';
let myArray = [];
let myNewArray = [];

let colorClass = "";

function openModal(date) {
    if (deleteEventModal.style.display !== 'none') {
        deleteEventModal.style.display = 'none';
    }
    document.getElementById('create-new-event').innerText = 'Close';
    clicked = date;

    eventDateInput.value = reconvertDate();
    const fix = eventDateInput.value;
    document.getElementById("");
    modal.style.display = 'block';
    // Is True if clicked day has event
    const eventForDay = events.find(e => e.date === clicked);


    // IF clicked on day with event displays events details
    if (eventForDay) {
        document.getElementById('eventText').innerText = ` ${eventForDay.title}`;
        document.getElementById('eventText').insertAdjacentHTML('afterbegin', '<span>Title: </span>');
        document.getElementById('eventDate').innerText = `Date: ${eventForDay.date}`;
        document.getElementById('eventDate').insertAdjacentHTML('afterbegin', '<span>Date: </span>');
        document.getElementById('eventStartTime').innerText = `${eventForDay.start_Time}`;
        document.getElementById('eventStartTime').insertAdjacentHTML('afterbegin', '<span>Starts at: </span>');
        document.getElementById('eventEndTime').innerText = `${eventForDay.end_Time}`;
        document.getElementById('eventEndTime').insertAdjacentHTML('afterbegin', '<span>Ends at: </span>');
        document.getElementById('eventType').innerText = `${eventForDay.type}`;
        document.getElementById('eventType').insertAdjacentHTML('afterbegin', '<span>Type: </span>');
        if (eventForDay.description !== "") {
            document.getElementById('eventDescription').innerText = `${eventForDay.description}`;
            document.getElementById('eventDescription').insertAdjacentHTML('afterbegin', '<span>Description: </span>');
        }
        document.getElementById('deletedEventTitle').innerText = `${eventForDay.title}`;
        deleteEventModal.style.display = 'block';

    } else {
        newEventModal.style.display = 'block';
    }
}

// Function for generating the Calander layout, at first it generates the current months layout, after pressing back or next buttons it generates the proper months

function generateCalender() {
    const datetime = new Date();
    // Nav for when switching between months
    if (monthOn !== 0) {
        datetime.setMonth(new Date().getMonth() + monthOn)
    }
    
    const day = datetime.getDate();
    const month = datetime.getMonth();
    const year = datetime.getFullYear();
    
    const numOfDays = new Date(year, month + 1, 0).getDate();
    const startday = new Date(year, month, 1);
    
    const previosNumOfdays = new Date(year, month-1, 0).getDate();
    
    const dateStr = startday.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'});
    const outOffMonthDays = weekdays.indexOf(dateStr.split(', ')[0]);
    
    const endSquares = (outOffMonthDays + numOfDays) % 7;
    // NAV month and year display
    document.getElementById("month-year").innerText = `${datetime.toLocaleDateString('en-GB', {month: "long"})} ${year}`;
    
    
    cale.innerHTML = '';
    // Generates every day cell
    for(let i = 1; i <= 42; i++) {
            
        const dayNumb = i - outOffMonthDays;
        // Inserts the corrent months daySquares
        if (i > outOffMonthDays && i < numOfDays + outOffMonthDays +1) {
            cale.insertAdjacentHTML('beforeend', `<div class="month-day" id="${dayNumb}-day"><div>${dayNumb}</div></,div>`)
            
            const dayString = `${i - outOffMonthDays}/${month + 1}/${year}`
            const daySquare = document.getElementById(`${dayNumb}-day`);
            const eventForDay = events.find(e => e.date === dayString);
            
            // Highlights the current day
            if (i - outOffMonthDays === day && monthOn === 0) {
                daySquare.className = "currentDay";
            }
            // Ads div for day square with event 
            const eventDiv = Div = document.createElement('div');
            if (eventForDay) {
                switch (eventForDay.type) {
                    case "Meeting":
                        eventDiv.classList.add('orange');
                        break;
                    case "Call":
                        eventDiv.classList.add('greenish');
                        break;
                    case "Out of office":
                        eventDiv.classList.add('magentaish');
                        break;
                }
                eventDiv.classList.add('event');
                
                if (eventForDay.title.length > 18) {
                    const shortenedTitle = (eventForDay.title).slice(0, 18);
                    eventDiv.innerText = `${shortenedTitle}...`;
                } else {
                        eventDiv.innerText = eventForDay.title;
                    }
                    daySquare.appendChild(eventDiv);
                }
                
                daySquare.addEventListener('click',() => {
                        if (document.getElementById('new-event').style.display === 'block') {
                            document.getElementById('new-event').style.display = 'none';
                        }
            openModal(dayString);
            reconvertDate();
            });
        }   
        // Inserts the previos months squares
        else if (i <= outOffMonthDays) {
            cale.insertAdjacentHTML('beforeend', `<div class="not-month-day previos-month"></div>`);
        }
        // Fills the days after the month day ends with the next months days
        else if (i > numOfDays) {
            cale.insertAdjacentHTML('beforeend', `<div class="not-month-day next-month"></div>`);
        }
    }
}
    
    // Closes side windows and resets all the trigger values to default 
    function closeModal() {
        eventTitleInput.classList.remove('error');
        newEventModal.style.display = 'none';
        deleteEventModal.style.display = 'none';
        modal.style.display= 'none';
        deleteAlert.style.display= 'none';
        
        // Deletes the inputs after closing
        eventTitleInput.value = '';
        eventDateInput.value = '';
        eventStartTimeInput.value = '';
        eventEndTimeInput.value = '';
        eventTypeInput.value= '';
        eventDescriptionInput.value = '';
        clicked = null;
        errorswitch =[];
        convertedDate = '';
        inputdate = '';
        myArray = [];
        myNewArray = [];
        document.getElementById('create-new-event').innerText = 'Create new event';
        removeElementsByClass('errorbox');
        generateCalender();
    }
    
    const converteddate = eventDateInput.value;
    
    if (eventTitleInput.value) {
        
        events.push({
            date: clicked,
            title: eventTitleInput.value,
        });
        sessionStorage.setItem('events', JSON.stringify(events));
        closeModal();
    } 
    
    // For deleting existing events from the calendar and SessionStorage
    function deleteEvent() {
        events = events.filter(e => e.date !== clicked);
        sessionStorage.setItem('events', JSON.stringify(events));
        deleteAlert.style.display = 'block';
    }
    
    // Error handeling before saving to maeke sure everything is in the correct format 
    function initError_v2() {
        convertDate();
        errorswitch = [];
        removeElementsByClass('errorbox');
        let titleInputCheck = eventTitleInput.value;
        console.log(eventDateInput.value);
        console.log(eventStartTimeInput.value);
        
        if (titleInputCheck === "") {
            eventTitleInput.insertAdjacentHTML('beforebegin', '<div class = "errorbox">Field is required</div>');
            errorAdd(1);
        } else if (titleInputCheck.length > 50) {
                eventTitleInput.insertAdjacentHTML('beforebegin', '<div class = "errorbox">Title too long</div>');
                errorAdd(1);
            }
            if(eventDateInput.value === "") {
                eventDateInput.insertAdjacentHTML('beforebegin', '<div class = "errorbox">Field is required</div>');
                errorAdd(1);
            }
            if(eventStartTimeInput.value === "") {
                eventStartTimeInput.insertAdjacentHTML('beforebegin', '<div class = "errorbox">Field is required</div>');
                errorAdd(1);
            }
            console.log(eventDurationValidation());
            if(eventEndTimeInput.value === "") {
                eventEndTimeInput.insertAdjacentHTML('beforebegin', '<div class = "errorbox">Field is required</div>');
                errorAdd(1);
            } else if (eventDurationValidation() === true) {
                eventEndTimeInput.insertAdjacentHTML('beforebegin', '<div class = "errorbox">Invalid time: End is before start</div>');
                errorAdd(1);
            }
            if(eventTypeInput.value === "") {
                eventTypeInput.insertAdjacentHTML('beforebegin', '<div class = "errorbox">Field is required</div>');
                errorAdd(1);
            }
            eventDurationValidation();
            if (errorswitch.length === 0) {
                convertDate();
                saveEvent();
            } else {
            }
        }
        // Function for counting errors for invalid fields while filling in the new event Form
        function errorAdd(type) {
            errorswitch.push(type);
        }
        
        // For removing Error pop ups while filling in the form
        function removeElementsByClass(className){
            const elements = document.getElementsByClassName(className);
            while(elements.length > 0){
                elements[0].parentNode.removeChild(elements[0]);
            }
        }
        // CONVERTS FROM INPUT TO STORAGE PHASE 2 From YYYY-MM-DD To dD/mM/YYYY (TO MATCH STORED DATA FORMAT)
        function convertDate() {
            myArray = eventDateInput.value.split('-');
            
            let theDay = parseInt(myArray[2]);
            let theMonth = parseInt(myArray[1]);
            const convertedDate = `${theDay}/${theMonth}/${myArray[0]}`;
            return convertedDate
        }
        // FROM CLICKED TO INPUT PHASE 1 from dD/mM/YYYY to YYYY-MM-DD (REQUIRED FORMAT FOR THE <INPUT> ELEMENT)
        function reconvertDate() {
            if (clicked === undefined) {
                console.log('return tries');
                eventDateInput.value = "";
                return
            }
            myNewArray = clicked.split('/');
            let zero1 = "";
            let zero2 ="";
            if (myNewArray[1].length === 1) {
                    zero1 = "0";
                }
                if (myNewArray[0].length === 1) {
                    zero2 = "0";
                } 
                let inputdate = `${myNewArray[2]}-${zero1}${myNewArray[1]}-${zero2}${myNewArray[0]}`;
                return inputdate
        }
        
        function eventDurationValidation() {
            const startTime = (eventStartTimeInput.value).split(':');
            const endTime = (eventEndTimeInput.value).split(':');
            if (parseInt(endTime[0]) < parseInt(startTime[0])) {
                return true
            } else if (endTime[0] === startTime[0]) {
                if (parseInt(endTime[1]) < parseInt(startTime[1])) {
                    return true
                } else {
                    return false
                }
            } else {
                return false;
            }
        }

function saveEvent() {
    if (eventTitleInput.value) {
        eventTitleInput.classList.remove('error');

        events.push({
            // all the input values to be saved in sessionStorrage
            date: convertDate(),
            title: eventTitleInput.value,
            start_Time: eventStartTimeInput.value,
            end_Time: eventEndTimeInput.value,
            type: eventTypeInput.value,
            description: eventDescriptionInput.value,
        });
        sessionStorage.setItem('events', JSON.stringify(events));
        closeModal();
    } else {
        eventTitleInput.classList.add('error');
    }
}

function initButtons() {
    // Nav Buttons
    document.getElementById('next-btn').addEventListener('click', () => {
        monthOn++;
        generateCalender();
    })
    document.getElementById('back-btn').addEventListener('click', () => {
        monthOn--;
        generateCalender();
    })

    // Module Buttons
    document.getElementById('cancel-btn').addEventListener('click', closeModal);
    
        document.getElementById('save-btn').addEventListener('click', () => { initError_v2();   }
    )

    document.getElementById('close-btn').addEventListener('click', closeModal);
    
    document.getElementById('delete-btn').addEventListener('click', deleteEvent);

    document.getElementById('create-new-event').addEventListener('click', bigButton);

    document.getElementById('ok-btn').addEventListener('click', closeModal);
}
// dynamic button functionality
function bigButton() {
    if (newEventModal.style.display !== 'block' && deleteEventModal.style.display !== 'none') {
    console.log('thissssss');
    document.getElementById('create-new-event').innerText = 'Create new event';
    closeModal();

} 
    else if (newEventModal.style.display !== 'block') {
        openModal();
        document.getElementById('create-new-event').innerText = 'close';
    } else if (newEventModal.style.display === 'block') {
        document.getElementById('create-new-event').innerText = 'Create new event';
        closeModal();
    }
}

initButtons();
generateCalender();
