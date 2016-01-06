define(['angular', 'services', 'jquery'], function(angular, services) {
    'use strict';

    /* Directives */
    angular.module('directives', ['services'])
        .directive('appVersion', ['version',
            function(version) {
                return function(scope, elm, attrs) {
                    console.log("Directive");
                    elm.text("2");
                };
            }
        ]).directive('animClass', function($route) {
            return {
                link: function(scope, elm, attrs) {
                    var enterClass = $route.current.animate;
                    elm.addClass(enterClass);
                    scope.$on('$destroy', function() {
                        elm.removeClass(enterClass);
                        elm.addClass($route.current.animate);
                    })
                }
            }
        }).directive('printDiv', ['dialogs', '$translate', function(dialogs, $translate) {
            return {
                restrict: 'A',
                link: function($scope, element, attrs) {
                    element.bind('click', function(evt) {
                        evt.preventDefault();
                        if (attrs.value <= 0) {
                            dialogs.notify($translate.instant(attrs.confTitle), $translate.instant(attrs.confMsg));
                        } else {
                            PrintElem(attrs.printDiv);
                        }
                    });

                    function PrintElem(elem) {
                        PrintWithWindow($(elem).html());
                    }

                    function PrintWithWindow(data) {
                    	var wwidth = '1020';
                        var wheight = '1020';
                        var LeftPosition = (screen.width) ? (screen.width - wwidth) / 2 : 0;
                        var TopPosition = (screen.height) ? (screen.height - wheight) / 2 : 0;
                        var settings =
                              'height=' + wheight + ',width=' + wwidth + ',top=' + TopPosition + ',left=' + LeftPosition
                                    + ',scrollbars=yes,resizable'
                    	var printStyleCollection ="";
                    	var mywindow;
                    	
                    	$.when($.get("assets/styles/printpreview.css"))
                        .done(function(response)
                        {
                          printStyleCollection = '<style type="text/css">' + response + '</style>'
                          mywindow = window.open('', '_blank', settings);
                          mywindow.document.open();
                          mywindow.document.write('<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">');
                          mywindow.document.write('<html><head><title>Print Dialog</title>' + printStyleCollection);
                          mywindow.document.write('</head><body><div>');
                          mywindow.document.write(data);
                          mywindow.document.write('</div></body></html>');
                          
                          mywindow.print()
                          setTimeout(function() {
                              mywindow.document.close();
                          }, 2000);
                          
                        });
                        return true;
                    }
                }
            };
        }]).directive('focusMe', function($timeout) {
            return function(scope, element, attrs) {
                scope.$watch(attrs.focusMe, function(value) {
                    if (value) {
                        $timeout(function() {
                            element[0].focus();
                        }, 700);
                    }
                });
            };
        }).directive('numbersOnly', function() {
            return {
                restrict: 'A',
                link: function(scope, elm, attrs, ctrl) {
                    elm.on('keydown', function(event) {
                        if ([8, 13, 27, 37, 38, 39, 40].indexOf(event.which) > -1) {
                            // backspace, enter, escape, arrows
                            return true;
                        } else if (event.which >= 48 && event.which <= 57) {
                            // numbers
                            return true;
                        } else if (event.which >= 96 && event.which <= 105) {
                            // numpad number
                            return true;
                        }
                        /*else if ([110, 190].indexOf(event.which) > -1) {
                                            // dot and numpad dot
                                            return true;
                                        }*/
                        else {
                            event.preventDefault();
                            return false;
                        }
                    });
                }
            }
        })directive('openInNewTab', [function() {
            return {
                compile: function(element) {
                    element.attr('target', '_blank');
                }
            };
        }]).directive('ieForceRedraw', [function() {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attributes, ngModelCtrl) {
                    var isIE = document.attachEvent;
                    if (!isIE) return;
                    var control = element[0];
                    //to fix IE9 issue with parent and detail controller, we need to depend on the parent controller
                    scope.$watchCollection(attributes.ieForceRedraw, function() {
                        //this will add and remove the options to trigger the rendering in IE9
                        var option = document.createElement("option");
                        control.add(option, null);
                        control.remove(control.options.length - 1);
                    });
                }
            }
        }]).directive('optionsClass', [function() {
            return {
                require: 'select',
                link: function(scope, element, attrs, ngSelect) {
                    var addClass = function() {
                        $('.optionClass option').each(function() {
                            var classCode = $(this).text();
                            $(this).addClass('color-col-' + classCode)
                        });
                    }
                    setTimeout(addClass, 300);
                }
            }
        }]).directive('wholeNumber', function() {
            return {
                restrict: 'A',
                link: function(scope, elm, attrs, ctrl) {
                    elm.on('keydown', function(event) {
                        if ([8, 13, 27, 37, 38, 39, 40].indexOf(event.which) > -1) {
                            // backspace, enter, escape, arrows
                            return true;
                        } else if (event.which >= 48 && event.which <= 57) {
                            // numbers
                            return true;
                        } else if (event.which >= 96 && event.which <= 105) {
                            // numpad number
                            return true;
                        } else if ( [110, 190,109,189].indexOf(event.which) > -1) {
                            // dot and numpad dot and minus sign
                            return true;
                        } else {
                            event.preventDefault();
                            return false;
                        }
                    });
                }
            }
        }).animation('.alert', function() {
            //Globally Implemented SLiding effect for alert/Warning/Success messages
            var NgHideClassName = 'ng-hide';
            return {
                beforeAddClass: function(element, className, done) {
                    if (className === NgHideClassName) {
                        jQuery(element).slideUp(done);
                    }
                },
                removeClass: function(element, className, done) {
                    if (className === NgHideClassName) {
                        jQuery(element).hide().slideDown(done);
                    }
                }
            }
    });
});
