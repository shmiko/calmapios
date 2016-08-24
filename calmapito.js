// (function() {
  'use strict';

  var MYAPIKEY = "AIzaSyBvLNxZkZ9Nn69-QSghPArPGgvHcrYDoS0";
  var clientID = "1077954538494-n7adn1hemab92p21e2h86rusg9vhhtb7.apps.googleusercontent.com";

  var map;

  // blank array for all the markers
  var markers = [];

  //global polgon variable is to ensure only one polygon is rendered
  var polygon = null;

  //Create placemarkers array to use in multiple functions to have control
  // over the number of places that show
  var placeMarkers = [];

  //map styes
  var featureOpts =   [{"featureType":"administrative","stylers":[{"visibility":"on"}]}
      ,{"featureType":"poi","stylers":[{"visibility":"simplified"}]}
      ,{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"}]}
      ,{"featureType":"water","stylers":[{"visibility":"simplified"}]}
      ,{"featureType":"transit","stylers":[{"visibility":"simplified"}]}
      ,{"featureType":"landscape","stylers":[{"visibility":"simplified"}]}
      ,{"featureType":"road.highway","stylers":[{"visibility":"on"}]}
      ,{"featureType":"road.local","stylers":[{"visibility":"on"}]}
      ,{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]}
      ,{"featureType":"water","stylers":[{"color":"#84afa3"},{"lightness":52}]}
      ,{"stylers":[{"saturation":-17},{"gamma":0.36}]}
      ,{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#3f518c"}]}
      ];


  function CenterControl(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to toggle sidebar';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Toggle Sidebar';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function() {
      //map.setCenter(chicago);
      // openNav();
      toggleSideNav();
      // document.getElementsByClassName('mySidenavRight').classList.toggle('collapsed');

    });


  }

  function SidebarControl(sidebarDiv, map) {

    // Set CSS for the control border.
    var sidebarUI = document.createElement('div');
    sidebarUI.className = 'options-box';
    sidebarUI.style.backgroundColor = '#fff';
    sidebarUI.style.border = '2px solid #fff';
    sidebarUI.style.borderRadius = '3px';
    sidebarUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    sidebarUI.style.cursor = 'pointer';
    sidebarUI.style.marginBottom = '22px';
    sidebarUI.style.textAlign = 'center';
    sidebarUI.title = 'Find Sydney Tourist Hotspots';
    // sidebarDiv.appendChild(sidebarUI);

    // Set CSS for the control interior.
    var sidebarText = document.createElement('div');
    sidebarText.style.color = 'rgb(25,25,25)';
    sidebarText.style.fontFamily = 'Roboto,Arial,sans-serif';
    sidebarText.style.fontSize = '16px';
    sidebarText.style.lineHeight = '38px';
    sidebarText.style.paddingLeft = '5px';
    sidebarText.style.paddingRight = '5px';
    sidebarText.innerHTML = 'Tourist Hotspots';// +
    // '<p>' +
    // '<div>' +
    // '<button onclick="closeNav()">X</button>' +
    // '<input id="show-listings" type="button" value="Show Listings">' +
    // '<input id="hide-listings" type="button" value="Hide Listings">' +
    // '<hr>' +
    // '<span class="text"> Draw a shape to search within it for tourist areas!</span>' +
    // '<input id="toggle-drawing"  type="button" value="Clear Drawing Tools">' +
    // '<hr>' +
    // '<span class="area"> You are searching within this sized area!</span>' +
    // '<input id="area" placeholder="Search Area is?" ><span> meters squared!</span>' +
    // '</div>' +
    // '<hr>' +
    // '<div>' +
    // '<input id="zoom-to-area-text" type="text" placeholder="Enter your favorite area!">' +
    // '<input id="zoom-to-area" type="button" value="Zoom">' +
    // '</div>' +
    // '</div>';
    // sidebarUI.appendChild(sidebarText);
    var sidebar = $('.options-box');

    // Setup the click event listeners: simply set the map to Chicago.
    sidebarUI.addEventListener('click', function() {
      // document.getElementById('show-listings').addEventListener('click', showListings);
      // document.getElementById('hide-listings').addEventListener('click', hideListings);
      // document.getElementById('toggle-drawing').addEventListener('click', function() {
      //   toggleDrawing(drawingManager);
      // });
      // document.getElementById('zoom-to-area').addEventListener('click', function() {
      //   zoomToArea();
      // });
     });
  }

  function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -33.856159, lng: 151.215256},
      zoom: 13,
      styles: featureOpts,
      mapTypeControl: false
    });

    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);
    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

    //contruct the side bar controls
    var sidebarControlDiv = document.createElement('div');
    var leftmiddleControl = new SidebarControl(sidebarControlDiv, map);
    sidebarControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(sidebarControlDiv);

    // this autocomplete is for use in the search within time entry box
    var timeAutocomplete = new google.maps.places.Autocomplete(
      document.getElementById('search-within-time-text'));

    // this autocomplete is for the geocoder entry box
    var zoomAutocomplete = new google.maps.places.Autocomplete(
      document.getElementById('zoom-to-area-text'));
    
    //Bias the boundaries within the map for the zoom to area text
    zoomAutocomplete.bindTo('bounds',map);

    // Create a searchbox in order to execute a places search
    var searchBox = new google.maps.places.SearchBox(
      document.getElementById('places-search'));
    // Bias the searchbox to within the bounds of the map
    searchBox.setBounds(map.getBounds());

    //locations array - usually these would be served up via a database
    var locations = [
      {title: 'Sydney Opera House', location: {lat: -33.856159, lng: 151.215256},image: 'beachflag.png'},
      {title: 'Sydney Harbour Bridge', location: {lat: -33.8523,lng: 151.2108},image: 'beachflag.png'},
      {title: 'Botanic Gardens', location: {lat: -33.8642,lng: 151.2166},image: 'beachflag.png'},
      {title: 'The Rocks', location: {lat: -33.8599,lng: 151.2090},image: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
      {title: 'Glebe', location: {lat: -33.8798,lng: 151.1854},image: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
      {title: 'Balmain', location: {lat: -33.8589,lng: 151.1791}, image: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'}
    ];

    //default pre defined images
    var image2 = {
      url: 'beachflag.png',
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(20, 32),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 32)
    };
    var image3 = {
      url: 'redflag.png',
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(20, 32),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 32)
    };

    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('redflag.png');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('beachflag.png');

    var largeInfowindow = new google.maps.InfoWindow();

    // Initialize the drawing manager.
    var drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
        drawingModes: [
          google.maps.drawing.OverlayType.POLYGON
        ]
      }
    });

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
      // Get the position from the location array.
      var position = locations[i].location;
      var title = locations[i].title;
      var image = locations[i].imge;
      // Create a marker per location, and put into markers array.
      var marker = new google.maps.Marker({
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        shape: shape,
        draggable:true,
        id: i
      });
      var shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
      };
      // Push the marker to our array of markers.
      markers.push(marker);

      // Create an onclick event to open an infowindow at each marker.
      marker.addListener('click', function() {
        populateInfoWindow(this, largeInfowindow);
      });

      // Two event listeners - one for mouseover, one for mouseout,
      // to change the colors back and forth.
      marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
      });
      marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
      });
    }

    document.getElementById('show-listings').addEventListener('click', showListings);
    document.getElementById('hide-listings').addEventListener('click', hideMarkers(markers));

    document.getElementById('toggle-drawing').addEventListener('click', function() {
      toggleDrawing(drawingManager);
    });

    document.getElementById('zoom-to-area').addEventListener('click', function() {
      zoomToArea();
    });

    document.getElementById('search-within-time').addEventListener('click', function() {
      searchWithinTime();
    });

    //Listen for the event fired when the user selects the prediction form the 
    // picklist and tetrieve more details for that place
    searchBox.addListener('places_changed', function(){
      searchBoxPlaces(this);
    });

    //Listen for the event fired when the user selects a prediction and clicks
    // "go" more detils for that place
    document.getElementById('go-places').addEventListener('click', textSearchPlaces);

   // Add an event listener so that the polygon is captured,  call the
   // searchWithinPolygon function. This will show the markers in the polygon,
   // and hide any outside of it.
   drawingManager.addListener('overlaycomplete', function(event) {
     // First, check if there is an existing polygon.
     // If there is, get rid of it and remove the markers
     if (polygon) {
       polygon.setMap(null);
       hideListings(markers);
     }
     // Switching the drawing mode to the HAND (i.e., no longer drawing).
     
     drawingManager.setDrawingMode(null);
     // Creating a new editable polygon from the overlay.
     polygon = event.overlay;
     polygon.setEditable(true);
     // Searching within the polygon.
     searchWithinPolygon();

     // Make sure the search is re-done if the poly is changed.
     polygon.getPath().addListener('set_at', searchWithinPolygon);
     polygon.getPath().addListener('insert_at', searchWithinPolygon);
   });

    //Resize Function
    google.maps.event.addDomListener(window, "resize", function() {
      var center = map.getCenter();
      google.maps.event.trigger(map, "resize");
      map.setCenter(center);
    });
    
  }//end init

  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      // Clear the infowindow content to give the streetview time to load.
      infowindow.setContent('');
      infowindow.marker = marker;
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
      var streetViewService = new google.maps.StreetViewService();
      var radius = 50;
      // In case the status is OK, which means the pano was found, compute the
      // position of the streetview image, then calculate the heading, then get a
      // panorama from that and set the options
      function getStreetView(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker.position);
            infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
            var panoramaOptions = {
              position: nearStreetViewLocation,
              pov: {
                heading: heading,
                pitch: 30
              }
            };
          var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('pano'), panoramaOptions);
        } else {
          infowindow.setContent('<div>' + marker.title + '</div>' +
            '<div>No Street View Found</div>');
        }
      }
      // Use streetview service to get the closest streetview image within
      // 50 meters of the markers position
      streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
      // Open the infowindow on the correct marker.
      infowindow.open(map, marker);
    }
  }

  // This function will loop through the markers array and display them all.
  function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
  }

  // This function will loop through the listings and hide them all.
  function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }

  // this function takes and image or color and then creates a new marler
  // icon of that color. The icon will be 21 px wide by 34 high, have an origin
  // of 0, 0 and be anchored at 10, 34).
  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(markerColor,
      //'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      //'|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
  }

  // This shows and hides (respectively) the drawing options.
  // This shows and hides (respectively) the drawing options.
  function toggleDrawing(drawingManager) {
    if (drawingManager.map) {
      drawingManager.setMap(null);
      // In case the user drew anything, get rid of the polygon
      if (polygon !== null) {
        polygon.setMap(null);
      }
    } else {
      drawingManager.setMap(map);
    }
  }

  // This function hides all markers outside the polygon,
  // and shows only the ones within it. This is so that the
  // user can specify an exact area of search.
  function searchWithinPolygon() {
    for (var i = 0; i < markers.length; i++) {
      if (google.maps.geometry.poly.containsLocation(markers[i].position, polygon)) {
        markers[i].setMap(map);

      } else {
        markers[i].setMap(null);
      }
    }
    var setArea = document.getElementById("area");
    var z = google.maps.geometry.spherical.computeArea(polygon.getPath()).toFixed(2);
    setArea.value = z;
  }

  // This function takes the input value in the find nearby area text input
  // locates it, and then zooms into that area. This is so that the user can
  // show all listings, then decide to focus on one area of the map.
  function zoomToArea() {
    // Initialize the geocoder.
    var geocoder = new google.maps.Geocoder();
    // Get the address or place that the user entered.
    var address = document.getElementById('zoom-to-area-text').value;
    // Make sure the address isn't blank.
    if (address == '') {
      window.alert('You must enter an area, or address.');
    } else {
      // Geocode the address/area entered to get the center. Then, center the map
      // on it and zoom in
      geocoder.geocode(
        { address: address,
          componentRestrictions: {locality: 'Sydney'}
        }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            map.setZoom(15);
          } else {
            window.alert('We could not find that location - try entering a more' +
                ' specific place.');
          }
        });
    }
  }

  // togge side nav function
  function toggleSideNav(){
    var cn = document.getElementById("mySidenav");
    //test for existance
    if( cn.classList.contains("collapsed") ) {
      cn.style.width = "350px";
      document.getElementsByClassName('sidenav')[0].classList.toggle('collapsed');
    } else {
      cn.style.width = "0";
      document.getElementsByClassName('sidenav')[0].classList.toggle('collapsed');
    }
  }

  // open sidenav
  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("mySidenav").classList.remove("collapsed");
    // document.getElementById("map").style.marginLeft = "250px";
  }

  //close sidenav
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("mySidenav").classList.add("collapsed");
    // document.getElementById("map").style.marginLeft= "0";
  }

  //close sidenav
  function closeRightNav() {
    document.getElementById("mySidenavRight").style.width = "0";
    document.getElementById("mySidenavRight").classList.add("collapsed");
    // document.getElementById("map").style.marginLeft= "0";
  }

  // This function allows the user to input a desired travel time, in
  // minutes, and a travel mode, and a location - and only show the listings
  // that are within that travel time (via that travel mode) of the location
  function searchWithinTime() {
    // Initialize the distance matrix service.
    var distanceMatrixService = new google.maps.DistanceMatrixService;
    var address = document.getElementById('search-within-time-text').value;
    // Check to make sure the place entered isn't blank.
    if (address == '') {
      window.alert('You must enter an address.');
    } else {
      hideMarkers(markers);
      // Use the distance matrix service to calculate the duration of the
      // routes between all our markers, and the destination address entered
      // by the user. Then put all the origins into an origin matrix.
      var origins = [];
      for (var i = 0; i < markers.length; i++) {
        origins[i] = markers[i].position;
      }
      var destination = address;
      var mode = document.getElementById('mode').value;
      // Now that both the origins and destination are defined, get all the
      // info for the distances between them.
      distanceMatrixService.getDistanceMatrix({
        origins: origins,
        destinations: [destination],
        travelMode: google.maps.TravelMode[mode],
        unitSystem: google.maps.UnitSystem.IMPERIAL,
      }, function(response, status) {
        if (status !== google.maps.DistanceMatrixStatus.OK) {
          window.alert('Error was: ' + status);
        } else {
          displayMarkersWithinTime(response);
        }
      });
    }
  }


  // This function will go through each of the results, and,
  // if the distance is LESS than the value in the picker, show it on the map.
  function displayMarkersWithinTime(response) {
   var maxDuration = document.getElementById('max-duration').value;
   var origins = response.originAddresses;
   var destinations = response.destinationAddresses;
   // Parse through the results, and get the distance and duration of each.
   // Because there might be  multiple origins and destinations we have a nested loop
   // Then, make sure at least 1 result was found.
   var atLeastOne = false;
   for (var i = 0; i < origins.length; i++) {
     var results = response.rows[i].elements;
     for (var j = 0; j < results.length; j++) {
       var element = results[j];
       if (element.status === "OK") {
         // The distance is returned in feet, but the TEXT is in miles. If we wanted to switch
         // the function to show markers within a user-entered DISTANCE, we would need the
         // value for distance, but for now we only need the text.
         var distanceText = element.distance.text;
         // Duration value is given in seconds so we make it MINUTES. We need both the value
         // and the text.
         var duration = element.duration.value / 60;
         var durationText = element.duration.text;
         if (duration <= maxDuration) {
           //the origin [i] should = the markers[i]
           markers[i].setMap(map);
           atLeastOne = true;
           // Create a mini infowindow to open immediately and contain the
           // distance and duration
           var infowindow = new google.maps.InfoWindow({
              content: durationText + ' away, ' + distanceText +
                '<div><input type=\"button\" value=\"View Route\" onclick =' +
                '\"displayDirections(&quot;' + origins[i] + '&quot;);\"></input></div>'
            });
           infowindow.open(map, markers[i]);
           // Put this in so that this small window closes if the user clicks
           // the marker, when the big infowindow opens
           markers[i].infowindow = infowindow;
           google.maps.event.addListener(markers[i], 'click', function() {
             this.infowindow.close();
           });
         }
       }
     }
   }
   if (!atLeastOne) {
     window.alert('We could not find any locations within that distance!');
   }
  }

  // This function is in response to the user selecting "show route" on one
  // of the markers within the calculated distance. This will display the route
  // on the map.
  function displayDirections(origin) {
    hideMarkers(markers);
    var directionsService = new google.maps.DirectionsService;
    // Get the destination address from the user entered value.
    var destinationAddress =
        document.getElementById('search-within-time-text').value;
    // Get mode again from the user entered value.
    var mode = document.getElementById('mode').value;
   
    directionsService.route({
      // The origin is the passed in marker's position.
      origin: origin,
      // The destination is user entered address.
      destination: destinationAddress,
      travelMode: google.maps.TravelMode[mode]
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        var directionsDisplay = new google.maps.DirectionsRenderer({
          map: map,
          directions: response,
          draggable: true,
          // setPanel: 'mySidenavRight',
          polylineOptions: {
            strokeColor: 'green'
          }
        });
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('mySidenavRight'));
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  // This function fires when the user selects a searchbox picklist item.
  // It will do a nearby search using the selected query string or place.
  function searchBoxPlaces(searchBox){
    hideMarkers(placeMarkers);
    var places = searchBox.getPlaces();
    // For each place, get the icon, name and location.
    createMarkersForPlaces(places);
    if (places.length == 0){
      window.alert('We did not find any places matching that search!');
    }
  }

  // This function fires when the user selects "go" on the places search.
  // It will do a nearby search using the entered query string or place.
  function textSearchPlaces(){
    var bounds = map.getBounds();
    hideMarkers(placeMarkers);
    var placesService = new google.maps.places.PlacesService(map);
    placesService.textSearch({
      query: document.getElementById('places-search').value,
      bounds: bounds
    }, function(results, status){
      if (status === google.maps.places.PlacesServiceStatus.OK){
        createMarkersForPlaces(results);
      }
    });
  }

  // This function creates markers for each place found in either places search.
  function createMarkersForPlaces(places) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < places.length; i++) {
      var place = places[i];
      var icon = {
        url: place.icon,
        size: new google.maps.Size(35, 35),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(15, 34),
        scaledSize: new google.maps.Size(25, 25)
      };
      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location,
        id: place.place_id
      });
      // Create a single infowindow to be used with the place details information
      // so that only one is open at once.
      var placeInfoWindow = new google.maps.InfoWindow();
      // If a marker is clicked, do a place details search on it in the next function.
      marker.addListener('click', function() {
        if (placeInfoWindow.marker == this) {
          console.log("This infowindow already is on this marker!");
        } else {
          getPlacesDetails(this, placeInfoWindow);
        }
      });
      placeMarkers.push(marker);
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    }
    map.fitBounds(bounds);
  }

  // This is the PLACE DETAILS search - it's the most detailed so it's only
  // executed when a marker is selected, indicating the user wants more
  // details about that place.
  function getPlacesDetails(marker, infowindow) {
    var service = new google.maps.places.PlacesService(map);
    service.getDetails({
      placeId: marker.id
    }, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        // Set the marker property on this infowindow so it isn't created again.
        infowindow.marker = marker;
        var innerHTML = '<div>';
        if (place.name) {
          innerHTML += '<strong>' + place.name + '</strong>';
        }
        if (place.formatted_address) {
          innerHTML += '<br>' + place.formatted_address;
        }
        if (place.formatted_phone_number) {
          innerHTML += '<br>' + place.formatted_phone_number;
        }
        if (place.opening_hours) {
          innerHTML += '<br><br><strong>Hours:</strong><br>' +
              place.opening_hours.weekday_text[0] + '<br>' +
              place.opening_hours.weekday_text[1] + '<br>' +
              place.opening_hours.weekday_text[2] + '<br>' +
              place.opening_hours.weekday_text[3] + '<br>' +
              place.opening_hours.weekday_text[4] + '<br>' +
              place.opening_hours.weekday_text[5] + '<br>' +
              place.opening_hours.weekday_text[6];
        }
        if (place.photos) {
          innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
              {maxHeight: 100, maxWidth: 200}) + '">';
        }
        innerHTML += '</div>';
        infowindow.setContent(innerHTML);
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
        });
      }
    });
  ]


// }())
