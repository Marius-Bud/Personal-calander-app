const cale = document.getElementById('run')

let monthOn = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const newEventModal = document.getElementById('new-event')
const backdrop = document.getElementById('modal')

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday', 'Sunday'];

const eventTitleInput = document.getElementById('eventTitleInput')

function openModal(date) {
    clicked = date;

    const eventForDay = events.find(e => e.date === clicked);

    if (eventForDay) {
        console.log('Event already exists');
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

    console.log(previosNumOfdays);

    const dateStr = startday.toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'});
    
    const outOffMonthDays = weekdays.indexOf(dateStr.split(', ')[0]);
    
    const endSquares = (outOffMonthDays + numOfDays) % 7;
    
    document.getElementById("month-year").innerText = `${datetime.toLocaleDateString('en-GB', {month: "long"})} ${year}`;


    cale.innerHTML = '';

    for(let i = 1; i <= 42; i++) {
        
        const dayNumb = i - outOffMonthDays;
        // Inserts the corrent months daySquares
        if (i > outOffMonthDays && i < numOfDays + outOffMonthDays +1) {
            cale.insertAdjacentHTML('beforeend', `<div class="month-day" id="${dayNumb}-day">${dayNumb}</div>`)

            const daySquare = document.getElementById(`${dayNumb}-day`);

            daySquare.addEventListener('click',() => openModal(`${i - outOffMonthDays}/${month + 1}/${year}`));
        }   
        // Inserts the previos months squares
            else if (i <= outOffMonthDays) {


                cale.insertAdjacentHTML('beforeend', `<div class="not-month-day">${previosNumOfdays - outOffMonthDays +i +1}</div>`)
            }
            // Fills the days after the month day ends with the next months days
            else if (i > numOfDays) {
                        cale.insertAdjacentHTML('beforeend', `<div class="not-month-day">${i - numOfDays - outOffMonthDays}</div>`);
                    }
                    
        }
        



}

function closeModal() {
    newEventModal.style.display = 'none';
    backdrop.style.display = 'none';
    eventTitleInput.value = '';
    clicked = null;
    generateCalender();
}

function initButtons() {
    document.getElementById('next-btn').addEventListener('click', () => {
        monthOn++;
        generateCalender();
    })
    document.getElementById('back-btn').addEventListener('click', () => {
        monthOn--;
        generateCalender();
    })
    document.getElementById('cancel-btn').addEventListener('click', closeModal)

    document.getElementById('save-btn', () => {})
}

initButtons()
generateCalender();

