const carousel = document.querySelector(".carousel-items");
const prevBtn = document.querySelector(".prev.btn");
const nextBtn = document.querySelector(".next.btn");

const itemWidth = 50; // in px
const containerWidth = 400;
const itemsInitiallySeen = containerWidth/itemWidth;
const itemsToScroll = 3;

let transformWidth = 0;
let currentItemNumber = itemsInitiallySeen;
function getTransformWidthForNext(){
    const numberOfItems = Array.from(carousel.children).length;
    const remainedItems=numberOfItems-currentItemNumber;
    if(remainedItems === 0){
        return
    } else if(itemsToScroll<=remainedItems){
        transformWidth = transformWidth + itemsToScroll*itemWidth;
        currentItemNumber+=itemsToScroll;
    } else if(itemsToScroll===remainedItems){
        transformWidth = transformWidth + itemsToScroll*itemWidth;
        currentItemNumber=numberOfItems;
    } else if(itemsToScroll>remainedItems){
        transformWidth = transformWidth + remainedItems*itemWidth;
        currentItemNumber=numberOfItems;
    }
    return transformWidth;
    }

    function getTransformWidthForPrev(){
        const numberOfItems = Array.from(carousel.children).length;
        const remainedItems=numberOfItems-currentItemNumber;
        if((numberOfItems -remainedItems) === (numberOfItems - itemsInitiallySeen)){
            return
        } else if((numberOfItems -remainedItems)>=(numberOfItems - itemsInitiallySeen)){
            transformWidth = transformWidth - itemsToScroll*itemWidth;
            currentItemNumber-=itemsToScroll;
        } else if((numberOfItems -remainedItems)<=(numberOfItems - itemsInitiallySeen)){
            transformWidth = 0;
            currentItemNumber=itemsInitiallySeen;
        }
        return transformWidth;
        }

prevBtn.addEventListener("click", ()=>{
    const width = getTransformWidthForPrev();
    carousel.style.transform = `translateX(-${width}px)`;
})
nextBtn.addEventListener("click", ()=>{
    const width = getTransformWidthForNext();
    carousel.style.transform = `translateX(-${width}px)`;
})