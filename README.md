// Define variables to store DOM elements
navMenu = get element by ID "nav-menu"
navToggle = get element by ID "nav-toggle"
navClose = get element by ID "nav-close"
favoritesList = get element by ID "favoritesList"

// Add event listener to toggle navigation menu
on navToggle click:
    add class "show-menu" to navMenu

// Add event listener to close navigation menu
on navClose click:
    remove class "show-menu" from navMenu

// Function to fetch favorite items from local storage
function fetchLocal():
    localArray = get item from localStorage with key "favorites"
    parsedLocalArray = parse localArray as JSON
    if parsedLocalArray is null:
        return an empty array
    else:
        return parsedLocalArray

// Initialize favorite list by fetching from local storage
favoriteList = call fetchLocal()

// Function to remove item from favorites
function remove(item):
    decode item as JSON and store in Item
    deleteElementIndex = find index of Item in favoriteList
    remove element at deleteElementIndex from favoriteList
    update localStorage with key "favorites" to store favoriteList as JSON
    call DisplayfavoriteList with favoriteList as argument

// Function to display favorites list
function DisplayfavoriteList(list):
    remainingData = list
    clear content of favoritesList

    if length of remainingData is 0:
        return

    // Create slider container and slider dynamically 
    create SimilarResultsEl element with text "Favorites List" and class "Similar-Results"
    append SimilarResultsEl to favoritesList
    create newSliderContainer element with class "slider-container"
    create newSlider element with class "splide"

    // Construct the HTML for the slider dynamically with fetched image URLs
    iterate over remainingData:
        create slide element with:
            - image sourced from each.src.medium
            - heart icon with onClick event to call remove function with encoded JSON of each item
            - image alt text
            - photographer information
        append slide to slide list

    append slide list to newSlider
    append newSlider to newSliderContainer
    append newSliderContainer to favoritesList

    // Initialize Splide slider for the new slider
    initialize Splide slider with newSlider options:
        - type: 'slide'
        - perMove: 1
        - perPage: 3
        - pauseOnHover: false
        - pagination: false
        - arrows: true
        - rewind: true

// Display initial favorites list
call DisplayfavoriteList with favoriteList as argument

// Function to add item to favorites
function addToFavorites(item):
    decode item as JSON and store in Item
    add Item to favoriteList
    update localStorage with key "favorites" to store favoriteList as JSON
    call DisplayfavoriteList with favoriteList as argument

// When document is loaded:
on DOMContentLoaded:
    get inputEl by ID "input"
    get searchEl by ID "search"
    get displayfirstData by ID "firstData"
    get sliderContainer by ID "sliderContainer"

    // Function to fetch images and create slider
    function fetchImagesAndCreateSlider(resData):
        clear content of sliderContainer
        if length of resData.photos is 0:
            return

        // Create slider container and slider dynamically 
        create SimilarResultsEl element with text "Similar Results" and class "Similar-Results"
        append SimilarResultsEl to sliderContainer
        create newSliderContainer element with class "slider-container"
        create newSlider element with class "splide"

        // Construct the HTML for the slider dynamically with fetched image URLs
        iterate over resData.photos starting from index 1:
            create slide element with:
                - image sourced from each.src.medium
                - heart icon with onClick event to call addToFavorites function with encoded JSON of each item
                - image alt text
                - photographer information
            append slide to slide list

        append slide list to newSlider
        append newSlider to newSliderContainer
        append newSliderContainer to sliderContainer

        // Initialize Splide slider for the new slider
        initialize Splide slider with newSlider options:
            - type: 'slide'
            - perMove: 1
            - perPage: 3
            - pauseOnHover: false
            - pagination: false
            - arrows: true
            - rewind: true

    // Function to display first image
    function displayFirst(resData):
        get firstData from resData.photos at index 0
        set innerHTML of displayfirstData with:
            - image sourced from firstData.src.medium
            - image alt text
            - photographer information
            - button to explore more with link to firstData.photographer_url

    // Function to get data from API
    function getData(inputValue):
        clear inputEl value
        define options object with Authorization header
        async function to fetch data:
            fetch data from API with inputValue using options
            parse response as JSON and store in resData
            call displayFirst with resData
            call fetchImagesAndCreateSlider with resData

    // Add event listener for input field keydown event
    on inputEl keydown:
        if key is "Enter" and inputEl value is not empty:
            call getData with inputEl value

    // Add event listener for search button click event
    on searchEl click:
        if inputEl value is not empty:
            call getData with inputEl value
