/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */

import AppModel from '../models/appModels';
import AppView from '../view/appView';

export default class App {
  constructor(value) {
    this.value = value;
  }


  start() {
    const model = new AppModel();
    const view = new AppView();

    let ctxWidth;
    let element = 0;
    let fps = 13;
    let timerID;
    let zindex = 1;
    let scale = 5;
    let widthCanvas = 128;
    let myColor = 'black';

    view.drawInformationCanvac(element, widthCanvas);
    view.resizeCanvas(element, scale, widthCanvas);

    const rng = document.getElementById('r1');
    const i1 = document.getElementById('i1');
    i1.value = `${rng.value} fps`;

    const colorCurrent = document.querySelector('.first-current-color');
    colorCurrent.addEventListener('input', function () {
      myColor = this.value;
      model.drawPen(ctxWidth, myColor, element);
    });


    // view.drawKlektis(element, scale, widthCanvas);
    model.cloneCanvas(element);

    document.querySelector('.pen').addEventListener('click', () => {
      model.drawPen(ctxWidth, myColor, element);
    });

    document.querySelector('.draw-line').addEventListener('click', () => {
      model.drawLine(ctxWidth, myColor, element);
    });

    document.querySelector('.add-frame').addEventListener('click', () => {
      const menuFrame = document.querySelector('.menu-frame');
      element = menuFrame.children.length - 1;
      view.drawWrapperCanvas(element);

      view.resizeCanvas(element, scale, widthCanvas);
      model.cloneCanvas(element);
      const arrayPicktures = model.getFrames();
      model.clearAnimation(timerID);
      timerID = model.animation(arrayPicktures, fps);
    });

    document.getElementById('r1').addEventListener('input', () => {
      i1.value = `${rng.value} fps`;
      fps = rng.value;
      const arrayPicktures = model.getFrames();
      model.clearAnimation(timerID);
      timerID = model.animation(arrayPicktures, fps);
    });


    const btnContainer = document.querySelector('.pencil-width');
    const btns = btnContainer.getElementsByClassName('wrapper-width');
    console.log('btns', btns);
    // Loop through the buttons and add the active class to the current/clicked button
    for (let i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        ctxWidth = i + 1;
        model.drawPen(ctxWidth, myColor, element);
        const current = document.getElementsByClassName('active');
        if (current.length > 0) {
          current[0].className = current[0].className.replace(' active', '');
        }
        this.className += ' active';
      });
    }

    document.querySelector('.full-screen').addEventListener('click', () => {
      const canvas = document.querySelector('.canvas-animation');
      function fullScreen(elem) {
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitrequestFullscreen) {
          elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullscreen) {
          elem.mozRequestFullScreen();
        }
      }
      fullScreen(canvas);
    });

    const miniCanvasWrapper = document.querySelector('.menu-frame');
    miniCanvasWrapper.addEventListener('click', (e) => {
      const arrayBasket = document.getElementsByClassName('icon-trash');
      const canvasWrapper = document.getElementsByClassName('canvas-wrapper');
      const arrayCanvas = document.querySelectorAll('.field-paint');
      const fieldCanvas = document.querySelector('.wrapper-field-paint');
      Array.from(arrayBasket).forEach((el, index) => {
        if (e.target === el) {
          miniCanvasWrapper.removeChild(canvasWrapper[index]);
          Array.from(arrayCanvas).forEach((el1, index1) => {
            if (index === index1) {
              fieldCanvas.removeChild(el1);
            }
          });
        }
      });
      model.numberFrame();
      const arrayPicktures = model.getFrames();
      model.clearAnimation(timerID);
      timerID = model.animation(arrayPicktures, fps);
    });

    miniCanvasWrapper.addEventListener('click', (e) => {
      const arrayDoubleFile = document.getElementsByClassName('icon-docs');
      Array.from(arrayDoubleFile).forEach((el, index) => {
        if (e.target === el) {
          view.drawWrapperCanvas(index + 1);
          view.resizeCanvas(index + 1, scale, widthCanvas);
          model.copyCanvas(index);
        }
      });
    });

    miniCanvasWrapper.addEventListener('click', (e) => {
      console.log('el', e.target);
      const canvasWrapper = document.getElementsByClassName('canvas-mini');
      const arrayCanvas = document.querySelectorAll('.field-paint');
      Array.from(canvasWrapper).forEach((el, index) => {
        if (e.target === el) {
          element = index;
          Array.from(arrayCanvas).forEach((elCanvas, index1) => {
            if (index === index1) {
              elCanvas.style.zIndex = zindex;
              zindex += 1;
            }
          });
        }
      });
    });

    document.querySelector('.menu-btn').addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('.menu').classList.toggle('menu_active');
    });

    document.querySelector('.low-canvas').addEventListener('click', () => {
      scale = 20;
      widthCanvas = 32;
      view.resizeCanvas(element, scale, widthCanvas);
      view.drawInformationCanvac(element, widthCanvas);
    });

    document.querySelector('.medium-canvas').addEventListener('click', () => {
      scale = 10;
      widthCanvas = 64;
      view.resizeCanvas(element, scale, widthCanvas);
      view.drawInformationCanvac(element, widthCanvas);
    });

    document.querySelector('.big-canvas').addEventListener('click', () => {
      scale = 5;
      widthCanvas = 128;
      view.resizeCanvas(element, scale, widthCanvas);
      view.drawInformationCanvac(element, widthCanvas);
    });

    document.querySelector('.save-in-gif').addEventListener('click', () => {
      const arrayCanvas = document.querySelectorAll('.canvas-mini');
      const gif = new GIF({
        workers: 2,
        quality: 10,
      });

      // add an image element
      // gif.addFrame(imageElement);
      // Array.from(arrayCanvas).forEach((el) => {
      //   gif.addFrame(el, { delay: 20000 });
      // });
      console.log('gif', gif);
      // or a canvas element
      // gif.addFrame(canvasElement, { delay: 200 });
      Array.from(arrayCanvas).forEach((el) => {
        const ctx = el.getContext('2d');
        gif.addFrame(ctx, { copy: true });
      });

      console.log('gif', gif);
      // // or copy the pixels from a canvas context
      // gif.addFrame(ctx, { copy: true });

      gif.on('finished', (blob) => {
        window.open(URL.createObjectURL(blob));
      });

      gif.render();
    });
    console.log('myColor', myColor);
    document.querySelector('.img-paint').addEventListener('click', () => {
      model.paintBucket(element, myColor);
    });

    document.querySelector('.img-pipette').addEventListener('click', () => {
      console.log('myColor', myColor);
      function rgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255) { throw 'Invalid color component'; }
        return ((r << 16) | (g << 8) | b).toString(16);
      }
      const canvasBasic = document.querySelectorAll('#canvas-basic');
      canvasBasic[element].onmousedown = function onmousedown(event) {
        const x = event.offsetX;
        const y = event.offsetY;
        const c = canvasBasic[element].getContext('2d');
        const p = c.getImageData(x, y, 1, 1).data;

        const hex = `#${(`000000${rgbToHex(p[0], p[1], p[2])}`).slice(-6)}`;
        console.log(hex);
        const color = document.querySelector('.first-current-color');
        color.value = hex;
        myColor = hex;
      };
    });
  }
}
