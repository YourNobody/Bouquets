import { Popup } from './popup'

export function createDropMenu(html) {
    const div = document.createElement('div')
    div.classList.add('drop')
    div.innerHTML = html
    return div
}

export function showDropMenu(html, classes, dest) {
    const elem = new Popup(html, [classes])

    Popup.popupMod(elem.html, 'open', dest)

    elem.html.addEventListener('click', (e) => {
        const { set } = e.target.dataset
        if (set === 'bg' || set === 'close' || e.target.tagName == 'A') {
            Popup.popupMod(elem.html, 'close')
        }
    })
}