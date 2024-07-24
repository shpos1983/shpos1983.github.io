var sectionSwiper;
var timelineSwiper;

sectionSwiper = new Swiper(".section-swiper", {
    speed: 800,
    slidesPerView: 1,
    nested: true,
    direction: "vertical",
    allowTouchMove: false,
    enabled: true,
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
        slideChangeTransitionEnd: function(){
            let act = this.activeIndex;
            /*if(act == 1){
                timelineSwiper.enabled = true;
            }else{
                timelineSwiper.enabled = false;
            }*/
        },
    }
});

timelineSwiper = new Swiper(".timeline-swiper", {
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
                $(".timeline-cont .cont-wrap:nth-of-type(1)").addClass('act');
            }else if( act >= 5){
                $(".timeline-cont .cont-wrap:nth-of-type(4)").addClass('act');
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
    allowTouchMove: true,
    enabled: false,
    mousewheel: true,
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
            let container = this.el;
            let act = this.activeIndex;
            if(act == 0){
                if(works2021Project1SceneSwiper.activeIndex == 2){
                    this.enabled = true;
                    this.mousewheel = true;
                    this.allowSlidePrev = false;
                    this.allowSlideNext = true;
                }else{
                    this.enabled = false;
                    this.mousewheel = false;
                }
            }else if(act == 1){
                /*if(works2021Project2ScrollSwiper.progress == 0){
                    this.enabled = true;
                    this.allowSlidePrev = true;
                    this.allowSlideNext = false;
                }else{
                    this.enabled = false;
                }*/

                /*if( $(container).find('.scroll-container').scrollTop() == 0 ){
                    this.enabled = true;
                    this.mousewheel = true;
                    this.allowSlidePrev = true;
                    this.allowSlideNext = false;
                }else{
                    this.enabled = false;
                    this.mousewheel = false;
                }*/

                    this.enabled = false;
                    this.mousewheel = false;
                    
            }
        },
    }
});

$('.project2021-swiper').find('.scroll-container').on('scroll', function(event){
    if( $(this).scrollTop() == 0 ){
        project2021Swiper.enabled = true;
        // project2021Swiper.mousewheel = true;
        project2021Swiper.allowSlidePrev = true;
        project2021Swiper.allowSlideNext = false;

        

    }else{
        project2021Swiper.enabled = false;
        // project2021Swiper.mousewheel = false;
    }



    if (event.originalEvent.wheelDelta >= 0) {
        console.log('Scroll up');
    }
    else {
        console.log('Scroll down');
    }
})

var works2021Project1SceneSwiper = new Swiper(".works-2021 .scene-swiper", {
    speed: 400,
    slidesPerView: "auto",
    spaceBetween: 0,
    resistanceRatio: 0,
    direction: "vertical",
    allowTouchMove: true,
    enabled: true,
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
                project2021Swiper.enabled = true;
                project2021Swiper.mousewheel = true;
                project2021Swiper.allowSlidePrev = false;
                project2021Swiper.allowSlideNext = true;
            }else{
                project2021Swiper.enabled = false;
                project2021Swiper.mousewheel = false;
            }
        },
    }
});

var works2021Project2ScrollSwiper = new Swiper(".works-2021 .scroll-swiper", {
    direction: "vertical",
    slidesPerView: "auto",
    freeMode: true,
    mousewheel: true,
    pagination: {
        el: ".swiper-pagination",
    },
    on: {
        init: function(){
            let act = this.activeIndex + 1;
            $(".works-2021 .scroll-swiper .swiper-slide:nth-of-type("+ act +") .cont-wrap").addClass('act');
        },
        slideChange: function(){
            
        },
        setTranslate: function(){
            if(this.progress == 0){
                project2021Swiper.enabled = true;
                project2021Swiper.allowSlidePrev = true;
                project2021Swiper.allowSlideNext = false;
            }else if(this.progress == 1){
                project2021Swiper.enabled = true;
                project2021Swiper.allowSlidePrev = false;
                project2021Swiper.allowSlideNext = true;
            }else{
                project2021Swiper.enabled = false;
            }
        },
        paginationUpdate: function(){
            let container = this.el;
            let act = $(container).find('.swiper-pagination-bullet-active').index() + 1;
            console.log(act);
            //$(".works-2021 .scroll-swiper .swiper-slide:nth-of-type("+ act +") .cont-wrap").addClass('act');
            $(container).find(".swiper-slide:nth-of-type("+ act +") .cont-wrap").addClass('act');
        }
    }
});

$('.works-2021 .nav-area .btn-item:nth-of-type(1)').on('click', function(){
    project2021Swiper.enabled = true;
    project2021Swiper.allowSlidePrev = true;
    project2021Swiper.allowSlideNext = true;
    project2021Swiper.slideTo(0);
});

$('.works-2021 .nav-area .btn-item:nth-of-type(2)').on('click', function(){
    project2021Swiper.enabled = true;
    project2021Swiper.allowSlidePrev = true;
    project2021Swiper.allowSlideNext = true;
    project2021Swiper.slideTo(1);
});