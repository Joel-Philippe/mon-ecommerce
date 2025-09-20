
'use client';
import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import './SvgBackground.css';

const SvgBackground = () => {
  useEffect(() => {
    // GSAP animation code goes here
    gsap.set('svg', {
      visibility: 'visible'
    });

    // Loader 1
    const loader1Bar1Heights = [20, 45, 57, 80, 64, 32, 66, 45, 64, 23, 66, 13, 64, 56, 34, 34, 2, 23, 76, 79, 20];
    const loader1Bar1Timeline = gsap.timeline({ repeat: -1 });
    const loader1Bar2Heights = [80, 55, 33, 5, 75, 23, 73, 33, 12, 14, 60, 80];
    const loader1Bar2Timeline = gsap.timeline({ repeat: -1 });
    const loader1Bar3Heights = [50, 34, 78, 23, 56, 23, 34, 76, 80, 54, 21, 50];
    const loader1Bar3Timeline = gsap.timeline({ repeat: -1 });
    const loader1Bar4Heights = [30, 45, 13, 80, 56, 72, 45, 76, 34, 23, 67, 30];
    const loader1Bar4Timeline = gsap.timeline({ repeat: -1 });

    function tlArrayStep(element, timeline, duration, array) {
      for (let i = 0, length = array.length; i < length; i++) {
        timeline.to(element, { duration, height: array[i] });
      }
    }

    tlArrayStep('.loader1 rect:nth-child(1)', loader1Bar1Timeline, (4.3 / loader1Bar1Heights.length), loader1Bar1Heights);
    tlArrayStep('.loader1 rect:nth-child(2)', loader1Bar2Timeline, (2 / loader1Bar2Heights.length), loader1Bar2Heights);
    tlArrayStep('.loader1 rect:nth-child(3)', loader1Bar3Timeline, (1.4 / loader1Bar3Heights.length), loader1Bar3Heights);
    tlArrayStep('.loader1 rect:nth-child(4)', loader1Bar4Timeline, (2 / loader1Bar4Heights.length), loader1Bar4Heights);

    // Loader 2
    gsap.to('.loader2 circle:nth-child(1)', {
      attr: {
        r: 22,
        "stroke-width": 1,
        "stroke-opacity": 1
      },
      opacity: 0,
      repeat: -1,
      delay: 1,
      duration: 2
    });
    gsap.to('.loader2 circle:nth-child(2)', {
      attr: {
        r: 22,
        "stroke-width": 1,
        "stroke-opacity": 1
      },
      opacity: 0,
      repeat: -1,
      duration: 2
    });
    gsap.to('.loader2 circle:nth-child(3)', {
      attr: {
        r: 1
      },
      repeat: -1,
      yoyo: true,
      ease: 'power2.out',
      duration: 1.5
    });

    // Loader 3
    gsap.to('.loader3 circle', {
      attr: {
        "fill-opacity": 0
      },
      repeat: -1,
      yoyo: true,
      ease: 'none',
      stagger: 0.25
    });

    // Loader 4
    const loader4__hearts = document.querySelectorAll('.loader4__heart');
    gsap.set('.loader4__heart:first-child', {
      opacity: 0.5
    });
    gsap.to(loader4__hearts, {
      opacity: (i) => i === 0 ? 1 : 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'none',
      duration: 0.75
    });

    // Loader 5
    // The DrawSVGPlugin is a premium GSAP plugin.
    // The following animation will not work without it.
    // You can get it from greensock.com
    // gsap.registerPlugin(DrawSVGPlugin);
    // gsap.set('.loader5__front', {
    //   drawSVG: '25% 45%'
    // });
    gsap.to('.loader5__front', {
      rotation: 360,
      repeat: -1,
      transformOrigin: '50% 50%',
      ease: 'none',
      duration: 1
    });

    // Loader 6
    gsap.set('.loader6__center', {
      opacity: 0.3,
      scale: 0.6,
      transformOrigin: '50% 50%'
    });
    gsap.to('.loader6 circle', {
      opacity: (i) => i === 1 ? 1 : 0.3,
      scale: (i) => i === 1 ? 1 : 0.6,
      repeat: -1,
      yoyo: true,
      transformOrigin: '50% 50%',
      ease: 'none',
      duration: 0.5
    });

    // Loader 7
    const loader7Timeline = gsap.timeline({ repeat: -1 });
    loader7Timeline.to('.loader7 circle', {
      attr: {
        "fill-opacity": 1
      },
      stagger: 0.2
    })
      .to('.loader7 circle', {
        attr: {
          "fill-opacity": 0
        },
        stagger: 0.2
      }, 0.4);

    // Loader 8
    gsap.to('.loader8 circle', {
      attr: {
        r: 20
      },
      opacity: 0,
      repeat: -1,
      stagger: 1
    });

    // Loader 9
    gsap.to('.loader9__inner', {
      rotation: -360,
      repeat: -1,
      transformOrigin: '50% 50%',
      ease: 'none',
      duration: 2
    });
    gsap.to('.loader9__outer', {
      rotation: 360,
      repeat: -1,
      transformOrigin: '50% 50%',
      ease: 'none',
      duration: 3
    });

    // Loader 10
    gsap.to('.loader10', {
      rotation: 360,
      repeat: -1,
      ease: 'none',
      duration: 1
    })

    // Loader 11
    gsap.to('.loader11__center', {
      attr: {
        height: 10,
      },
      y: 60,
      repeat: -1,
      yoyo: true,
      duration: 0.5
    });
    gsap.to('.loader11__inner2', {
      attr: {
        height: 10
      },
      y: 50,
      repeat: -1,
      yoyo: true,
      delay: 0.25,
      duration: 0.5
    });
    gsap.to('.loader11__inner3', {
      attr: {
        height: 10
      },
      y: 50,
      repeat: -1,
      yoyo: true,
      delay: 0.35,
      duration: 0.5
    });

    // Loader 12
    const loader12Timeline = gsap.timeline({ repeat: -1 });
    loader12Timeline.to('.loader12__path-top', { duration: 0.75, attr: { cx: 50, cy: 50 } }, "l12_1")
      .to('.loader12__path-left', { duration: 0.75, attr: { cx: 27, cy: 5 } }, "l12_1")
      .to('.loader12__path-right', { duration: 0.75, attr: { cx: 5, cy: 50 } }, "l12_1");

  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, overflow: 'hidden' }}>
      <ul className="loading__wrapper">
        <li>
          <svg className="loader1" fill="#FFF" height="80" viewBox="0 0 55 80" width="55" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1 0 0 -1 0 80)">
              <rect height="20" rx="3" width="10"></rect>
              <rect height="80" rx="3" width="10" x="15"></rect>
              <rect height="50" rx="3" width="10" x="30"></rect>
              <rect height="30" rx="3" width="10" x="45"></rect>
            </g>
          </svg>
        </li>
        <li>
          <svg className="loader2" height="45" stroke="#fff" viewBox="0 0 45 45" width="45" xmlns="http://www.w3.org/2000/svg">
            <g fillRule="evenodd" fill="none" strokeWidth="2" transform="translate(1 1)">
              <circle cx="22" cy="22" r="6" strokeOpacity="0"></circle>
              <circle cx="22" cy="22" r="6" strokeOpacity="0"></circle>
              <circle cx="22" cy="22" r="8"></circle>
            </g>
          </svg>
        </li>
        <li>
          <svg className="loader3" fill="#fff" height="105" viewBox="0 0 105 105" width="105" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12.5" cy="12.5" r="12.5" fillOpacity="1"></circle>
            <circle cx="12.5" cy="52.5" r="12.5" fillOpacity="1"></circle>
            <circle cx="52.5" cy="12.5" r="12.5" fillOpacity="1"></circle>
            <circle cx="52.5" cy="52.5" r="12.5" fillOpacity="1"></circle>
            <circle cx="92.5" cy="12.5" r="12.5" fillOpacity="1"></circle>
            <circle cx="92.5" cy="52.5" r="12.5" fillOpacity="1"></circle>
            <circle cx="12.5" cy="92.5" r="12.5" fillOpacity="1"></circle>
            <circle cx="52.5" cy="92.5" r="12.5" fillOpacity="1"></circle>
            <circle cx="92.5" cy="92.5" r="12.5" fillOpacity="1"></circle>
          </svg>
        </li>
        <li>
          <svg className="loader4" fill="#fff" height="64" viewBox="0 0 140 64" width="140" xmlns="http://www.w3.org/2000/svg">
            <path className="loader4__heart" d="M30.262 57.02L7.195 40.723c-5.84-3.976-7.56-12.06-3.842-18.063 3.715-6 11.467-7.65 17.306-3.68l4.52 3.76 2.6-5.274c3.717-6.002 11.47-7.65 17.305-3.68 5.84 3.97 7.56 12.054 3.842 18.062L34.49 56.118c-.897 1.512-2.793 1.915-4.228.9z"></path>
            <path className="loader4__heart" d="M105.512 56.12l-14.44-24.272c-3.716-6.008-1.996-14.093 3.843-18.062 5.835-3.97 13.588-2.322 17.306 3.68l2.6 5.274 4.52-3.76c5.84-3.97 13.592-2.32 17.307 3.68 3.718 6.003 1.998 14.088-3.842 18.064L109.74 57.02c-1.434 1.014-3.33.61-4.228-.9z"></path>
            <path d="M67.408 57.834l-23.01-24.98c-5.864-6.15-5.864-16.108 0-22.248 5.86-6.14 15.37-6.14 21.234 0L70 16.168l4.368-5.562c5.863-6.14 15.375-6.14 21.235 0 5.863 6.14 5.863 16.098 0 22.247l-23.007 24.98c-1.43 1.556-3.757 1.556-5.188 0z" />
          </svg>
        </li>
        <li>
          <svg version="1.1" className="loader5" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 52 52" style={{ enableBackground: 'new 0 0 52 52' }} xmlSpace="preserve">
            <path className="loader5__front" d="M51,26c0,13.8-11.2,25-25,25S1,39.8,1,26S12.2,1,26,1S51,12.2,51,26z" />
            <path className="loader5__back" d="M51,26c0,13.8-11.2,25-25,25S1,39.8,1,26S12.2,1,26,1S51,12.2,51,26z" />
          </svg>
        </li>
        <li>
          <svg className="loader6" fill="#fff" height="30" viewBox="0 0 120 30" width="120" xmlns="http://www.w3.org/2000/svg">
            <circle className="loader6__left" cx="15" cy="15" r="15"></circle>
            <circle className="loader6__center" cx="60" cy="15" r="15"></circle>
            <circle className="loader6__right" cx="105" cy="15" r="15"></circle>
          </svg>
        </li>
        <li>
          <svg className="loader7" height="58" viewBox="0 0 58 58" width="58" xmlns="http://www.w3.org/2000/svg">
            <g fillRule="evenodd" fill="none">
              <g strokeWidth="1.5" stroke="#FFF" transform="translate(2 1)">
                <circle cx="42.601" cy="11.462" fillOpacity="0" fill="#fff" r="5"></circle>
                <circle cx="49.063" cy="27.063" fillOpacity="0" fill="#fff" r="5"></circle>
                <circle cx="42.601" cy="42.663" fillOpacity="0" fill="#fff" r="5"></circle>
                <circle cx="27" cy="49.125" fillOpacity="0" fill="#fff" r="5"></circle>
                <circle cx="11.399" cy="42.663" fillOpacity="0" fill="#fff" r="5"></circle>
                <circle cx="4.938" cy="27.063" fillOpacity="0" fill="#fff" r="5"></circle>
                <circle cx="11.399" cy="11.462" fillOpacity="0" fill="#fff" r="5"></circle>
                <circle cx="27" cy="5" fillOpacity="0" fill="#fff" r="5"></circle>
              </g>
            </g>
          </svg>
        </li>
        <li>
          <svg className="loader8" height="44" stroke="#fff" viewBox="0 0 44 44" width="44" xmlns="http://www.w3.org/2000/svg">
            <g fillRule="evenodd" fill="none" strokeWidth="2">
              <circle cx="22" cy="22" r="0"></circle>
              <circle cx="22" cy="22" r="0"></circle>
            </g>
          </svg>
        </li>
        <li>
          <svg className="loader9" width="135" height="135" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#fff">
            <path className="loader9__inner" d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z"></path>
            <path className="loader9__outer" d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z"></path>
          </svg>
        </li>
        <li>
          <svg className="loader10" height="38" viewBox="0 0 38 38" width="38" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="a" x1="8.042%" x2="65.682%" y1="0%" y2="23.865%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                <stop offset="63.146%" stopColor="#fff" stopOpacity=".631" />
                <stop offset="100%" stopColor="#fff" />
              </linearGradient>
            </defs>
            <g fillRule="evenodd" fill="none">
              <g transform="translate(1 1)">
                <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" strokeWidth="2" stroke="url(#a)"></path>
                <circle cx="36" cy="18" fill="#fff" r="1"></circle>
              </g>
            </g>
          </svg>
        </li>
        <li>
          <svg className="loader11" width="135" height="140" viewBox="0 0 135 140" xmlns="http://www.w3.org/2000/svg" fill="#fff">
            <rect className="loader11__inner3" y="10" width="15" height="120" rx="6"></rect>
            <rect className="loader11__inner2" x="30" y="10" width="15" height="120" rx="6"></rect>
            <rect className="loader11__center" x="60" width="15" height="140" rx="6"></rect>
            <rect className="loader11__inner2" x="90" y="10" width="15" height="120" rx="6"></rect>
            <rect className="loader11__inner3" x="120" y="10" width="15" height="120" rx="6"></rect>
          </svg>
        </li>
        <li>
          <svg className="loader12" height="57" stroke="#fff" viewBox="0 0 57 57" width="57" xmlns="http://www.w3.org/2000/svg">
            <g fillRule="evenodd" fill="none">
              <g strokeWidth="2" transform="translate(1 1)">
                <circle className="loader12__path-left" cx="5" cy="50" r="5"></circle>
                <circle className="loader12__path-top" cx="27" cy="5" r="5"></circle>
                <circle className="loader12__path-right" cx="50" cy="50" r="5"></circle>
              </g>
            </g>
          </svg>
        </li>
      </ul>
    </div>
  );
};

export default SvgBackground;
