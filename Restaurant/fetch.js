
fetch('user.json')
.then(response => response.json())
.then(data => {
    restaurantsData = data;
    let rating = restaurantsData.ratings;
    console.log(restaurantsData);
    showRestaurants()
    function showRestaurants(obj) {

        for (let i = 0; i < restaurantsData.length; i++) {

                var restInfo = restaurantsData[i];

            const myArticle1 = document.querySelector('.restaurantForms');
            const header1 = document.createElement('h2');
            const paraAddress = document.createElement('p');
            const paraLat = document.createElement('p');
            const paraLong = document.createElement('p');
            const paraRatings = document.createElement('span');
            const paraReviews = document.createElement('p');
            const button = document.createElement('button');
            const myList = document.createElement('ul');
            var ratingsSide = document.createElement('p')
            var reviewsSide = document.createElement('p');
            const input = document.createElement('input')

            header1.textContent = restaurantsData[i].restaurantName;
            paraAddress.textContent = 'Address: ' + restaurantsData[i].address;
            paraLat.textContent = 'Lat: ' + restaurantsData[i].lat;
            paraLong.textContent = 'Long: ' + restaurantsData[i].long;
            paraRatings.textContent = 'Rating: ' + restaurantsData[i].ratings + '⭐';
            paraReviews.textContent = '"' + restaurantsData[i].comment + '"';
            button.setAttribute('id', i);
            input.label = "Enter Review: "
            input.setAttribute('class', 'inputReview');
            $('select:first-of-type').attr('id', 'selectBoxFrom')

            paraAddress.setAttribute('class', 'address');
            paraRatings.setAttribute('class', 'rating');
            paraReviews.style.fontStyle = "italic"; 

            myArticle1.appendChild(header1);
            myArticle1.appendChild(paraAddress);
            myArticle1.appendChild(paraRatings);
            myArticle1.appendChild(paraReviews);
            myArticle1.appendChild(button);
            
            $( document ).ready(function() {
                $(button).click(function(){
                    paraReviews.textContent = "";
                    myArticle1.appendChild(input);
                    $(button).click(function() {
                        paraReviews.textContent = '"' + $(input).val() + '"';
                        input.style.display = "none";
                        button.style.display = "none";
                    })
                })
           });
           
            sidebar.appendChild(myArticle1);
            myArticle1.style.textAlign = "left"
            button.innerHTML = "Add Review";
        }
    }
   
});