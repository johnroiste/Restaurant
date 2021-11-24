let sidebar = document.getElementById('side-bar');
let restaurantsData, request, service, infowindow, newCard;
let nav = document.getElementsByTagName('nav');
let button = document.getElementById('selectBoxFrom');
let buttonTo = document.getElementById('selectBoxTo');
let markers = [];
let restName, restAddress, ratingvalue, fromSubmit;
let filteredRestaurants;
let placeholderPhoto = document.createElement('img')
placeholderPhoto.setAttribute = ('src', "placeholder.jpg");


////////Initializing map/////////
function initMap() {
    bounds = new google.maps.LatLngBounds();
    infoWindow = new google.maps.InfoWindow;
    currentInfoWindow = infoWindow;

    if (navigator.geolocation) {
        const mypos = navigator.geolocation.getCurrentPosition(position => {
            let pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            console.log(`Center: lon ${pos.lng} lat: ${pos.lat}`);

            const map = new google.maps.Map(document.getElementById('map'), {
                center: pos,
                zoom: 12
            });
////////////////////////////////////////////
            request = {
                location: pos,
                radius: 8047,
                types: ['restaurant'],
            };
/////////////////////////////////////////////
            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                title: 'Marker',
                icon: {
                    url: "marker.png",
                },
                draggable: true
            });
   
/////////////////////////////////////////////////
            service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, callback);

            function callback (results, status) {
                if(status == google.maps.places.PlacesServiceStatus.OK) {
                    for(var i = 0; i < results.length; i++) {
                        createMarker(results[i]);
                    }
                }
            }
        
            function createMarker(place) {
                var photos = place.photos;
                let infowindow = new google.maps.InfoWindow();
                var placeLoc = place.geometry.location;
                if (!photos) {
                    photos = placeholderPhoto;
                }
                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });

            //Placing dynamic info on the sidebar
                google.maps.event.addListenerOnce(map, 'click', () => {
   
                let request = {
                  placeId: place.place_id,
                  fields: ['name', 'formatted_address', 'geometry', 'rating',
                    'website', 'photos', 'reviews']
                };
                   
                service.getDetails(request, (placeResult, status) => {
                  showDetails(placeResult, marker, status)
                });
              });

                google.maps.event.addListener(marker, 'click', function() {
                   let request = {
                       placeId: place.place_id,
                       fields: ['name', 'formatted_address', 'geometry', 'rating',
                             'website', 'photos', 'reviews']
                   }

                   service.getDetails(request, (placeResult, status) => {
                    showDetails(placeResult, marker, status)
                   });

                });

                function clearResults(markers) {
                    for (var m in markers) {
                        markers[m].setMap(null)
                    }
                    markers = []
                    }
                }

                let photoRestaurant = document.createElement('img');
                photoRestaurant.src = "restaurant.png"

                function createPhoto(placeResult) {
                    var photos = placeResult.photos;
                    var photo;
                    if (!photos) {
                        photo = photoRestaurant;
                    } else {
                        photo = photos[0].getUrl({'maxWidth': 200, 'maxHeight': 200});
                    }
                    return photo;
                }

/////////////////////////////////////////////////////
                function showDetails(placeResult, marker, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        let placeInfowindow = new google.maps.InfoWindow();
                        let comment = "";
                        let rating = placeResult.rating;
                        let inputBox = document.createElement('input')
                        /////////////////////////////////////////////////
                        for (i = 0; i < placeResult.reviews.length; i += 1) {
                            comment = placeResult.reviews[i].text;
                        }
                        /////////////////////////////////////////////////

                            newCard = '<div id="googleInfo"><strong>' + placeResult.name +
                            '</strong><br>' + '<img  id="infoPhoto" src="' +
                                createPhoto(placeResult) + '">' + '<p id="infoAdd">'
                                 + 'Address: ' + placeResult.formatted_address + 
                                 '</p>'+'<br>' + 'Rating: ' + Math.round(rating) + '⭐' + '<br>'
                                 + '<p class="Italics" id="addReviewNew">' + '"' + comment + '"' + '</p>' + 
                                 '<button id="AddReview" type="submit" >'
                                 + 'Add Review' + '</button>'
                                 + '</div>';

                        //     $( document ).ready(function() {
                        //         $('#AddReview').click(function(){
                        //             // parareviewsPop.textContent = "";
                        //             $('#googleInfo').append(inputBox);

                        //             $('#AddReview').click(function() {
                        //                 alert('Time to add review')
                        //                 inputBox.style.display = "none";
                        //                 // Addreview.style.display = "none";
                        //             })
                        //         })
                        //    });

                            // console.log(Math.round(placeResult.rating));
                            // marker.set("id", placeResult.rating);
                            // markers.push(marker);
                            // markerId = (Math.round(marker.id * 2) / 2).toFixed();
                            // console.log(markerId);

                            placeInfowindow.setContent(newCard);
                            placeInfowindow.open(marker.map, marker);
                            currentInfoWindow.close();
                            currentInfoWindow = placeInfowindow;
                            showSidebar(placeResult);
                            
                            $('#filterButton').on('click',function(){
                            let min = $('#selectBoxFrom').val()
                            let max = $('#selectBoxTo').val();
                            let minNum = parseInt(min);
                            let maxNum = parseInt(max);
                                // markerId = Math.ceil(marker.id);
                                // console.log(markerId);
                            
                            setTimeout(3000);
                            // if (markerId >= minNum && markerId <= maxNum) {
                            //     marker.setVisible(true);
                            // } else {
                            //     marker.setVisible(false);
                            // }
                            
                            //When filter is clicked make divs appear and disappear based on rating///
                            for (let i = 0; i < min; i++) {
                            $("section").css('display', 'block');
                            $( "section:contains('Rating: " + i + "')" ).css( "display", "none" );
                            $( "section:contains('Rating: NaN')" ).css( "display", "none" );
                            }
                            
                            for (let j = 5; j > max ; j-=0.5) {
                                $( "section:contains('Rating: " + j + "')" ).css( "display", "none" );
                            }   
                            
                            filteredRestaurants = restaurantsData.filter(function(obj) {
                                return obj.ratings >= min && obj.ratings <= max;
                            })

                                console.log(filteredRestaurants);

                            if(rating >= min && rating <= max) {
                                showDetails(placeResult);
                            } else if(rating <= max && rating >= min) {
                                showDetails(placeResult);
                            }
                            else {
                                marker.setMap(null);
                            }
                        
                            $('img').on("error", function() {
                                $("img").attr("src");
                                $(this).attr('src', 'placeholder.jpg');
                              });
                              
                        })

                    } 

                    else { console.log('no results')};
                }


                    function showSidebar(placeResult) {

                        const mainDiv = document.createElement('section');
                        const div = document.createElement('div');
                        const header = document.createElement('h2');
                        const address = document.createElement('p')
                        const rating = document.createElement('p')
                        const review = document.createElement('p')
                        const input = document.createElement('input')
                        const buttonReview = document.createElement('button');

                        restaurantsData.push({restaurantName: placeResult.name,
                        address: placeResult.formatted_address, ratings: placeResult.rating, });

                        header.textContent = placeResult.name;
                        address.textContent = placeResult.formatted_address;
                        rating.textContent = "Rating: " + Math.round(placeResult.rating) + '⭐';
                        buttonReview.textContent = "Add Review";

                        for (let i = 0; i < placeResult.reviews.length; i += 1) {
                            comment = '' + placeResult.reviews[i].text + '"';
                        }
                        review.textContent = comment;
                        for (i = 0; i < restaurantsData.length; i++){
                            buttonReview.setAttribute('id', i+100);
                        }

                        mainDiv.setAttribute('id', placeResult.rating);
                        mainDiv.id = (Math.round(placeResult.rating * 2) / 2).toFixed(1);
                        header.setAttribute('id', 'header')
                        address.setAttribute('class', 'address');
                        rating.style.fontSize = "large";
                        button.classList.add = "addReview";
                        review.style.fontStyle = "Italic";
                        input.setAttribute('class', 'inputReviewNew');
                        mainDiv.setAttribute('class', 'restaurantForms container');
                    
                        //////Input review//////////
                        $( document ).ready(function() {
                            $(buttonReview).click(function(){
                                review.textContent = "";
                                div.appendChild(input);
                                $(buttonReview).click(function() {
                                    review.textContent = '"' + $(input).val() + '"';
                                    input.style.display = "none";
                                    button.style.display = "none";
                                })
                            })
                       });

                        div.appendChild(header);
                        if(placeResult.photos) {
                            let firstPhoto = placeResult.photos[0];
                            let photo = document.createElement('img');
                            photo.src = firstPhoto.getUrl();
                            div.appendChild(photo);
                            photo.setAttribute('class', 'photo');
                        } 
                        div.append(address);
                        div.appendChild(rating);
                        div.appendChild(review);
                        div.appendChild(buttonReview);
                        mainDiv.appendChild(div);
                        sidebar.appendChild(mainDiv);     
                    }


//////////////function to add json markers to the map////////////////////////////////////////
                for (var y = 0; y < Object.keys(restaurantsData).length; y++) {
                // for (var y = 0; y < restaurantsData.length; y++) {

                    var restaurantInfo = restaurantsData[y];
                    var latLng = new google.maps.LatLng(restaurantInfo.lat, restaurantInfo.long)

                    const window = document.createElement('div');
                    const title = document.createElement('h3');
                    const paraAddressPop = document.createElement('p');
                    const paraRatingsPop = document.createElement('p');
                    const parareviewsPop = document.createElement('p')
                    const buttonPop = document.createElement('button');
                    const ratingPop = document.createElement('p');
                    const image = document.createElement('img');
                    const inputNew = document.createElement('input');

                    title.textContent = restaurantInfo.restaurantName;
                    paraAddressPop.textContent = restaurantInfo.address;
                    paraRatingsPop.textContent = "Rating: " + restaurantInfo.ratings + '⭐';
                    parareviewsPop.textContent = '"' + restaurantInfo.comment + '"';
                    image.setAttribute("src", restaurantInfo.photo);
                    title.style.marginTop = "-20px;"
                    image.setAttribute('class', 'windowImage');
                    
                    paraAddressPop.setAttribute('class', 'windowAddress')
                    buttonPop.setAttribute('class', 'windowButton');
                    paraRatingsPop.setAttribute('class', 'windowRatings');
                    parareviewsPop.style.marginTop = "160px";
                    buttonPop.textContent = "Add Review";
                    buttonPop.setAttribute('id', y);                

                    window.appendChild(title);
                    window.appendChild(image);
                    window.appendChild(paraAddressPop);
                    window.appendChild(paraRatingsPop);
                    window.appendChild(parareviewsPop);
                    window.appendChild(buttonPop);
                    window.classList.add('window');
                    console.log(latLng);

                    ///////Enter review on infowindow////////
                    $( document ).ready(function() {
                        $(buttonPop).click(function(){
                            parareviewsPop.textContent = "";
                            window.appendChild(inputNew);
                            $(buttonPop).click(function() {
                                parareviewsPop.textContent = '"' + 
                                $(inputNew).val() + '"';
                                inputNew.style.display = "none";
                                buttonPop.style.display = "none";
                            })
                        })
                   });

                    ///////////////////////////////////////////


                    let content = restaurantInfo.restaurantName;
                    
                    let restMarker = new google.maps.Marker({
                        position: latLng,
                        map:map,
                        title: restaurantInfo.restaurantName,
                    });

                    console.log(`Marker created: ${restMarker}`);
                    restMarker.set('id', restaurantInfo.ratings);
                    markers.push(restMarker);
                    restMarkerId = restMarker.id;                    

                    currentInfoWindow.close();
                    
                    setTimeout(2000);
                    let infowindow = new google.maps.InfoWindow();

                    restMarker.addListener("click", () => {
                        infowindow.open(map, restMarker);
                        infowindow.setContent(window);
                    });

                    //show and hide marker based on selected values
                    $('#filterButton').on('click',function(){
                        let min = $('#selectBoxFrom').val()
                        let max = $('#selectBoxTo').val();

                        if (restMarkerId >= min && restMarkerId <= max) {
                            restMarker.setVisible(true);
                        } else {
                            restMarker.setVisible(false);
                        }

                        // if(Math.round(restaurantInfo.ratings) >= min && Math.round(restaurantInfo.ratings) <= max) {
                        //     restMarker.setVisible(true);
                        // } else {
                        //     restMarker.setVisible(false);
                        // }
                    })


                    ///////////////////Add new restaurant on right click/////////////////////////////////////////
                        google.maps.event.addListener(map, 'rightclick', function (e) {
        
                    //Determine the location where the user has clicked.
                         var location = e.latLng;
                         var element = document.createElement('div');
                         element.innerHTML = form;
                   
                        var markerNew = new google.maps.Marker({
                            position: location,
                            map: map
                        });
                
                        google.maps.event.addListener(markerNew, "click", function (e) {
                            let infoWindow= new google.maps.InfoWindow({
                                content: element
                            });
                            
                            infoWindow.open(map, markerNew);
                        });
                           
                    });

                           const form = 
                           '<div id="formBox">' + '<br>' + 
                           '<div id="divDisappear">' +
                            '<input type="text" placeholder="Restaurant Name" id="restaurantName">'
                             + '</input>' + '<br>' +
                            '<input type="text" placeholder="Address" id="restAddress">'
                             + '</input>' + '<br>' + 
                            '<label>' + "Rating " + '</label>' + 
                            ' <select id = "myList">' +
                               '<option value = "1">1</option>' +
                               '<option value = "2">2</option>' +
                               '<option value = "3">3</option>' +
                               '<option value = "4">4</option>' +
                               '<option value = "5">5</option>' +
                               '</select>' + '<br>' +
                               '<input type="submit" id="enter" value="Add to map" onclick="myfunction()"></input>' +
                            '</div>' +
                            '</div>'
                }

 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////           

            var infoWindow = new google.maps.InfoWindow();
            infoWindow.open(map);
            map.setCenter(pos);

            }, () => {
                // If the browser supports geolocation, but user has denied permission
                handleLocationError(true, infoWindow);
            });
        } else {
            // IF browser doesn't support geolocation
            handleLocationError(false, infoWindow);
        }
    }

  
    function myfunction() {
          restName = document.getElementById('restaurantName').value;
          restAddress = document.getElementById('restAddress').value;
          ratingValue = document.getElementById('myList').value;

          restaurantsData.push({restaurantName: restName,
          address: restAddress });
          console.log(restaurantsData);
          formBox = document.getElementById('formBox');
          formDiv = document.getElementById('divDisappear');
          formDiv.style.display = "none";
          nameText = document.createElement('p')
          imageRestaurant = document.createElement('img')
          addressText = document.createElement('p')
          ratingText = document.createElement('p')
          nameText.textContent = restName;
          addressText.textContent = restAddress;
          ratingText.textContent = "Rating: " + ratingValue + '⭐';

          nameText.classList.add("headerInfowindow");
          imageRestaurant.src = "restaurant.png"
          imageRestaurant.setAttribute('class', 'imageRestaurant');
          addressText.id = "infoAdd";
          ratingText.style.marginTop = "-2px";
          ratingText.style.marginLeft= "5px";
          addressText.style.marginLeft = "-30px;"
          ratingText.style.width = "100px";

          formBox.appendChild(nameText);
          formBox.appendChild(imageRestaurant);
          formBox.appendChild(addressText);
          formBox.appendChild(ratingText);
          restName.textContent = restName;
          restAddress.textContent = restAddress;
    }
    
    //If there's a geolocation error
        function handleLocationError(browserHasGeolocation, infoWindow) {
            // Set default location to Dublin, Ireland
            pos = {lat: -33.856, lng: 151.215};
            map = new google.maps.Map(document.getElementById('map'), {
                center: pos,
                zoom: 15
            });

            // Display an InfoWindow at the map center
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                'Geolocation permissions denied. Using default location.' :
                'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open(map);
            currentInfoWindow = infoWindow;
        }
