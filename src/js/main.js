'use strict'

//импортируюет функционал с других файлов сюда
import { Popup } from './templates/popup'
import { checkTextInputs, checkCheckboxes, checkSetTimeInputs, scrolling } from './templates/validform'
import { setCalendar, daysInMonth } from './templates/calendar'
import { showDropMenu } from './templates/dropmenu'
import { showFullScreenImg } from './templates/imgscreen' 
import L from 'leaflet'

//навешиваюию обработчик события который выполнится когда дом структура будет загружена
document.addEventListener('DOMContentLoaded', () => {
    //создаю экземпляр класа всплывающего окна
    

    /// form check

    const form = document.querySelector('.formfield form'),
          inputTextFields = form.querySelectorAll('#initials input '),
          inputCheckboxes = form.querySelectorAll('.checkbox'),
          inputRadioboxes = form.querySelectorAll('.radio'),
          inputSetTimeFields = form.querySelectorAll('.formfield__delivery input'),
          inputPopup = document.querySelectorAll('#phonePopup')


    inputTextFields.forEach(item => {
        item.addEventListener('input', () => checkTextInputs(inputTextFields))
    })

    //при клике на кнопку заказать срабатывает событие 'submit', дальше идет проверка на валидность 
    form.addEventListener('submit', function handler(e) {
        e.preventDefault()
        checkCheckboxes(inputCheckboxes)
        checkCheckboxes(inputRadioboxes)
        checkSetTimeInputs(inputSetTimeFields)
        let inputs = [
            ...inputTextFields,
            ...inputCheckboxes,
            ...inputRadioboxes,
            ...inputSetTimeFields,
            ...inputPopup
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
    //создаю в прототипе объекта даты функци. получения дней в месяце
    Date.prototype.daysInMonth = daysInMonth

    //создаю экзмеляр класса
    const calendar = new Popup(templateCalendar(), ['calendar'])
        
    calendar.find('.calendar__icon').addEventListener('click', () => {
        if (!document.querySelector('.calendar')) {
            Popup.popupMod(calendar.html, 'open', '.formfield__delivery-date')
            let month = new Date().getMonth(),
                year = new Date().getFullYear(),
                countMonth = 0

            setCalendar(calendar.html, month, year)
            calendar.find('.calendar__left').addEventListener('click', () => {
                if (countMonth) {
                    countMonth--
                    month--
                    if (month == -1) {
                        month = 11
                        year--
                    }
                    setCalendar(calendar.html, month, year)
                } else {
                    setCalendar(calendar.html, month, year)
                }
            })
            calendar.find('.calendar__right').addEventListener('click', () => {
                countMonth++
                month++
                if (month % 12 == 0) {
                    month = 0
                    year++
                    setCalendar(calendar.html, month, year)
                } else {
                    setCalendar(calendar.html, month, year)
                }
            })
            calendar.find('.calendar__days').onclick = function(e) {
                if (e.target.tagName == 'LI') {
                    let inp = Array.prototype.find.call(inputSetTimeFields, i => {
                        if (i.getAttribute('id') == 'calendar') return i
                    })
                    inp.value = `${getZero(e.target.innerText)}.${getZero(month + 1)}.${year}`
                    Popup.popupMod(calendar.html, 'close')
                }
            } 
        } else {
            Popup.popupMod(calendar.html, 'close')
        }
    })


    //создаю экземпляр класса
    const clock = new Popup(templateCLock(), ['clock'])

    clock.find('.clock__icon').addEventListener('click', (e) => {
        if (!document.querySelector('.clock')) {
            Popup.popupMod(clock.html, 'open', '.formfield__delivery-time')

            clock.html.addEventListener('click', (e) => {
                let target = e.target
                while(!target.classList.contains('clock__item')) {
                    target = target.parentNode
                }
                let inp = Array.prototype.find.call(inputSetTimeFields, i => {
                    if (i.getAttribute('id') == 'clock') return i
                })
                inp.value = target.innerText
                Popup.popupMod(clock.html, 'close')
            })
        } else {
            Popup.popupMod(clock.html, 'close')
        }
    })

    //если число меньше 10 то для правильного отображения даты будет добавлен нуль
    function getZero(num) {
        if (num < 10) return '0' + num
        return num
    }

///header

    ///выпадающее меню
    const header = document.querySelector('header .container')
    const humTrigger = document.querySelector('.header__menu')
    humTrigger.addEventListener('click', () => showDropMenu(templateMenu(), ['drop'], 'header .container'))

    ///SLIDER
    const frame = document.querySelector('.reviews__main'),
          prev = document.querySelector('.reviews__left'),
          next = document.querySelector('.reviews__right'),
          slidesField = document.querySelector('.reviews__tape')

    let slideIndex = 0,
        offset = 0

    let slideWidth, slides = document.querySelectorAll('.reviews__item')

    const int = setInterval(() => {
        slideWidth = +getComputedStyle(slides[0]).width.match(/\d+/)[0]
        frame.style.width = slideWidth + 'px'
    }, 100)
    
    slidesField.style.transition = 'transform 0.3s ease-out 0s'

    prev.addEventListener('click', () => {
        moveToPrev()
        prev.onselectstart = () => false
    })
    next.addEventListener('click', () => {
        moveToNext()
        next.onselectstart = () => false
    })

    function moveToNext() {
        if (offset >= slideWidth * (slides.length - 1)) {
            offset = 0
            slideIndex = 0
            slidesField.style.transform = `translateX(${offset}px)`
        } else {
            offset += slideWidth 
            slideIndex++
            slidesField.style.transform = `translateX(-${offset}px)`
        }
    }
    function moveToPrev() {
        if (offset <= 0 ) {
            slideIndex = slides.length - 1 
            offset = slideWidth * (slides.length - 1)
            slidesField.style.transform = `translateX(-${offset}px)`
        } else {
            offset -= slideWidth 
            slideIndex--
            slidesField.style.transform = `translateX(-${offset}px)`
        }
    }

    ///MAP

    const map = document.querySelector('#map')
    const mymap = L.map(map).setView([53.93023493974838, 27.588955400746784]);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoieW91cm5vYm9keSIsImEiOiJja2hxa2FueXEwMTZiMzVsaDRsZ3h2ZzEwIn0.zvDPw-4w26yQXkOow24pyA', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 19,
        inZoom: 5,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoieW91cm5vYm9keSIsImEiOiJja2hxa2FueXEwMTZiMzVsaDRsZ3h2ZzEwIn0.zvDPw-4w26yQXkOow24pyA',
        center: [53.93023493974838, 27.588955400746784]
    }).addTo(mymap)

    mymap.touchZoom.disable()
    mymap.scrollWheelZoom.disable()
    mymap.boxZoom.disable()
    mymap.keyboard.disable()

    const greenIcon = L.icon({
        iconUrl: 'icons/mapMarker.svg',
        iconSize:  [55, 72], // size of the icon
    })

    const marker = L.marker([53.93023493974838, 27.588955400746784], {icon: greenIcon}).addTo(mymap).bindPopup("Букеты");

    ///TO TOP
    const toTop = document.querySelector('.to__top')
    toTop.addEventListener('click', () => {
        header.scrollIntoView({ block: "start", behavior: "smooth" })
    })

    ///IMGS

    const fullscreenImgs = document.querySelectorAll('[data-show="full"]')
    fullscreenImgs.forEach(img => img.addEventListener('click', () => showFullScreenImg(img.src)))
})