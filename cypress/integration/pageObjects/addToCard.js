class AddToCard {

    getPricedProduct() {
        return cy.get('.product-card').first('.mz-btn-gray');
    }

    getListPricedsProduct(){
        return cy.get('.product-card').find('.mz-btn-gray');
    }

    findCardTitle(el) {
        return el.find('.product-card__title').text().trim();
    }

    addToCard(el) {
        el.find('.mz-btn-gray').trigger("click");
    }

    getCardQuantity() {
        return cy.get('#header-cart-quantity');
    }

    goToCardPage() {
        const button = cy.get('#header-cart-btn');
        button.click();
    }

    getProductName() {
        return cy.get('.product-name');
    }

    getConsumptionImport() {
        return cy.get('.tab-col > :nth-child(1)').first();
    }

    getMissAmountFree() {
        return cy.get('.section-static-inner > .cart-summary-block > .discount-col > .fee-ship-field > .mz-mx-2');
    }

    getMessFreeShip() {
        return cy.get('.section-static-inner > .cart-summary-block > .discount-col > .fee-ship-field > i');
    }

    getTotalPriceAProduct() {
        return cy.get('.total-current-price');
    }

    getTotalValueOrder() {
        return cy.get('.section-static-inner > .cart-summary-block > .price-col > .total-price-field > .value > .price');
    }

    getProductQuantity() {
        return cy.get('.mz-number-control__input');
    }

    getMainProduct() {
        return cy.get('.main-product-segment');
    }

    clickDeleteProduct() {
        const btn = cy.get('[title="Xoá sản phẩm"]');
        btn.click({ force: true });
    }

    getTitleConfirmModal() {
        return cy.get('.mz-confirm-modal__title');
    }

    cancelDelete() {
        const btn = cy.get('.cancel-btn');
        btn.click({ force: true });
    }

    deleteProduct() {
        const btn = cy.get('.confirm-btn');
        btn.click({ force: true });
    }

    getContentBlankCard() {
        // không có sản phẩm nào trong giỏ hàng
        return cy.get('.content');
    }

    getLabelBtnContinue() {
        //get btn tiếp tục mua sắm
        return cy.get('.section-inner > .mz-btn > .mz-btn__label-col');
    }

    order() {
        const btn = cy.get('.section-static-inner > .cart-summary-block > .submit-col > .mz-grd-btn > .mz-grd-btn__inner');
        btn.click({ force: true });
    }

    
}

export default AddToCard;