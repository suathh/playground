// create.js
$(document).ready(function () {

    // process the form
    $('form').submit(function (event) {

        // get the form data
        // there are many ways to get this data using jQuery (you can use the class or id also)

        var name = $('input[name=name]').val(),
                frequency = $('input[name=frequency]').val(),
                taskType = $('input[name=taskType]').val(),
                hour = $('input[name=hour]').val(),
                weekday = $('input[name=weekday]').val() || 'off',
                weekend = $('input[name=weekend]').val() || 'off',
                city = $('input[name=city]').val(),
                offset = $('input[name=offset]').val(),
                email = $('input[name=email]').val(),
                apiKey = $('input[name=apiKey]').val(),
                apiSecret = $('input[name=apiSecret]').val();

        var formData = JSON.stringify(
                {
                    "name": "rainAlert_" + name,
                    "resource": "rainAlert_" + name,
                    "template": "useCase_weekdayWeekendRainAlert",
                    //"frequency": frequency,
                    "type": taskType,
                    "cron": "0 0 " + hour + " * * ?",
                    "nodes": [
                        {
                            "name": "isHour_1",
                            "properties": {
                                "sensor": {
                                    "requiredProperties": [
                                        {
                                            "hour": hour
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            "name": "weekday_switch",
                            "properties": {
                                "sensor": {
                                    "requiredProperties": [
                                        {
                                            "item": weekday
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            "name": "weekend_switch",
                            "properties": {
                                "sensor": {
                                    "requiredProperties": [
                                        {
                                            "item": weekend
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            "name": "wetWeatherForecast5Days_1",
                            "properties": {
                                "sensor": {
                                    "requiredProperties": [
                                        {
                                            "city": city
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            "name": "IfEventIsBetweenTwoDates_1",
                            "properties": {
                                "sensor": {
                                    "requiredProperties": [
                                        {
                                            "fromDateOffsetHours": offset
                                        }
                                    ]
                                },
                                "actions": [
                                    {
                                        "label": "templateMail_1",
                                        "requiredProperties": [
                                            {
                                                "to": email
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    ]
                }
        );

        alert(formData);

        // process the form
        $.ajax({
            type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url: 'https://app.waylay.io/api/tasks', // the url where we want to POST
            data: formData, // our data object
            dataType: 'json', // what type of data do we expect back from the server
            async: true,
            contentType: 'application/json',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', make_base_auth(apiKey, apiSecret));
            },
            success: function (data) {

                alert('Success! Remember the Task ID as you need it to delete the task.' + JSON.stringify(data));
                //alert("Thanks, message sent")
            },
            error: function (data) {

                //alert(JSON.stringify(data)); 
                alert(JSON.stringify(data));
            }
        })
                // using the done promise callback
                .done(function (data) {

                    // log data to the console so we can see
                    console.log(data);

                    // here we will handle errors and validation messages
                });

        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
    });

});

function make_base_auth(user, password) {
    var tok = user + ':' + password;
    var hash = btoa(tok);
    return "Basic " + hash;
}

