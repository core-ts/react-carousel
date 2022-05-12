"use strict";
function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("../carousel.css");
__export(require("./CarouselVideoItem"));
function CarouselImageItem(props) {
  return (React.createElement("div", { className: 'data-item-gallery' }, React.createElement("img", { className: 'image-carousel iframe-youtube', src: props.src, alt: props.alt, draggable: props.draggable })));
}
exports.CarouselImageItem = CarouselImageItem;
function Carousel(props) {
  var children = props.children, infiniteLoop = props.infiniteLoop;
  var widthItem = React.useRef(0);
  var counter = React.useRef(0);
  var slidersLength = React.useRef(0);
  var touchPosition = React.useRef(0);
  var slider = React.useRef(null);
  var sliderContainer = React.useRef(null);
  var typingTimeoutRef = React.useRef(null);
  var widthFullScreen = React.useRef(0);
  var slideContentWrap = React.useRef(null);
  var widthSlideContentWrap = React.useRef(0);
  React.useEffect(function () {
    if (!widthFullScreen.current || !slideContentWrap.current) {
      return;
    }
    widthFullScreen.current = window.screen.width;
    widthSlideContentWrap.current = slideContentWrap.current.offsetWidth;
  }, []);
  React.useLayoutEffect(function () {
    infiniteLoop ? (counter.current = 1) : (counter.current = 0);
    window.addEventListener('resize', handleResize);
    window.addEventListener('mouseup', handleResize);
    window.addEventListener('touchend', handleResize);
    handleWidth();
    return function () {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', handleResize);
      window.removeEventListener('touchend', handleResize);
      clearTimeout(typingTimeoutRef.current);
    };
  }, [children]);
  var handleResize = function () {
    if (!slideContentWrap.current) {
      return;
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (widthFullScreen.current === window.innerWidth &&
      document.fullscreenElement) {
      return;
    }
    if (widthFullScreen.current !== window.screen.width) {
      widthFullScreen.current = window.screen.width;
      typingTimeoutRef.current = setTimeout(function () {
        handleWidth();
      }, 200);
      widthSlideContentWrap.current = slideContentWrap.current.offsetWidth;
      return;
    }
    if (slideContentWrap.current &&
      widthSlideContentWrap.current !== slideContentWrap.current.offsetWidth) {
      typingTimeoutRef.current = setTimeout(function () {
        handleWidth();
      }, 200);
      widthSlideContentWrap.current = slideContentWrap.current.offsetWidth;
      return;
    }
    typingTimeoutRef.current = setTimeout(function () {
      handleWidth();
    }, 200);
  };
  var handleWidth = function () {
    if (!sliderContainer.current || !slideContentWrap.current) {
      return;
    }
    var slideItems = sliderContainer.current.children;
    console.log(slideContentWrap.current.offsetWidth);
    slidersLength.current = slideItems.length;
    widthItem.current = slideContentWrap.current.offsetWidth;
    Array.from(slideItems).forEach(function (item) {
      if (slideContentWrap &&
        slideContentWrap.current &&
        item instanceof HTMLElement) {
        item.style.width = slideContentWrap.current.offsetWidth + 'px';
      }
    });
    sliderContainer.current.style.width =
      widthItem.current * slidersLength.current + 'px';
    sliderContainer.current.style.transition = 'transform 0.4s ease-in-out';
    sliderContainer.current.style.transform =
      'translate3d(' + -widthItem.current * counter.current + 'px, 0px, 0px)';
  };
  var handleTransitionEnd = function () {
    var sliderParent = document.querySelector('.slider-container');
    sliderParent.querySelectorAll('.data-item-youtube').forEach(function (child) {
      var _a;
      var iframe = child.querySelector('iframe');
      if (iframe !== null) {
        (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
      }
    });
    sliderParent.querySelectorAll('.play-video-wrapper').forEach(function (child) {
      var video = child.querySelector('video');
      video === null || video === void 0 ? void 0 : video.pause();
    });
    if (!sliderContainer.current) {
      return;
    }
    if (sliderContainer.current.children[counter.current].id === 'lastClone') {
      sliderContainer.current.style.transition = 'none';
      counter.current = slidersLength.current - 2;
      sliderContainer.current.style.transform =
        'translate3d(' + -widthItem.current * counter.current + 'px, 0px, 0px)';
    }
    if (sliderContainer.current.children[counter.current].id === 'firstClone') {
      sliderContainer.current.style.transition = 'none';
      counter.current = slidersLength.current - counter.current;
      sliderContainer.current.style.transform =
        'translate3d(' + -widthItem.current * counter.current + 'px, 0px, 0px)';
    }
  };
  var prev = function () {
    if (!sliderContainer.current) {
      return;
    }
    if (counter.current <= 0) {
      return;
    }
    sliderContainer.current.style.transition = 'transform 0.4s ease-in-out';
    counter.current--;
    sliderContainer.current.style.transform =
      'translate3d(' + -widthItem.current * counter.current + 'px, 0px, 0px)';
    clearVideo();
  };
  var next = function () {
    if (!sliderContainer.current) {
      return;
    }
    if (counter.current >= slidersLength.current - 1) {
      return;
    }
    sliderContainer.current.style.transition = 'transform 0.4s ease-in-out';
    counter.current++;
    sliderContainer.current.style.transform =
      'translate3d(' + -widthItem.current * counter.current + 'px, 0px, 0px)';
    clearVideo();
  };
  var handleDots = function (index, e) {
    e.preventDefault();
    if (infiniteLoop) {
      index++;
    }
    if (counter.current !== index) {
      counter.current = index;
      sliderContainer.current.style.transition = 'transform 0.4s ease-in-out';
      sliderContainer.current.style.transform =
        'translate3d(' + -widthItem.current * counter.current + 'px, 0px, 0px)';
    }
    clearVideo();
  };
  var handleTouchStart = function (e) {
    if (!touchPosition.current) {
      return;
    }
    var touchDown = e.touches[0].clientX;
    touchPosition.current = touchDown;
  };
  var handleTouchMove = function (e) {
    var touchDown = touchPosition.current;
    if (touchDown === null) {
      return;
    }
    var currentTouch = e.touches[0].clientX;
    var diff = touchDown - currentTouch;
    if (diff > 5) {
      next();
    }
    if (diff < -5) {
      prev();
    }
    touchPosition.current = -1;
  };
  var clearVideo = function () {
    if (!sliderContainer.current) {
      return;
    }
    var tagVideo = sliderContainer.current.querySelector('.slider-items > video') ||
      sliderContainer.current.querySelector('.slider-items > iframe');
    if (tagVideo && tagVideo.parentElement) {
      var tagBtnVideo = tagVideo.parentElement.querySelector('.btn-play');
      var tagThumbnail = tagVideo.parentElement.querySelector('.thumbnail-container');
      if (tagVideo) {
        tagVideo.remove();
        tagBtnVideo === null || tagBtnVideo === void 0 ? void 0 : tagBtnVideo.classList.remove('display-none');
        tagThumbnail === null || tagThumbnail === void 0 ? void 0 : tagThumbnail.classList.remove('opacity-0');
      }
    }
  };
  return (React.createElement("div", { className: 'slider', ref: slider }, children.length > 1 && (React.createElement(React.Fragment, null, React.createElement("span", { className: 'btn-prev', onClick: prev }, "<"), React.createElement("span", { className: 'btn-next', onClick: next }, ">"))), React.createElement("div", { className: 'slider-content-wrapper', ref: slideContentWrap, onTouchStart: handleTouchStart, onTouchMove: handleTouchMove }, React.createElement("div", { className: 'slider-container', ref: sliderContainer, onTransitionEnd: function () { return handleTransitionEnd(); } }, infiniteLoop && (React.createElement("div", { className: 'slider-items', id: 'lastClone' }, children[children.length - 1])), children.map(function (item, index) { return (React.createElement("div", { className: 'slider-items', key: "slider-items-" + index }, item)); }), infiniteLoop && (React.createElement("div", { className: 'slider-items', id: 'firstClone' }, children[0]))))));
}
exports.Carousel = Carousel;
