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
                ticker = $('input[name=ticker]').val(),
                compare = $('input[name=compare]').val(),
                threshold = $('input[name=threshold]').val()
                ;

        var formData = {
            "name": "stockAlert_" + name,
            "resource": "stockAlert_" + name,
            "frequency": frequency,
            "type": taskType,
            "nodes": [
                {
                    "name": "yahooStock_1",
                    "properties": {
                        "sensor": {
                            "requiredProperties": [
                                {
                                    "ticker":ticker,
                                    "threshold": threshold
                                }
                            ]
                        },
                        "actions": [
                            {
                                "label": "mandrillSendMail_1",
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
            formData.template = "useCase_stockAlert_sendOnlyOnceEvery24hrs_Above";
        } else if (compare === 'below') {
            formData.template = "useCase_stockAlert_sendOnlyOnceEvery24hrs_Below";
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

                alert('Success! Remember the Task ID as you need it to delete the task. ' + JSON.stringify(data));
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

