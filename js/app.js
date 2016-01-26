var app = angular.module("simbox", ['ui.bootstrap', 'btford.socket-io']);
app.factory('mySocket', function (socketFactory) {
    return socketFactory();
});
app.controller("AppCtrl", function ($scope, $window, mySocket) {
    console.log('app start');
    var random_messages = [
      "Together we can face any challenges as deep as the ocean and as high as the sky.",
      "In the ocean of baseness, the deeper we get, the easier the sinking.",
      "Loading the RoboSub Simulation."
    ];

    $window.loading_screen = $window.pleaseWait({
      logo: "images/logo.png",
      backgroundColor: '#50C7E8',
      loadingHtml: "<p class='loading-message'>"+random_messages[Math.floor(Math.random() * random_messages.length)]+"</p><div class='sk-spinner sk-chasing-dots'><div class='sk-child sk-dot1'></div><div class='sk-child sk-dot2'></div></div>"
    });
    var hasGP = false;
    var repGP;
    var allStop = true;

    function canGame() {
        return "getGamepads" in navigator;
    }

    function reportOnGamepad() {
        var gp = navigator.getGamepads()[0];

        $scope.roll = gp.axes[0].toFixed(2);
        $scope.depth = gp.axes[1].toFixed(2);
        $scope.speed = gp.axes[2].toFixed(2);
        $scope.trim = gp.axes[5].toFixed(2);
        $scope.$apply();

        if ($scope.speed != 0) {
            allStop = false;
            if ($scope.speed > 0) {
                mySocket.emit('speed:reverse', {
                    speed: {
                        left: convertSpeed($scope.speed, 'left'),
                        right: convertSpeed($scope.speed, 'right')
                    }
                });
            }

            if ($scope.speed < 0) {
                mySocket.emit('speed:forward', {
                    speed: {
                        left: convertSpeed($scope.speed, 'left'),
                        right: convertSpeed($scope.speed, 'right')
                    }
                });
            }
        } else {
            if (!allStop) {
                allStop = true;
                mySocket.emit('speed:allStop', {
                    speed: {
                        left: 0,
                        right: 0
                    }
                });
            }
        }

        if ($scope.roll > 0) {
            mySocket.emit('roll:right', {
                tilt: {
                    left: 0,
                    right: 180
                }
            });
        }

        if ($scope.roll < 0) {
            mySocket.emit('roll:left', {
                tilt: {
                    left: 180,
                    right: 0
                }
            });
        }

        if ($scope.depth > 0) {
            mySocket.emit('depth:assend', {
                tilt: {
                    left: 180,
                    right: 180
                }
            });
        }

        if ($scope.depth < 0) {
            mySocket.emit('depth:descend', {
                tilt: {
                    left: 0,
                    right: 0
                }
            });
        }

    }

    function convertSpeed(percent, motorSide) {
        if (percent < 0) {
            percent = percent * -1;
        }
        var speed = (255 * percent).toFixed(0);
        if ($scope.trim < 0 && motorSide == 'left') {
            var trim = $scope.trim * -1;
            speed = speed - (speed * trim);
        }
        if ($scope.trim > 0 && motorSide == 'right') {
            var trim = $scope.trim;
            speed = speed - (speed * trim);
        }
        return speed;
    }


    if (canGame()) {

        $scope.prompt = 'To begin using your gamepad, connect it and press any button!';

        $(window).on("gamepadconnected", function () {
            hasGP = true;
            $scope.prompt = "Gamepad connected!";
            console.log("connection event");
            repGP = window.setInterval(reportOnGamepad, 100);
        });

        $(window).on("gamepaddisconnected", function () {
            console.log("disconnection event");
            $scope.prompt = prompt;
            window.clearInterval(repGP);
        });

        //setup an interval for Chrome
        var checkGP = window.setInterval(function () {
            console.log('checkGP');
            if (navigator.getGamepads()[0]) {
                if (!hasGP) $(window).trigger("gamepadconnected");
                window.clearInterval(checkGP);
            }
        }, 500);
    }
});
