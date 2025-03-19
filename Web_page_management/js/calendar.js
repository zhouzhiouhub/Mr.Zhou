// Calendar.js
// This is a simple calendar implementation in JavaScript.
let simpleCurrentDate = new Date();
const simpleToday = new Date();

function renderSimpleCalendar() {
    const year = simpleCurrentDate.getFullYear();
    const month = simpleCurrentDate.getMonth();
    
    document.getElementById('simple-month-year').textContent = `${year}/${month + 1}`;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const grid = document.getElementById('simple-calendar-grid');
    grid.innerHTML = '';
    
    const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
    daysOfWeek.forEach(day => {
        const div = document.createElement('div');
        div.className = 'simple-day-name';
        div.textContent = day;
        grid.appendChild(div);
    });
    
    const prevMonthDays = firstDayOfWeek;
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    let dayCount = 0;
    
    for (let i = prevMonthDays - 1; i >= 0; i--) {
        const div = document.createElement('div');
        div.className = 'simple-day simple-other-month';
        div.textContent = prevMonthLastDay - i;
        grid.appendChild(div);
        dayCount++;
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
        const div = document.createElement('div');
        div.className = 'simple-day simple-current-month';
        div.textContent = i;
        if (year === simpleToday.getFullYear() && month === simpleToday.getMonth() && i === simpleToday.getDate()) {
            div.classList.add('simple-today');
        }
        grid.appendChild(div);
        dayCount++;
    }
    
    const totalCells = Math.ceil((prevMonthDays + daysInMonth) / 7) * 7;
    for (let i = 1; dayCount < totalCells; i++) {
        const div = document.createElement('div');
        div.className = 'simple-day simple-other-month';
        div.textContent = i;
        grid.appendChild(div);
        dayCount++;
    }
}

function simplePrevMonth() {
    simpleCurrentDate.setMonth(simpleCurrentDate.getMonth() - 1);
    renderSimpleCalendar();
}

function simpleNextMonth() {
    simpleCurrentDate.setMonth(simpleCurrentDate.getMonth() + 1);
    renderSimpleCalendar();
}

function simplePrevYear() {
    simpleCurrentDate.setFullYear(simpleCurrentDate.getFullYear() - 1);
    renderSimpleCalendar();
}

function simpleNextYear() {
    simpleCurrentDate.setFullYear(simpleCurrentDate.getFullYear() + 1);
    renderSimpleCalendar();
}

renderSimpleCalendar();
