class ProductPage{

    checkExistProduct(){
        return cy.get("body").find(".product-card__img-field-inner");
    }

    getCategoryItem(){
        return cy.get('[data-test-category-item]');
    }

    getFilterItem(){
        return cy.get('[data-test-filter-item-value]');
    }

    getGroupBrand(){
        return cy.get('[data-test-filter-item-key="brand_id"]')
    }

    getBrandCheckbox(){
        return cy.get('[data-test-filter-item-key="brand_id"] > .mz-basic-sidebox__item-checkbox >.mz-state-control > .mz-state-control__input')
    }

    getNameBrand(){
        return cy.get('.is-selected > .mz-basic-sidebox__item-name')
    }

    getGroupCountry(){
        return cy.get('[data-test-filter-item-key="country_code"]')
    }

    getProductList(){
        return cy.get('[data-test-product-list] .product-card-col')
    }

    getProductTitle(){
        return cy.get('.product-card__title')
    }

    
}

export default ProductPage