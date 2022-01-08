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

function openModal(date) {
    clicked = date;
    modal.style.display = 'block'
    // Is True if clicked day has event
    const eventForDay = events.find(e => e.date === clicked);

    if (eventForDay) {
        document.getElementById('eventText').innerText = eventForDay.title;
        deleteEventModal.style.display = 'block';

    } else {
        newEventModal.style.display = 'block';
    }

    backdrop.style.display = 'block'
}

// Function for generating the Calander layout, at first it generates the current months layout, after pressing back or next buttons it generates the proper months
function generateCalender() {
    const datetime = new Date();

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
    
    document.getElementById("month-year").innerText = `${datetime.toLocaleDateString('en-GB', {month: "long"})} ${year}`;


    cale.innerHTML = '';
    // Generates every day cell
    for(let i = 1; i <= 42; i++) {
        
        const dayNumb = i - outOffMonthDays;
        // Inserts the corrent months daySquares
        if (i > outOffMonthDays && i < numOfDays + outOffMonthDays +1) {
            cale.insertAdjacentHTML('beforeend', `<div class="month-day" id="${dayNumb}-day">${dayNumb}</div>`)
            
            const dayString = `${i - outOffMonthDays}/${month + 1}/${year}`

            const daySquare = document.getElementById(`${dayNumb}-day`);
            const eventForDay = events.find(e => e.date === dayString);

            // Highlights the current day
            if (i - outOffMonthDays === day && monthOn === 0) {
                daySquare.className = "currentDay";
            }

            if (eventForDay) {
                const eventDiv = Div = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForDay.title;
                daySquare.appendChild(eventDiv);
            }
            
            daySquare.addEventListener('click',() => {openModal(dayString);
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
    // backdrop.style.display = 'none';
    // Deletes the inputs after closing
    eventTitleInput.value = '';
    eventDateInput.value = '';
    eventStartTimeInput.value = '';
    eventEndTimeInput.value = '';
    eventTypeInput.value= '';
    eventDescriptionInput.value = '';
    clicked = null;
    errorswitch =[];
    removeElementsByClass('errorbox')
    generateCalender();
}

function saveEvent() {
    // initError()
    if (eventTitleInput.value) {
        eventTitleInput.classList.remove('error');

        events.push({
            date: clicked,
            title: eventTitleInput.value,
        });
        sessionStorage.setItem('events', JSON.stringify(events));
        closeModal();
    } else {
        eventTitleInput.classList.add('error');
    }
}

function deleteEvent() {
    events = events.filter(e => e.date !== clicked);
    sessionStorage.setItem('events', JSON.stringify(events));
    closeModal();
}

function removeElementsByClass(className){
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

// function initError() {

    
//     let titleInputCheck = eventTitleInput.value
//     console.log(`error box before ${errorBox}`);
//     if (titleInputCheck === "" || titleInputCheck.length > 50) {
//         if (errorBox !== "") {    
//             // errorBox = "";
//             removeElementsByClass('errorbox')
//             // modal.getElementsByClassName('errorbox').innerHTML = "";
//             console.log('runs');
//         }
//         else {
//             eventTitleInput.insertAdjacentHTML('beforebegin', '<div class = "errorbox">Error</div>');
//             console.log(errorBox);
//         }
//         errorBox = modal.getElementsByClassName("errorbox");
//         console.log(titleInputCheck.length);
//     } else {
//         console.log('all good');
//         console.log(titleInputCheck);
//     }
// }

function initError_v2() {

    removeElementsByClass('errorbox');
    let titleInputCheck = eventTitleInput.value
    console.log(eventDateInput.value);

    // if (titleInputCheck === "" || titleInputCheck.length > 50) {
    //     eventTitleInput.insertAdjacentHTML('beforebegin', '<div class = "errorbox">Field is required</div>')
    // } else {
    //     saveEvent();
    // }
    // if (errorswitch === false) {
    //     saveEvent();
    // }


    if (titleInputCheck === "" || titleInputCheck.length > 50) {
        eventTitleInput.insertAdjacentHTML('beforebegin', '<div class = "errorbox">Field is required</div>')
        errorswitch.push(1)
    } else {
        errorswitch.pop([0])
     }

    if(eventDateInput.value === "") {
        eventDateInput.insertAdjacentHTML('beforebegin', '<div class = "errorbox">Field is required</div>')
        errorswitch.push(1)
    } else {
        errorswitch.pop([0])
     }
    
    if(eventStartTimeInput.value === "") {
        eventStartTimeInput.insertAdjacentHTML('beforebegin', '<div class = "errorbox">Field is required</div>')
        errorswitch.push(1)
    } else {
        errorswitch.pop([0])
     }
    console.log(errorswitch)
    if (errorswitch !== true) {
        console.log('save runs')
        saveEvent();
    } else {
        // errorswitch.pop([0])
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
    document.getElementById('cancel-btn').addEventListener('click', closeModal)
    
        document.getElementById('save-btn').addEventListener('click', () => { initError_v2()    }
    )

    document.getElementById('close-btn').addEventListener('click', closeModal)
    
    document.getElementById('delete-btn').addEventListener('click', deleteEvent)
}


initButtons();
generateCalender();
