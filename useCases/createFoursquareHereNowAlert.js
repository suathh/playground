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
                locName = $('input[name=locName]').val(),
                locNear = $('input[name=locNear]').val(),
                locID = $('input[name=locID]').val(),
                threshold = $('input[name=threshold]').val()
                ;

        var formData = {
            "name": "foursqIsHereNowAlert_" + name,
            "resource": "foursqIsHereNowAlert_" + name,
            "frequency": frequency,
            "type": taskType,
            "nodes": [
                {
                    "name": "FoursquareIsHereNow_1",
                    "properties": {
                        "sensor": {
                            "requiredProperties": [
                                {
                                    
                                    "isHereNow_threshold": threshold
                                    //--- if the number of API calls goes above 5000/hr, we'll need to ask users for their own foursquare key&secret
                                    //--- at the current period of 30mins, it's 2/hr and 48/day
                                    /*"isHereNow_range": 0000,
                                     "foursquare_client_key": xxxx,
                                    "foursquare_client_secret": xxx*/
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

        //---for now, foursquare use case only trigger notification when values goes ABOVE the threshold. Not many venues have steady number of check-ins
        /*
        if (compare === 'above') {
            formData.template = "useCase_currencyAlert_12hrs_Above";
        } else if (compare === 'below') {
            formData.template = "useCase_currencyAlert_12hrs_Below";
        }*/
        
        
        //---this checks if venue ID is provided. If so, use the template for venueID, else use the template for searchVenue
        if (locID.length > 0) {
            formData.template = "useCase_foursquare_isHereNow_venueID";
        } else {
            formData.template = "useCase_foursquare_isHereNow_searchVenue";
        }

        if (locID.length > 0) { 
            //--- if venue ID is provided
            //--- simply provide the venue ID property to the FoursquareIsHereNow_1 sensor
            formData.nodes[0].properties.sensor.requiredProperties[0].venue_id = locID;
        } else {
            //--- for the search venue template, there is additional 'search venue' sensor, 
            //--- and here we provide the venue name and near location properties
            formData.nodes.push(
                    {
                        "name": "FoursquareSearchVenue_1",
                        "properties": {
                            "sensor": {
                                "requiredProperties": [
                                    {
                                        "venue_name": locName,
                                        "near_location" : locNear
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

