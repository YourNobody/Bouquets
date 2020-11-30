'use strict'

//импортируюет функционал карты
import L from 'leaflet'

//данное событие срабатывает когда DOM-дерево загружено
document.addEventListener('DOMContentLoaded', () => {
    //создаю всплывающее окно
    const $dropMenuTrigger = document.querySelector('.header__menu')
    const $dropMenu = document.querySelector('.drop')

    $dropMenuTrigger.addEventListener('click', () => popupToggle($dropMenu, 'open'))

    $dropMenu.addEventListener('click', (e) => {
        const { set } = e.target.dataset
        if (set === 'bg' || set === 'close') popupToggle($dropMenu, 'close')
        else if (e.target.tagName === 'A') popupToggle($dropMenu, 'close')
    })

    function popupToggle(elem, method) {
        if (!elem) return 'Element is not defined'
        
        if (method === 'open') elem.classList.remove('hide')
        else if (method === 'close') elem.classList.add('hide')
        else return 'Choose the correct method'
    }

    const $popup = document.querySelector('.popup'),
          $popupTrigger = document.querySelector('.aside__btn'),
          $popupClose = document.querySelector('.popup__close img')

    $popupTrigger.addEventListener('click', () => {
        popupToggle($popup, 'open')

        document.onkeydown = (e) => {
            if (e.code == 'Escape' && !$popup.classList.contains('hide')) { 
                popupToggle($popup, 'close')
            }
        }
    
    })

    $popup.addEventListener('click', (e) => {
        if (e.target === $popup || e.target == $popupClose) {
            popupToggle($popup, 'close')
        }
    })

    /// form check

    const formMain = document.querySelector('.formfield form'),
          formPopup = document.querySelector('.popup__form form'),
          inputTextFields = formMain.querySelectorAll('#initials input '),
          inputCheckboxes = formMain.querySelectorAll('.checkbox'),
          inputRadioboxes = formMain.querySelectorAll('.radio'),
          inputSetTimeFields = formMain.querySelectorAll('.formfield__delivery input'),
          inputPopup = document.querySelectorAll('#phone-popup')


    inputTextFields.forEach(item => {
        item.addEventListener('input', () => checkTextInputs(item))
    })

    inputPopup.forEach(item => {
        item.addEventListener('input', () => checkTextInputs(item))
    })

    //при клике на кнопку заказать срабатывает событие 'submit', дальше идет проверка на валидность 

    function checkTextInputs(input) {
        if (input.getAttribute('type') === 'text' && input.value.match(/[^a-zA-Zа-яА-Я\s]/)) {
            input.style.borderBottomColor = 'red'
        } else if (input.getAttribute('type') === 'phone' && input.value.match(/[^\d\+\(\)\-]/)) {
            console.log('fffff')
            console.log(input)
            input.style.borderBottomColor = 'red'
        } else {
            input.style.borderBottomColor = 'black'
        }
    }
    function checkCheckboxes(boxes) {
        for (let index = 0; index < boxes.length; index++) {
            if (boxes[index].checked) {
                findTitle(boxes[index]).style.borderBottom = ''
                return
            }            
        }
        findTitle(boxes[0]).style.borderBottom = '1px solid red'
    }
    function checkSetTimeInputs(inputs) {
        let count = 0
        for (let index = 0; index < inputs.length; index++) {
            let { set } = inputs[index].dataset
            if (inputs[index].value === 'Задать' && set === 'settime') {
                inputs[index].style.borderBottomColor = 'red'
                count++
            }
        }
        if (count > 0) return
        inputs.forEach(item => item.style.borderBottomColor = 'black') 
    }
    
    function scrolling(item) {
        if (item.style.borderBottomColor === 'red') {
            item.scrollIntoView({block: "center", behavior: "smooth"})
            return false
        } else if (findTitle(item).style.borderBottomColor === 'red') {
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
            return document.body
       }
    }

    formMain.addEventListener('submit', (e) => {
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
        if (count == inputs.length) {
            alert('Form is valid!')
            e.target.reset()
        }
    })

    formPopup.addEventListener('submit', (e) => {
        e.preventDefault()
        let inputs = [...inputPopup]
        let count = 0
        for (let i = 0; i < inputs.length; i++) {
            if (!scrolling(inputs[i])) {
                alert('Fill the form correctly!')
                break
            } else {
                count++
            }
        }
        if (count == inputs.length) {
            popupToggle($popup, 'close')
            e.target.reset()
        }
    })



    ///Drop menu
    //создаю в прототипе объекта даты функци. получения дней в месяце
    Date.prototype.daysInMonth = function(year, month) {
		return 33 - new Date(year, month, 33).getDate()
	}

    const $calendarTrigger = document.querySelector('.calendar__icon'),
          $clockTrigger = document.querySelector('.clock__icon'),
          $calendar = document.querySelector('.calendar'),
          $calendarLeft = document.querySelector('.calendar__left'),
          $calendarRight = document.querySelector('.calendar__right'),
          $clock = document.querySelector('.clock')

    $calendarTrigger.addEventListener('click', () => {
        if ($calendar.classList.contains('hide')) {
                popupToggle($calendar, 'open')
            let month = new Date().getMonth(),
                year = new Date().getFullYear(),
                countMonth = 0

            setCalendar(month, year)
            $calendarLeft.addEventListener('click', () => {
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
            $calendarRight.addEventListener('click', () => {
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
            $calendar.addEventListener('click', (e) => {
                if (e.target == document) {
                    popupToggle($calendar, 'close')
                }
            })
        } else {
            popupToggle($calendar, 'close')
        }
    })

    $clockTrigger.addEventListener('click', () => {
        if ($clock.classList.contains('hide')) {
            popupToggle($clock, 'open')

            $clock.addEventListener('click', (e) => {
                let target = e.target
                while(!target.classList.contains('clock__item')) {
                    target = target.parentNode
                }
                let inp = Array.prototype.find.call(inputSetTimeFields, i => {
                    if (i.getAttribute('id') == 'clock') return i
                })
                inp.value = target.innerText
                popupToggle($clock, 'close')
            })
        } else {
            popupToggle($clock, 'close')
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
        days.onclick = function(e) {
            if (e.target.tagName === 'LI') {
                let inp = Array.prototype.find.call(inputSetTimeFields, i => {
                    if (i.getAttribute('id') === 'calendar') return i
                })
                inp.value = `${getZero(e.target.innerText)}.${getZero(month + 1)}.${year}`
                popupToggle($calendar, 'close')
            }
        } 
    }

    function getZero(num) {
        if (num < 10) return '0' + num
        return num
    }


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
    const mymap = L.map(map).setView([53.93023493974838, 27.588955400746784], 13);

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
        document.querySelector('header').scrollIntoView({ block: "start", behavior: "smooth" })
    })

    ///IMGS

    const fullscreenImgs = document.querySelectorAll('[data-show="full"]')
    fullscreenImgs.forEach(img => img.addEventListener('click', () => showFullScreenImg(img.src)))

    function showFullScreenImg(src) {
        const $div = document.createElement('div')
        const $newImg = document.createElement('img')
        const $close = document.createElement('div')
    
        $div.classList.add('bgForImg')
        $newImg.src = src
        $newImg.style.borderRadius = '20px'
        $close.className = 'img-close'
    
        $div.append($newImg, $close)  
        document.body.append($div)
    
        const { width, height } = window.getComputedStyle($newImg)
        const { width: w, height: h} = window.getComputedStyle(document.body)
    
        let factor

        if (+width.replace('px', '') < +w.replace('px', '') / 3.7 && +height.replace('px', '') < +h.replace('px', '') / 3.7) {
            factor = 2.5
            changeSize($newImg, $close, width, height, factor)
        } else if (+width.replace('px', '') < +w.replace('px', '') / 3.2 && +height.replace('px', '') < +h.replace('px', '') / 3.2) {
            factor = 2.1
            changeSize($newImg, $close, width, height, factor)
        } else if (+width.replace('px', '') < +w.replace('px', '') / 2.5 && +height.replace('px', '') < +h.replace('px', '') / 2.5) {
            factor = 1.7
            changeSize($newImg, $close, width, height, factor)
        } else if (+width.replace('px', '') < +w.replace('px', '') / 2 && +height.replace('px', '') < +h.replace('px', '') / 2) {
            factor = 1.3
            changeSize($newImg, $close, width, height, factor)
        } else if (+width.replace('px', '') < +w.replace('px', '') / 1.7 && +height.replace('px', '') < +h.replace('px', '') / 1.7) {
            factor = 1.15
            changeSize($newImg, $close, width, height, factor)
        } else if (+width.replace('px', '') > +w.replace('px', '') * 0.85 || +height.replace('px', '') > +h.replace('px', '') * 0.85) {
            factor = 0.85
            changeSize($newImg, $close, width, height, factor)
        } else {
            changeSize($newImg, $close, width, height)
        }
        $div.addEventListener('click', function(e) {
            if (e.target === this || e.target === $close) {
                this.remove()
            }
        })
    }
    
    function changeSize($newImg, $close, width, height, factor = 1) {
        $newImg.style.transform = `scale(${factor})`
        $newImg.style.transition = '0.25s ease-in'
        $newImg.style.opacity= 1
        $newImg.addEventListener('transitionend', () => {
            $close.innerText = '╳'
            $close.style.left = +width.replace(/px/, '') / 2 * factor - 40 + 'px';
            $close.style.bottom = +height.replace(/px/, '') / 2 * factor - 33 + 'px';
        })
    }
})

