// create.js
$(document).ready(function () {

    // process the form
    $('form').submit(function (event) {

        // get the form data
        // there are many ways to get this data using jQuery (you can use the class or id also)

        var name = $('input[name=name]').val(),
                frequency = $('input[name=frequency]').val(),
                taskType = $('input[name=taskType]').val(),
                email = $('input[name=email]').val(),
                apiKey = $('input[name=apiKey]').val(),
                apiSecret = $('input[name=apiSecret]').val(),
                currency = $('input[name=currency]').val(),
                compare = $('input[name=compare]').val(),
                threshold = $('input[name=threshold]').val(),
                hasAccessKey = $('input[name=hasAccessKey]').val(),
                accessKey = $('input[name=accessKey]').val(),
                baseCurrency = $('input[name=baseCurrency]').val()
                ;

        var formData = {
            "name": "currencyAlert_" + name,
            "resource": "currencyAlert_" + name,
            "frequency": frequency,
            "type": taskType,
            "nodes": [
                {
                    "name": "function_compare",
                    "properties": {
                        "sensor": {
                            "requiredProperties": [
                                {
                                    "threshold": threshold
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
        };

        
        if (compare === 'above') {
            formData.template = "useCase_currencyAlert_12hrs_Above";
        } else if (compare === 'below') {
            formData.template = "useCase_currencyAlert_12hrs_Below";
        }

        if (hasAccessKey) {
            formData.nodes.push(
                    {
                        "name": "currencyLayerExchangeRate_1",
                        "properties": {
                            "sensor": {
                                "requiredProperties": [
                                    {
                                        "accessKey": accessKey,
                                        "currencies": currency,
                                        "baseCurrency": baseCurrency
                                    }
                                ]
                            }
                        }
                    }
            )
        } else {
            formData.nodes.push(
                    {
                        "name": "currencyLayerExchangeRate_1",
                        "properties": {
                            "sensor": {
                                "requiredProperties": [
                                    {
                                        "currencies": currency
                                    }
                                ]
                            }
                        }
                    }
            )
        }

        formData = JSON.stringify(formData);


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

