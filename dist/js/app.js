"use strict";

document.addEventListener("DOMContentLoaded", function () {

    //wedp
    function isWebp() {

        function testWebP(callback) {
            let webP = new Image();
            webP.onload = webP.onerror = function () {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }

        testWebP(function (support) {
            let className = support === true ? 'webp' : 'no-webp';
            document.documentElement.classList.add(className);
        });
    }
    isWebp();


    //mobile menu
    const menuBody = document.querySelector('.header-bottom');
    const iconMenu = document.querySelector('.header-top__menu-link');
    if (iconMenu) {
        iconMenu.addEventListener("click", function () {
            document.body.classList.toggle('_lock');
            iconMenu.classList.toggle('_active');
            menuBody.classList.toggle('_active');
        });
    }

    //SPOLLERS
    const spollersArray = document.querySelectorAll('[data-spollers]');
    if (spollersArray.length > 0) {
        //получение обычных спойлеров
        const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
            return !item.dataset.spollers.split(",")[0];
        });
        //инициализация спойлера
        if (spollersRegular.length > 0) {
            initSpollers(spollersRegular);
        }
        //получение спойлеров с медиа запросами
        const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
            return item.dataset.spollers.split(",")[0];
        });

        // инициализация спойлеров с медиа запросами
        if (spollersMedia.length > 0) {
            const breakpointsArray = [];
            spollersMedia.forEach(item => {
                const params = item.dataset.spollers;
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            });

            //получение уникальных брейкпоинтов
            let mediaQueries = breakpointsArray.map(function (item) {
                return '(' + item.type + "-width:" + item.value + "px)," + item.value + ',' + item.type;
            });
            mediaQueries = mediaQueries.filter(function (item, index, self) {
                return self.indexOf(item) === index;
            });

            //работа с каждым брейкпоинтом
            mediaQueries.forEach(breakpoint => {
                const paramsArray = breakpoint.split(",");
                const mediaBreakpoint = paramsArray[1];
                const mediaType = paramsArray[2];
                const matchMedia = window.matchMedia(paramsArray[0]);

                //обьекты с нужными значениями
                const spollersArray = breakpointsArray.filter(function (item) {
                    if (item.value === mediaBreakpoint && item.type === mediaType) {
                        return true;
                    }
                });
                //событие
                matchMedia.addListener(function () {
                    initSpollers(spollersArray, matchMedia);
                });
                initSpollers(spollersArray, matchMedia);
            });
        }
        //инициализация
        function initSpollers(spollersArray, matchMedia = false) {
            spollersArray.forEach(spollersBlock => {
                spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                if (matchMedia.matches || !matchMedia) {
                    spollersBlock.classList.add('_init');
                    initSpollerBody(spollersBlock);
                    spollersBlock.addEventListener("click", setSpollerAction);
                } else {
                    spollersBlock.classList.remove('_init');
                    initSpollerBody(spollersBlock, false);
                    spollersBlock.removeEventListener("click", setSpollerAction);
                }
            });
        }

        function initSpollerBody(spollersBlock, hideSpollerBody = true) {
            const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
            if (spollerTitles.length > 0) {
                spollerTitles.forEach(spollerTitle => {
                    if (hideSpollerBody) {
                        spollerTitle.removeAttribute('tabindex');
                        if (!spollerTitle.classList.contains('_active')) {
                            spollerTitle.nextElementSibling.hidden = true;
                        }
                    } else {
                        spollerTitle.setAttribute('tabindex', '-1');
                        spollerTitle.nextElementSibling.hidden = false;
                    }
                });
            }
        }

        function setSpollerAction(e) {
            const el = e.target;
            if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
                const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
                const spollersBlock = spollerTitle.closest('[data-spollers]');
                const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
                if (!spollersBlock.querySelectorAll('._slide').length) {
                    if (oneSpoller && !spollerTitle.classList.contains('_active')) {
                        hideSpollersBody(spollersBlock);
                    }
                    spollerTitle.classList.toggle('_active');
                    _slideToggle(spollerTitle.nextElementSibling, 500);
                }
                e.preventDefault();
            }
        }

        function hideSpollersBody(spollersBlock) {
            const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
            if (spollerActiveTitle) {
                spollerActiveTitle.classList.remove('_active');
                _slideUp(spollerActiveTitle.nextElementSibling, 500);
            }
        }
    }

    //================================================================================================

    //SlideToggle 
    let _slideUp = (target, duration = 500) => {
        if (!target.classList.contains('_slide')) {
            target.classList.add('_slide');
            target.style.transitionProperty = 'height, margin, padding';
            target.style.transitionDuration = duration + 'ms';
            target.style.height = target.offsetHeight + 'px';
            target.offsetHeight;
            target.style.overflow = 'hidden';
            target.style.height = 0;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout(() => {
                target.hidden = true;
                target.style.removeProperty('height');
                target.style.removeProperty('padding-top');
                target.style.removeProperty('padding-bottom');
                target.style.removeProperty('mragin-top');
                target.style.removeProperty('margin-bottom');
                target.style.removeProperty('overflow');
                target.style.removeProperty('transition-duration');
                target.style.removeProperty('transition-property');
                target.classList.remove('_slide');
            }, duration);
        }
    }

    let _slideDown = (target, duration = 500) => {
        if (!target.classList.contains('_slide')) {
            target.classList.add('_slide');
            if (target.hidden) {
                target.hidden = false;
            }
            let height = target.offsetHeight;
            target.style.overflow = 'hidden';
            target.style.height = 0;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + 'ms';
            target.style.height = height + 'px';
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            window.setTimeout(() => {
                target.style.removeProperty('height');
                target.style.removeProperty('overflow');
                target.style.removeProperty('transition-duration');
                target.style.removeProperty('transition-property');
                target.classList.remove('_slide');
            }, duration);
        }
    }

    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) {
            return _slideDown(target, duration);
        } else {
            return _slideUp(target, duration);
        }
    }

    //modals
    const popupLinks = document.querySelectorAll('.popup-link');
    const body = document.querySelector('body');
    const lockPadding = document.querySelectorAll(".lock-padding");

    let unlock = true;

    const timeout = 500;

    if (popupLinks.length > 0) {
        for (let index = 0; index < popupLinks.length; index++) {
            const popupLink = popupLinks[index];
            popupLink.addEventListener("click", function (e) {
                const popupName = popupLink.getAttribute('href').replace('#', '');
                const curentPopup = document.getElementById(popupName);
                popupOpen(curentPopup);
                e.preventDefault();
            });
        }
    }

    const popupCloseIcon = document.querySelectorAll('.close-popup');
    if (popupCloseIcon.length > 0) {
        for (let index = 0; index < popupCloseIcon.length; index++) {
            const el = popupCloseIcon[index];
            el.addEventListener('click', function (e) {
                popupClose(el.closest('.popup'));
                e.preventDefault();
            });
        }
    }

    function popupOpen(curentPopup) {
        if (curentPopup && unlock) {
            const popupActive = document.querySelector('.popup.open');
            if (popupActive) {
                popupClose(popupActive, false);
            } else {
                bodyLock();
            }
            curentPopup.classList.add('open');
            curentPopup.addEventListener("click", function (e) {
                if (!e.target.closest('.popup__content')) {
                    popupClose(e.target.closest('.popup'));
                }
            });
        }
    }

    function popupClose(popupActive, doUnlock = true) {
        if (unlock) {
            popupActive.classList.remove('open');
            if (doUnlock) {
                bodyUnLock();
            }
        }
    }

    function bodyLock() {
        const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

        if (lockPadding.length > 0) {
            for (let index = 0; index < lockPadding.length; index++) {
                const el = lockPadding[index];
                el.style.paddingRight = lockPaddingValue;
            }
        }
        body.style.paddingRight = lockPaddingValue;
        body.classList.add('_lock');

        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, timeout);
    }

    function bodyUnLock() {
        setTimeout(function () {
            if (lockPadding.length > 0) {
                for (let index = 0; index < lockPadding.length; index++) {
                    const el = lockPadding[index];
                    el.style.paddingRight = '0px';
                }
            }
            body.style.paddingRight = '0px';
            body.classList.remove('_lock');
        }, timeout);

        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, timeout);
    }

    document.addEventListener('keydown', function (e) {
        const popupActive = document.querySelector('.popup.open');
        if (e.which === 27) {
            if (popupActive) {
                popupClose(popupActive);
            }

        }
    });

    //mask on input

    [].forEach.call(document.querySelectorAll('.tel'), function (input) {
        var keyCode;

        function mask(event) {
            event.keyCode && (keyCode = event.keyCode);
            var pos = this.selectionStart;
            if (pos < 3) event.preventDefault();
            var matrix = "+7 (___) ___ ____",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, ""),
                new_value = matrix.replace(/[_\d]/g, function (a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a
                });
            i = new_value.indexOf("_");
            if (i != -1) {
                i < 5 && (i = 3);
                new_value = new_value.slice(0, i)
            }
            var reg = matrix.substr(0, this.value.length).replace(/_+/g,
                function (a) {
                    return "\\d{1," + a.length + "}"
                }).replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
            if (event.type == "blur" && this.value.length < 5) this.value = ""
        }

        input.addEventListener("input", mask, false);
        input.addEventListener("focus", mask, false);
        input.addEventListener("blur", mask, false);
        input.addEventListener("keydown", mask, false)

    });

    //validation on form

    const inputs = document.querySelectorAll('.input');
    if (inputs.length > 0) {
        inputs.forEach(input => {
            input.addEventListener("input", function (e) {
                if (input.value.length > 0) {
                    addActiveClass(input);
                } else {
                    removeActiveClass(input);
                }

            })

        });
    }

    // const form = document.getElementById('form');\
    const forms = document.querySelectorAll('.form');
    const submitButton = document.getElementById('code-link');
    forms.forEach(form => {
        if (form.length > 0) {
            form.addEventListener('submit', formSend);
        }
        async function formSend(e) {
            e.preventDefault();
            let error = formValidate(form);
        }

        function formValidate(form) {
            let error = 0;
            let formReq = form.querySelectorAll('._req');

            for (let index = 0; index < formReq.length; index++) {
                const input = formReq[index];
                formRemoveError(input);
                if (input.classList.contains('tel')) {
                    if (numberTest(input)) {
                        formAddError(input);
                        error++;
                    }
                }
                if (input.classList.contains('_mail')) {
                    if (mailTest(input)) {
                        formAddError(input);
                        error++;
                    }
                } else {
                    if (input.value === '') {
                        formAddError(input);
                        error++;
                    }
                }

                // if (input.classList.contains('_mail')) {
                //     if (codeTest(input)) {
                //         formAddError(input);
                //         error++;
                //     }
                // }

            }
            return error;
        }
    });

    //dropdown

    const dropdwonItems = document.querySelectorAll('.dropdown__content');
    if (dropdwonItems.length > 0) {
        dropdwonItems.forEach(function (dropDownWrapper) {
            const dropDownBtn = dropDownWrapper.querySelector('.dropdown__button');
            const dropDownList = dropDownWrapper.querySelector('.dropdown__list');
            const dropDownListItems = dropDownList.querySelectorAll('.dropdown__list-item');
            const dropDownInput = dropDownWrapper.querySelector('.dropdown__input-hidden');

            // Клик по кнопке. Открыть/Закрыть select
            dropDownBtn.addEventListener('click', function (e) {
                toggleActiveClass(dropDownList);
                toggleActiveClass(dropDownBtn);
            });

            // Выбор элемента списка. Запомнить выбранное значение. Закрыть дропдаун
            dropDownListItems.forEach(function (listItem) {
                listItem.addEventListener('click', function (e) {
                    e.stopPropagation();
                    dropDownBtn.innerText = this.innerText;
                    dropDownBtn.focus();
                    dropDownInput.value = this.dataset.value;
                    removeActiveClass(dropDownList);
                    removeActiveClass(dropDownBtn);
                });
            });

            // Клик снаружи дропдауна. Закрыть дропдаун
            document.addEventListener('click', function (e) {
                if (e.target !== dropDownBtn) {
                    removeActiveClass(dropDownList);
                    removeActiveClass(dropDownBtn);
                }
            });

            // Нажатие на Tab или Escape. Закрыть дропдаун
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Tab' || e.key === 'Escape') {
                    removeActiveClass(dropDownList);
                    removeActiveClass(dropDownBtn);
                }
            });
        });
    }

    //break points

    if (window.innerWidth > 1024) {
        document.querySelector('.sublist').classList.add('dropdown__list');
        const reviewsSlider = new Swiper('.reviews__row ', {
            sumulateTouch: false, //or false
            touchRatio: 1,
            touchAngel: 45,
            grabCursor: true, //or false
            slideToClickedSlide: false, //or false
            hashNavigation: {
                watchState: false, // or false
            },
            keyboard: {
                enabled: true,
                onlyInViewport: true,
                pageUpDown: true,
            },
            slidesPerView: 3,
            watchoverflow: false,
            spaceBetween: 30,
            slidesPerGroup: 1,
            centeredSlides: false,
            slidesPerColumn: 1, // - для коректной работы не юзать авто высоту.
            loop: false, // or false - не работает с мультирядностью
            loopedSlides: 0, // работает с loop
            freeMode: false,
            //скорость переключения слайдов:
            speed: 600,
            effect: 'slide',
            breakpoints: {
                100: {
                    spaceBetween: 10,
                },
                492: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
                767: {
                    spaceBetween: 24,
                    slidesPerView: 1,
                },
                1024: {
                    slidesPerView: 3,
                }
            },
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
            observer: true,
            observeParents: true,
            observeSlideChildren: true,
        });
        const reviewsPageSlider = new Swiper('.reviews-page__slider ', {
            sumulateTouch: false, //or false
            touchRatio: 1,
            touchAngel: 45,
            grabCursor: true, //or false
            slideToClickedSlide: false, //or false
            hashNavigation: {
                watchState: false, // or false
            },
            keyboard: {
                enabled: true,
                onlyInViewport: true,
                pageUpDown: true,
            },
            slidesPerView: 3,
            watchoverflow: false,
            spaceBetween: 30,
            slidesPerGroup: 1,
            centeredSlides: false,
            slidesPerColumn: 1, // - для коректной работы не юзать авто высоту.
            loop: false, // or false - не работает с мультирядностью
            loopedSlides: 0, // работает с loop
            freeMode: false,
            //скорость переключения слайдов:
            speed: 600,
            effect: 'slide',
            breakpoints: {
                100: {
                    spaceBetween: 10,
                },
                492: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
                767: {
                    spaceBetween: 24,
                    slidesPerView: 1,
                },
                1024: {
                    slidesPerView: 3,
                }
            },
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
            observer: true,
            observeParents: true,
            observeSlideChildren: true,
        });
    }

    if (window.innerWidth < 767) {
        const certificatesSlider = new Swiper('.certificates__row ', {
            sumulateTouch: false,
            touchRatio: 1,
            touchAngel: 45,
            grabCursor: true,
            slideToClickedSlide: false,
            hashNavigation: {
                watchState: false,
            },
            keyboard: {
                enabled: true,
                onlyInViewport: true,
                pageUpDown: true,
            },
            autoHeight: false,
            slidesPerView: 3,
            watchoverflow: false,
            spaceBetween: 30,
            slidesPerGroup: 1,
            centeredSlides: true,
            slidesPerColumn: 1, // - для коректной работы не юзать авто высоту.
            loop: false, // or false - не работает с мультирядностью
            loopedSlides: 0, // работает с loop
            freeMode: false,
            //скорость переключения слайдов:
            speed: 600,
            effect: 'slide',
            breakpoints: {
                100: {
                    spaceBetween: 10,
                    slidesPerView: 'auto',
                    centeredSlides: true
                },
                492: {

                    spaceBetween: 20,
                },
                767: {
                    spaceBetween: 24,
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            },
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
            observer: true,
            observeParents: true,
            observeSlideChildren: true,
        });
        const casePageSlider = document.querySelector('.case-page__slider');
        if (casePageSlider) {
            casePageSlider.classList.add('swiper');
            document.querySelector('.case-page-slider__wrapper').classList.add('swiper-wrapper');
        }

        const caseSlider = new Swiper('.case-page__slider ', {
            sumulateTouch: false,
            touchRatio: 1,
            touchAngel: 45,
            grabCursor: true,
            slideToClickedSlide: false,
            hashNavigation: {
                watchState: false,
            },
            pagination: {
                el: '.case-page__pagination',
                type: 'bullets',
            },
            keyboard: {
                enabled: true,
                onlyInViewport: true,
                pageUpDown: true,
            },
            autoHeight: false,
            slidesPerView: 1,
            watchoverflow: false,
            spaceBetween: 30,
            slidesPerGroup: 1,
            centeredSlides: true,
            slidesPerColumn: 1, // - для коректной работы не юзать авто высоту.
            loop: false, // or false - не работает с мультирядностью
            loopedSlides: 0, // работает с loop
            freeMode: false,
            //скорость переключения слайдов:
            speed: 600,
            effect: 'slide',
            breakpoints: {
                100: {
                    slidesPerView: 1,
                },
                492: {

                    spaceBetween: 20,
                },
                767: {
                    spaceBetween: 24,
                    slidesPerView: 1,
                },
                1024: {
                    slidesPerView: 1,
                }
            },
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
            observer: true,
            observeParents: true,
            observeSlideChildren: true,
        });

    }

    if (window.innerWidth < 1400) {
        const projectsContent = document.querySelector('.projects__content');
        if (projectsContent) {
            projectsContent.classList.add('container');
        }
    }

    //toggle active class onlick

    const checboxes = document.querySelectorAll('.checkbox');
    checboxes.forEach(checkbox => {
        checkbox.addEventListener("click", function () {
            toggleActiveClass(checkbox);
        });
    });

    const servicesItems = document.querySelectorAll('.services__item');
    if (servicesItems.length > 0) {
        servicesItems.forEach(servicesItem => {
            servicesItem.addEventListener("click", function () {
                toggleActiveClass(servicesItem);
            });
        });
    }

    //tabs
    const tabBlocks = document.querySelectorAll('.tab-section');
    if (tabBlocks.length > 0) {

        tabBlocks.forEach(tabBlock => {
            const tabBtns = Array.from(tabBlock.querySelectorAll(".tab__btn")),
                tabSlide = Array.from(tabBlock.querySelectorAll(".tab__slide")),
                numBtns = tabBtns.length;
            if (tabBtns.length > 0) {
                tabBtns[0].classList.add("_active");
                tabSlide[0].classList.add("_active");

                let activeBtn = tabBtns[0];
                let activeSlide = tabSlide[0];

                tabBtns.forEach((el) => {
                    el.addEventListener("click", onTabBtnClick);
                });

                function onTabBtnClick(e) {
                    e.preventDefault();
                    const btn = e.target.closest(".tab__btn");
                    changeBtn(btn);
                }

                function changeBtn(btn) {
                    if (btn.classList.contains("_active")) {
                        return;
                    }
                    activeBtn.classList.remove("_active");
                    btn.classList.add("_active");
                    activeBtn = btn;
                    changeIndicator(btn);
                }

                function changeIndicator(btn) {
                    const indexBtn = tabBtns.indexOf(btn);
                    changeSlide(indexBtn);
                }

                function changeSlide(index) {
                    activeSlide.classList.remove("_active");
                    tabSlide[index].classList.add("_active");
                    activeSlide = tabSlide[index];
                }
            }
        });

    }



    //from quiz

    const quizItems = document.querySelectorAll('.quiz__item');
    if (quizItems.length > 0) {
        quizItems.forEach(item => {
            item.addEventListener("click", function () {
                const activeStep = item.closest('.quiz__step');
                activeStep.nextElementSibling.classList.add('_active');
                activeStep.classList.remove('_active');
            });
        });
    }

    const animItems = document.querySelectorAll('._anim-items');

    if (animItems.length > 0) {
        window.addEventListener('scroll', animOnScroll);

        function animOnScroll() {
            for (let index = 0; index < animItems.length; index++) {
                const animItem = animItems[index];
                const animItemHeight = animItem.offsetHeight;
                const animItemOffset = offset(animItem).top;
                const animStart = 4;

                let animItemPoint = window.innerHeight - animItemHeight / animStart;
                if (animItemHeight > window.innerHeight) {
                    animItemPoint = window.innerHeight - window.innerHeight / animStart;
                }

                if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
                    animItem.classList.add('_visible');
                } else {
                    if (!animItem.classList.contains('_anim-no-hide')) {
                        animItem.classList.remove('_visible');
                    }

                }
            }
        }

        function offset(el) {
            const rect = el.getBoundingClientRect(),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return {
                top: rect.top + scrollTop,
                left: rect.left + scrollLeft
            };
        }

        setTimeout(() => {
            animOnScroll();
        }, 200);

    }

    const counter = document.querySelectorAll('._counter');
    let limit = 0; 
    if (counter.length > 0) {
        window.addEventListener('scroll', function () {
            if (limit == counter.length) {
                return;
            }
            for (let i = 0; i < counter.length; i++) {
                let pos = counter[i].getBoundingClientRect().top;
                let win = window.innerHeight - 40; 
                if (pos < win && counter[i].dataset.stop === "0") {
                    counter[i].dataset.stop = 1; 
                    let x = 0;
                    limit++;
                    let int = setInterval(function () {
                        x = x + Math.ceil(counter[i].dataset.to / 50);
                        counter[i].innerText = x;
                        if (x > counter[i].dataset.to) {
                            counter[i].innerText = counter[i].dataset.to;
                            clearInterval(int);
                        }
                    }, 30);
                }
            }
        });
    }
    
    //fileReader

    const fileInput = document.getElementById('fileInput'),
        filePreview = document.getElementById('filePreview');

    if (fileInput) {
        fileInput.addEventListener('change', function () {
            uploadFile(fileInput.files[0]);
        });
    }

    //sliders

    const worksSlider = new Swiper('.show-works__slider ', {
        sumulateTouch: false, //or false
        touchRatio: 1,
        touchAngel: 45,
        initialSlide: 3,
        grabCursor: true, //or false
        slideToClickedSlide: false, //or false
        hashNavigation: {
            watchState: false, // or false
        },
        keyboard: {
            enabled: true,
            onlyInViewport: true,
            pageUpDown: true,
        },
        navigation: {
            nextEl: '.show-works__arrow_next',
            prevEl: '.show-works__arrow_prev',
        },
        // autoHeight: true,
        slidesPerView: 3,
        watchoverflow: false,
        spaceBetween: 24,
        slidesPerGroup: 1,
        centeredSlides: true,
        slidesPerColumn: 1, // - для коректной работы не юзать авто высоту.
        loop: true, // or false - не работает с мультирядностью
        loopedSlides: 0, // работает с loop
        freeMode: false,
        //скорость переключения слайдов:
        speed: 600,
        effect: 'slide',
        breakpoints: {
            100: {
                initialSlide: 1,
                slidesPerView: 'auto',
                centeredSlides: false,
            },
            492: {
                initialSlide: 1,
                slidesPerView: 'auto',
                centeredSlides: false,

            },
            767: {
                initialSlide: 1,
                slidesPerView: 'auto',
                centeredSlides: false,

            },
            1024: {
                slidesPerView: 3,
                centeredSlides: true,
            },
            1500: {
                slidesPerView: 3.5,
            }
        },
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
    });

    const faqSlider = new Swiper('.faq-slider__slider ', {
        sumulateTouch: false,
        touchRatio: 1,
        touchAngel: 45,
        grabCursor: true,
        slideToClickedSlide: false,
        hashNavigation: {
            watchState: false,
        },
        navigation: {
            nextEl: '.faq__arrow_next',
            prevEl: '.faq__arrow_prev',
        },
        keyboard: {
            enabled: true,
            onlyInViewport: true,
            pageUpDown: true,
        },
        slidesPerView: 3,
        watchoverflow: false,
        spaceBetween: 16,
        slidesPerGroup: 1,
        loopedSlides: 0,
        freeMode: false,
        speed: 600,
        effect: 'slide',
        breakpoints: {
            100: {
                spaceBetween: 16,
                slidesPerView: 'auto',
            },
            492: {

            },
            767: {
                spaceBetween: 16,
                slidesPerView: 'auto',
            },
            1024: {
                slidesPerView: 3,
            }
        },
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
    });

    //functions

    function uploadFile(file) {
        if (!['application/pdf'].includes(file.type)) {
            alert('Разрешены только pdf файлы');
            fileInput.value = '';
            return;
        }

        var reader = new FileReader();
        reader.fileName = file.name;
        reader.onload = function (e) {
            filePreview.innerHTML = `<div class="quiz__preview quiz-preview">
            <div class="quiz-preview__left  ">
                <div class="quiz-preview__icon">
                    <img src="img/icons/article.svg" alt="">
                </div>
                <div id="filePreview" class="quiz-preview__title">
                    ${e.target.fileName}
                </div>
            </div>
            <div class="quiz-preview__right">
                <button type="button" class="quiz-preview__button">

                </button>
            </div>
        </div>`;
        };
        reader.onerror = function (e) {
            alert('Ошибка');

        };
        reader.readAsDataURL(file);
    }

    function formAddError(input) {
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
    }

    function formRemoveError(input) {
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error');
    }

    function numberTest(input) {
        return !/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/.test(input.value);
    }

    function mailTest(input) {
        return !/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(input.value);
    }

    function toggleActiveClass(el) {
        el.classList.toggle('_active');
        el.parentElement.classList.toggle('_active');
    }

    function addActiveClass(el) {
        el.classList.add('_active');
        el.parentElement.classList.add('_active');
    }

    function removeActiveClass(el) {
        el.classList.remove('_active');
        el.parentElement.classList.remove('_active');
    }

});

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    document.body.classList.add('_touch');

} else {
    document.body.classList.add('_pc');
};