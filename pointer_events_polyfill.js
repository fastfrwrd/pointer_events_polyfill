define(['jquery'], function($) {
    'use strict';
    /*
     * https://github.com/kmewhort/pointer_events_polyfill
     * Pointer Events Polyfill: Adds support for the style attribute "pointer-events: none" to browsers without this feature (namely, IE).
     * (c) 2013, Kent Mewhort, licensed under BSD. See LICENSE.txt for details.
     */

    /**
     * this module was adapted to meet HomeAway's ESLint standards.
     */

    // constructor
    function PointerEventsPolyfill(options) {
        var obj = this;

        // set defaults
        obj.options = {
            selector: '*',
            mouseEvents: ['click', 'dblclick', 'mousedown', 'mouseup', 'hover', 'mouseover', 'mouseout'],
            usePolyfillIf: function() {
                var agent, version;

                if (navigator.appName === 'Microsoft Internet Explorer') {
                    agent = navigator.userAgent;

                    if (agent.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/)) {
                        version = parseFloat(RegExp.$1);
                        if (version < 11) {
                            return true;
                        }
                    }
                }

                return false;
            }
        };

        if (options) {
            $.each(options, function(k, v) {
                obj.options[k] = v;
            });
        }

        if (obj.options.usePolyfillIf()) {
            obj.register_mouse_events();
        }
    }

    // singleton initializer
    PointerEventsPolyfill.initialize = function(options) {
        if (!PointerEventsPolyfill.singleton) {
            PointerEventsPolyfill.singleton = new PointerEventsPolyfill(options);
        }

        return PointerEventsPolyfill.singleton;
    };

    // handle mouse events w/ support for pointer-events: none
    PointerEventsPolyfill.prototype.register_mouse_events = function() {
        // register on all elements (and all future elements) matching the selector
        $(document).on(this.options.mouseEvents.join(' '), this.options.selector, function(e) {
            var origDisplayAttribute, underneathElem;

            if ($(this).css('pointer-events') === 'none') {
                // peak at the element below
                origDisplayAttribute = $(this).css('display');

                $(this).css('display', 'none');

                underneathElem = document.elementFromPoint(e.clientX, e.clientY);

                if (origDisplayAttribute) {
                    $(this).css('display', origDisplayAttribute);
                } else {
                    $(this).css('display', '');
                }

                 // fire the mouse event on the element below
                e.target = underneathElem;
                $(underneathElem).trigger(e);

                return false;
            }

            return true;
        });
    };

    return PointerEventsPolyfill;
});
