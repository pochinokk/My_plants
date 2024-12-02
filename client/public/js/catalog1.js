const carousel = document.querySelector(".carousel1");
const arrowBtns = document.querySelectorAll(".wrapper1 .arrows1");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const carouselChildren = [...carousel.children];

let isDragging = false, startX, startScrollLeft;

let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

carouselChildren.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

carouselChildren.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id === "left1" ? -firstCardWidth : firstCardWidth;
    })
});
const dragStart = (e) =>{
    isDragging = true;
    carousel.classList.add("dragging1")
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}
const dragging = (e) =>{
    if(!isDragging) return;
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}
const dragStop = () =>{
    isDragging = false;
    carousel.classList.remove("dragging1");
}
const infiniteScroll = () => {
    if(carousel.scrollLeft === 0)
    {
        carousel.classList.add("no-transition1");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition1");
    }else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition1");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition1");
    }
}
carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);


//Вторая карусель
const carousel2 = document.querySelector(".carousel2");
const arrowBtns2 = document.querySelectorAll(".wrapper2 .arrows2");
const firstCardWidth2 = carousel2.querySelector(".card").offsetWidth;
const carouselChildren2 = [...carousel2.children];

let isDragging2 = false, startX2, startScrollLeft2;

let cardPerView2 = Math.round(carousel2.offsetWidth / firstCardWidth2);

carouselChildren2.slice(-cardPerView2).reverse().forEach(card => {
    carousel2.insertAdjacentHTML("afterbegin", card.outerHTML);
});

carouselChildren2.slice(0, cardPerView2).forEach(card => {
    carousel2.insertAdjacentHTML("beforeend", card.outerHTML);
});

arrowBtns2.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel2.scrollLeft += btn.id === "left2" ? -firstCardWidth2 : firstCardWidth2;
    })
});
const dragStart2 = (e) =>{
    isDragging2 = true;
    carousel2.classList.add("dragging2")
    startX2 = e.pageX;
    startScrollLeft2 = carousel2.scrollLeft;
}
const dragging2 = (e) =>{
    if(!isDragging2) return;
    carousel2.scrollLeft = startScrollLeft2 - (e.pageX - startX2);
}
const dragStop2 = () =>{
    isDragging2 = false;
    carousel2.classList.remove("dragging2");
}
const infiniteScroll2 = () => {
    if(carousel2.scrollLeft === 0)
    {
        carousel2.classList.add("no-transition2");
        carousel2.scrollLeft = carousel2.scrollWidth - (2 * carousel2.offsetWidth);
        carousel2.classList.remove("no-transition2");
    }else if (Math.ceil(carousel2.scrollLeft) === carousel2.scrollWidth - carousel2.offsetWidth) {
        carousel2.classList.add("no-transition2");
        carousel2.scrollLeft = carousel2.offsetWidth;
        carousel2.classList.remove("no-transition2");
    }
}
carousel2.addEventListener("mousedown", dragStart2);
carousel2.addEventListener("mousemove", dragging2);
document.addEventListener("mouseup", dragStop2);
carousel2.addEventListener("scroll", infiniteScroll2);

//Третья карусель
const carousel3 = document.querySelector(".carousel3");
const arrowBtns3 = document.querySelectorAll(".wrapper3 .arrows3");
const firstCardWidth3 = carousel3.querySelector(".card").offsetWidth;
const carouselChildren3 = [...carousel3.children];

let isDragging3 = false, startX3, startScrollLeft3;

let cardPerView3 = Math.round(carousel3.offsetWidth / firstCardWidth3);

carouselChildren3.slice(-cardPerView3).reverse().forEach(card => {
    carousel3.insertAdjacentHTML("afterbegin", card.outerHTML);
});

carouselChildren3.slice(0, cardPerView3).forEach(card => {
    carousel3.insertAdjacentHTML("beforeend", card.outerHTML);
});

arrowBtns3.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel3.scrollLeft += btn.id === "left3" ? -firstCardWidth3 : firstCardWidth3;
    })
});
const dragStart3 = (e) =>{
    isDragging3 = true;
    carousel3.classList.add("dragging3")
    startX3 = e.pageX;
    startScrollLeft3 = carousel3.scrollLeft;
}
const dragging3 = (e) =>{
    if(!isDragging3) return;
    carousel3.scrollLeft = startScrollLeft3 - (e.pageX - startX3);
}
const dragStop3 = () =>{
    isDragging3 = false;
    carousel3.classList.remove("dragging3");
}
const infiniteScroll3 = () => {
    if(carousel3.scrollLeft === 0)
    {
        carousel3.classList.add("no-transition3");
        carousel3.scrollLeft = carousel3.scrollWidth - (2 * carousel3.offsetWidth);
        carousel3.classList.remove("no-transition3");
    }else if (Math.ceil(carousel3.scrollLeft) === carousel3.scrollWidth - carousel3.offsetWidth) {
        carousel3.classList.add("no-transition3");
        carousel3.scrollLeft = carousel3.offsetWidth;
        carousel3.classList.remove("no-transition3");
    }
}
carousel3.addEventListener("mousedown", dragStart3);
carousel3.addEventListener("mousemove", dragging3);
document.addEventListener("mouseup", dragStop3);
carousel3.addEventListener("scroll", infiniteScroll3);
