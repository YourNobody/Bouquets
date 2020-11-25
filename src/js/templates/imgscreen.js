export function showFullScreenImg(src) {
    const $div = document.createElement('div')
    const $newImg = document.createElement('img')
    const $close = document.createElement('div')

    $div.classList.add('bgForImg')
    $div.style.overflow = 'hidden'
    $close.setAttribute('data-type', 'close')
    $newImg.src = src
    $newImg.style.borderRadius = '20px'

    $div.append($newImg, $close)
    document.body.append($div)

    const { width, height } = window.getComputedStyle($newImg)
    const { width: w, height: h} = window.getComputedStyle(document.body)

    let factor
    console.log(+h.replace(/\px/, ''), +w.replace(/\px/, ''))
    if (+width.replace(/\px/, '') < +w.replace(/\px/, '') / 3.7 && +height.replace(/\px/, '') < +h.replace(/\px/, '') / 3.7) {
        factor = 2.5
        changeSize($newImg, $close, width, height, factor)
    } else if (+width.replace(/\px/, '') < +w.replace(/\px/, '') / 3.2 && +height.replace(/\px/, '') < +h.replace(/\px/, '') / 3.2) {
        factor = 2.1
        changeSize($newImg, $close, width, height, factor)
    } else if (+width.replace(/\px/, '') < +w.replace(/\px/, '') / 2.5 && +height.replace(/\px/, '') < +h.replace(/\px/, '') / 2.5) {
        factor = 1.7
        changeSize($newImg, $close, width, height, factor)
    } else if (+width.replace(/\px/, '') < +w.replace(/\px/, '') / 2 && +height.replace(/\px/, '') < +h.replace(/\px/, '') / 2) {
        factor = 1.3
        changeSize($newImg, $close, width, height, factor)
    } else if (+width.replace(/\px/, '') < +w.replace(/\px/, '') / 1.7 && +height.replace(/\px/, '') < +h.replace(/\px/, '') / 1.7) {
        factor = 1.15
        changeSize($newImg, $close, width, height, factor)
    } else if (+width.replace(/\px/, '') > +w.replace(/\px/, '') * 0.85 || +height.replace(/\px/, '') > +h.replace(/\px/, '') * 0.85) {
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
    $newImg.ontransitionend = () => {
        $close.innerText = '╳'
        $close.style.left = +width.replace(/\px/, '') / 2 * factor- 40 + 'px';
        $close.style.bottom = +height.replace(/\px/, '') / 2 * factor - 33 + 'px';
    }
}