class Banner{
    countHomeSlider(){
        const el = cy.get('.home-page > #home-slider-section > #home-slider-section__swiper-container > .home-slider-pagination-nav > .swiper-pagination-bullet');
    }
    
    getSliderBanner(index){
        // truy cập vào head banner slider trên trang chủ
        const el = cy.get('.home-page > #home-slider-section > #home-slider-section__swiper-container > .home-slider-pagination-nav > .swiper-pagination-bullet:nth-child('+ index +')');
        el.click({force: true});
        const el1 = cy.get('.swiper-wrapper > .swiper-slide-active > .home-slider-item-inner > .home-slider-img-outer > .home-slider-img');
        el1.click({force: true}).wait(1000);
    }

    getTemplateTab(template, index){
        // click các tab trên trang https://fado.vn/h/cham-deal-thang-5
        const el = cy.get('#template-' + template + ' > .mz-container > .product-choosed-block > .block-head > .cate-tab-item-wrap > .cate-tab-item:nth-child(' + index + ') > .cate-title');
        el.click({force: true}).wait(2000);
    }
}

export default Banner;