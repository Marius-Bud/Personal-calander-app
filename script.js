const cale = document.getElementById('run')

let monthOn = 0;
let clicked = null;
let events = sessionStorage.getItem('events') ? JSON.parse(sessionStorage.getItem('events')) : [];

const newEventModal = document.getElementById('new-event');
const deleteEventModal = document.getElementById('deleteEventModal');
// const backdrop = document.getElementById('backdrop');
const modal = document.getElementById('modal'); 

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday', 'Sunday'];

// Event Properties
const eventTitleInput = document.getElementById('eventTitleInput');
const eventDateInput = document.getElementById('eventDateInput');
const eventStartTimeInput = document.getElementById('eventStartTimeInput');
const eventEndTimeInput = document.getElementById('eventEndTimeInput');
const eventTypeInput = document.getElementById('eventTypeInput');
const eventDescriptionInput = document.getElementById('eventDescriptionInput');

const requiredFields = [eventTitleInput, eventDateInput, eventStartTimeInput, eventEndTimeInput, eventTypeInput];

let errorBox = "";
let errorswitch = [];

let convertedDate = '';
let inputdate = '';
let myArray = [];
let myNewArray = [];

let colorClass = "";

function openModal(date) {
    document.getElementById('create-new-event').innerText = 'Close'
    clicked = date;

    eventDateInput.value = reconvertDate();
    const fix = eventDateInput.value
    // if (clicked !== null) {
    //     console.log('if runs');
    //     eventDateInput.value = reconvertDate();
    // }

    // console.log(eventDateInput.value);

    // eventDateInput.value = date;
    document.getElementById("")
    modal.style.display = 'block'
    // Is True if clicked day has event
    const eventForDay = events.find(e => e.date === clicked);


    // IF clicked on day with event displays events details
    if (eventForDay) {
        document.getElementById('eventText').innerText = `Title: ${eventForDay.title}`;
        document.getElementById('eventDate').innerText = `Date: ${eventForDay.date}`;
        document.getElementById('eventStartTime').innerText = `Starts at: ${eventForDay.start_Time}`;
        document.getElementById('eventEndTime').innerText = `Ends at: ${eventForDay.end_Time}`;
        document.getElementById('eventType').innerText = `Type: ${eventForDay.type}`;
        if (eventForDay.description !== "") {
            document.getElementById('eventDescription').innerText = `Description: ${eventForDay.description}`
        }
        deleteEventModal.style.display = 'block';

    } else {
        newEventModal.style.display = 'block';
    }

    // backdrop.style.display = 'block'
}
// CONVERTS FROM INPUT TO STORAGE PHASE 2 From YYYY-MM-DD To dD/mM/YYYY (TO MATCH STORED DATA FORMAT)
function convertDate() {
    myArray = eventDateInput.value.split('-');
    // console.log(myArray);

    let theDay = parseInt(myArray[2])
    let theMonth = parseInt(myArray[1])

    // console.log(`my array 2 ${theDay}`);
    // console.log(`my array 1 ${theMonth}`);

    const convertedDate = `${theDay}/${theMonth}/${myArray[0]}`
    // console.log(`converted date ${convertedDate}`)

    return convertedDate
}
// FROM CLICKED TO INPUT PHASE 1 from dD/mM/YYYY to YYYY-MM-DD (REQUIRED FORMAT FOR THE <INPUT> ELEMENT)
function reconvertDate() {
    // console.log(eventDateInput.value);
    // console.log(`clicked state ${clicked}`);
        if (clicked === undefined) {
            // console.log('return tries');
            return
        }
        // console.log('re runs');
        myNewArray = clicked.split('/')
        let zero1 = "";
        let zero2 ="";
        if (myNewArray[1].length === 1) {
            zero1 = "0";
        }
        if (myNewArray[0].length === 1) {
            zero2 = "0"
        } 
        let inputdate = `${myNewArray[2]}-${zero1}${myNewArray[1]}-${zero2}${myNewArray[0]}`
        return inputdate
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
    // console.log(dateStr);
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
            cale.insertAdjacentHTML('beforeend', `<div class="month-day" id="${dayNumb}-day">${dayNumb}</div>`)
            
            const dayString = `${i - outOffMonthDays}/${month + 1}/${year}`
            // const dayString = `${year}-${month + 1}-${i - outOffMonthDays}`
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
                        eventDiv.classList.add('orange')
                        break;
                    case "Call":
                        eventDiv.classList.add('greenish')
                        break;
                    case "Out of office":
                        eventDiv.classList.add('magentaish')
                        break;
                }
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForDay.title;
                daySquare.appendChild(eventDiv);
            }
            
            daySquare.addEventListener('click',() => {openModal(dayString);
                reconvertDate();
                console.log("click");});
        }   
        // Inserts the previos months squares
        else if (i <= outOffMonthDays) {
            cale.insertAdjacentHTML('beforeend', `<div class="not-month-day previos-month">${previosNumOfdays - outOffMonthDays +i +1}</div>`)
        }
        // Fills the days after the month day ends with the next months days
        else if (i > numOfDays) {
            cale.insertAdjacentHTML('beforeend', `<div class="not-month-day next-month">${i - numOfDays - outOffMonthDays}</div>`);
        }
    }
    
    
    
}

function closeModal() {
    eventTitleInput.classList.remove('error');
    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    modal.style.display= 'none';

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
    document.getElementById('create-new-event').innerText = 'Create new event'
    removeElementsByClass('errorbox')
    generateCalender();
}

    // initError()
    const converteddate = eventDateInput.value

    if (eventTitleInput.value) {
        eventTitleInput.classList.remove('error');

        events.push({
            date: clicked,
            title: eventTitleInput.value,
        });
        sessionStorage.setItem('events', JSON.stringify(events));
        console.log(eventDateInput.value)
        console.log(clicked);
        closeModal();
    } else {
        eventTitleInput.classList.add('error');
    }


function deleteEvent() {
    events = events.filter(e => e.date !== clicked);
    sessionStorage.setItem('events', JSON.stringify(events));
    closeModal();
    alert('Event has been deleted')
}

function removeElementsByClass(className){
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}


function initError_v2() {
    convertDate()
    errorswitch = [];
    removeElementsByClass('errorbox');
    let titleInputCheck = eventTitleInput.value
    console.log(eventDateInput.value);
    console.log(eventStartTimeInput.value);

    if (titleInputCheck === "" || titleInputCheck.length > 50) {
        eventTitleInput.insertAdjacentHTML('beforebegin', '<div class = "errorbox">Field is required</div>')
        errorAdd(1);
    }
    if(eventDateInput.value === "") {
        eventDateInput.insertAdjacentHTML('beforebegin', '<div class = "errorbox">Field is required</div>')
    errorAdd(1);
    }
    if(eventStartTimeInput.value === "") {
        eventStartTimeInput.insertAdjacentHTML('beforebegin', '<div class = "errorbox">Field is required</div>')
        errorAdd(1)
     }
     console.log(eventDurationValidation());
    if(eventEndTimeInput.value === "" || eventDurationValidation() === true ) {
        eventEndTimeInput.insertAdjacentHTML('beforebegin', '<div class = "errorbox">Field is required</div>')
        errorAdd(1)
     }
    if(eventTypeInput.value === "") {
        eventTypeInput.insertAdjacentHTML('beforebegin', '<div class = "errorbox">Field is required</div>')
        errorAdd(1)
    }
    eventDurationValidation();
    console.log(errorswitch)
    if (errorswitch.length === 0) {
        console.log('save runs')
        convertDate();
        saveEvent();
    } else {
        // errorswitch.pop([0])
     }
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
    // initError()
    if (eventTitleInput.value) {
        eventTitleInput.classList.remove('error');

        events.push({
            // date: clicked,
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

function errorAdd(type) {
    errorswitch.push(type)
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
    document.getElementById('cancel-btn').addEventListener('click', closeModal)
    
        document.getElementById('save-btn').addEventListener('click', () => { initError_v2()    }
    )

    document.getElementById('close-btn').addEventListener('click', closeModal)
    
    document.getElementById('delete-btn').addEventListener('click', deleteEvent)

    document.getElementById('create-new-event').addEventListener('click', bigButton)
}
// dynamic button functionality
function bigButton() {
    if (newEventModal.style.display !== 'block' && deleteEventModal.style.display !== 'none') {
    console.log('thissssss');
    document.getElementById('create-new-event').innerText = 'Create new event'
    closeModal()

} 
    else if (newEventModal.style.display !== 'block') {
        openModal();
        document.getElementById('create-new-event').innerText = 'close'
    } else if (newEventModal.style.display === 'block') {
        document.getElementById('create-new-event').innerText = 'Create new event'
        closeModal()
    }
}

initButtons();
generateCalender();
