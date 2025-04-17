
angular.module('uiSwitch', [])
    //https://codepen.io/anon/pen/jjXJBd
    .directive('switch', function () {
        return {
            restrict: 'AE'
            , replace: true
            , transclude: true
            , template: function (element, attrs) {
                var html = '';
                html += '<span';
                html += ' class="switch' + (attrs.class ? ' ' + attrs.class : '') + '"';
                html += attrs.ngModel ? ' ng-click="' + attrs.ngDisabled + ' ? ' + attrs.ngModel + ' : ' + attrs.ngModel + '=!' + attrs.ngModel + (attrs.ngChange ? '; ' + attrs.ngChange + '()"' : '"') : '';
                html += ' ng-class="{ checked:' + attrs.ngModel + ', disabled:' + attrs.ngDisabled + ' }"';
                html += '>';
                html += '<small></small>';
                html += '<input type="checkbox"';
                html += attrs.id ? ' id="' + attrs.id + '"' : '';
                html += attrs.name ? ' name="' + attrs.name + '"' : '';
                html += attrs.ngModel ? ' ng-model="' + attrs.ngModel + '"' : '';
                html += ' style="display:none" />';
                html += '<span class="switch-text">'; /*adding new container for switch text*/
                html += attrs.on ? '<span class="on">' + attrs.on + '</span>' : ''; /*switch text on value set by user in directive html markup*/
                html += attrs.off ? '<span class="off">' + attrs.off + '</span>' : ' ';  /*switch text off value set by user in directive html markup*/
                html += '</span>';
                return html;
            }
        }
    });


//['angularUtils.directives.dirPagination', 'ui.bootstrap', 'cfp.hotkeys', 'datatables', 'ngFileUpload', 'naif.base64', 'cp.ngConfirm']
var schoolApp = angular.module('schoolApp', ['ngFileUpload', 'angular.chosen', 'uiSwitch', 'naif.base64']);//'ngSanitize'
$(".preloader").fadeOut();
schoolApp.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keyup", function (event) {
            if (event.which === 13 || event.currentTarget.value === "") {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});
schoolApp.filter('commaspliter', function () {

    return function (input) {

        return input.split(',');
    };
});



schoolApp.directive('activeDeactive', function () {
    var model = [];
    return {
        link: function (scope, element, attr) {

            model = scope.m;
            let message = (scope.m.IsActive || scope.m.isActive) ? "Do you want to InActive this record ?" : "Do you want to Active this record ?";
            element.bootstrap_confirm_delete(scope.$parent, model,
                {
                    callback: function (event) {

                        let jsonData = angular.toJson({ recordActiveDeactive: { primaryKeyField: event.data.model.PrimaryKeyField, primaryKeyId: event.data.model.PrimaryKeyId, tableName: event.data.model.TableName, recordStatus: (event.data.model.IsActive || event.data.model.isActive) === true ? false : true } });
                        event.data.scope.MakeHttpCall(Constants.Post, "/ActiveRecord", jsonData, Constants.ApplicationJson).then(function (response) {
                            if (response.IsSuccess) {
                                var jsTableName = event.data.model.TableName;

                                switch (jsTableName.toLowerCase()) {

                                    case 'caleventtypemaster':
                                        event.data.scope.GetGridEventTypeList();
                                        break;
                                    case 'schoolsmstemplate':
                                        event.data.scope.TemplateDetailsFn();
                                        break;
                                    default:
                                        event.data.scope.GetGridList();
                                }

                                ShowNotification(Notification.info, response.Message, "top right");
                            }
                            else {
                                ShowNotification(Notification.warning, response.Message, "top right");
                            }

                        });
                    }
                },
                {
                    message: message
                }
            );
        }
    }
});

schoolApp.directive('allowOnlyNumbers', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attrs, ngModel) {
            elm.on('keypress focusout', function (event) {
                var position = this.selectionStart;
                var $input = $(this);
                var value = $input.val();
                value = value.replace(/[^0-9]/g, '')
                $input.val(value);
                ngModel.$setViewValue(value);
                ngModel.$render();
                this.selectionEnd = position;

                if (event.which == 64 || event.which == 16) {
                    // to allow numbers
                    return false;
                } else if (event.which >= 48 && event.which <= 57) {
                    // to allow numbers
                    return true;
                }
                else if ([8, 13, 27, 0, 9].indexOf(event.which) > -1) {
                    // to allow backspace, enter, escape, arrows
                    return true;
                } else {
                    event.preventDefault();
                    // to stop others
                    //alert("Sorry Only Numbers Allowed");
                    return false;
                }
            });
        }
    }
});


schoolApp.directive('validateAlpha', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elem, attr, ngModel) {
            elem.on('keypress focusout', function (event) {

                //var $input = $(this);
                //var value = $input.val();
                //value = value.replace(/[^\w]/gi, '')
                //value = value.replace(/[0-9]/g, '')
                //$input.val(value);

                var keycode;
                keycode = event.keyCode ? event.keyCode : event.which;
                if ((keycode >= 65 && keycode <= 90) || (keycode >= 97 && keycode <= 122) || keycode === 32 || keycode === 8 || keycode === 9) {
                    // to allow Alpha and Numeric
                    return true;
                }
                else {

                    return false;
                }

            });
        }
    };
});

schoolApp.directive('restrictField', function () {
    return {
        restrict: 'AE',
        scope: {
            restrictField: '='
        },
        link: function (scope) {
            // this will match spaces, tabs, line feeds etc
            // you can change this regex as you want
            var regex = /\s/g;

            scope.$watch('restrictField', function (newValue, oldValue) {
                if (newValue != oldValue && regex.test(newValue)) {
                    scope.restrictField = newValue.replace(regex, '');
                }
            });
        }
    };
});
schoolApp.directive('fixedFirstColumn', function () {
    return {
        restrict: "A",
        template: "<div class='table-responsive'><div ng-transclude></div></div>",
        transclude: true,
        link: function ($scope, $element) {
            var interval = setInterval(function () {
                var tr = $element.find("tr");

                angular.forEach(tr, function (i) {
                    var columns = angular.element(i).children();

                    if (columns.length < 1) {
                        // Row with no columns? Ignore it.
                        return;
                    }

                    var column0 = angular.element(columns[0]).children()[0] || columns[0];
                    var column1 = columns[1];

                    // Calculate heights of each <td>.
                    var height0 = (column0).offsetHeight;
                    var height1 = column1 ? column1.offsetHeight : 0;

                    // Calculate final height.
                    var height = Math.max(height0, height1);

                    // Set heights of <td> and <tr>.
                    columns[0].style.height = height + "px";
                    i.style.height = height + "px";

                    if (column1) {
                        column1.style.height = height + "px";
                    }

                    // If <td> heights have stabilized.
                    if (height0 !== 0 && height0 === height1) {
                        clearInterval(interval);
                    }
                });
            }, 1000);
        }
    };
});
schoolApp.directive('validateAlphaNumeric', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elem, attr, ngModel) {
            elem.on('keypress focusout', function (event) {

                var $input = $(this);
                var value = $input.val();
                value = value.replace(/[^\w\s]/gi, '')

                $input.val(value);
                var keycode;
                keycode = event.keyCode ? event.keyCode : event.which;
                if ((keycode >= 65 && keycode <= 90) || (keycode == 32) || (keycode >= 97 && keycode <= 122) || (event.which >= 48 && event.which <= 57)) {
                    // to allow Alpha and Numeric
                    return true;
                }
                else {
                    return false;
                }

            });
        }
    };
});

schoolApp.directive('validatePassword', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attr, ngModel) {
            elem.on('keypress focusout', function (event) {
                var re = /[a-zA-Z0-9!@#$%^&*,._]/gi;
                var keycode = event.keyCode ? event.keyCode : event.which;
                var keychar = String.fromCharCode(keycode);
                if (re.test(keychar) || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 46 || event.keyCode == 37 || event.keyCode == 39)
                    return true;
                else
                    return false;
            });
        }
    };
});

schoolApp.directive('disallowSquare', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attr, ngModel) {
            elem.on('keypress focusout', function (event) {
                var keycode = event.keyCode ? event.keyCode : event.which;
                var keychar = String.fromCharCode(keycode);
                if (keychar == "[" || keychar == "]")
                    return false;
                else
                    return true;
            });
        }
    };
});

schoolApp.filter('html', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);
schoolApp.directive('validateAlphaNumericSpecialChar', function () {
    return {
        require: 'ngModel', //allow Alpha Numeric & Specify Special Character[Space!#-'.]
        restrict: 'A',
        link: function (scope, elem, attr, ngModel) {
            elem.on('keypress focusout', function (event) {

                var keycode;
                keycode = event.keyCode ? event.keyCode : event.which;
                if ((keycode >= 65 && keycode <= 90) || (keycode == 32) || (keycode == 33) || (keycode == 35) || (keycode == 39) || (keycode == 46) || (keycode == 45) || (keycode >= 97 && keycode <= 122) || (event.which >= 48 && event.which <= 57)) {
                    // to allow Alpha and Numeric
                    return true;
                }
                else {
                    return false;
                }

            });
        }
    };
});

schoolApp.directive('myMaxlength', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            var maxlength = Number(attrs.myMaxlength);
            function fromUser(text) {

                if (text.length > maxlength) {
                    var transformedInput = text.substring(0, maxlength);
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                    return transformedInput;
                }
                return text;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

schoolApp.directive('draggable', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element[0].addEventListener('dragstart', scope.handleDragStart, false);
            element[0].addEventListener('dragend', scope.handleDragEnd, false);
        }
    };
});

schoolApp.directive('droppable', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element[0].addEventListener('drop', scope.handleDrop, false);
            element[0].addEventListener('dragover', scope.handleDragOver, false);
        }
    };
});
schoolApp.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
schoolApp.directive('ngConfirmClick', [
    function () {
        return {
            link: function (scope, element, attr) {                

                msg = 'Are you sure you want to change the record status..?';

                var clickAction = attr.confirmedClick;
                element.bind('click', function (event) {
                    if (window.confirm(msg)) {
                        scope.$eval(clickAction);
                    }
                });
            }
        };
    }]);

schoolApp.directive('ngConfirmClickClearance', [
    function () {
        return {
            link: function (scope, element, attr) {                

                msg = 'Are you sure you want to change the cheque status..?';

                var clickAction = attr.confirmedClick;
                element.bind('click', function (event) {
                    if (window.confirm(msg)) {
                        scope.$eval(clickAction);
                    }
                });
            }
        };
    }]);


schoolApp.directive('onlyNum', function () {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attributes) {
            var limit = $attributes.ngDecimal;
            function caret(node) {
                if (node.selectionStart) {
                    return node.selectionStart;
                }
                else if (!document.selection) {
                    return 0;
                }
                //node.focus();
                var c = "\001";
                var sel = document.selection.createRange();
                var txt = sel.text;
                var dul = sel.duplicate();
                var len = 0;
                try { dul.moveToElementText(node); } catch (e) { return 0; }
                sel.text = txt + c;
                len = (dul.text.indexOf(c));
                sel.moveStart('character', -1);
                sel.text = "";
                return len;
            }
            $element.bind('keypress', function (event) {                
                var charCode = (event.which) ? event.which : event.keyCode;
                var elem = document.getElementById($element.attr("id"));
                if (charCode == 45) {
                    return false;
                }
                if (charCode == 46) {
                    if ($element.val().length > limit - 1) {
                        event.preventDefault();
                        return false;
                    }
                    if ($element.val().indexOf('.') != -1) {
                        event.preventDefault();
                        return false;
                    }
                    return true;
                }
                if (charCode != 45 && charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                    event.preventDefault();
                    return false;
                }
                if ($element.val().length > limit - 1) {
                    event.preventDefault();
                    return false;
                }
                return true;
            });
        }
    };
})

schoolApp.directive("select2", function ($timeout, $parse) {
    return {
        restrict: 'AC',
        require: 'ngModel',
        link: function (scope, element, attrs) {            
            $timeout(function () {                
                element.select2({ allowClear: true });
                element.select2Initialized = true;
            });

            var refreshSelect = function () {
                if (!element.select2Initialized) return;

                element.trigger('change');

            };

            var recreateSelect = function () {
                if (!element.select2Initialized) return;
                $timeout(function () {
                    element.select2('destroy');
                    element.select2();
                });
            };

            scope.$watch(attrs.ngModel, refreshSelect);

            if (attrs.ngOptions) {
                var list = attrs.ngOptions.match(/ in ([^ ]*)/)[1];
                // watch for option list change
                scope.$watch(list, recreateSelect);
            }

            if (attrs.ngDisabled) {
                scope.$watch(attrs.ngDisabled, refreshSelect);
            }
        }
    };
});



schoolApp.directive('replace', function () {
    return {
        require: 'ngModel',
        scope: {
            regex: '@replace',
            with: '@with'
        },
        link: function (scope, element, attrs, model) {
            model.$parsers.push(function (val) {
                if (!val) { return; }
                var regex = new RegExp(scope.regex);
                var replaced = val.replace(regex, scope.with);
                if (replaced !== val) {
                    model.$setViewValue(replaced);
                    model.$render();
                }
                return replaced;
            });
        }
    };
})



