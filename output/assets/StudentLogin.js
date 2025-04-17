schoolApp.controller("StudentLoginController", ['$scope', '$http', '$timeout', '$window', function ($scope, $http, $timeout, $window) {
    //Script Urls
    $scope.GetStudentRegisterOnLoadDetailsUrl = "/services/StudentLoginController.asmx/GetStudentRegisterOnLoadDetails";
    $scope.SendOTPtoStudentForRegisterUrl = "/services/StudentLoginController.asmx/SendOTPtoStudentForRegister";
    $scope.OTPVerifyForStudentRegisterUrl = "/services/StudentLoginController.asmx/OTPVerifyForStudentRegister";
    $scope.PostStudentRegisterDetailsUrl = "/services/StudentLoginController.asmx/PostStudentRegisterDetails";
    $scope.GetSchoolStateWiseCommonCityUrl = "/FeeModuleServices/AdmissionRegistrationFromWebController.asmx/GetSchoolStateWiseCommonCity";

    $scope.DoLoginMethodUrl = "/services/StudentLoginController.asmx/DoLoginMethod";
    $scope.LoginUsingMobileNoUrl = "/services/StudentLoginController.asmx/LoginUsingMobileNo";
    $scope.VerifyLoginOtpUrl = "/services/StudentLoginController.asmx/VerifyLoginOtp";

    $scope.ForgotPasswordMobileNoOtpUrl = "/services/StudentLoginController.asmx/ForgotPasswordMobileNo";
    $scope.VerifyForgotPassLoginOtpUrl = "/services/StudentLoginController.asmx/VerifyForgotPassLoginOtp";
    $scope.PostChangePasswordUrl = "/services/StudentLoginController.asmx/PostChangePassword";
    $scope.VerifyReCaptchaTokenMethodUrl = "/services/StudentLoginController.asmx/VerifyReCaptchaTokenMethod";

    $scope.GetForgotPassUrl = "/services/StudentLoginController.asmx/GetForgotPasswordSMSLogs";

    InitializeNgMethods($scope, $http);

    $scope.OtpFor = "Student Login";

    $scope.CaptchaToken = null;
    $scope.IsCaptchaOk = true;

    $(".forgottext").click(function () {
        if ($(this)) {

            $scope.OtpFor = "Forgot Password OTP";

        } else {
            $scope.OtpFor = "Student Login";
        }
    });
    $scope.ClearAllVariable = function () {
        $scope.Username = null;
        $scope.Password = null;
        $scope.OTPLogin = null;
        $scope.MobileNo = null;
        $scope.StdId = null;
        $scope.NewPassword = null;
        $scope.ConfirmNewPassword = null;
        $scope.EnrollmentNo = null;
        $scope.Captcha = null;

    };

    $scope.VerifyTokenMethod = function () {
        try {
            //debugger;

            jsonData = angular.toJson({
                Token: $scope.CaptchaToken
            });
            $scope.MakeHttpCall(Constants.Post, $scope.VerifyReCaptchaTokenMethodUrl, jsonData, Constants.ApplicationJson).then(function (response) {
                debugger
                if (response.Success == true) {
                    $scope.IsCaptchaOk = true;
                }

                //response.ErrorMessage

            });
        } catch (e) {

            ShowNotification(Notification.error, window.RequestFailed);
        }
    };



    $scope.DoLoginMethod = function () {

        try {
            debugger;
            var isValid = true;

            if (!$scope.Username) {
                isValid = false;
                return;
            }

            if (!$scope.Password) {
                isValid = false;
                return;
            }
            if (!$scope.LoginBy) {
                $scope.LoginBy = "";

            }
            if (!$scope.Captcha) {
                $scope.Captcha = "";

            }

            if ($scope.IsCaptchaOk == true) {

                jsonData = angular.toJson({
                    username: $scope.Username,
                    password: $scope.Password,
                    browserName: $scope.browserName,
                    loginBy: $scope.LoginBy,
                    captcha: $scope.Captcha
                });
                $scope.MakeHttpCall(Constants.Post, $scope.DoLoginMethodUrl, jsonData, Constants.ApplicationJson).then(function (response) {
                    if (response !== undefined && response !== null && response !== "") {
                        debugger;
                        if (response.IsSuccess) {
                            $scope.ClearAllVariable();
                            ShowNotification(Notification.info, 'Login successfully.');

                            window.location.href = "../UMSStudents/StudentDashboard.aspx";
                        }
                        else {
                            if (response.Message === '401') {
                                ShowNotification(Notification.warning, 'Username or Password not matched.');
                            }
                            else if (response.Message === '405') {
                                ShowNotification(Notification.warning, 'Please Enter Valid Captcha.');
                            }
                            else if (response.Message === '406') {
                                ShowNotification(Notification.warning, response.CustomReturn);
                            }
                            else {
                                ShowNotification(Notification.error, window.RequestFailed);
                            }
                        }
                    }
                    else {
                        ShowNotification(Notification.error, window.RequestFailed);
                    }

                });
            }
            else {
                ShowNotification(Notification.warning, 'Please select  captcha...!');
            }
        } catch (e) {

            ShowNotification(Notification.error, window.RequestFailed);
        }
    };

    $scope.DoLoginUsingMobile = function () {
        try {
            //debugger;
            var isValid = true;
            if (!$scope.MobileNo) {
                isValid = false;
                return;
            }
            if (isValid) {
                $scope.CountDown();
                jsonData = angular.toJson({
                    mobileNo: $scope.MobileNo
                });
                $scope.MakeHttpCall(Constants.Post, $scope.OtpFor === "Student Login" ? $scope.LoginUsingMobileNoUrl : $scope.ForgotPasswordMobileNoOtpUrl, jsonData, Constants.ApplicationJson).then(function (response) {
                    if (response !== undefined && response !== null && response !== "") {
                        if (response.IsSuccess) {
                            $scope.ClearAllVariable();
                            $scope.StdId = response.CustomReturn.split(':')[1];

                            SendOtpButton(response.IsSuccess);
                            ShowNotification(Notification.info, 'OTP sent successfully..!');
                        }
                        else {
                            SendOtpButton(response.IsSuccess);
                            if (response.CustomReturn) {
                                ShowNotification(Notification.warning, response.CustomReturn);
                            }
                            else {
                                ShowNotification(Notification.error, window.RequestFailed);
                            }
                        }
                    }
                    else {
                        SendOtpButton(response.IsSuccess);
                        ShowNotification(Notification.error, window.RequestFailed);
                    }

                });

            }
        } catch (e) {
            SendOtpButton(response.IsSuccess);
            ShowNotification(Notification.error, window.RequestFailed);
        }
    };



    $scope.VerifyUserOTP = function () {
        try {
            // debugger;
            var isValid = true;
            if (!$scope.OTPLogin) {
                isValid = false;
            }

            if (!$scope.StdId) {
                isValid = false;
            }
            if ($scope.IsCaptchaOk == true) {
            }

            else {
                ShowNotification(Notification.warning, 'Please select  captcha...!');
            }

            if (isValid) {
                jsonData = angular.toJson({
                    stdId: $scope.StdId,
                    OTP: $scope.OTPLogin,
                });
                $scope.MakeHttpCall(Constants.Post, $scope.OtpFor === "Student Login" ? $scope.VerifyLoginOtpUrl : $scope.VerifyForgotPassLoginOtpUrl, jsonData, Constants.ApplicationJson).then(function (response) {
                    if (response !== undefined && response !== null && response !== "") {
                        if (response.IsSuccess && response.Data) {
                            if (response.Data.CustomReturn != "OTP Not Matched.") {

                                if ($scope.OtpFor === "Student Login") {
                                    $scope.Username = response.Data.UserName;
                                    $scope.Password = response.Data.Password;
                                    $scope.LoginBy = "OTP";
                                    $scope.DoLoginMethod();
                                }
                                if ($scope.OtpFor === "Forgot Password OTP") {
                                    $scope.Username = response.Data.UserName;
                                    $scope.Password = response.Data.Password;
                                    $scope.LoginBy = "OTP";
                                    $scope.DoLoginMethod();
                                }
                                else {
                                    VerifyOtpClick(response.IsSuccess);

                                }
                            }
                            else {
                                ShowNotification(Notification.warning, 'OTP Not Matched.');
                                VerifyOtpClick(response.IsSuccess);
                            }

                            //if ($scope.OtpFor === "Student Login") {
                            //    $scope.Username = response.Data.UserName;
                            //    $scope.Password = response.Data.Password;
                            //    $scope.LoginBy = "OTP";
                            //    $scope.DoLoginMethod();
                            //}
                            //else {
                            //    VerifyOtpClick(response.IsSuccess);

                            //}
                        }
                        else {
                            ShowNotification(Notification.warning, 'OTP Not Matched.');
                            VerifyOtpClick(response.IsSuccess);

                        }
                    }
                    else {
                        VerifyOtpClick(response.IsSuccess);
                        ShowNotification(Notification.error, window.RequestFailed);
                    }
                });
            }
        } catch (e) {
            VerifyOtpClick(response.IsSuccess);
            ShowNotification(Notification.error, window.RequestFailed);
        }
    };

    $scope.CountDown = function (duration, display) {
        if (!isNaN(duration)) {
            var timer = duration, minutes, seconds;

            var interVal = setInterval(function () {
                minutes = parseInt(timer / 60, 10);
                seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                $(display).html("Expire in " + "<b>" + minutes + "m : " + seconds + "s" + "</b>");
                if (--timer < 0) {
                    timer = duration;
                    ResendFunction();
                    //$('#display').empty();
                    clearInterval(interVal)
                }
            }, 1000);
        }
    }

    window.onload = function () {
        var fiveMinutes = 60 * 5,
            display = document.querySelector('#display');
        $scope.CountDown(fiveMinutes, display);
    };

    $scope.ResendFunction = function () {
        var ReSend = "<a href='javascript:void(0)' onclick='CheckMobileNumber()' class=''>Resend OTP </a>";
        $('#display').html(ReSend);
    }

    $scope.ChangePasswordPost = function () {
        try {
            //debugger;
            var isValid = true;
            if (!$scope.NewPassword) {
                isValid = false;
            }

            if (!$scope.ConfirmNewPassword) {
                isValid = false;
            }

            if (!$scope.StdId) {
                isValid = false;
            }
            if (!$scope.CaptchaText && isValid === true) {
                ShowNotification(Notification.warning, 'Please enter captcha code..!');
                $scope.getRandomString();
                isValid = false;
            }
            if ($scope.CaptchaText && $scope.CaptchaText !== $('#captcha').text() && isValid === true) {
                ShowNotification(Notification.warning, 'Please enter valid captcha code..!');
                $scope.getRandomString();
                isValid = false;
            }

            if (isValid) {
                if ($scope.NewPassword !== $scope.ConfirmNewPassword) {
                    ShowNotification(Notification.warning, 'New Password and Confirm Password must match.', 'top right');
                    return;
                }

                jsonData = angular.toJson({
                    stdId: $scope.StdId,
                    password: $scope.NewPassword,
                    newPassword: $scope.ConfirmNewPassword,
                    isLoggedInUser: false
                });
                $scope.MakeHttpCall(Constants.Post, $scope.PostChangePasswordUrl, jsonData, Constants.ApplicationJson).then(function (response) {
                    if (response !== undefined && response !== null && response !== "") {
                        if (response.IsSuccess) {
                            $scope.ClearAllVariable();
                            ShowNotification(Notification.warning, 'Password reset successfully..!', 'top right');
                            LoginviaPasswordClick(response.IsSuccess);
                        }
                        else {
                            LoginviaPasswordClick(response.IsSuccess);
                            if (response.CustomReturn === 'customMSg') {

                                ShowNotification(response.NotificationType, response.Message, 'top right');
                            }
                            else {
                                ShowNotification(Notification.error, window.RequestFailed);
                            }
                        }
                    }
                    else {
                        LoginviaPasswordClick(response.IsSuccess);
                        ShowNotification(Notification.error, window.RequestFailed);
                    }
                });
            }
        } catch (e) {
            LoginviaPasswordClick(response.IsSuccess);
            ShowNotification(Notification.error, window.RequestFailed);
        }
    };

    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName = navigator.appName;
    var fullVersion = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset + 5);
    }
    // In Chrome, the true version is after "Chrome" 
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset + 7);
    }
    // In Safari, the true version is after "Safari" or after "Version" 
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In Firefox, the true version is after "Firefox" 
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset + 8);
    }
    // In most other browsers, "name/version" is at the end of userAgent 
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
        (verOffset = nAgt.lastIndexOf('/'))) {
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(";")) != -1)
        fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(" ")) != -1)
        fullVersion = fullVersion.substring(0, ix);

    majorVersion = parseInt('' + fullVersion, 10);
    if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }

    $scope.appVersion = navigator.appName;
    $scope.userAgent = navigator.userAgent;
    $scope.browserName = browserName;
    $scope.fullVersion = fullVersion;
    $scope.majorVersion = majorVersion;

    $scope.getRandomString = function () {
        //debugger;
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
        var result = '';
        for (var i = 0; i < 8; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        $('#captcha').text(result);
        $scope.CaptchaText = "";
    };
    $scope.getRandomString();

    $scope.GetSendSms = function (enrollmentNo, mobileNo) {
        debugger
        $scope.ForgotPasswordSMS = null;
        try {
            debugger;
            var isValid = true;

            if (!$scope.EnrollmentNo) {
                isValid = false;
                $('#forgot').show();
                $('#doForgotBtn').show();
                return;
            }

            if (!$scope.MobileNo) {
                isValid = false;
                $('#forgot').show();
                $('#doForgotBtn').show();
                return;
            }

            if ($scope.IsCaptchaOk == true) {

                jsonData = angular.toJson({ EnrollmentNo: enrollmentNo, MobileNo: mobileNo });
                $scope.MakeHttpCall(Constants.Post, $scope.GetForgotPassUrl, jsonData, Constants.ApplicationJson).then(function (response) {
                    if (response && response.IsSuccess) {
                        if (response.IsSuccess) {
                            $scope.ClearAllVariable();
                            ShowNotification(Notification.info, response.CustomReturn);
                        }
                        else {

                            SendOtpButton(response.IsSuccess);
                            if (response.CustomReturn) {
                                ShowNotification(Notification.warning, response.CustomReturn);
                            }
                            else {
                                ShowNotification(Notification.error, window.RequestFailed);

                            }
                        }
                    }
                    else {
                        if (response.CustomReturn) {
                            ShowNotification(Notification.warning, response.CustomReturn)
                            $('#forgot').show();
                            $('#doForgotBtn').show();
                            $scope.EnrollmentNo = null;
                            $scope.MobileNo = null;
                        }
                        else {
                            ShowNotification(Notification.error, window.RequestFailed);
                        }
                    }


                });
            }
            else {
                ShowNotification(Notification.warning, 'Please select  captcha...!');
                $('#forgot').show();
                $('#doForgotBtn').show();
            }

        } catch (e) {
            SendOtpButton(response.IsSuccess);
            ShowNotification(Notification.error, window.RequestFailed);

        }
    };

}]);





