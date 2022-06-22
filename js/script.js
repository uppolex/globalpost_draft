const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');

let search_block = document.querySelector('.search');

if (iconMenu) {
    iconMenu.addEventListener("click", function (e) {
        document.body.classList.toggle('_lock');
        iconMenu.classList.toggle('_active');
        menuBody.classList.toggle('_active');
        search_block.classList.remove("_active");
    });
}


(function () {
    let original_positions = [];
    let da_elements = document.querySelectorAll('[data-da]');
    let da_elements_array = [];
    let da_match_media = [];
    if (da_elements.length > 0) {
        let number = 0;
        for (let index = 0; index < da_elements.length; index++) {
            const da_element = da_elements[index];
            const da_move = da_element.getAttribute('data-da');
            const da_array = da_move.split(',');
            if (da_array.length == 3) {
                da_element.setAttribute('data-da-index', number);
                original_positions[number] = {
                    "parent": da_element.parentNode,
                    "index": index_in_parent(da_element)
                };
                da_elements_array[number] = {
                    "element": da_element,
                    "destination": document.querySelector('.' + da_array[0].trim()),
                    "place": da_array[1].trim(),
                    "breakpoint": da_array[2].trim()
                }
                number++;
            }
        }
        dynamic_adapt_sort(da_elements_array);

        for (let index = 0; index < da_elements_array.length; index++) {
            const el = da_elements_array[index];
            const da_breakpoint = el.breakpoint;
            const da_type = "max";      // для MobileFirst поменять на min

            da_match_media.push(window.matchMedia("(" + da_type + "-width: " + da_breakpoint + "px)"));
            da_match_media[index].addListener(dynamic_adapt);

        }
    }
    function dynamic_adapt(e) {
        for (let index = 0; index < da_elements_array.length; index++) {
            const el = da_elements_array[index];
            const da_element = el.element;
            const da_destination = el.destination;
            const da_place = el.place;
            const da_breakpoint = el.breakpoint;
            const da_classname = "_dynamic_adapt_" + da_breakpoint;

            if (da_match_media[index].matches) {
                if (!da_element.classList.contains(da_classname)) {
                    let actual_index;
                    if (da_place == 'first') {
                        actual_index = index_of_elements(da_destination)[0];
                    } else if (da_place == 'last') {
                        actual_index = index_of_elements(da_destination)[index_of_elements(da_destination).length];
                    } else {
                        actual_index = index_of_elements(da_destination)[da_place];
                    }
                    da_destination.insertBefore(da_element, da_destination.children[actual_index]);
                    da_element.classList.add(da_classname);
                }
            } else {
                if (da_element.classList.contains(da_classname)) {
                    dynamic_adapt_back(da_element);
                    da_element.classList.remove(da_classname);
                }
            }
        }
        custom_adapt();
    }

    dynamic_adapt();

    function dynamic_adapt_back(el) {
        const da_index = el.getAttribute('data-da-index');
        const original_place = original_positions[da_index];
        const parent_place = original_place['parent'];
        const index_place = original_place['index'];
        const actual_index = index_of_elements(parent_place, true)[index_place];
        parent_place.insertBefore(el, parent_place.children[actual_index]);
    }
    function index_in_parent(el) {
        var children = Array.prototype.slice.call(el.parentNode.children);
        return children.indexOf(el);
    }
    function index_of_elements(parent, back) {
        const children = parent.children;
        const children_array = [];
        for (let i = 0; i < children.length; i++) {
            const children_element = children[i];
            if (back) {
                children_array.push(i);
            } else {
                if (children_element.getAttribute('data-da') == null) {
                    children_array.push(i);
                }
            }
        }
        return children_array;
    }
    function dynamic_adapt_sort(arr) {
        arr.sort(function (a, b) {
            if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }   // Для MobileFirst поменять
        });
        arr.sort(function (a, b) {
            if (a.place > b.place) { return 1 } else { return -1 }
        });
    }
    function custom_adapt() {
        const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }

    window.addEventListener('resize', function (event) {

    });
})()



const track_btn = document.querySelector('.track__btn');
const track_input = document.querySelector('.track__input');
track_btn.addEventListener("click", function(e) {
    e.preventDefault()
    track_btn.classList.toggle("_active");
    track_input.classList.toggle("_active");
})


const track_mobile_btns = document.querySelectorAll('.track__mobile-btn');
const track_mobile_btn_open = document.querySelector('.track__mobile-btn_open');
const track_mobile_btn_close = document.querySelector('.track__mobile-btn_close');
const header_content_track = document.querySelector('.header__content-track');

track_mobile_btns.forEach(
    track_mobile_btn => {
        track_mobile_btn.addEventListener("click", function(e) {
            e.preventDefault()
            track_input.classList.toggle("_active");
            header_content_track.classList.toggle("_active");
            track_mobile_btn_open.classList.toggle("_inactive");
            track_mobile_btn_close.classList.toggle("_active");
        });        
    }
)



document.addEventListener('keyup', function (event) {
    if (event.code === 'Escape') {
        track_btn.classList.remove('_active');
        track_input.classList.remove('_active');
        track_mobile_btn_open.classList.remove('_inactive');
        track_mobile_btn_close.classList.remove('_active');
        header_content_track.classList.remove('_active');
    }
});


let search_header_btn = document.querySelector('.search-header');
search_header_btn.addEventListener("click", function(e) {
    e.preventDefault()
    search_block.classList.toggle("_active");
})


function fadeIn(el, time) {
    el.style.opacity = 0;

    let last = +new Date();
    let tick = function () {
        el.style.opacity = +el.style.opacity + (new Date() - last) / time;
        last = +new Date();

        if (+el.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        }
    };

    tick();
}

function fadeOut(el, time) {
    el.style.opacity = 1;

    var last = +new Date();
    var tick = function () {
        el.style.opacity = +el.style.opacity - (new Date() - last) / time;
        last = +new Date();

        if (+el.style.opacity > 0) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        }
    };

    tick();
}



let tabs = document.querySelectorAll('._tabs');
if (tabs) {
    for (let index = 0; index < tabs.length; index++) {
        let tabs_cont = tabs[index];
        let tabs_items = tabs_cont.querySelectorAll('._tabs-item');
        let tabs_blocks = tabs_cont.querySelectorAll('._tabs-block');
        for (let index = 0; index < tabs_items.length; index++) {
            let tabs_item = tabs_items[index];
            tabs_item.addEventListener("click", function (e) {
                tabs_items.forEach(
                    (item) => {
                        item.classList.remove('_active');
                    }
                )
                tabs_blocks.forEach(
                    (item) => item.classList.remove('_active')
                )
                tabs_item.classList.add('_active');
                tabs_blocks[index].classList.add('_active');
                fadeIn(tabs_blocks[index], 400)
            })
        }
    }
}


let selects = document.getElementsByTagName('select');
if (selects.length > 0) {
    selects_init();
}
function selects_init() {
    for (let index = 0; index < selects.length; index++) {
        const select = selects[index];
        select_init(select);
    }
    document.addEventListener('click', function (e) {
        selects_close(e);
    });
    document.addEventListener('keydown', function (e) {         
        if (e.which == 27) {                                    
            selects_close(e);
        }
    });
}
function selects_close(e) {
    const selects = document.querySelectorAll('.select');
    if (!e.target.closest('.select')) {                             
        for (let index = 0; index < selects.length; index++) {
            const select = selects[index];                          
            const select_body_options = select.querySelector('.select__options');
            select.classList.remove('_active');                     
            _slideUp(select_body_options, 100);                     
        }
    }
}
function select_init(select) {                                  
    const select_parent = select.parentElement;
    const select_modifikator = select.getAttribute('class');    
    const select_selected_option = select.querySelector('option[selected]');    
    select.setAttribute('data-default', select_selected_option.value)      
    select.style.display = 'none';

    select_parent.insertAdjacentHTML('beforeend', '<div class="select select_' + select_modifikator + '"></div>')    

    let new_select = select.parentElement.querySelector('.select') 
    new_select.appendChild(select);                                
    select_item(select);
}
function select_item(select) {
    const select_parent = select.parentElement;                 
    const select_items = select_parent.querySelector('.select__item');
    const select_options = select.querySelectorAll('option');
    const select_selected_option = select.querySelector('option[selected]');    
    const select_selected_text = select_selected_option.text;
    const select_type = select.getAttribute('data-type');
    const input_placeholder = select.getAttribute('data-placeholder');
    const input_value = select.getAttribute('data-inputvalue');

    if (select_items) {
        select_items.remove();
    }

    let select_type_content = '';
    if (select_type == 'input') {
        let input_content = ''
        if (input_placeholder) {
            input_content += ` placeholder="${input_placeholder}" `
        }
        if (input_value !== "empty") {
            input_content += ` value="${select_selected_text}" `
        }
        select_type_content = '<div class="select__value icon-select-arrow"><input autocomplete="off" type="text" name="form[]"' + input_content + 'data-error="Ошибка" data-value="" class="select__input"></div>'        // НЕДОПИСАНО   // возможно, это для работы, как с элементами <datalist>

    } else {
        select_type_content = '<div class="select__value icon-select-arrow"><span>' + select_selected_text + '</span></div>';
    }

    select_parent.insertAdjacentHTML('beforeend',                                       // вставляем весь код html для кастомного дропдауна 
        '<div class="select__item" tabindex="0">' +
        '<div class="select__title">' + select_type_content + '</div>' +
        '<div class="select__options">' + select_get_options(select_options) +          // в оригинале '<div class="select__options">' + select_get_options(select_options) + '</div>' +      // хотя это нелогично - лишний закрывающий div
        '</div></div>');

    select_actions(select, select_parent);
}
function select_actions(original, select) {                         // здесь select - это общий контейнер с классом .select
    const select_item = select.querySelector('.select__item');
    const select_body_options = select.querySelector('.select__options');
    const select_options = select.querySelectorAll('.select__option');
    const select_type = original.getAttribute('data-type');
    const select_input = select.querySelector('.select__input');

    ["click", "keydown"].forEach(ev => {
        select_item.addEventListener(ev, function (e) {
            if (e.type == "click" || e.keyCode === 32) {
                console.log(ev);

                e.preventDefault();
                let selects = document.querySelectorAll('.select');
                for (let index = 0; index < selects.length; index++) {
                    const select = selects[index];
                    const select_body_options = select.querySelector('.select__options');
                    if (select != select_item.closest('.select')) {                     
                        select.classList.remove('_active');
                        _slideUp(select_body_options, 100);
                    }
                }
                _slideToggle(select_body_options, 100);
                select.classList.toggle('_active');
                
                for (let index = 0; index < select_options.length; index++) {  
                    const element = select_options[index];
                    let element_display = window.getComputedStyle(element).display;
                    if (element_display !== "none" && select.classList.contains('_active')) {
                        element.focus();
                        break;
                    }
                }
                if (!select.classList.contains('_active')) {
                    select_item.focus();
                }
            } 
        });
    })
    for (let index = 0; index < select_options.length; index++) {
        const select_option = select_options[index];
        const select_option_value = select_option.getAttribute('data-value');
        const select_option_text = select_option.innerHTML;
            
        if (select_type == 'input') {
            select_input.addEventListener('keyup', select_search);
        } else {
            if (select_option.getAttribute('data-value') == original.value) {
                select_option.style.display = 'none';
            }
        }

        select_option.setAttribute("tabindex", 0);
        select_option.addEventListener("keydown", function (ev) {
            if (ev.keyCode === 40 && select_option.nextElementSibling) {
                ev.preventDefault();
                select_option.nextElementSibling.focus()
            } else if (ev.keyCode === 38 && select_option.previousElementSibling) {
                ev.preventDefault();
                select_option.previousElementSibling.focus()
            }
        });

        ["click", "keydown"].forEach(ev => {
            select_option.addEventListener(ev, function (e) {
                if (e.type == "click" || e.keyCode === 13) {
                    if (ev === "keydown") {
                        _slideToggle(select_body_options, 100);
                        select.classList.toggle('_active');
                        select_item.focus();
                    }
                    for (let index = 0; index < select_options.length; index++) {
                        const el = select_options[index];
                        el.style.display = 'block';
                    }
                    if (select_type == 'input') {
                        select_input.value = select_option_text;
                        original.value = select_option_value;
                    } else {
                        select.querySelector('.select__value').innerHTML = '<span>' + select_option_text + '</span>';
                        original.value = select_option_value;
                        select_option.style.display = 'none';
                    }
                }
            });            
        })

    }
}
function select_get_options(select_options) {
    if (select_options) {
        let select_options_content = '';
        for (let index = 0; index < select_options.length; index++) {
            const select_option = select_options[index];
            const select_option_value = select_option.value;
            if (select_option_value != '' && !select_option.disabled) {
                const select_option_text = select_option.text;
                select_options_content = select_options_content + '<div data-value="' + select_option_value + '" class="select__option">' + select_option_text + '</div>'
            }
        }
        return select_options_content;
    }
}
function select_search(e) {
    let select_block = e.target.closest('.select').querySelector('.select__options');
    let select_options = e.target.closest('.select').querySelectorAll('.select__option');
    let select_search_text = e.target.value.toUpperCase();
    
    for (let i = 0; i < select_options.length; i++) {
        let select_option = select_options[i];
        let select_txt_value = select_option.textContent || select_option.innerText;
        if (select_txt_value.toUpperCase().indexOf(select_search_text) > -1) {
            select_option.style.display = "";
        } else {
            select_option.style.display = "none";
        }
    }
}
function selects_update_all() {
    let selects = document.querySelectorAll('select');
    if (selects) {
        for (let index = 0; index < selects.length; index++) {
            const select = selects[index];
            select_item(select);
        }
    }
}

let _slideUp = (target, duration = 500) => {
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
        target.style.display = 'none';
        target.style.removeProperty('height');
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
        target.classList.remove('_slide');
    }, duration);
}
let _slideDown = (target, duration = 500) => {
    target.style.removeProperty('display');
    let display = window.getComputedStyle(target).display;
    if (display === 'none')
        display = 'block';

    target.style.display = display;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = 'height, margin, padding';
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
let _slideToggle = (target, duration = 500) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        if (window.getComputedStyle(target).display === 'none') {
            return _slideDown(target, duration);
        } else {
            return _slideUp(target, duration);
        }
    }
}
let select_complex_dropdowns = document.querySelectorAll('.select-complex-dropdown');
if (select_complex_dropdowns.length > 0) {
    select_complex_items_init();
}
function select_complex_items_init() {
    for (let index = 0; index < select_complex_dropdowns.length; index++) {
        const select_dropdown = select_complex_dropdowns[index];
        select_complex_actions(select_dropdown);
    }
    // // select_callback();
    document.addEventListener('click', function (e) {           
        selects_complex_close(e);
    });
    document.addEventListener('keydown', function (e) {         
        if (e.which == 27) {                                    
            selects_complex_close(e);
        }
    });
}
function selects_complex_close(e) {
    let select_complex_dropdowns = document.querySelectorAll('.select-complex-dropdown');
    if (!e.target.closest('.select-complex-dropdown')) {                             
        for (let index = 0; index < select_complex_dropdowns.length; index++) {
            const select_dropdown = select_complex_dropdowns[index];                          
            const select_dropdown_name = select_dropdown.getAttribute('data-sel_complex_name');
            const select_list = document.querySelector(`[data-sel_complex_options="${select_dropdown_name}"]`);
            _slideUp(select_list, 100);
            select_dropdown.classList.remove('_active');
            select_list.classList.remove('_active');
        }
    }
}
function select_complex_actions(select_dropdown) {
    const select_name = select_dropdown.getAttribute('data-sel_complex_name');
    const select_list = document.querySelector(`[data-sel_complex_options="${select_name}"]`);
    const select_input = select_dropdown.closest('.select-complex-item').querySelector('input');
    const select_options = select_list.querySelectorAll('.select-complex__option');

    select_dropdown.addEventListener('click', function () {
        let select_complex_dropdowns = document.querySelectorAll('.select-complex-dropdown');
        for (let index = 0; index < select_complex_dropdowns.length; index++) {
            const some_select_dropdown = select_complex_dropdowns[index];
            const some_select_name = some_select_dropdown.getAttribute('data-sel_complex_name');
            const some_select_list = document.querySelector(`[data-sel_complex_options="${some_select_name}"]`);
            if (some_select_dropdown != select_dropdown) {                     
                some_select_dropdown.classList.remove('_active');
                _slideUp(some_select_list, 100);
            }
        }
        _slideToggle(select_list, 100);
        select_dropdown.classList.toggle('_active');
        select_list.classList.toggle('_active');
    });
    for (let index = 0; index < select_options.length; index++) {
        const select_option = select_options[index];
        const select_option_value = select_option.getAttribute('data-value');
        const select_option_text = select_option.innerHTML;
        select_option.addEventListener('click', function () {
            select_dropdown.innerHTML = select_option_text;
            select_input.value = select_option_value
            select_dropdown.setAttribute('data-value', select_option_value);
            _slideToggle(select_list, 100);
            select_dropdown.classList.toggle('_active');
            select_list.classList.toggle('_active');
        });
    }
}


// ==================================================================

let quantityButtons = document.querySelectorAll('.quantity__button');
if (quantityButtons.length > 0) {
    for (let index = 0; index < quantityButtons.length; index++) {
        const quantityButton = quantityButtons[index];
        quantityButton.addEventListener("click", function (e) {
            let value = parseInt(quantityButton.closest('.quantity').querySelector('input').value);
            if (quantityButton.classList.contains('quantity__button_plus')) {
                value++;
            } else {
                value = value - 1;
                if (value < 0) {
                    value = 0
                }
            }
            let quantity_input = quantityButton.closest('.quantity').querySelector('input')
            quantity_input.value = value;
            quantity_buffer = quantity_input.nextSibling;
            adapt_input_extra_handler(quantity_input, quantity_buffer);
            adapt_input(quantity_input);
        });
    }
}


// ==================================================================
var adaptive_inputs = document.querySelectorAll('.adaptive_input'),
  buffer = [];

window.addEventListener("load", adaptive_inputs_init);
function adaptive_inputs_init() {
    for (let i = 0; i < adaptive_inputs.length; i++) {
        const adaptive_input = adaptive_inputs[i];
        buffer[i] = document.createElement('span');
        const adaptive_buffer = buffer[i];
        adaptive_buffer.className = "adaptive_buffer";

        adapt_input_extra_handler(adaptive_input, adaptive_buffer);

        const adaptive_input_style = getComputedStyle(adaptive_input);

        adaptive_buffer.style.position = "absolute";
        adaptive_buffer.style.visibility = "hidden";
        adaptive_buffer.style.whiteSpace = "nowrap";
        adaptive_buffer.style.zIndex = "-1";
        adaptive_buffer.style.fontFamily = adaptive_input_style.fontFamily;
        adaptive_buffer.style.fontSize = adaptive_input_style.fontSize;
        adaptive_buffer.style.letterSpacing = adaptive_input_style.letterSpacing;
        adaptive_buffer.style.fontWeight = adaptive_input_style.fontWeight;
        adaptive_input.parentNode.insertBefore(adaptive_buffer, adaptive_input.nextSibling);
        adapt_input(adaptive_input);
        adaptive_input.addEventListener('input', () => adapt_input(adaptive_input));
        adaptive_input.addEventListener('blur', function () {
            adapt_input_extra_handler(adaptive_input, adaptive_buffer);
            adapt_input(adaptive_input);
        });
    }
}

function adapt_input (input_element) {
    input_element.nextElementSibling.innerHTML = input_element.value;
    input_element.style.width = input_element.nextElementSibling.clientWidth + 'px';
}

function adapt_input_extra_handler(input_element, buffer_element) {
    let input_measure = input_element.parentElement.querySelector('.adaptive_measure');
    if (input_element.value === "" || input_element.value === "0" ) {
        input_element.value = "0";
        input_element.classList.add('_unset');
        buffer_element.classList.add('_unset');
        if (input_measure) {
            input_measure.classList.add('_unset');
        }
    } else {
        input_element.classList.remove('_unset');
        buffer_element.classList.remove('_unset');
        if (input_measure) {
            input_measure.classList.remove('_unset');
        }
    }
}
// ==================================================================
let extra_services = document.querySelectorAll('.checkbox-extra-services__body');
for (let index = 0; index < extra_services.length; index++) {
    const extra_service = extra_services[index];
    extra_service.addEventListener('mouseenter', function (e) {
        this.classList.add('_active');
        _slideDown(this.querySelector('.checkbox-extra-services__text'));
    });
    extra_service.addEventListener('mouseleave', function (e) {
        this.classList.remove('_active');
        _slideUp(this.querySelector('.checkbox-extra-services__text'));
    });
}


// ============================================================================================
const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (
            isMobile.Android() ||
            isMobile.BlackBerry() ||
            isMobile.iOS() ||
            isMobile.Opera() ||
            isMobile.Windows());
    }
};

// ==================================================================
if (isMobile.any() || window.matchMedia("(max-width: 1400px)").matches) {
    const dropdownOpeners = document.querySelectorAll('._dropdown-opener');
    for (let index = 0; index < dropdownOpeners.length; index++) {
        const dropdownOpener = dropdownOpeners[index];
        dropdownOpener.addEventListener("click", function (e) {
            if (!e.target.closest('._dropdown-opener__menu')) {
                dropdownOpener.classList.toggle('_active');
                let dropdownOpenerMenu = dropdownOpener.querySelector('._dropdown-opener__menu');
                _slideToggle(dropdownOpenerMenu);
            }
        })
    }
    document.addEventListener("click", function (e) {
        const dropdownOpenersActive = document.querySelectorAll('._dropdown-opener._active');
        if (!e.target.closest('._dropdown-opener') & dropdownOpenersActive.length > 0) {
            for (let index = 0; index < dropdownOpenersActive.length; index++) {
                const dropdownOpenerActive = dropdownOpenersActive[index];
                dropdownOpenerActive.classList.remove('_active');
                _slideUp(dropdownOpenerActive.querySelector('._dropdown-opener__menu'));
            }
        }
    })
}


// ==================================================================
let track_status = document.querySelector('.track-status__items');
let track_status_items = document.querySelectorAll('.track-status__item');

for (let index = 0; index < track_status_items.length; index++) {
    const track_status_item = track_status_items[index];
    if (track_status_item.classList.contains('_active') && index > 0) {
        for (let i = 0; i < index; i++) {
            const element = track_status_items[i];
            element.classList.add('_done');
            if (i === index - 1) {
                element.querySelector('.indicator__line_bottom').style.display = 'none';
            }
        };
        if (track_status_items[index + 1]) {
            track_status_items[index + 1].querySelector('.indicator__line_top').style.display = 'none';
        }
    }
}


// ==================================================================


if (window.matchMedia("(min-width: 1492px)").matches) {
    window.addEventListener("load", adapt_text_width);
    console.log(1111);
} else {
}

function adapt_text_width() {
    var d = document.querySelectorAll('.stages__name'),
    i, w, width, height;

    for (i = 0; i < d.length; i++) {
        width = d[i].offsetWidth;
        height = d[i].offsetHeight;

        for (w = width; w; w--) {
            d[i].style.width = w + 'px';
            if (d[i].offsetHeight !== height) break;
        }

        if (w < d[i].scrollWidth) {
            d[i].style.width = d[i].style.maxWidth = d[i].scrollWidth + 'px';
        } else {
            d[i].style.width = (w + 1) + 'px';
        }
    }
}


// ==================================================================

let btn = document.querySelectorAll('button[type="submit"],input[type="submit"]');
let forms = document.querySelectorAll('form');
if (forms.length > 0) {
    for (let index = 0; index < forms.length; index++) {
        const el = forms[index];
        el.addEventListener('submit', form_submit);
    }
}
function form_submit(e) {
    let btn = event.target;
    let form = btn.closest('form');
    let message = form.getAttribute('data-message');
    let error = form_validate(form);
    if (error == 0) {
        console.log(1111);
        // SendForm
        form_clean(form);
        if (message) {
            popup_open('message-' + message);
            e.preventDefault();
        }
    } else {
        let form_error = form.querySelectorAll('._error');
        if (form_error && form.classList.contains('_goto-error')) {
            _goto(form_error[0], 1000, 50)
        }
        e.preventDefault();
    }
}
function form_validate(form) {
    let error = 0;
    let form_req = form.querySelectorAll('._req');
    if (form_req.length > 0) {
        for (let index = 0; index < form_req.length; index++) {
            const el = form_req[index];
            if (!_is_hidden(el)) {
                error += form_validate_input(el);
            }
        }
    }
    return error;
}
function form_validate_input(input) {
    let error = 0;
    let input_g_value = input.getAttribute('data-value');

    if (input.getAttribute("name") == "email" || input.classList.contains("_email")) {
        if (input.value != input_g_value) {
            let em = input.value.replace(" ", "");
            input.value = em;
        }
        if (email_test(input) || input.value == input_g_value) {
            form_add_error(input);
            error++;
        } else {
            form_remove_error(input);
        }
    } else if (input.getAttribute("type") == "checkbox" && input.checked == false) {
        form_add_error(input);
        error++;
    } else if (input.getAttribute("type") == "tel" || input.classList.contains("_phone")) {
        if (!phoneTest(input)) {
            form_add_error(input);
            error++;
        } else {
            form_remove_error(input);
        }
    } else {
        if (input.value == '' || input.value == input_g_value) {
            form_add_error(input);
            error++;
        } else {
            form_remove_error(input);
        }
    }
    return error;
}
function form_add_error(input) {
    input.classList.add('_error');
    input.parentElement.classList.add('_error');

    let input_error = input.parentElement.querySelector('.form__error');
    if (input_error) {
        input.parentElement.removeChild(input_error);
    }
    let input_error_text = input.getAttribute('data-error');
    if (input_error_text && input_error_text != '') {
        if (!input.parentElement.nextElementSibling || (input.parentElement.nextElementSibling && !input.parentElement.nextElementSibling.classList.contains('form__error'))) {
            input.parentElement.insertAdjacentHTML('afterend', '<div class="form__error">' + input_error_text + '</div>');
        }
    }
}
function form_remove_error(input) {
    input.classList.remove('_error');
    input.parentElement.classList.remove('_error');

    let input_error = input.parentElement.parentElement.querySelector('.form__error');
    if (input_error) {
        input.parentElement.parentElement.removeChild(input_error);
    }
}

function email_test(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}
function form_clean(form) {
    let inputs = form.querySelectorAll('input,textarea');
    for (let index = 0; index < inputs.length; index++) {
        const el = inputs[index];
        el.parentElement.classList.remove('_focus');
        el.classList.remove('_focus');
        el.value = el.getAttribute('data-value');
    }
    let checkboxes = form.querySelectorAll('.checkbox__input');
    if (checkboxes.length > 0) {
        for (let index = 0; index < checkboxes.length; index++) {
            const checkbox = checkboxes[index];
            checkbox.checked = false;
        }
    }
    let selects = form.querySelectorAll('select');
    if (selects.length > 0) {
        for (let index = 0; index < selects.length; index++) {
            const select = selects[index];
            const select_default_value = select.getAttribute('data-default');
            select.value = select_default_value;
            select_item(select);
        }
    }
}
function _is_hidden(el) {
    return (el.offsetParent === null)
}


// ==================================================================
// ==================================================================
const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding');    

let unlock = true;

const timeout = 800;        

if (popupLinks.length > 0) {
    for (let index = 0; index < popupLinks.length; index++) {
        const popupLink = popupLinks[index];
        popupLink.addEventListener('click', function (e) {
            const popupName = popupLink.getAttribute('href').replace('#', '');  
            const currentPopup = document.getElementById(popupName);            
            popupOpen(currentPopup);
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

function popupOpen(currentPopup) {
    if (currentPopup && unlock) {
        const popupActive = document.querySelector('.popup.open');
        if (popupActive) {
            popupClose(popupActive, false);        
        } else {
            bodyLock();
        }
        currentPopup.classList.add('open');             
        currentPopup.addEventListener("click", function (e) {
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
            bodyUnlock();           
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

function bodyUnlock() {
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
    }, 0);
}

document.addEventListener('keydown', function (e) {
    if (e.which == 27) {
        const popupActive = document.querySelector('.popup.open');
        if (popupActive) {
            popupClose(popupActive);
        }
    }
});

// ==================================================================
// <input type="tel" class="_phone">
const phone_inputs = document.querySelectorAll('._phone, input[type="tel"]');

if (phone_inputs) {
    for (let index = 0; index < phone_inputs.length; index++) {
        const phone_input = phone_inputs[index];
        phone_input.setAttribute('maxlength', 20);
        phone_input.addEventListener('keypress', validatePhoneSymbol);
        phone_input.addEventListener('blur', validatePhone);
    }
}
function validatePhoneSymbol(e) {
    let input_value = e.target.value
    var key = e.keyCode || e.which;
    key = String.fromCharCode(key);
    regex = /[0-9 + ()-]/;          
    if (key === " " && key == input_value[input_value.length-1]) { 
        e.preventDefault();
    }
    if (key === "+" && input_value.length > 0) {    
        e.preventDefault();
    }
    if(!regex.test(key)) {         
        e.preventDefault();
    }
}
function validatePhone(e) {
    if (!phoneTest(e.target) && e.target.value.length > 0) {
        e.target.classList.add('_error');
        e.target.parentElement.classList.add('_error');
    } else {
        e.target.classList.remove('_error');
        e.target.parentElement.classList.remove('_error');
    }
}
function phoneTest(input) {
    input.value = input.value.trim();
    var regex = /^[\d\+][\d\(\)\ -]{4,18}\d$/;
    return regex.test(input.value)
}
