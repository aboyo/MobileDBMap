/*
 * Google Maps documentation: http://code.google.com/apis/maps/documentation/javascript/basics.html
 * Geolocation documentation: http://dev.w3.org/geo/api/spec-source.html
 */
var geocoder;
var map;
var markers;
var infowindow;

var clickMarker;

function initMap() {

    console.log("document.on");
    var defaultLatLng = new google.maps.LatLng(23.973256, 120.979128);  // Default to Hollywood, CA when no geolocation support
        
    if (navigator.geolocation) {        
        function success(pos) { // Location found, show map with these coordinates
            drawMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        }        
        function fail(error) {
            drawMap(defaultLatLng);  // Failed to find location, show default map     
        } // Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
                
        navigator.geolocation.getCurrentPosition(success, fail, {
            maximumAge: 500000,
            enableHighAccuracy: true,
            timeout: 6000
        });
    } else {        
        drawMap(defaultLatLng); // No geolocation support, show default map
    }    

}

function drawMap(latlng) {        
    var myOptions = {            
        zoom: 7,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP        
    };        
    map = new google.maps.Map(document.getElementById("map-canvas"), myOptions); // Add an overlay to the map of current lat/lng
    infowindow = new google.maps.InfoWindow();
    //geocoder = new google.maps.Geocoder();
    // var marker = new google.maps.Marker({            
    //     position: latlng,
    //     map: map,
    //     title: "Greetings!"        
    // });
    //codeAddress(/*list*/);
    addMarker();

    google.maps.event.addListener(map, 'click', function (event) {
        console.log(event.latLng.lat());
        console.log(event.latLng.lng());
        console.log(event);

        if (clickMarker){
            clickMarker.setMap(null);
        }

        var icon = {
            url: '/images/man.png', // url
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(25,50) // anchor
        };
        clickMarker = new google.maps.Marker({
            position: event.latLng,
            title: '開啟街景',
            icon: icon,
            map: map
        });
        console.log(clickMarker.position.lat())
        console.log(clickMarker.title)
        //infowindow.setContent("<a href='http://maps.google.com/maps?daddr=" + clickMarker.position.lat() + "," + clickMarker.position.lng() + "'>" + clickMarker.title + "</a><p>"+clickMarker.position.lat()+","+clickMarker.position.lng()+"</p>");
        infowindow.setContent("<a href='https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" + clickMarker.position.lat() + "," + clickMarker.position.lng() + "'>" + clickMarker.title + "</a>");
        infowindow.open(map, clickMarker);

    });
}

//var deviceList = [];

// function codeAddress(/*list*/) {
//     console.log(list.title);
//     var list1 = [];
//     $.each(list, function (key, value) {

//         if (key > 1) {
//             ///////////
//             setTimeout(function () {
//                 geocoder.geocode({
//                     'address': value[4]
//                 }, function (results, status) {
//                     var obj;
//                     console.log(value[4]);
//                     console.log(status);
//                     if (status == google.maps.GeocoderStatus.OK) {
//                         obj = results[0].geometry.location;
//                         console.log(obj.lat() + "," + obj.lng());
//                         //直接使用push似乎會由於非同步回傳結果時間的不同，導致順序與地址輸入框內不同 
//                         //將push方式改為直接設定陣列的index再去塞值，如此MarkAry的順序跟地址輸入框內才相同
//                     }
//                     list1.push({
//                         num: value[0],
//                         title: value[1],
//                         employment: value[2],
//                         address: value[4],
//                         startDate: value[5],
//                         endDate: value[6],
//                         startTime: value[7],
//                         endTime: value[8],
//                         loc: obj
//                     });
//                     if (list1.length == list[0].data.length - 2) {
//                         deviceList.push({
//                             desc: list[0].name,
//                             list: list1
//                         });
//                         addMarker();
//                     }
//                 });
//             }, 800 * key);
//             ///////////
//         }
//     });
// }

function addMarker() {
    // Create an array of alphabetical characters used to label the markers.
    //var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Add some markers to the map.
    // Note: The code uses the JavaScript Array.prototype.map() method to
    // create an array of markers based on a given "locations" array.
    // The map() method here has nothing to do with the Google Maps API.
    console.log(list.length);
    markers = list.map(function (element, index) {
        //console.log(element);
        //console.log(element.loc.slice(1,-1));
        var lat = element.loc.slice(1, -1).split(",")[0].split(":")[1];
        var lng = element.loc.slice(1, -1).split(",")[1].split(":")[1];
        console.log(lat + "," + lng);
        return new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            title: element.title,
            map: map
        });
    });

    for (var index in markers) {
        markers[index].addListener('click', function () {
            if (clickMarker){
                clickMarker.setMap(null);
            }
            showInfo(map, this);
        });
    }

    function showInfo(mapObj, markerObj) { //開啟資訊視窗  

        infowindow.setContent(InfoContent(markerObj));
        infowindow.open(mapObj, markerObj);
    }

    function InfoContent(markerObj) {
        var index = markers.indexOf(markerObj);
        var html = "<a href='http://maps.google.com/maps?daddr=" + list[index].address + "'>店名:" + markerObj.title + "</a>" +
            "<div>地址:" + list[index].address + "</div><a href='https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" + markerObj.position.lat() + "," + markerObj.position.lng() + "'>觀看街景</a>"
        console.log(html);
        return html;
    }
    console.log(markers.length);
}