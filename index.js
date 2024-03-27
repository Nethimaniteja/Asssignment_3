let navMenu = document.getElementById("nav-menu");
let navToggle = document.getElementById("nav-toggle");
let navClose = document.getElementById("nav-close");
let favoritesList = document.getElementById("favoritesList");

navToggle.addEventListener("click", function() {
    navMenu.classList.add("show-menu")
})


navClose.addEventListener("click", function() {
    navMenu.classList.remove("show-menu")
})

function fetchLocal(){
    let localArray = localStorage.getItem("favorites");
    let parsedlocalArray = JSON.parse(localArray);
    if (parsedlocalArray === null) {
        return [];
    } else {
        return parsedlocalArray;
    }
}

let favoriteList = fetchLocal();
// favoriteList.length()

function remove(item){
    const Item = JSON.parse(decodeURIComponent(item));
    console.log(Item)
    let deleteElementIndex = favoriteList.findIndex(function(each) {
        if (each.id === Item.id) {
            return true;
        } else {
            return false;
        }
    });

    favoriteList.splice(deleteElementIndex,1);
    localStorage.setItem('favorites',JSON.stringify(favoriteList))
    DisplayfavoriteList(favoriteList);
}

function DisplayfavoriteList(list){

    let remainingData = list
    favoritesList.textContent = "";

    if(remainingData.length === 0){
        return
    }

        
      //Create slider container and slider dynamically 
      const SimilarResultsEl = document.createElement("h2");
      SimilarResultsEl.textContent = "Favorites List";
      SimilarResultsEl.classList.add("Similar-Results") 
      favoritesList.appendChild(SimilarResultsEl)
      const newSliderContainer = document.createElement('div');
      newSliderContainer.classList.add('slider-container');
      const newSlider = document.createElement('div');
      newSlider.classList.add('splide');

      // Construct the HTML for the slider dynamically with fetched image URLs
      const slideList = remainingData.map(each => `
      <li class="splide__slide">
        <div class="slide-container">
            <img src="${each.src.small}" alt="Image" style="width:100%;height:200px;">
            <img src="./red_Heart.png" class="heart" onClick="remove('${encodeURIComponent(JSON.stringify(each))}')"/>
            <p class="slider-image-name">${each.alt}</p>
            <p class="slider-photographer">${each.photographer}</p>
        </div>
      </li>`).join('');
      newSlider.innerHTML = `
        <div class="splide__track">
          <ul class="splide__list">
            ${slideList}
          </ul>
        </div>
      `;
      
      // Append the newly created slider to the slider container
      newSliderContainer.appendChild(newSlider);
      favoritesList.appendChild(newSliderContainer);

      // Initialize Splide slider for the new slider
      new Splide(newSlider, {
        type: 'slide',
        perMove:1,
        perPage: 3,
        pauseOnHover: false,
        pagination: false,
        arrows: true,
        rewind: true,
      }).mount();
}

DisplayfavoriteList(favoriteList);

function addToFavorites(item){
    const Item = JSON.parse(decodeURIComponent(item));
    // console.log(Item)
    favoriteList.push(Item)
    localStorage.setItem('favorites',JSON.stringify(favoriteList))
    DisplayfavoriteList(favoriteList)
}



document.addEventListener('DOMContentLoaded', function () {
    let inputEl = document.getElementById("input");
    let searchEl = document.getElementById("search");
    let displayfirstData = document.getElementById("firstData");
    const sliderContainer = document.getElementById('sliderContainer');


    function fetchImagesAndCreateSlider(resData) {
      
      let remainingData = resData.photos.slice(1)
      console.log(remainingData)
      sliderContainer.textContent = "";

      if(remainingData.length === 0){
        return
         }

        
      // Create slider container and slider dynamically 
      const SimilarResultsEl = document.createElement("h2");
      SimilarResultsEl.textContent = "Similar Results";
      SimilarResultsEl.classList.add("Similar-Results") 
      sliderContainer.appendChild(SimilarResultsEl);

      const newSliderContainer = document.createElement('div');
      newSliderContainer.classList.add('slider-container');
      const newSlider = document.createElement('div');
      newSlider.classList.add('splide');

      // Construct the HTML for the slider dynamically with fetched image URLs
      const slideList = remainingData.map(each => `
      <li class="splide__slide">
        <div class="slide-container">
            <img src="${each.src.small}" alt="Image"  class="slide-image">
            <img src="./Heart.png" class="heart" onClick="addToFavorites('${encodeURIComponent(JSON.stringify(each))}')"/>
            <p class="slider-image-name">${each.alt}</p>
            <p class="slider-photographer">${each.photographer}</p>
        </div>
      </li>`).join('');
      newSlider.innerHTML = `
        <div class="splide__track">
          <ul class="splide__list">
            ${slideList}
          </ul>
        </div>
      `;
      
      // Append the newly created slider to the slider container
      newSliderContainer.appendChild(newSlider);
      sliderContainer.appendChild(newSliderContainer);

      // Initialize Splide slider for the new slider
      new Splide(newSlider, {
        type: 'slide',
        perMove:1,
        perPage: 3,
        pauseOnHover: false,
        pagination: false,
        arrows: true,
        rewind: true,
      }).mount();
    }

    function displayFirst(resData){
        let firstData = resData.photos[0]
        console.log(firstData)
        displayfirstData.innerHTML = `
            <div class="dummy-image-container">
                <div>
                    <div class="dummy-image-container">
                        <img src="${firstData.src.small}" class="dummy-image"/>
                    </div>
                    <div class="dummy-content-container">
                        <h3>${firstData.alt}</h3>
                        <p>${firstData.photographer}</p>
                        <a href="${firstData.photographer_url}" target="_blank"><button>Explore More</button></a>
                    </div>
                </div>  
            </div>`
    }
    
    function getData(inputValue){
    
        inputEl.value = "";
    
        let options = {
            headers: {
                Authorization : "jAhtaTY7oBgoqcF6R8VcfmDDnRUG5EVVdwfj3AemNewMhgT9ZzlutIQ5"
            }
        }
        
        async function data(inputValue){
            let res = await fetch(`https://api.pexels.com/v1/search/?query=${inputValue}`,options);
            let resData = await res.json()
            console.log(resData)
            displayFirst(resData)
            fetchImagesAndCreateSlider(resData);
        }
    
        data(inputValue);
    }
    
    inputEl.addEventListener("keydown",function(event){
        if(event.key === "Enter"){
            if(inputEl.value){
                getData(inputEl.value);
            }
        }
    })
    
    searchEl.addEventListener("click",function(){
        if(inputEl.value){
            getData(inputEl.value);
        }
    })

  });