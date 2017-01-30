
$(document).ready(function () {

    /*-----Sign in----------------------------------------------------------------------------------- */
    let validEmail = false;
    let validPassword = false;

    $("#email").keyup(function () {
        const email = $(this).val();
        validEmail = isValidEmailAddress(email);
        toggleClassElem($(this).parent(), validEmail, "valid");
        toggleClassElem($(".login-block button"), validEmail && validPassword, "active");
    });

    $("#password").keyup(function () {
        const password = $(this).val();
        validPassword = isValidPassword(password);
        toggleClassElem($(this).parent(), validPassword, "valid");
        toggleClassElem($(".login-block button"), validEmail && validPassword, "active");
    });

    $("[data-tooltip]").on("click", function (eventObject) {
        data_tooltip = $(this).attr("data-tooltip");
        $(this).find('span').text(data_tooltip)
            .css({
                "left": 20
            })
            .show();
    }).mouseout(function () {
        $(this).find('span').hide()
            .text("")
            .css({
                "left": 0
            });
    });

    /*-----Chat----------------------------------------------------------------------------------- */
    $("#addUser").on("click", function (eventObject) {
        $(".message-list").append(function () {
                const newUser = "<li class='new'><a href=''><img class='avatar' src='./img/0.png' alt='Profile photo'></a><h3>" +
                    $("#newUser").val() + "</h3><p class='message'></p></li>";
                $("#newUser").val("");
                return newUser;
            }
        )
    });

    /*-----Currency converter----------------------------------------------------------------------------------- */
    $(".currency-list").keyup(function (e) {
        const currencyNewValue = e.target.value;
        const idCurrencyNewValue = e.target.id;
        const letterLength = 25;
        const spaceBetweenSingValue = 25;
        if (currencyNewValue.indexOf(".") < 0 && currencyNewValue.length > 5) {
            e.target.value.length = 5;
            alert("Your input more 5");
        } else if (currencyNewValue.indexOf(".") > 0 && currencyNewValue.length > 6) {
            e.target.value.length = 6;
            alert("Your input more 5");
        } else {
            $(e.target).width(currencyNewValue.length * letterLength).next().css("right", $(e.target).width() + spaceBetweenSingValue);
            $(".currency-list input").not(e.target).map((index, elem)=> {
                let currencyValue = currencyConverter(elem.id, idCurrencyNewValue, +currencyNewValue);
                if ((currencyValue + '').indexOf(".") < 0 && (currencyValue + '').length > 5 ||
                    (currencyValue + '').indexOf(".") > 0 && (currencyValue + '').length > 6) {
                    currencyValue = 99999;
                }
                $(elem).val(currencyValue).width((currencyValue + '').length * letterLength)
                    .next().css("right", $(elem).width() + spaceBetweenSingValue);
            });
        }
    });
    $(".converter button:last-child").on("click", function () {
        if (this.className == "add-currency") {
            $(".currency-list").append("<li><div class='currency-name'><p>BYR</p></div><input id='byr' type='number' class='currency-input byr' value='0'><label for='byr'>br</label></li>");
            $("#byr").val(currencyConverter("byr", "usd", +$("#usd").val()));
            $(this).removeClass("add-currency").addClass("remove-currency")
        } else {
            $(".currency-list li:last-child").remove();
            $(this).removeClass("remove-currency").addClass("add-currency")
        }
    });

    /*-----Circles----------------------------------------------------------------------------------- */
    let sum = 0;
    $(".circles input").keyup(function () {
        sum = 0;
        let countEmptyInputs = 3;
        $(".circles input").map((index, elem) => {
            if (elem.value != "") {
                sum += +elem.value;
                countEmptyInputs--;
            }
        });

        if (sum && sum <= 100 && !countEmptyInputs) {
            $(".circle-button").addClass("active");
        } else if (sum > 100) {
            alert("Check your inputs");
        }
    });

    $(".circle-button").on("click", function () {
        const circleInputValues = [];
        $(".circles input").map(function (index, elem) {
            circleInputValues.push(+elem.value);
        });
        drawCircleAround(".circle-around", circleInputValues);
        $(".circle-around-inside").text(sum);
        drawCircleAround(".circle-fill", circleInputValues);
        drawCircleStraight(circleInputValues);
    });


    function drawCircleAround(nameCircle, circleInputValues) {
        const circleAround = [
            " .first-value",
            " .second-value",
            " .third-value"
        ];
        const circleDeg = 360;
        const percent100 = 100;
        const circleInputValuesDeg = circleInputValues.map((value, index)=> {
            value = circleDeg * value / percent100;
            return {
                index: index,
                value: value
            };
        });

        let currentPosition = 0;
        circleInputValuesDeg.sort((a, b)=> a.value - b.value)
            .forEach( (value, index)=> {
                const color = $(nameCircle + circleAround[value.index] + " .pie").css("background-color");
                if (value.value > 180) {

                    $(nameCircle + circleAround[value.index])
                        .after("<div class='circle-around-slice add-value'><div class='pie'></div></div>");

                    $(".add-value .pie").css({
                        "transform": "rotate(" + (value.value - 180) + "deg)",
                        "background-color": color
                    });

                    $(".add-value").css({
                        "transform": "rotate(" + (180 + currentPosition) + "deg)"
                    });

                    $(nameCircle + circleAround[value.index] + " .pie")
                        .css({
                            "transform": "rotate(" + 180 + "deg)"
                        });
                    $(nameCircle + circleAround[value.index])
                        .css({
                            "transform": "rotate(" + currentPosition + "deg)"
                        });
                } else {

                    $(nameCircle + circleAround[value.index] + " .pie")
                        .css({
                            "transform": "rotate(" + value.value + "deg)"
                        });
                    $(nameCircle + circleAround[value.index])
                        .css({
                            "transform": "rotate(" + currentPosition + "deg)"
                        });
                    currentPosition += value.value;
                }
            });
    }

    function drawCircleStraight(circleInputValues) {
        const circleStraight = [
            ".circle-straight-first-value",
            ".circle-straight-second-value",
            ".circle-straight-third-value"
        ];
        circleInputValues.forEach((value, index)=> {
            $(circleStraight[index]).css("height", value * 160 / 100);
        });
        let arrayCircleStraight = $(".circle-straight div").toArray().sort((a, b)=> {
            const aHeight = +$(a).css("height").slice(0, -2);
            const bHeight = +$(b).css("height").slice(0, -2);
            return aHeight - bHeight;
        });
        for (let i = 0; i < arrayCircleStraight.length; i++) {
            if (i == 0) {
                $(arrayCircleStraight[i]).css("bottom", 0);
            } else {
                $(arrayCircleStraight[i]).css("bottom", +$(arrayCircleStraight[i - 1]).css("height").slice(0, -2) + +$(arrayCircleStraight[i - 1]).css("bottom").slice(0, -2));
            }
        }
    }

    /*-----Weather----------------------------------------------------------------------------------- */
    let locations = [
        {
            "temperature": 73,
            "location": "Zagora, Greece",
            "imageLocation": "img/greace.jpg"
        },
        {
            "temperature": 29,
            "location": "Venec, Italy",
            "imageLocation": "img/venec.jpg"
        },
        {
            "temperature": 32,
            "location": "Rom, Italy",
            "imageLocation": "img/rom.jpg"
        }];
    const imageWidth = 307;
    $(".paging").click(function (e) {
        const trigger = $(e.target).attr("rel") - 1;
        $(".paging a").removeClass('active');
        $(e.target).addClass('active');
        $(".image_reel").animate({
            left: -trigger * imageWidth
        }, 500);
    });
    $(".scale-button").click(function () {
        const trigger = $(this).attr("rel") - 1;
        $(".scale-button").removeClass('selected-scale');
        $(this).addClass('selected-scale');
        $(".temperature").map((index, elem)=> {
            if (this.id == "fahrenheit") {
                $(elem).text(celsToFahrenheit(locations[index].temperature));
            } else {
                $(elem).text(locations[index].temperature);
            }

        });
    });
    $(".add-place-button").click(function () {
        $(".input-location").css("display", "block")
    });
    $(".input-location button").click(function () {
        locations.push({
            "temperature": $("#temperature").val(),
            "location": $("#location").val(),
            "imageLocation": $("#imageLocation").val()
        });
        let time = new Date();
        $(".image_reel").append("<a class='clearfix' href='#'><img src="
            + locations[locations.length - 1].imageLocation + " alt=''/><div class='weather-info'><p class='temperature'>"
            + locations[locations.length - 1].temperature + "</p><p class='location'>" + locations[locations.length - 1].location + "</p><p class='time'>"
            + checkTime(time.getHours()) + ":" + checkTime(time.getMinutes()) + " am</p></div></a>");

        const posRight = (+$(".paging").css("right").slice(0, -2)) + 7;
        $(".paging").css("right", posRight);
        $(".paging").append("<a href='#' rel='" + locations.length + "'></a>");
        $(".input-location").css("display", "none")
    });
    $(".list-view-button").click(function () {
        $(".weather-menu").before("<div class='burger-list'><ul></ul></div>");
        locations.forEach((value)=> {
            $(".burger-list ul").append("<li>"+value.location+"</li>")
        });
        $(".burger-list").click(function (e) {
            const index = locations.findIndex((elem)=>elem.location == e.target.innerText);
            $( ".paging a[rel='"+(index+1)+"']" ).trigger( "click" );
            $(this).remove();
        });
    });

});
/*----------------------------------------------------------------------------------------------- */


function toggleClassElem(elem, valed, addedClass) {
    if (valed) {
        elem.addClass(addedClass);

    } else {
        elem.removeClass(addedClass);
    }
}

function sum(first, second) {
    return first + second;
}

function isValidEmailAddress(email) {
    const pattern = new RegExp(/^([a-z0-9_\.-]{2,20})@([a-z0-9_\.-]{2,20})\.([a-z\.]{2,6})$/);
    return pattern.test(email);
}

function isValidPassword(password) {
    const pattern = new RegExp(/^[a-z0-9_-]{8,15}$/);
    return pattern.test(password);
}

function currencyConverter(firstCurrency, secondCurrency, newValue) {
    const usdGbr = 0.79;
    const usdByr = 1.95;
    const byrGbr = 0.4;
    switch (firstCurrency) {
        case "gbr":
            if (secondCurrency == "usd") {
                return Math.round(newValue * usdGbr * 100) / 100;
            } else {
                return Math.round(newValue * byrGbr * 100) / 100;
            }
            break;
        case "usd":
            if (secondCurrency == "gbr") {
                return Math.round(newValue / usdGbr * 100) / 100;
            } else {
                return Math.round(newValue / usdByr * 100) / 100;
            }
            break;
        case "byr":
            if (secondCurrency == "gbr") {
                return Math.round(newValue / byrGbr * 100) / 100;
            } else {
                return Math.round(newValue * usdByr * 100) / 100;
            }
            break;
    }
}

function celsToFahrenheit(cels) {
    return (cels * 1.8) + 32;
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}