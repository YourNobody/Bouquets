'use strict'

///mapLoading

// function loadMap(mapSrc) {
//     let height
//     if (window.matchMedia("(max-width: 750px)").matches) {
//         height = 450
//     } else if (window.matchMedia("(max-width: 500px)").matches) {
//         height = 320
//     } else {
//         height = 720
//     }
//     let mapSrcAdd = mapSrc.replace(/height=(\d+)/, `height=${height}`)
//     document.querySelector('.yandexmap__map').innerHTML = `
//         <script type="text/javascript" charset="utf-8" async style="display: block;"
//         src='https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A0357700ef4d32a70f8b8d17ae8ebea8fea06779420492f591a37cfb955ff9c9c&amp;width=100%25&amp;height=720&amp;lang=ru_RU&amp;scroll=false'>
//         </script>
//     `
//     console.log(document.querySelector('.yandexmap__map').innerHTML)
//     console.dir(document.querySelector('.yandexmap__map'))
// }

// loadMap("https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A0357700ef4d32a70f8b8d17ae8ebea8fea06779420492f591a37cfb955ff9c9c&amp;width=100%25&amp;height=720&amp;lang=ru_RU&amp;scroll=false")

document.addEventListener('DOMContentLoaded', () => {
    ///popup map

    const popup = document.querySelector('.popup'),
          popupTrigger = document.querySelector('.aside__btn'),
          popupClose = document.querySelector('.popup__close img'),
          popupBook = document.querySelector('.popup__form button')

    popupTrigger.addEventListener('click', () => {
        popupMod(popup, 'open')
        
        popup.addEventListener('click', (e) => {
            if (e.target === popup || e.target == popupClose) {
                popupMod(popup, 'close')
            }
        })
        popupBook.addEventListener('click', () => {
            popupMod(popup, 'close')
        })
    })

    document.onkeydown = (e) => {
        if (e.code == 'Escape' && !popup.classList.contains('hide')) { 
            popupMod('close')
        }
    }

    function popupMod(elem, method) {
        if (method === 'open') {
            elem.classList.remove('hide')
        } else if (method === 'close') {
            elem.classList.add('hide')
        }
    }


    /// form check

    const form = document.querySelector('.formfield form'),
          inputTextFields = form.querySelectorAll('.formfield__fullinput input'),
          inputCheckboxes = form.querySelectorAll('.checkbox'),
          inputRadioboxes = form.querySelectorAll('.radio'),
          inputSetTimeFields = form.querySelectorAll('.formfield__delivery input')

    inputTextFields.forEach(item => {
        item.addEventListener('input', () => checkTextInputs(inputTextFields))
    })

    function checkTextInputs(inputs) {
        inputs.forEach(item => {
            if (item.getAttribute('type') == 'text' && item.value.match(/[^a-zA-Z\s]/)) {
                item.style.boxShadow = '0 0 5px red'
            } else if (item.getAttribute('type') == 'phone' && item.value.match(/[^\d\+\(\)\-]/)) {
                item.style.boxShadow = '0 0 5px red'
            } else {
                item.style.boxShadow = ''
            }
        })
    }
    function checkCheckboxes(boxes) {
        for (let index = 0; index < boxes.length; index++) {
            if (boxes[index].checked) {
                findTitle(boxes[index]).style.boxShadow = ''
                return
            }            
        }
        findTitle(boxes[0]).style.boxShadow = '0 0 5px red'
    }
    function checkSetTimeInputs(inputs) {
        for (let index = 0; index < inputs.length; index++) {
            if (inputs[index].value == 'Задать') {
                if (inputs[index].getAttribute('id') == 'calendar') {
                    findTitle(inputs[index]).style.boxShadow = '0 0 5px red'
                } else if (inputs[index].getAttribute('id') == 'clock'){
                    findTitle(inputs[index]).style.boxShadow = '0 0 5px red'
                }
            }
        }
        inputs.forEach(input => findTitle(input).style.boxShadow = '')
    }

    function scrolling(item) {
        if (item.style.boxShadow) {
            item.scrollIntoView({block: "center", behavior: "smooth"})
            return false
        } else if (findTitle(item).style.boxShadow) {
            findTitle(item).scrollIntoView({block: "center", behavior: "smooth"})
            return false
        }
        return true
    }

    function findTitle(item) {
       try {
            while (!item.classList.contains('title')) {
                item = item.parentNode
                Array.prototype.forEach.call(item.children, i => {
                    if (i.classList.contains('title')) item = i
                })
            }
            return item
       } catch (err) {
            return
       }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        checkCheckboxes(inputCheckboxes)
        checkCheckboxes(inputRadioboxes)
        checkSetTimeInputs(inputSetTimeFields)
        let inputs = [
            ...inputTextFields,
            ...inputCheckboxes,
            ...inputRadioboxes,
            ...inputSetTimeFields
        ]
        let count = 0
        for (let i = 0; i < inputs.length; i++) {
            if (!scrolling(inputs[i])) {
                alert('Fill the form correctly!')
                break
            } else {
                count++
            }
        }
        if (count == inputs.length) alert('Form is valid!')
    })


    ///Drop menu
    Date.prototype.daysInMonth = function(year, month) {
		return 33 - new Date(year, month, 33).getDate();
	};

    const calendarTrigger = document.querySelector('.calendar__icon'),
          clockTrigger = document.querySelector('.clock__icon'),
          calendar = document.querySelector('.calendar'),
          calendarLeft = document.querySelector('.calendar__left'),
          calendarRight = document.querySelector('.calendar__right'),
          clock = document.querySelector('.clock')

    calendarTrigger.addEventListener('click', () => {
        if (calendar.classList.contains('hide')) {
                popupMod(calendar, 'open')
            let month = new Date().getMonth(),
                year = new Date().getFullYear(),
                countMonth = 0

            setCalendar(month, year)
            calendarLeft.addEventListener('click', () => {
                if (countMonth) {
                    countMonth--
                    month--
                    if (month == -1) {
                        month = 11
                        year--
                    }
                    setCalendar(month, year)
                } else {
                setCalendar(month, year) 
                }
                
            })
            calendarRight.addEventListener('click', () => {
                countMonth++
                month++
                if (month % 12 == 0) {
                    month = 0
                    year++
                    setCalendar(month, year)
                } else {
                    setCalendar(month, year)
                }
            })
            calendar.addEventListener('click', (e) => {
                if (e.target == document) {
                    popupMod(calendar, 'close')
                }
            })
        } else {
            popupMod(calendar, 'close')
        }
    })

    clockTrigger.addEventListener('click', () => {
        if (clock.classList.contains('hide')) {
            popupMod(clock, 'open')

            clock.addEventListener('click', (e) => {
                let target = e.target
                while(!target.classList.contains('clock__item')) {
                    target = target.parentNode
                }
                let inp = Array.prototype.find.call(inputSetTimeFields, i => {
                    if (i.getAttribute('id') == 'clock') return i
                })
                inp.value = target.innerText
                popupMod(clock, 'close')
            })
        } else {
            popupMod(clock, 'close')
        }
    })

    function setCalendar(month, year) {
        const days = document.querySelector('.calendar__days')
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
        document.querySelector('.calendar__month').innerText = months[month]
        days.innerHTML = ''
        let daysAmount = Date.prototype.daysInMonth(year, month)
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
        n = 0
        days.onclick = function(e) {
            if (e.target.tagName == 'LI') {
                let inp = Array.prototype.find.call(inputSetTimeFields, i => {
                    if (i.getAttribute('id') == 'calendar') return i
                })
                inp.value = `${getZero(e.target.innerText)}.${getZero(month + 1)}.${year}`
                popupMod(calendar, 'close')
            }
        } 
    }

})

function getZero(num) {
    if (num < 10) return '0' + num
    return num
}
