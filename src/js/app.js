"use strict";

document.addEventListener("DOMContentLoaded", function () {
    // const calcItems = document.querySelectorAll('.calculator-slide__item:nth-child(n+8)');
    // const calcWrapper = document.querySelector('.calculator-slide__row_many-item');
    // if (innerWidth < 767) {
    //     if (calcItems.length > 0) {
    //         const wrapper = document.createElement('div');
    //         calcWrapper.append(wrapper);
    //         calcItems.forEach(el => {
    //             wrapper.append(el);
    //         });
    //     }
    // }
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

    const scrollLinks = document.querySelectorAll('[data-goto]');
    if (scrollLinks.length > 0) {
        scrollLinks.forEach(link => {
            link.addEventListener("click", onScrollLinkClick);
        });

        function onScrollLinkClick(e) {
            const link = e.target;
            if (link.dataset.goto && document.querySelector(link.dataset.goto)) {
                const gotoBlock = document.querySelector(link.dataset.goto);
                const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset;

                window.scrollTo({
                    top: gotoBlockValue,
                    behavior: "smooth"
                });
                e.preventDefault();
            }
        }
    }

    window.addEventListener('scroll', scrollFunction);

    function scrollFunction() {
        const header = document.getElementById('header');
        if (document.body.scrollTop > 75 || document.documentElement.scrollTop > 75) {
            header.classList.add('_fixed');
        } else {
            header.classList.remove('_fixed');
        }
    }

    document.querySelectorAll('.feedback-form__switches_checkbox').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('_active');
        });
    });



    //mobile menu
    const menuBody = document.getElementById('menuBody'),
        menuIcon = document.getElementById('menuIcon'),
        menuIconTouchZone = menuIcon.parentElement;
    if (menuIcon) {
        menuIconTouchZone.addEventListener('click', function () {
            menuIcon.classList.toggle('_active');
            menuBody.classList.toggle('_active');
            document.body.classList.toggle('_lock');
            document.body.classList.toggle('_open');
            menuIconTouchZone.classList.add('_active');
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
    setInterval(() => {
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

    }, 5000);


    //validation on form

    // const inputs = document.querySelectorAll('.input');
    // if (inputs.length > 0) {
    //     inputs.forEach(input => {
    //         input.addEventListener("input", function (e) {
    //             if (input.value.length > 0) {
    //                 addActiveClass(input);
    //             } else {
    //                 removeActiveClass(input);
    //             }

    //         })

    //     });
    // }

    // const form = document.getElementById('form');\
    const forms = document.querySelectorAll('.form');
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
    //toggle active class onlick


    const productSwitch = document.querySelectorAll('.product-compound-graph__switch');
    if (productSwitch.length > 0) {
        productSwitch.forEach(item => {
            item.style.cssText = `width: ${item.dataset.width}%`;
        });

    }

    const feedbackSwitch = document.querySelector('.feedback-form__switches');
    if (feedbackSwitch) {
        const feedbackSwitchParentEl = feedbackSwitch.closest('.products-preview_tab');
        feedbackSwitch.addEventListener('click', function () {
            feedbackSwitch.classList.toggle('_active');
            feedbackSwitch.parentElement.classList.toggle('_active');

            if (feedbackSwitchParentEl) {
                feedbackSwitchParentEl.classList.toggle('_active');
            }
        });
    }

    const inputsWrapper = document.querySelector('.feedback-form-item__content_fields');
    if (inputsWrapper) {
        const addFieldButton = inputsWrapper.querySelector('.feedback-form-item__add-field');
        addFieldButton.addEventListener('click', function () {
            inputsWrapper.insertAdjacentHTML('beforeend', ` <div class="feedback-form-item__content-row">
            <input placeholder="Кличка, возраст, порода" type="text" class="feedback-form-item__input input">
        </div>`);
        });
    }

    const tableItemActiveToSpoller = document.querySelector('.product-compound-table__column:first-child'),
        tableItemSpollerButton = document.querySelector('.product-compound-table__button'),
        tableItemWrapper = document.querySelector('.product-compound-feature__content'),
        tableItem = document.querySelector('.product-compound-table'),
        textItemsSpollerButton = document.querySelector('.product-compound__button');

    if (window.innerWidth < 492) {
        if (tableItemSpollerButton) {
            tableItemWrapper.prepend(tableItemActiveToSpoller);
            tableItem.append(document.querySelector('.product-compound-feature__row'));
            tableItemActiveToSpoller.style.cssText = 'margin: 0 0 20px 0';
            tableItemSpollerButton.addEventListener('click', function () {
                tableItemWrapper.classList.toggle('_active-spl');
            });
            textItemsSpollerButton.addEventListener('click', function () {
                textItemsSpollerButton.parentElement.classList.toggle('_active-spl');
            });
        }
    }

    const calculatorSlides = document.querySelectorAll('.calculator-slide');

    if (calculatorSlides.length > 0) {

        calculatorSlides.forEach(slide => {
            const calculatorSlidesButtonNext = slide.querySelector('.calculator__button._next'),
                calculatorSlidesButtonPrev = slide.querySelector('.calculator__button._back'),
                calculatorSlideCatItem = slide.querySelector('.calculator-slide__item._cat-item'),
                calculatorSlideDogItem = slide.querySelector('.calculator-slide__item._dog-item'),
                calculatorSlidesButtonStart = slide.querySelector('.calculator__button._start');
            if (calculatorSlidesButtonNext) {
                calculatorSlidesButtonNext.addEventListener('click', function () {
                    calculatorSlidesButtonNext.closest('.calculator-slide').classList.remove('_active');
                    calculatorSlidesButtonNext.closest('.calculator-slide').nextElementSibling.classList.add('_active');

                });
            }

            if (calculatorSlideCatItem) {
                calculatorSlideCatItem.addEventListener('click', () => {
                    calculatorSlideCatItem.closest('.calculator').classList.add('_cat-template-next');
                    calculatorSlideCatItem.closest('.calculator').classList.remove('_dog-template-next');
                });
            }

            if (calculatorSlidesButtonStart) {
                calculatorSlidesButtonStart.addEventListener('click', () => {
                    const calcDogBlock = document.querySelector('.calculator__dog-block');
                    const calcCatBlock = document.querySelector('.calculator__cat-block');
                    if (document.querySelector('.calculator').classList.contains('_dog-template-next')) {
                        calcDogBlock.style.cssText = "display: block;";
                        calculatorSlidesButtonStart.closest('.calculator-slide').classList.remove('_active');
                        document.querySelector('.calculator').classList.add('_dog-template');
                        calcDogBlock.querySelector('.calculator-slide').classList.add('_active');
                    } else {
                        calcCatBlock.style.cssText = "display: block;";
                        calculatorSlidesButtonStart.closest('.calculator-slide').classList.remove('_active');
                        document.querySelector('.calculator').classList.add('_cat-template');
                        document.querySelector('.calculator').classList.remove('_dog-template');
                        calcCatBlock.querySelector('.calculator-slide').classList.add('_active');
                    }
                });
            }

            if (calculatorSlideDogItem) {
                calculatorSlideDogItem.addEventListener('click', () => {
                    calculatorSlideDogItem.closest('.calculator').classList.add('_dog-template-next');
                    calculatorSlideDogItem.closest('.calculator').classList.remove('_cat-template-next');
                });
            }
            if (calculatorSlidesButtonPrev) {
                calculatorSlidesButtonPrev.addEventListener('click', function () {
                    calculatorSlidesButtonPrev.closest('.calculator-slide').classList.remove('_active');
                    calculatorSlidesButtonPrev.closest('.calculator-slide').previousElementSibling.classList.add('_active');

                });
            }
        });
    }

    const calculatorSlideFinal = document.querySelectorAll('#finalSlide');
    if (calculatorSlideFinal.length > 0) {
        calculatorSlideFinal.forEach(calculatorSlideFinal => {
            const resetBtn = calculatorSlideFinal.querySelector('.calculator__button-reset');
            if (resetBtn) {
                resetBtn.addEventListener('click', function () {
                    calculatorSlideFinal.classList.remove('_active');
                    document.getElementById('stage-1').classList.add('_active');
                    document.querySelector('.calculator').classList.add('_dog-template');
                    calculatorSlides.forEach(slide => {
                        const checkboxes = slide.querySelectorAll('.calculator-slide__item');
                        if (checkboxes.length > 0) {
                            checkboxes.forEach(checkbox => {
                                checkbox.classList.remove('_active');
                                checkbox.checked = false;
                            });
                        }
                        const inputTypeCheckboxes = slide.querySelectorAll('[type="checkbox"]');
                        if (inputTypeCheckboxes.length > 0) {
                            inputTypeCheckboxes.forEach(box => {
                                box.checked = false;
                            });
                        }
                        // const calculatorSlidesButtonStart = slide.querySelector('.calculator__button._start');
                    });
                    if (document.querySelector('.calculator').classList.contains('_cat-template-next')) {
                        document.querySelector('.calculator').classList.remove('_cat-template-next');
                        document.querySelector('.calculator').classList.remove('_cat-template');
                    }
                });
            }     
        });
       
    }


    const checkboxItems = document.querySelectorAll('.calculator-slide__item');
    if (checkboxItems.length > 0) {
        checkboxItems.forEach(item => {
            item.addEventListener('click', (e) => {
                checkboxItems.forEach(el => {
                    el.classList.remove('_active');
                });
                item.classList.add('_active');
            });
        });
    }



    const rangeSlider = document.querySelectorAll('#calculatorRange');

    if (rangeSlider.length > 0) {
        rangeSlider.forEach(rangeSlider => {
            noUiSlider.create(rangeSlider, {
                start: 25,
                tooltips: true,
                step: 1,
    
                behaviour: 'tap',
                connect: [true, false],
                range: {
                    min: 0.00,
                    max: 50.00
                },
            });
    
            const input = document.querySelectorAll('#forRangeSlider');

            input.forEach(input => {
                input.oninput = function () {
                    if (this.value.length > 2) {
                        this.value = this.value.slice(0, 2);
                    }
                }
                rangeSlider.noUiSlider.on('update', function (values, handle) {
                    input.value = values[handle];
                });
        
                input.addEventListener('input', (e) => {
                    rangeSlider.noUiSlider.set(e.currentTarget.value);
                });     
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
                    }, 50);
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


    const reviewsCard = new Swiper('.reviews-card-slider', {
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
            nextEl: '.reviews-card__slider-button-next',
            prevEl: '.reviews-card__slider-button-prev',
        },
        // autoHeight: true,
        slidesPerView: 2,
        watchoverflow: false,
        spaceBetween: 26,
        slidesPerGroup: 1,
        centeredSlides: false,
        slidesPerColumn: 1,
        loop: true,
        loopedSlides: 0,
        freeMode: false,
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
                initialSlide: 2,
                slidesPerView: 2,
                centeredSlides: false,
            }

        },
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
    });

    const calcSlider = new Swiper('.calculator-slide-slider__content', {
        sumulateTouch: false, //or false
        touchRatio: 1,
        navigation: {
            nextEl: '.calculator-slide-slider__next',
            prevEl: '.calculator-slide-slider__prev',
        },
        touchAngel: 45,
        // initialSlide: 1,
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
        // autoHeight: true,
        slidesPerView: 4,
        watchoverflow: false,
        spaceBetween: 40,
        slidesPerGroup: 1,
        centeredSlides: false,
        slidesPerColumn: 1,
        loop: true,
        autoplay: {
            delay: 5000,
        },
        loopedSlides: 0,
        freeMode: false,
        speed: 600,
        effect: 'slide',
        breakpoints: {
            100: {
                initialSlide: 1,
                centeredSlides: false,
                slidesPerView: 'auto',
                spaceBetween: 0,
            },
            1024: {
                initialSlide: 1,
                centeredSlides: false,
                slidesPerView: 4,
                spaceBetween: 40,
            },
            1400: {
                spaceBetween: 40,
                initialSlide: 1,
                centeredSlides: false,
            }

        },
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
    });

    const reviewsCardSub = new Swiper('.reviews-page-sub-slider__slider', {
        sumulateTouch: false, //or false
        touchRatio: 1,
        touchAngel: 45,
        initialSlide: 1,
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
            nextEl: '.reviews-page-sub-slider__slider-button-next',
            prevEl: '.reviews-page-sub-slider__slider-button-prev',
        },
        // autoHeight: true,
        slidesPerView: 3,
        watchoverflow: false,
        spaceBetween: 26,
        slidesPerGroup: 1,
        centeredSlides: false,
        slidesPerColumn: 1,
        loop: true,
        loopedSlides: 0,
        freeMode: false,
        speed: 600,
        effect: 'slide',
        breakpoints: {
            100: {
                initialSlide: 1,
                slidesPerView: 'auto',
                centeredSlides: false,
                spaceBetween: 10,
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
            1023: {
                initialSlide: 1,
                slidesPerView: 'auto',
                centeredSlides: false,

            },
            1024: {
                initialSlide: 1,
                slidesPerView: 2,
                centeredSlides: false,
            },

            1400: {
                initialSlide: 1,
                slidesPerView: 2,
                centeredSlides: false,
            },
            1440: {
                slidesPerView: 3
            },

        },
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
    });


    const reviewsCardMainItemSlider = new Swiper('.reviews-card-main-item-slider', {
        sumulateTouch: false, //or false
        touchRatio: 1,
        navigation: {
            nextEl: '.reviews-card-main-item-slider__button-next',
            prevEl: '.reviews-card-main-item-slider__button-prev',
        },
        touchAngel: 45,
        // initialSlide: 1,
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
        autoplay: {
            delay: 5000,
        },
        // autoHeight: true,
        slidesPerView: 1,
        watchoverflow: false,
        spaceBetween: 20,
        slidesPerGroup: 1,
        centeredSlides: false,
        slidesPerColumn: 1,
        loop: true,

        loopedSlides: 0,
        freeMode: false,
        speed: 600,
        effect: 'slide',
        breakpoints: {
            100: {
                initialSlide: 1,
                centeredSlides: false,
            },
            1024: {
                initialSlide: 1,
                centeredSlides: false,
            },
            1400: {
                initialSlide: 1,
                centeredSlides: false,
            }

        },
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
    });

    const imageSlider = new Swiper('.community-slider', {
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
        // autoHeight: true,
        slidesPerView: 4,
        watchoverflow: false,
        spaceBetween: 0,
        slidesPerGroup: 1,
        centeredSlides: false,
        slidesPerColumn: 1,
        loop: false,
        loopedSlides: 0,
        freeMode: false,
        speed: 600,
        effect: 'slide',
        breakpoints: {
            100: {
                initialSlide: 1,
                slidesPerView: 'auto',
                centeredSlides: false,
            },
            1024: {
                initialSlide: 1,
                slidesPerView: 3,
                centeredSlides: false,
            },
            1400: {
                initialSlide: 1,
                slidesPerView: 4,
                centeredSlides: false,
            }

        },
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
    });

    const otherProductsSlider = new Swiper('.other-products__slider', {
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
            nextEl: '.other-products__slider-button-next',
            prevEl: '.other-products__slider-button-prev',
        },
        // autoHeight: true,
        slidesPerView: 4,
        watchoverflow: false,
        spaceBetween: 50,
        slidesPerGroup: 1,
        centeredSlides: false,
        slidesPerColumn: 1,
        loop: true,
        loopedSlides: 0,
        freeMode: false,
        speed: 600,
        effect: 'slide',
        breakpoints: {
            100: {
                initialSlide: 1,
                slidesPerView: 2.2,
                centeredSlides: true,
                spaceBetween: 14,
                effect: 'coverflow',
                coverflowEffect: {
                    rotate: 0,
                    stretch: 0,
                    depth: 6,
                    modifier: 120,
                },
            },
            492: {
                centeredSlides: true,
            },
            767: {
                slidesPerView: 3,
                centeredSlides: false,
            },
            1024: {
                initialSlide: 1,
                slidesPerView: 3,
                centeredSlides: false,
                spaceBetween: 24,
                effect: 'slide',
            },
            1400: {
                initialSlide: 1,
                slidesPerView: 4,
                centeredSlides: false,
                spaceBetween: 50,
            }

        },
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
    });

    const productsPreviewSlider = new Swiper('.products-preview__slider', {
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
            nextEl: '.other-products__slider-button-next',
            prevEl: '.other-products__slider-button-prev',
        },
        // autoHeight: true,
        slidesPerView: 3,
        watchoverflow: false,
        spaceBetween: 50,
        slidesPerGroup: 1,
        centeredSlides: true,
        slidesPerColumn: 1,
        loop: true,
        loopedSlides: 0,
        freeMode: false,
        speed: 600,
        effect: 'slide',
        breakpoints: {
            100: {
                initialSlide: 1,
                slidesPerView: 2.2,
                spaceBetween: 14,
                effect: 'coverflow',
                coverflowEffect: {
                    rotate: 0,
                    stretch: 0,
                    depth: 6,
                    modifier: 120,
                },
            },
            492: {
                slidesPerView: 2.5,
            },
            767: {
                slidesPerView: 3,
            },
            1024: {
                initialSlide: 1,
                slidesPerView: 3,
                spaceBetween: 24,
                effect: 'slide',
            },
            1400: {
                initialSlide: 1,
                slidesPerView: 3,
                spaceBetween: 50,
            }

        },
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
    });

    if (window.innerWidth < 1024) {
        const aboutCompanyNewsSlider = document.querySelector('.about-company-news__row'),
            aboutCompanyNewsWrapper = document.querySelector('.about-company-news__wrapper');

        if (aboutCompanyNewsSlider) {
            aboutCompanyNewsSlider.classList.add('swiper');
            aboutCompanyNewsWrapper.classList.add('swiper-wrapper');
            new Swiper(aboutCompanyNewsSlider, {
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
                // autoHeight: true,
                slidesPerView: 3,
                watchoverflow: false,
                spaceBetween: 28,
                slidesPerGroup: 1,
                centeredSlides: false,
                slidesPerColumn: 1,
                loop: true,
                loopedSlides: 0,
                freeMode: false,
                speed: 600,
                effect: 'slide',
                breakpoints: {
                    100: {
                        slidesPerView: 'auto',
                        spaceBetween: 10,
                    },
                    492: {
                        spaceBetween: 28,
                        slidesPerView: 'auto',
                    },

                    1024: {
                        slidesPerView: 3,
                    },
                    1400: {
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

        const reviewsSectionSlider = document.querySelector('.reviews-page__slider');

        if (reviewsSectionSlider) {
            const reviewsSectionSliderWrapper = reviewsSectionSlider.querySelector('.reviews-section__wrapper'),
                reviewsSectionSliderSlides = reviewsSectionSlider.querySelectorAll('.reviews-section__slide');
            reviewsSectionSlider.classList.add('swiper');
            reviewsSectionSliderWrapper.classList.add('swiper-wrapper');
            reviewsSectionSliderSlides.forEach(slide => {
                slide.classList.add('swiper-slide');
            });
            new Swiper(reviewsSectionSlider, {
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
                // autoHeight: true,
                slidesPerView: 3,
                watchoverflow: false,
                spaceBetween: 28,
                slidesPerGroup: 1,
                centeredSlides: false,
                slidesPerColumn: 1,
                loop: false,
                loopedSlides: 0,
                freeMode: false,
                speed: 600,
                effect: 'slide',
                breakpoints: {
                    100: {
                        slidesPerView: 'auto',
                        spaceBetween: 10,
                    },
                    492: {
                        spaceBetween: 28,
                        slidesPerView: 'auto',
                    },

                    1024: {
                        slidesPerView: 3,
                    },
                    1400: {
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


    }



    [].forEach.call(document.querySelectorAll('._tel'), function (input) {
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

    const importMessageBlockOnMob = document.querySelector('.compound-info__message');
    const importCompoundBlockOnMob = document.querySelector('.compound-info__body');
    if (window.innerWidth < 492) {
        if (importCompoundBlockOnMob) {
            importCompoundBlockOnMob.append(importMessageBlockOnMob);
        }
    }


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
}