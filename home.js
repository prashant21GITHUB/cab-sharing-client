$(document).ready(function () {

    // check for Geolocation support
    if (navigator.geolocation) {
        console.log('Geolocation is supported!');
    }
    else {
        console.log('Geolocation is not supported for this Browser/OS.');
        $("button").prop("disabled", true);
    }

    var encodedKey = encodeURIComponent("AIzaSyDGvspAuYLNKpawQ-OYCwsrIOW8Qo5GPRs");

    function getNearbyCabsLocationData() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                var accuracy = position.coords.accuracy;
                var currentLoc = new google.maps.LatLng(latitude, longitude);
                var mapOptions = {
                    zoom: 15,
                    center: currentLoc,
                    mapTypeControl: true,
                    navigationControlOptions: {
                        style: google.maps.NavigationControlStyle.LARGE
                    },
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                const map = new google.maps.Map(
                    document.getElementById("map"), mapOptions
                );

                new google.maps.Marker({
                    position: currentLoc,
                    map: map,
                    title: "You are here",
                    draggable: true,
                    // animation: google.maps.Animation.DROP,
                });

                let nearByCabsUrl = "http://localhost:3000/api/getNearByCabs/?latlng=" + latitude + "," + longitude;
                $.get(nearByCabsUrl, (data, status) => {
                    if (status != "success") {
                        console.log("Failed to get nearby cabs location", status);
                    } else {

                        console.log(data);
                        const resObj = data;
                        const image = 'https://img.icons8.com/color/48/000000/convertible.png';
                        for(var i=0; i<resObj.length; i++) {
                            let coords = new google.maps.LatLng(resObj[i].current_lat, resObj[i].current_lng);
                            let marker = new google.maps.Marker({
                                position: coords,
                                // map: map,
                                title: resObj[i].name +":"+ resObj[i].mobile,
                                icon: image,
                                draggable: false,
                                // animation: google.maps.Animation.DROP,
                            });
                            marker.setMap(map);
                        }
                    }
                });


            }, function error(msg) {
                alert('Please enable your GPS position future.');

            }, { maximumAge: 6000, timeout: 5000, enableHighAccuracy: true });
        }

    }

    $("button").click(function () {

        getNearbyCabsLocationData();
        console.log("button clicked")


    });
});