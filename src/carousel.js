// hourly forecast
const carouselFrame = document.querySelector(".today-carousel");
const carousel = document.querySelector(".carousel-items");
const prevBtn = document.querySelector(".prev.btn");
const nextBtn = document.querySelector(".next.btn");

const itemWidth = 50; // in px
const containerWidth = 400;
const itemsInitiallySeen = containerWidth/itemWidth;
const itemsToScroll = 3;

// const maxTransformWidth = numberOfItems * itemWidth;
// const transformThreshold = maxTransformWidth - itemWidth;
let transformWidth = 0;
let currentItemNumber = itemsInitiallySeen;
let btnType;
function getTransformWidthForNext(){
    const numberOfItems = Array.from(carousel.children).length;
    const remainedItems=numberOfItems-currentItemNumber;
    if(remainedItems === 0){
        console.log("0")
        return
    } else if(itemsToScroll<=remainedItems){
        console.log("1")
        transformWidth = transformWidth + itemsToScroll*itemWidth;
        currentItemNumber+=itemsToScroll;
        console.log(currentItemNumber)
        console.log(numberOfItems-currentItemNumber)
    } else if(itemsToScroll===remainedItems){
        console.log("2")
        transformWidth = transformWidth + itemsToScroll*itemWidth;
        currentItemNumber=numberOfItems;
        console.log(currentItemNumber)
        console.log(numberOfItems-currentItemNumber)
    } else if(itemsToScroll>remainedItems){
        console.log("3")
        transformWidth = transformWidth + remainedItems*itemWidth;
        currentItemNumber=numberOfItems;
        console.log(currentItemNumber)
        console.log(remainedItems)
    }
    return transformWidth;
    }

    function getTransformWidthForPrev(){
        const numberOfItems = Array.from(carousel.children).length;
        const remainedItems=numberOfItems-currentItemNumber;
        if((numberOfItems -remainedItems) === (numberOfItems - itemsInitiallySeen)){
            console.log("0p")
            return
        } else if((numberOfItems -remainedItems)>=(numberOfItems - itemsInitiallySeen)){
            console.log("1p")
            transformWidth = transformWidth - itemsToScroll*itemWidth;
            currentItemNumber-=itemsToScroll;
            console.log(currentItemNumber)
            console.log(numberOfItems-currentItemNumber)
        } 
        // else if(itemsToScroll===remainedItems){
        //     console.log("2p")
        //     transformWidth = transformWidth - itemsToScroll*itemWidth;
        //     currentItemNumber=numberOfItems;
        //     console.log(currentItemNumber)
        //     console.log(numberOfItems-currentItemNumber)
        // } 
        else if((numberOfItems -remainedItems)<=(numberOfItems - itemsInitiallySeen)){
            console.log("3p")
            transformWidth = 0;
            currentItemNumber=itemsInitiallySeen;
            console.log(currentItemNumber)
            console.log(remainedItems)
        }
        return transformWidth;
        }

prevBtn.addEventListener("click", ()=>{
    btnType = "prev";
    const width = getTransformWidthForPrev();
    carousel.style.transform = `translateX(-${width}px)`;
})
nextBtn.addEventListener("click", ()=>{
    const width = getTransformWidthForNext();
    carousel.style.transform = `translateX(-${width}px)`;
})