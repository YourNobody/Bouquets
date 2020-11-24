
export function setCalendar(calendar,month, year) {
    const days = calendar.querySelector('.calendar__days')
    const months = [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь'
    ]
    calendar.querySelector('.calendar__month').innerText = months[month]
    days.innerHTML = ''
    let daysAmount = daysInMonth(year, month)
    let n = 0
    for (let i = 0; i < daysAmount; i++) {
        let li = document.createElement('li')
        li.innerText += i + 1
        days.append(li)
        if (i == 6 + (n * 7)) {
            li.style.color = 'red'
            li.previousElementSibling.style.color= 'red'
            n++
        }
    }
}

export function setDaysOfPrevMonth(calendar, month, year, countMonth) {
    if (countMonth) {
        countMonth--
        month--
        if (month == -1) {
            month = 11
            year--
        }
        setCalendar(calendar, month, year)
    } else {
        setCalendar(calendar, month, year)
    }
}

export function setDaysOfNextMonth(calendar, month, year, countMonth) {
    countMonth++
    month++
    if (month % 12 == 0) {
        month = 0
        year++
        setCalendar(calendar, month, year)
    } else {
        setCalendar(calendar, month, year)
    }
}

export function daysInMonth(year, month) {
    return 33 - new Date(year, month, 33).getDate();
}