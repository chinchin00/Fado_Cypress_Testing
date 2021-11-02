class CartPage {
    elements = {
        productName: () => cy.get('.product-name'),
        consumptionImport: () => cy.get('.tab-col > :nth-child(1)').first(),
        commerceImport: () => cy.get('.tab-col > :nth-child(1)').first(),
        missAmountFree: () => cy.get('.section-static-inner > .cart-summary-block > .discount-col > .fee-ship-field > .mz-mx-2'),
        messFreeShip: () => cy.get('.section-static-inner > .cart-summary-block > .discount-col > .fee-ship-field > i'),
        totalPriceAProduct: () => cy.get('.total-current-price'),
        totalValueOrder: () => cy.get('.section-static-inner > .cart-summary-block > .price-col > .total-price-field > .value > .price'),
        productQuantity: () => cy.get('.mz-number-control__input'), //number of a product in cart
        mainProduct: () => cy.get('.main-product-segment'), //get block each product
        btnDelete: () => cy.get('[title="Xoá sản phẩm"]'),
        titleComfirmModal: () => cy.get('.mz-confirm-modal__title'), //get title confirm delete product
        contentBlankCart: () => cy.get('.content'), //không có sản phẩm nào trong giỏ hàng
        labelBtnContinue: () => cy.get('.section-inner > .mz-btn > .mz-btn__label-col'), // btn tiếp tục mua sắm
        btnOrder: () => cy.get('.section-static-inner > .cart-summary-block > .submit-col > .mz-grd-btn > .mz-grd-btn__inner'),
        btnConfirmCancelDelete: () => cy.get('.cancel-btn'),
        btnConfirmDelete: () => cy.get('.confirm-btn')
    }

    //delete product when the cart has only a product
    deleteAProduct() {
        const btn = this.elements.btnDelete();
        btn.click({ force: true });
    }

    cancelDelete() {
        const btn = this.elements.btnConfirmCancelDelete();
        btn.click({ force: true });
    }

    deleteProduct() {
        const btn = this.elements.btnConfirmDelete();
        btn.click({ force: true });
    }

    order() {
        const btn = this.elements.btnOrder();
        btn.click({ force: true });
    }

    
}

export default CartPage;