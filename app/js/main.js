$(function(){
    console.log('Инициализация началась');

    $('.top-slider__inner').slick({
        dots:true,
        arrows: false,
        fade: true,
        autoplay: true,
        autoplaySpeed: 2000
    });

    console.log('Slick-Slider инициализирован');

    $('.star').rateYo({
        rating: 3.5,
        starWidth: "17px",
        normalFill: "#ccccce",
        ratedFill: "#ffc35b",
        readOnly: true
    });

    console.log('RateYo инициализирован');
});