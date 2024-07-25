

var sectionSwiper = new Swiper(".section-swiper", {
    speed: 800,
    slidesPerView: 1,
    nested: true,
    direction: "vertical",
    allowTouchMove: false,
    effect: "creative",
    creativeEffect: {
        progressMultiplier: 1,
        prev: {
            shadow: true,
            translate: [0, 0, -240],
            opacity: 1,
        },
        next: {
            translate: [0, "100%", 0],
            opacity: 1,
        },
    },
    on: {
        slideChange: function(){
            let act = this.activeIndex;
            $('#header nav button').removeClass('act');
            $('#header nav button:nth-of-type('+ act +')').addClass('act');
        },
    }
});

var timelineSwiper = new Swiper(".timeline-swiper", {
    speed: 600,
    slidesPerView: "auto",
    centeredSlides: true,
    initialSlide: 2,
    parallax: true,
    mousewheel: {
        eventsTarget: '#timeline',
    },
    on: {
        slideChange: function(){
            let act = this.activeIndex - 1;

            $(".timeline-cont .cont-wrap").removeClass('act');

            if(act <= 0){
                $(".timeline-cont .cont-wrap").removeClass('act');
            }else if( act >= 5){
                $(".timeline-cont .cont-wrap").removeClass('act');
            }else{
                $(".timeline-cont .cont-wrap:nth-of-type("+ act +")").addClass('act');
            }
        }
    }
});

$('#header .bi').on('click', function(){
    sectionSwiper.slideTo(0);
});

$('.start-btn').on('click', function(){
    sectionSwiper.slideTo(1);
});

$('#header nav button:nth-of-type(1)').on('click', function(){
    sectionSwiper.slideTo(1);
});

$('#header nav button:nth-of-type(2)').on('click', function(){
    sectionSwiper.slideTo(2);
});

$('#header nav button:nth-of-type(3)').on('click', function(){
    sectionSwiper.slideTo(3);
});

$('#header nav button:nth-of-type(4)').on('click', function(){
    sectionSwiper.slideTo(4);
});

$('#header nav button:nth-of-type(5)').on('click', function(){
    sectionSwiper.slideTo(5);
});



var project2021Swiper = new Swiper(".project2021-swiper", {
    speed: 800,
    slidesPerView: 1,
    nested: true,
    direction: "vertical",
    allowTouchMove: false,
    on: {
        init: function(){
            let act = this.activeIndex + 1;
            $('.works-2021 .nav-area .btn-item').removeClass('act');
            $('.works-2021 .nav-area .btn-item:nth-of-type('+ act +')').addClass('act');
        },
        slideChange: function(){
            let act = this.activeIndex + 1;
            $('.works-2021 .nav-area .btn-item').removeClass('act');
            $('.works-2021 .nav-area .btn-item:nth-of-type('+ act +')').addClass('act');
        },
        slideChangeTransitionEnd: function(){
            let act = this.activeIndex;
            if(act == 1){
                $('.project2021-swiper .scroll-container .cont-wrap > .fade:first-of-type').addClass('in');
            }
        },
    }
});

var works2021Project1SceneSwiper = new Swiper(".works-2021 .scene-swiper", {
    speed: 400,
    slidesPerView: "auto",
    spaceBetween: 0,
    resistanceRatio: 0,
    direction: "vertical",
    allowTouchMove: true,
    mousewheel: {
        eventsTarget: '.project2021-1',
    },
    pagination: {
        el: ".works-2021 .scene-swiper + .swiper-pagination",
    },
    on: {
        init: function(){
            let act = this.activeIndex + 1;
            $(".description-area .description-wrap").removeClass('act');
            $(".description-area .description-wrap:nth-of-type("+ act +")").addClass('act');
        },
        slideChange: function(){
            let act = this.activeIndex + 1;
            $(".description-area .description-wrap").removeClass('act');
            $(".description-area .description-wrap:nth-of-type("+ act +")").addClass('act');
        },
        slideChangeTransitionEnd: function(){
            let act = this.activeIndex;
            if(act == 2){
                this.mousewheel.disable();
            }else{
                this.mousewheel.enable();
            }
        },
    }
});


$('.project2021-swiper .scroll-container').on('scroll', function(event){
    let middlePoint = $(this).outerHeight() / 2;
    let scrollT = $(this).scrollTop();
    $(this).find('.cont-wrap > .fade').each(function(index){
        let thisPosT = $(this).position().top;
        
        if(thisPosT < middlePoint + scrollT){
            console.log( index );
            $(this).addClass('in');
        }
    });

});


$('.project2021-swiper .scroll-container').on("mousewheel DOMMouseScroll", function (event){
    if( $(this).scrollTop() == 0 ){
        if (event.originalEvent.wheelDelta >= 0) {
            project2021Swiper.slideTo(0);
        }
    }
});

$('.project2021-1').on("mousewheel DOMMouseScroll", function (event){
    if (event.originalEvent.wheelDelta >= 0) {
        works2021Project1SceneSwiper.mousewheel.enable();
    } else {
        project2021Swiper.slideTo(1);
    }
});


$('.works-2021 .nav-area .btn-item:nth-of-type(1)').on('click', function(){
    project2021Swiper.slideTo(0);
});

$('.works-2021 .nav-area .btn-item:nth-of-type(2)').on('click', function(){
    project2021Swiper.slideTo(1);
});