export class Popup {
    //создаю конструктор в котором будет html выражение и так же 
    //функция срабатывающая автоматически при создании экзмепляра
    constructor(html, classes) {
        this.html 
        this.createPopup(html, classes)
    }
    //добавляет элемент на страницу или удаляет его
    static popupMod(elem, method, destSelector) {
        const dest = document.querySelector(destSelector)
        if (method === 'open' && !dest.querySelector(`.${elem.className}`)) {
            dest.append(elem)
        } else if (method === 'close') {
            elem.remove()
        } else {
            console.log('WTF COMMAND, MAN!????')
        }
    }

    //находит элемент на странице
    find(selector) {
        let result = this.html.querySelectorAll(selector)
        if (result.length == 1) {
            return result[0]
        } else if (result.length > 1) {
            return result
        }
        result = document.querySelectorAll(selector)
        if (result.length == 1) {
            return result[0]
        } else if (result.length > 1) {
            return result
        }
        return
    }

    //создает html для страницы и записвает в свойство в конструкторе
    createPopup(html, classes) {
        const popup = document.createElement('div')
        if (classes) classes.length == 1 ? popup.classList.add(classes) : classes.forEach(cls => popup.classList.add(cls))
        popup.innerHTML = html
        this.html = popup
    } 
}