window.addEventListener('load', initimage, false);

function initimage() {

    if (document.addEventListener) {//firefox
        // alert('jest')
    } else {
        alert('brak')
    }


    ImageViewe({
        id: 'imageviewe'
    });
}


/**
 *
 * @param param
 * @returns {ImageViewe}
 * @constructor
 */
function ImageViewe(param) {

    window.cl = console.log

    if (!(this instanceof ImageViewe)) {
        return new ImageViewe(param);
    }

    this.MAX_ASPECT_RATIO = 2;
    this.MIN_ASPECT_RATIO = 1;
    this._id = param.id;
    console.log('id-------------------------------------------------------------', param.id)
    this._actual_left = '44px'      // aktualny left
    this._actual_top = '444px'      // aktualny top
    this._containerX = null;    // ekran X
    this._containerY = null;    // ekran Y
    this._imageX = null;        // orginalna szerokość obrazka
    this._imageY = null;        // orginalna wysokość obrazka
    this._aspect_taitio_image = null;
    this._actual_image_width = '100';   // aktualna szerokość obrazka
    this._actual_image_height = 100;  //    aktualna wysokość obrazka
    this._displaceX = 0;
    this._displaceY = 0;
    this._disX = .5;
    this._disY = .5;

    this._spowalniaczX = false;
    this._spowalniaczY = false;


    this._scale_image = 1;

    this._imga = null; // aktualny obrazek


    this.test = 'to jest test';
    this._top_r = 0;

    // Init Html modal code
    this.inithtml(param.id)

    // Run
    this.inite(param.id);


}


/**
 *  Oczekiwanie na kliknięcie
 */
ImageViewe.prototype.inite = function () {

    let links = document.querySelectorAll('[data-link]');

    for (let link of links) {
        link.addEventListener('click', () => {
            this.imageService(link);
        }, false)
    }

}


/**
 *
 * @param link
 *
 *  1.
 *
 */
ImageViewe.prototype.imageService = function (link) {
    console.log('link', link)


    let image = link.dataset.link;

    let modal = document.getElementById('box-' + this._id);

    modal.style.display = "block";

    let player = document.getElementById('player');
    let photo = '<img id="imga" class="image-model" src="' + image + '"  ">'
    player.innerHTML = photo;


    // image id
    let imga = document.querySelector('#imga');


    // AJAX. Czekamy na wczytanie zdjęcia
    imga.addEventListener("load", (e) => {

        console.log('imga', imga.src)
        this.title(imga.src);

        this._imga = imga;

        let _set_w_img;
        let _set_h_img;


        let contener = document.getElementById('content-' + this._id);

        this._containerX = contener.offsetWidth;  // Całkowida dostępna szerokość na ekranie
        this._containerY = contener.offsetHeight; // Całkowita dostępna wysokość na ekeranie

        // this._imageX = _imga.naturalWidth;
        // this._imageY = _imga.naturalHeight;
        this._imageX = parseInt(window.getComputedStyle(imga).width);    // image orginal X
        this._imageY = parseInt(window.getComputedStyle(imga).height);   // image orginal Y
        this._aspect_taitio_image = this._imageX / this._imageY;
        // console.log('this _mageX -------------------------------------', this._imageX)
        // console.log('this _mageY -------------------------------------', this._imageY)


        if (this._imageY >= (this._containerY - 100)) {

            _set_h_img = this._containerY - 100;   //
            _set_w_img = _set_h_img * this._aspect_taitio_image;
            this._actual_image_height = _set_h_img;
            this._actual_image_width = _set_w_img;
            imga.style.height = _set_h_img + 'px';
            imga.style.width = _set_w_img + 'px';


            this._actual_top = "50"
            this._actual_left = (this._containerX - _set_w_img) / 2;
            // this._actual_left  = (this._containerX - this._imageX)/2
            // this._actual_top = (this._containerY - this._imageY)/2

            this._actual_image_height = _set_h_img;
            this._actual_image_width = _set_w_img;


        } else {

            _set_w_img = this._imageX;
            _set_h_img = this._imageY;

            this._actual_image_height = _set_h_img;
            this._actual_image_width = _set_w_img;

            this._actual_left = (this._containerX - this._actual_image_width) / 2
            this._actual_top = (this._containerY - this._actual_image_height) / 2

        }


        imga.style.left = this._actual_left + 'px';
        imga.style.top = this._actual_top + 'px';

        // Zdjęcie zostało wyświetlone, Idzieny o operacji resize i move
        this.position(imga);
        this.imageWheel();
        this.close();
    })

}


/**
 *
 * @param imga
 *
 *  Jeśli klinięto myszą na image uruchamiana funkcja enteredPosition, oraz wyjście jeśli puszczono przycis,
 */
ImageViewe.prototype.position = function (imga) {

    let body = document.body;
    imga.style.userSelect = 'none';

    let x = this.enteredPosition.bind(this); /// !!!

    imga.addEventListener('mousedown', (ee) => {
        ee.preventDefault();
        imga.addEventListener("mousemove", x, false)
    }, false)

    body.addEventListener('mouseup', (eee) => {
        eee.preventDefault();
        imga.removeEventListener("mousemove", x, false)
    }, false)


}

/**
 *
 * @param e
 *
 *  Trzymamy przycisk na image, sprawdzamy pozycję myszy i reagujemy
 */
ImageViewe.prototype.enteredPosition = function (e) {
    e.preventDefault();
    // this._imga.style.cursor = 'move';

    if (this._containerX < this._actual_image_width) {
        let dmX = e.movementX; // delta X, mouse position
        this._actual_left += dmX;

        min_left = this._containerX - this._actual_image_width
        max_left = 0

        min_top = 0;
        max_top = this._containerY - this._actual_image_height;

        if (this._actual_left < min_left) {
            this._actual_left = min_left
        }
        if (this._actual_left > max_left) {
            this._actual_left = max_left
        }
        this._imga.style.left = this._actual_left + 'px'
    }


    if (this._containerY < this._actual_image_height) {

        let dmY = e.movementY; // delta Y, mouse position
        this._actual_top += dmY;

        min_top = this._containerY - this._actual_image_height;
        max_top = 0

        if (this._actual_top < min_top) {
            this._actual_top = min_top
        }
        if (this._actual_top > max_top) {
            this._actual_top = max_top
        }

        this._imga.style.left = this._actual_left + 'px'
        this._imga.style.top = this._actual_top + 'px'


    }

    this._spowalniaczX = true
    this._spowalniaczY = true
    // console.log('actual left----  position h-----------------', this._actual_left )
}


ImageViewe.prototype.imageWheel = function () {


    let left;
    let top;

    this._imga.addEventListener('wheel', (e) => {
        e.preventDefault();
        let delta = e.wheelDelta


        // Dla  dużych zdjęć
        if (this._containerY < this._imageY) {
            this._scale_image = this._actual_image_width / this._imageX;

            // console.log('this._displaceX1', this._displaceX)
            if (this._scale_image > this.MAX_ASPECT_RATIO && delta > 0) {
                return;
            }
            if (this._scale_image < this.MIN_ASPECT_RATIO && delta < 0 && (this._actual_image_height) <= (this._imageY - 200)) {
                return;
            }

            if (!this._spowalniaczX) {
                this._actual_image_height += delta;
                this._actual_image_width += delta * this._aspect_taitio_image;

            }


            // left


            left = (this._containerX - this._actual_image_width) / 2;


            if (this._spowalniaczX) {
                let dx = left - this._actual_left;

                if (dx < 0) {
                    dx = -dx / 10;
                    for (let i = 1; i <= dx; i++) {
                        setTimeout(function () {
                            // console.log(i)
                            if (this._actual_image_width <= this._imageX) {
                                return
                            }

                            this._actual_left -= 10
                            this._imga.style.left = this._actual_left + 'px';
                        }.bind(this), i * 2);
                    }
                } else if (dx > 0) {

                    dx = dx / 10;
                    for (let i = 1; i <= dx; i++) {
                        setTimeout(function () {
                            // console.log(i)

                            if (this._actual_image_width <= this._imageX) {
                                return
                            }
                            this._actual_left += 10
                            this._imga.style.left = this._actual_left + 'px';
                        }.bind(this), i * 2);
                    }

                }


                this._spowalniaczX = false
            } else {
                this._actual_left = left
            }


            // top


            top = (this._containerY - this._actual_image_height) / 2;

            console.log('top-----------', top)

            if (this._spowalniaczY) {
                let dy = top - this._actual_top;
                console.log('dy----------------', dy)
                if (dy < 0) {
                    dy = -dy / 10;
                    for (let i = 1; i <= dy; i++) {
                        setTimeout(function () {
                            console.log(i)
                            if (this._actual_image_height <= (this._imageY - 100)) {
                                return
                            }
                            this._actual_top -= 10
                            this._imga.style.top = this._actual_top + 'px';
                        }.bind(this), i * 2);
                    }
                } else if (dy > 0) {

                    dy = dy / 10;
                    for (let i = 1; i <= dy; i++) {
                        setTimeout(function () {
                            // console.log(i)
                            if (this._actual_image_height <= (this._imageY - 100)) {
                                return
                            }
                            this._actual_top += 10
                            this._imga.style.top = this._actual_top + 'px';
                        }.bind(this), i * 2);
                    }

                }


                this._spowalniaczY = false
            } else {
                this._actual_top = top
            }


            this._imga.style.width = this._actual_image_width + 'px';
            this._imga.style.height = this._actual_image_height + 'px';

            this._imga.style.left = this._actual_left + 'px';
            this._imga.style.top = this._actual_top + 'px';


            console.log('actual left---- well 22 ----------------', this._actual_left)

        }

        // this.dev('weel')

    }, false)
}


ImageViewe.prototype.close = function () {
    let close = document.getElementById('close-' + this._id);
    close.addEventListener('click', () => {
        let modal = document.getElementById('box-' + this._id);
        modal.style.display = null;
    }, false)
}


ImageViewe.prototype.inithtml = function (id = 'iv') {

    let cms = document.createElement('div');
    cms.setAttribute('id', 'box-' + id);
    cms.setAttribute('class', 'image-box hidden ' + id);
    document.body.appendChild(cms, document.body.firstChild);

    let cs = document.createElement('div');
    cs.setAttribute('id', 'wrapper-' + id);
    cs.setAttribute('class', 'image-wrapper');
    cms.appendChild(cs);

    let mcs = document.createElement('div');
    mcs.setAttribute('id', 'travel-' + id);
    mcs.setAttribute('class', 'image-travel');
    cs.appendChild(mcs);


    /* main*/
    let mbs = document.createElement('div');
    mbs.setAttribute('id', 'content-' + id);
    mbs.setAttribute('class', 'imager-content');
    mcs.appendChild(mbs);


    let player = document.createElement('div');
    player.setAttribute('id', 'player');  /* ! player dla youtube*/
    player.setAttribute('class', 'player');
    mbs.appendChild(player);


    let mfs = document.createElement('div');
    mfs.setAttribute('id', 'mfooter-' + id);
    mfs.setAttribute('class', 'mfooter');
    mcs.appendChild(mfs);


    let mhs = document.createElement('div');
    mhs.setAttribute('id', 'header-' + id);
    mhs.setAttribute('class', 'image-header');
    mcs.appendChild(mhs);

    let title = document.createElement('div');
    title.setAttribute('id', 'title-' + id);
    title.setAttribute('class', 'image-title');
    mhs.appendChild(title);

    // let buttons_cont = document.createElement('div');
    // buttons_cont.setAttribute('id', 'control-' + id);
    // buttons_cont.setAttribute('class', 'image-control');
    // mhs.appendChild(buttons_cont);

    let x = document.createTextNode('✕');
    let hspan = document.createElement('span');
    hspan.setAttribute('id', 'close-' + id);
    hspan.setAttribute('class', 'image-close');
    hspan.appendChild(x);
    mhs.appendChild(hspan);


}


ImageViewe.prototype.title = function (text) {


    let title = document.getElementById('title-' + this._id );
    title.innerText = text

}


ImageViewe.prototype.test = function () {
    alert(33);
}


ImageViewe.prototype.dev = function (text) {
    console.log('------------------------------------------------ ' + text + ' ----------------------------------------------------------')
    console.log('this._actual_left', this._actual_left)
    console.log('this._actual_top', this._actual_top)
    console.log('this._containerX', this._containerX)
    console.log('this._containerY', this._containerY)
    console.log('this._imageX', this._imageX)
    console.log('this._imageY', this._imageY)
    console.log('this._aspect_taitio_image', this._aspect_taitio_image)
    console.log('this._actual_image_width', this._actual_image_width)
    console.log('this._actual_image_height', this._actual_image_height)
    console.log('this._scale_image', this._scale_image)

}



























