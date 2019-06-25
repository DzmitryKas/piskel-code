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

    const colorCurrentFirst = document.querySelector('.first-current-color');
    colorCurrentFirst.addEventListener('input', function () {
      myColor = this.value;
      model.drawPen(ctxWidth, myColor, element);
    });

    const colorCurrentSecond = document.querySelector('.second-current-color');
    colorCurrentSecond.addEventListener('contextmenu', function (event) {
      event.preventDefault()
      myColor = this.value;
      model.drawPen(ctxWidth, myColor, element);
    });


    // view.drawKlektis(element, scale, widthCanvas);
    model.cloneCanvas(element);

    document.querySelector('.pen').addEventListener('click', () => {
      model.drawPen(ctxWidth, myColor, element);
    });

    document.querySelector('.eraser').addEventListener('click', () => {
      model.erasing(element);
    });

    window.onload = function () {
      model.drawPen(ctxWidth, myColor, element);
    };

    document.querySelector('.line').addEventListener('click', () => {
      model.drawLine(ctxWidth, myColor, element);
    });

    const canvasWrapper = document.getElementsByClassName('canvas-wrapper');
    document.querySelector('.add-frame').addEventListener('click', () => {
      const menuFrame = document.querySelector('.menu-frame');

      element = menuFrame.children.length - 1;
      view.drawWrapperCanvas(element);

      view.resizeCanvas(element, scale, widthCanvas);
      model.cloneCanvas(element);
      const arrayPicktures = model.getFrames();
      model.clearAnimation(timerID);
      timerID = model.animation(arrayPicktures, fps);
      const current = document.getElementsByClassName('selected');

      if (current.length > 0) {
        current[0].className = current[0].className.replace(' selected', '');
      }
      canvasWrapper[element].className += ' selected';
      const arrayCanvasBasic = document.querySelectorAll('.field-paint');
      Array.from(arrayCanvasBasic).forEach((elCanvas) => {
        elCanvas[element].style.zIndex = zindex;
        zindex += 1;
      });
    });

    document.getElementById('r1').addEventListener('input', () => {
      i1.value = `${rng.value} fps`;
      fps = rng.value;
      const arrayPicktures = model.getFrames();
      model.clearAnimation(timerID);
      timerID = model.animation(arrayPicktures, fps);
    });


    const tools = document.querySelector('.tools');
    const allTools = tools.getElementsByTagName('div');
    tools.addEventListener('click', (e) => {
      Array.from(allTools).forEach((el) => {
        if (e.target === el) {
          const current = document.getElementsByClassName('active');
          console.log('current', current);
          if (current.length > 0) {
            current[0].className = current[0].className.replace(' active', '');
          }
          e.target.className += ' active';
        }
      });
    });

    const miniCanvasWrapper = document.querySelector('.menu-frame');
    console.log('canvasWrapper', canvasWrapper);
    miniCanvasWrapper.addEventListener('click', (e) => {
      const arrayCanvas = document.querySelectorAll('.canvas-mini');
      console.log('e.target', e.target);
      arrayCanvas.forEach((el, index) => {
        if (e.target === el) {
          const current = document.getElementsByClassName('selected');

          if (current.length > 0) {
            current[0].className = current[0].className.replace(' selected', '');
            console.log('current[0]', current.length);
          }
          canvasWrapper[index].className += ' selected';
        }
      });
    });

    const btnContainer = document.querySelector('.pencil-width');
    const btns = btnContainer.getElementsByClassName('wrapper-width');

    // Loop through the buttons and add the active class to the current/clicked button
    for (let i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        ctxWidth = i + 1;
        model.drawPen(ctxWidth, myColor, element);
        const current = document.getElementsByClassName('current-pencil');
        if (current.length > 0) {
          current[0].className = current[0].className.replace(' current-pencil', '');
        }
        this.className += ' current-pencil';
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


    miniCanvasWrapper.addEventListener('click', (e) => {
      const arrayBasket = document.getElementsByClassName('icon-trash');
      const canvas = document.getElementsByClassName('canvas-wrapper');
      const arrayCanvas = document.querySelectorAll('.field-paint');
      const fieldCanvas = document.querySelector('.wrapper-field-paint');
      Array.from(arrayBasket).forEach((el, index) => {
        if (e.target === el) {
          miniCanvasWrapper.removeChild(canvas[index]);
          Array.from(arrayCanvas).forEach((el1, index1) => {
            if (index === index1) {
              fieldCanvas.removeChild(el1);
              const current = document.getElementsByClassName('selected');

              if (current.length > 0) {
                current[0].className = current[0].className.replace(' selected', '');
              }
              canvasWrapper[index].className += ' selected';
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
      const arrayCanvasBasic = document.querySelectorAll('.field-paint');
      const arrayCanvasMini = document.querySelectorAll('.canvas-mini');
      Array.from(arrayCanvasMini).forEach((el, index) => {
        if (e.target === el) {
          element = index;
          Array.from(arrayCanvasBasic).forEach((elCanvas, index1) => {
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
    document.querySelector('.paint').addEventListener('click', () => {
      model.paintBucket(element, myColor);
    });

    document.querySelector('.pipette').addEventListener('click', () => {
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
