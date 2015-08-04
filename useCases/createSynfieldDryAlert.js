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
                city = $('input[name=city]').val(),
                authToken = $('input[name=authToken]').val(),
                username = $('input[name=username]').val(),
                headNode = $('input[name=headNode]').val(),
                threshold = $('input[name=threshold]').val()
                ;

        Date.prototype.yyyymmdd = function () {
            var yyyy = this.getFullYear().toString();
            var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
            var dd = this.getDate().toString();
            return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]); // padding
        };

        var untilDate = new Date().yyyymmdd();
        var fromDate = new Date(new Date().getTime() - 864000000).yyyymmdd(); //10days

        var formData = {
            "name": "synfieldDryAlert_" + name,
            "resource": "synfieldDryAlert_" + name,
            "frequency": frequency,
            "type": taskType,
            "nodes": [
                //RetrieveHeadNodeSensors_1 tok, *****headnode
                //RetrieveHeadNodeSensorsMeasurements_1 tok, *****headnode, fromdate, untildate
                //templateMail_2 to
                //templateMail_1 to
                //Function_1 threshold
                //**RetrieveSections **tok, **username
                //wetWeatherForecast5Days_1 city
                {
                    "name": "RetrieveHeadNodeSensors_1",
                    "properties": {
                        "sensor": {
                            "requiredProperties": [
                                {
                                    "authorizationToken": authToken
                                }
                            ]
                        }
                    }
                },
                {
                    "name": "RetrieveHeadNodeSensorsMeasurements_1",
                    "properties": {
                        "sensor": {
                            "requiredProperties": [
                                {
                                    "authorizationToken": authToken,
                                    "fromDate": fromDate,
                                    "untilDate": untilDate
                                }
                            ]
                        }
                    }
                },
                {
                    "name": "synfieldGetLastItemInArray_1",
                    "properties": {
                        "actions": [
                            {
                                "label": "templateMail_2",
                                "requiredProperties": [
                                    {
                                        "to": email
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "Function_1",
                    "properties": {
                        "sensor": {
                            "requiredProperties": [
                                {
                                    "threshold": threshold
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
                    "name": "Gate_2",
                    "properties": {
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

        //---this checks if headnode is provided. If so, use the template for headnode, else use the template with retrieveSections which requires username instead of headnode
        if (headNode.length > 0) {
            formData.template = "useCase_synfield_drySoilAlert_byHeadNode";
            //--- if venue ID is provided
            //--- simply provide the venue ID property to the FoursquareIsHereNow_1 sensor
            formData.nodes[0].properties.sensor.requiredProperties[0].headNode = headNode;
            formData.nodes[1].properties.sensor.requiredProperties[0].headNode = headNode;

        } else {
            formData.template = "useCase_synfield_drySoilAlert";
            //--- for the search venue template, there is additional 'search venue' sensor, 
            //--- and here we provide the venue name and near location properties
            formData.nodes.push(
                    {
                        "name": "RetrieveSections_1",
                        "properties": {
                            "sensor": {
                                "requiredProperties": [
                                    {
                                        "authorizationToken": authToken,
                                        "username": username
                                    }
                                ]
                            }
                        }
                    });
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