export class Popup {
    constructor(html, classes) {
        this.html 
        
        this.createPopup(html, classes)
    }
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

    createPopup(html, classes) {
        const popup = document.createElement('div')
        if (classes) classes.length == 1 ? popup.classList.add(classes) : classes.forEach(cls => popup.classList.add(cls))
        popup.innerHTML = html
        this.html = popup
    } 
}