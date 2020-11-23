'use strict'

document.addEventListener('DOMContentLoaded', () => {

    ///popup map

    const popup = document.querySelector('.popup'),
          popupTrigger = document.querySelector('.aside__btn'),
          popupClose = document.querySelector('.popup__close img'),
          popupForm = document.querySelector('.popup__form'),
          popupBook = popupForm.querySelector('.popup__form button'),
          popupPhone = popupForm.querySelectorAll('.popup__form input')

    

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

    popupPhone.forEach(item => {
        item.addEventListener('input', () => checkTextInputs(popupPhone))
    })
    popupForm.addEventListener('submit', (e) => {
        e.preventDefault()
        checkTextInputs(popupPhone)
        if (!scrolling(popupPhone)) {
            alert('Fill the form correctly!')
        } else {
            alert('Form is valid!')
        }
    })

    /// form check

    const form = document.querySelector('.formfield form'),
          formSub = form.querySelector('.formfield__totalorder'),
          inputTextFields = form.querySelectorAll('#initials input '),
          inputCheckboxes = form.querySelectorAll('.checkbox'),
          inputRadioboxes = form.querySelectorAll('.radio'),
          inputSetTimeFields = form.querySelectorAll('.formfield__delivery input')

    inputTextFields.forEach(item => {
        item.addEventListener('input', () => checkTextInputs(inputTextFields))
    })

    function checkTextInputs(inputs) {
        inputs.forEach(item => {
            if (item.getAttribute('type') == 'text' && item.value.match(/[^a-zA-Zа-яА-Я\s]/)) {
                item.style.borderBottomColor = 'red'
            } else if (item.getAttribute('type') == 'phone' && item.value.match(/[^\d\+\(\)\-]/)) {
                item.style.borderBottomColor = 'red'
            } else {
                item.style.borderBottomColor = 'black'
            }
        })
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
        for (let index = 0; index < inputs.length; index++) {
            if (inputs[index].value === 'Задать') {
                if (inputs[index].getAttribute('id') === 'calendar') {
                   inputs[index].style.borderBottomColor = 'red'
                } else if (inputs[index].getAttribute('id') === 'clock'){
                   inputs[index].style.borderBottomColor = 'red'
                }
                return 
            }
        }
        inputs.forEach(input => input.style.borderBottomColor = '')
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
            return
       }
    }

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
    Date.prototype.daysInMonth = function(year, month) {
		return 33 - new Date(year, month, 33).getDate();
	};

    const calendarTrigger = document.querySelector('.calendar__icon'),
          clockTrigger = document.querySelector('.clock__icon'),
          calendar = document.querySelector('.calendar'),
          calendarLeft = document.querySelector('.calendar__left'),
          calendarRight = document.querySelector('.calendar__right'),
          clock = document.querySelector('.clock')

    calendarTrigger.addEventListener('click', (e) => {

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
        } else {
            popupMod(calendar, 'close')
        }
    })

    clockTrigger.addEventListener('click', (e) => {
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

///header

    function templateHTML() {
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
    humTrigger.addEventListener('click', (e) => {showDropMenu(e); console.log(e.target)})

    function createDropMenu() {
        const div = document.createElement('div')
        div.classList.add('drop')
        div.innerHTML = templateHTML()
        return div
    }

    function showDropMenu(e) {
        let elem
        if (!header.querySelector('.drop')) {
            elem = createDropMenu()
            header.append(elem)
        } else {
            elem = header.querySelector('.drop')
            elem.classList.remove('hide')
        }
        elem.addEventListener('click', (e) => {
            const { set } = e.target.dataset
            console.log(e.target)
            if (set === 'bg' || set === 'close' || e.target.tagName == 'A') {
                elem.classList.add('hide')
            }
        })
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


    ///MAP

    const L = require('leaflet')

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


    const fullscreenImgs = document.querySelectorAll('[data-show="full"]')
    fullscreenImgs.forEach(img => img.addEventListener('click', () => showFullScreenImg(img.src)))

    function showFullScreenImg(src) {
        const $div = document.createElement('div')
        const $newImg = document.createElement('img')
        const $close = document.createElement('div')
        $div.classList.add('bgForImg')
        $close.setAttribute('data-type', 'close')
        $newImg.src = src
        $div.append($newImg, $close)
        document.body.append($div)
        const { width, height } = window.getComputedStyle($newImg)
        const { width: w, height: h} = window.getComputedStyle(document.body)
        if (+width.replace(/\px/, '') < +w.replace(/\px/, '') / 2.5 && +height.replace(/\px/, '') < +h.replace(/\px/, '') / 2.5) {
            $newImg.style.transform = 'scale(2)'
            $newImg.style.transition = '0.25s ease-in'
            $newImg.ontransitionend = () => {
                $close.innerText = '╳'
                $close.style.left = +width.replace(/\px/, '') - 40 + 'px';
                $close.style.bottom = +height.replace(/\px/, '') - 33 + 'px';
            }
        } else {
            $close.innerText = '╳'
            $close.style.left = +width.replace(/\px/, '') / 2 - 40 + 'px';
            $close.style.bottom = +height.replace(/\px/, '') / 2 - 33 + 'px';
        }
        $div.addEventListener('click', function(e) {
            if (e.target === this || e.target === $close) {
                this.remove()
            }
        })
    }


    function getZero(num) {
        if (num < 10) return '0' + num
        return num
    }

})