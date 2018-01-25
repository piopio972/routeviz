/**
 * Created by Piotr on 26.10.2017.
 */

var myRenderer = L.canvas({ padding: 0.5 });

var groupLayer = new L.LayerGroup();
var heatLayer = new L.HeatLayer();

var layers = {
    "Historical data": groupLayer,
    "Heatmap": heatLayer
};

var controlLayer = new L.control.layers(layers, null, {"collapsed": false});



var myWorker;



$( document ).ready(function() {



    var heatmap_slider = $('#heatmap_size').slider({
        formatter: function(value) {
            return 'Current value: ' + value;
        }
    });

    $("#heatmaplabel").html("Heatmap point intensity: " + heatmap_slider.slider('getValue'));

    heatmap_slider.slider('on', 'change', function (e) {
        $("#heatmaplabel").html("Heatmap point intensity: " + heatmap_slider.slider('getValue'));

        heatLayer.setOptions({max: heatmap_slider.slider('getValue'), });

    });

    heatLayer.setOptions({radius: 10, renderer: myRenderer, blur: 10});

    $('#submit_historical_btn').on("click", function () {

        $(".overlay").show();

        var date_from = $("#datetime_from").data("DateTimePicker").date().format("YYYY-MM-DD HH:mm:ss");
        var date_to = $("#datetime_to").data("DateTimePicker").date().format("YYYY-MM-DD HH:mm:ss");

        var line = $('.flex-list').find('.chosen').text();

        // console.log(date_from);
        // console.log(date_to);
        // console.log(line);

        $.ajax({

            type        : "POST",
            url         : Routing.generate('getHistorical'),
            dataType    : 'json',
            data        : {"line": line, "from": date_from, "to": date_to},

            success: function(ret) {

                console.log(ret);

                var points = ret.map( function (t) { return [t["latitude"], t["longitude"]]; });

                if(map.hasLayer(groupLayer)){
                    map.removeLayer(groupLayer);
                }

                if(map.hasLayer(heatLayer)){
                    map.removeLayer(heatLayer);
                }

                // heatLayer.clearLayers();
                // heatLayer
                // heat = L.heatLayer(points, {radius: 10, renderer: myRenderer, blur: 10}).addTo(map);

                heatLayer.setLatLngs(points);

                groupLayer.clearLayers();

                $.each(ret, function (key, value) {

                    groupLayer.addLayer(L.circleMarker([value["latitude"],value["longitude"]], {radius : '1', renderer: myRenderer}))
                    // heatLayer.addLatLng(L.latLng(value["latitude"], value["longitude"]));
                    // circles = L.circleMarker([value["latitude"],value["longitude"]], {radius : '1', renderer: myRenderer}).addTo(map);
                });
                groupLayer.addTo(map);
                // map.addLayer(groupLayer);
                // map.addLayer(heatLayer);
            },
            complete: function(jqXHR) {

                if(!map.hasLayer(controlLayer)){
                    controlLayer.addTo(map);
                }
                // L.control.layers(layers, null, {"collapsed": false}).addTo(map);

                $(".overlay").hide();

            },
            error: function(jqXHR, errorText, errorThrown) {

            }

        });

    });

    $('#datetime_from').datetimepicker({

        // showClose: true,
        keepOpen: true,
        debug: true,
        useCurrent: false,
        maxDate: moment(),
        defaultDate: moment().add(-3,'days'),

    });


    $('#datetime_to').datetimepicker({

        minDate: $("#datetime_from").data("DateTimePicker").date(),
        maxDate: moment(),
        widgetPositioning: {
            horizontal: 'left',
            vertical: 'auto'
        }
    });

    $("#datetime_from").on("dp.change", function (e) {
        $('#datetime_to').data("DateTimePicker").minDate(e.date);
    });

   $(".flex-list").on("click", ".line",  function () {
       var line = $(this).text();
       // console.log($(this).parent());
       $(this).parent().find('.line').removeClass('chosen');
       $(this).addClass("chosen");

       // console.log($(this).text() + " clicked");
   });

    /*app.sendAjax("GET", Routing.generate('getLines'), {"type": "all"}, function (ret) {

        $.each(ret, function (key, value) {

            console.log(value);
            $("#line-select").get(0).options.add(new Option(value["line"]));
            // L.circleMarker([value[0],value[1]], {'color': '#ff0000'}).addTo(map);

        });
    });*/
    /*app.sendAjax("GET", Routing.generate('getClusters'), {}, function (ret) {

        $.each(ret, function (key, value) {

            L.circleMarker([value[0],value[1]], {'color': '#ff0000'}).addTo(map);

        });
    });*/

    // if(Window.Worker){
    //     console.log("yay");
    // }

    var myWorker = new Worker('/js/historical/DBSCANworker.js')

    myWorker.onmessage = function (e) {
        // console.log(e.data);
    };

    // app.sendAjax('GET', Routing.generate('getHistorical'), {"type": "bus"}, function(data){
    //     var points = data.map( function (t) { return [t["latitude"], t["longitude"]]; });
    //     var heat = L.heatLayer(points, {radius: 10, renderer: myRenderer, blur: 10}).addTo(map);
    //
    //     L.control.layers({"Heatmap" : heat}).addTo(map);
    //
    // });

    // $.ajax({
    //     type     : "GET",
    //     url      : Routing.generate('getHistorical'),
    //     dataType: 'json',
    //
    //     success: function(ret) {

            // myWorker.postMessage(ret);

            // heatmapLayer.setData(testData);

            // heatmapLayer.addTo(map);

            // var heat = L.heatLayer([[-37.8839, 175.3745188667, "1"]], {radius: 5}).addTo(map);


            // console.log(map.hasLayer(heatmapLayer));
            // map.addLayer(heatmapLayer);


            // var points = ret.map( function (t) { return [t["latitude"], t["longitude"]]; });
            // var circles = ret.map( function (t) { return {'location' : {'latitude' : parseFloat(t["latitude"]), 'longitude' : parseFloat(t["longitude"]), 'accuracy' : 1}}; });


            // var dbscanner = jDBSCAN().eps(0.01).minPts(10).distance('HAVERSINE').data(circles);
            // var cluster_centers = dbscanner.getClusters();
            // var start = new Date().getTime();

            // dbscanner();

            // var end = new Date().getTime();

            // var point_assignment_result = dbscanner();
            // console.log('Resulting DBSCAN output', point_assignment_result);

            // var cluster_centers = dbscanner.getClusters();
            // console.log(cluster_centers);
            // console.log((end - start) + 'msec');

            // $.each(cluster_centers, function (key, value) {
            //     circles = L.circleMarker([value["location"]["latitude"],value["location"]["longitude"]], {radius : '5', renderer: clusterRenderer, 'color': '#ff0000'}).addTo(map);
            // })
            // L.circleMarker(circles, {radius : '1', renderer: myRenderer}).addTo(map);

            // heat = L.heatLayer(points, {radius: 10, renderer: myRenderer, blur: 10}).addTo(map);


            // $.each(ret, function (key, value) {
                //
                // L.heatLayer([[value["latitude"],value["longitude"], "200"]], {radius: 5, renderer: myRenderer}).addTo(map);
                //  circles = L.circleMarker([value["latitude"],value["longitude"]], {radius : '1', renderer: myRenderer}).addTo(map);
            //
    //         });
    //     },
    //     complete: function(jqXHR) {
    //
    //
    //     },
    //     error: function(jqXHR, errorText, errorThrown) {
    //
    //     }
    // });

    app.sendAjax('GET', Routing.generate('getLines'), {"type": "all"}, function (data) {
        addLine(data, "line-list")
    });

});


