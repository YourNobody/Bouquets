export function checkTextInputs(inputs) {
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
export function checkCheckboxes(boxes) {
    for (let index = 0; index < boxes.length; index++) {
        if (boxes[index].checked) {
            findTitle(boxes[index]).style.borderBottom = ''
            return
        }            
    }
    findTitle(boxes[0]).style.borderBottom = '1px solid red'
}
export function checkSetTimeInputs(inputs) {
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

export function scrolling(item) {
    if (item.style.borderBottomColor === 'red') {
        item.scrollIntoView({block: "center", behavior: "smooth"})
        return false
    } else if (findTitle(item).style.borderBottomColor === 'red') {
        findTitle(item).scrollIntoView({block: "center", behavior: "smooth"})
        return false
    }
    return true
}

export function findTitle(item) {
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
