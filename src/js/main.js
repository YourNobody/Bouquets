'use strict'

import { Popup } from './templates/popup'
import { checkTextInputs, checkCheckboxes, checkSetTimeInputs, scrolling, findTitle } from './templates/validform'
import { setCalendar, setDaysOfPrevMonth, setDaysOfNextMonth, daysInMonth } from './templates/calendar'
import { showDropMenu } from './templates/dropmenu'
import { showFullScreenImg } from './templates/imgscreen' 
import L from 'leaflet'

document.addEventListener('DOMContentLoaded', () => {
    
    const popup = new Popup(templatePopup(), ['popup'])
    popup.find('.aside__btn').addEventListener('click', () => Popup.popupMod(popup.html, 'open', '.yandexmap'))
    popup.html.addEventListener('click', (e) => {
        if (e.target === popup.html || e.target === popup.find('.popup__close img')) {
            Popup.popupMod(popup.html, 'close')
        }
    })
    popup.find('.popup__form button').addEventListener('click', () => Popup.popupMod(popup.html, 'close'))
    document.onkeydown = (e) => {
        if (e.code == 'Escape' && !popup.html.classList.contains('hide')) { 
            Popup.popupMod(popup.html, 'close')
        }
    }
    popup.find('.popup__form input').addEventListener('input', () => checkTextInputs(popup.find('.popup__form input')))
    popup.find('.popup__form').addEventListener('click', (e) => {
        e.preventDefault()
        checkTextInputs(popupPhone)
        if (!scrolling(popupPhone)) {
            alert('Fill the form correctly!')
        } else {
            alert('Form is valid!')
        }
    })

    function templatePopup() {
        return `
        <div class="popup__dialog">
            <div class="popup__close">
                <img src="icons/close.svg">
            </div>
            <div class="popup__title">
                Заказать звонок
            </div>
            <div class="popup__text">
                Оставьте свой номер телефона, и мы перезвоним Вам.
            </div>
            <div class="popup__form">
                <form>
                    <input type="phone" name="phonePopup" id="phonePopup" required placeholder="Телефон*">
                    <button type="submit">Заказать звонок</button>
                </form>
            </div>
        </div>
        `
    }

    /// form check

    const form = document.querySelector('.formfield form'),
          inputTextFields = form.querySelectorAll('#initials input '),
          inputCheckboxes = form.querySelectorAll('.checkbox'),
          inputRadioboxes = form.querySelectorAll('.radio'),
          inputSetTimeFields = form.querySelectorAll('.formfield__delivery input')

    inputTextFields.forEach(item => {
        item.addEventListener('input', () => checkTextInputs(inputTextFields))
    })

    form.addEventListener('submit', function handler(e) {
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
    function templateCalendar() {
        return `
            <div class="calendar__top">
                <div class="calendar__left">
                    <img src="icons/left.svg">
                </div>
                <div class="calendar__month">Октябрь</div>
                <div class="calendar__right">
                    <img src="icons/right.svg">
                </div>
            </div>
            <ul class="calendar__days">
            </ul>
        `
    }

    Date.prototype.daysInMonth = daysInMonth

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

    function templateCLock() {
        return `
            <div class="clock__item"><span data-from>9:00</span data-to>-<span>12:00</span></div>
            <div class="clock__item"><span data-from>12:00</span data-to>-<span>15:00</span></div>
            <div class="clock__item"><span data-from>15:00</span data-to>-<span>18:00</span></div>
        `
    }

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

    function getZero(num) {
        if (num < 10) return '0' + num
        return num
    }

///header

    function templateMenu() {
        return `
            <div class="bg" data-set="bg"></div>
            <div class="close" data-set="close">×</div>
            <ul>
                <li><a href="#about" class="header__item">О нас</a></li>
                <li><a href="#bouquets" class="header__item">Букеты</a></li>
                <li><a href="#reviews" class="header__item">Отзывы</a></li>
                <li><a href="#payment" class="header__item">Доставка и оплата</a></li>
                <li><a href="#contacts" class="header__item">Контакты</a></li>
            </ul>
        `
    }
    
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
        moveToPrevious()
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
    function moveToPrevious() {
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

    ///MA

    const map = document.querySelector('#map')
    const mymap = L.map(map).setView([53.93023493974838, 27.588955400746784], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoieW91cm5vYm9keSIsImEiOiJja2hxa2FueXEwMTZiMzVsaDRsZ3h2ZzEwIn0.zvDPw-4w26yQXkOow24pyA', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 19,
        inZoom: 5,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoieW91cm5vYm9keSIsImEiOiJja2hxa2FueXEwMTZiMzVsaDRsZ3h2ZzEwIn0.zvDPw-4w26yQXkOow24pyA',
        center: [53.93023493974838, 27.588955400746784],
        zoomControl: false
    }).addTo(mymap)

    mymap.touchZoom.disable();
    mymap.doubleClickZoom.disable();
    mymap.scrollWheelZoom.disable();
    mymap.boxZoom.disable();
    mymap.keyboard.disable();

    const greenIcon = L.icon({
        iconUrl: 'icons/mapMarker.svg',
        iconSize:  [55, 72], // size of the icon
    })

    const marker = L.marker([53.93023493974838, 27.588955400746784], {icon: greenIcon}).addTo(mymap).bindPopup("Букеты");

    ///TO TOP
    const toTop = document.querySelector('.to__top')
    toTop.addEventListener('click', () => {
        header.scrollIntoView({block: "start", behavior: "smooth"})
    })

    ///IMGS

    const fullscreenImgs = document.querySelectorAll('[data-show="full"]')
    fullscreenImgs.forEach(img => img.addEventListener('click', () => showFullScreenImg(img.src)))
})