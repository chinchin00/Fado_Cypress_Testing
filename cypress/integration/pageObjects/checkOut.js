class CheckOut {
    // Get the first priced product

    convertToNumber(el) {
        let textTrim = el.text().trim();
        let number = textTrim.split(" ");
        number = Number(number[0].replace(/[^\d]/g, ''));
        return number;
    }

    getBtnLogin() {
        return cy.get('.is-border-right > .suggest-login-segment > .control-col > .mz-btn');
    }

    getLabelEnterInfo() {
        return cy.get('.control-col > .mz-btn > .mz-btn__label-col');
    }

    getBtnOrder() {
        return cy.get('.submit-order-info-btn');
    }

    fillCustomerPhone(value) {
        const field = cy.get('[name="customer_phone"]');
        field.clear();
        // field.type(value).should('have.value', value);
        field.should("be.visible")
            .type(value, { force: true }).should('have.value', value);
        return this;
    }

    fillCustomerEmail(value) {
        const field = cy.get(':nth-child(3) > .mz-form-group > .mz-form-group__control-col > .mz-form-control > .mz-form-control__input');
        field.clear();
        field.should("be.visible")
            .type(value,{ force: true }).should('have.value', value);
        return this;
    }

    fillCustomerName(value) {
        const field = cy.get('.mz-form > :nth-child(1) > .mz-form-group > .mz-form-group__control-col > .mz-form-control > .mz-form-control__input');
        field.clear();
        field.should("be.visible")
            .type(value,  { force: true }).should('have.value', value);
        return this;
    }

    selectCity() {
        cy.get('#vs1__combobox > .vs__actions').click({ force: true });
        cy.wait(1000);
        cy.get('#vs1__option-1').click({ force: true });
        cy.wait(1000);
    }

    selectDistrict() {
        cy.get('#vs2__combobox > .vs__actions').click({ force: true });
        cy.wait(1000);
        cy.get('#vs2__option-1').click({ force: true });
        cy.wait(1000);
    }

    getComboboxDistrict(){
        return cy.get('[aria-labelledby="vs2__combobox"]');
    }

    selectWard() {
        cy.get('#vs3__combobox > .vs__actions').click({ force: true });
        cy.wait(1000);
        cy.get('#vs3__option-1').click({ force: true });
        cy.wait(1000);
    }
    
    getComboboxWard(){
        return cy.get('[aria-labelledby="vs3__combobox"]');
    }

    fillDetailAddress(value){
        const field = cy.get(':nth-child(5) > :nth-child(2) > .mz-form-group__control-col > .mz-form-control > .mz-form-control__input');
        field.clear();
        field.should("be.visible")
            .type(value,{ force: true }).should('have.value', value);
        return this;
    }

    fillNewDetailAddress(value){
        // enter input detail in create new address modal
        const field = cy.get(':nth-child(4) > :nth-child(2) > .mz-form-group__control-col > .mz-form-control > .mz-form-control__input');
        field.clear();
        field.type(value, { force: true }).should('have.value', value);
        return this;
    }

    createInfo() {
        const btn = cy.get('.user-address-book-modal-inner > .mz-basic-modal__foot > .foot-control-group > .mz-btn');
        btn.click({ force: true });
    }

    getMessErrorName(){
        return cy.get('.mz-form > :nth-child(1) > .mz-form-group > .mz-form-group__control-col > .mz-form-error-label');
    }

    getMessErrorPhone(){
        return cy.get('.user-address-book-modal-inner > .mz-basic-modal__body > :nth-child(1) > .mz-form > :nth-child(2) > .mz-form-group > .mz-form-group__control-col > .mz-form-error-label');
    }

    getMessErrorEmail(){
        return cy.get(':nth-child(3) > .mz-form-group > .mz-form-group__control-col > .mz-form-error-label');
    }

    getMessErrorAddress(){
        return cy.get('.address-select-form-error-label');
    }

    getMessErrorDetailAddress(){
        return cy.get(':nth-child(5) > :nth-child(2) > .mz-form-group__control-col > .mz-form-error-label');
    }

    closeAddressModal(){
        const btn = cy.get('.user-address-book-modal-inner > .mz-basic-modal__foot > .foot-control-group > .close-modal-btn');
        btn.click({ force: true });
    }

    getTotalProductPrice(){
         return cy.get('.total-product-price > div');
    }

    // đồng ý điều khoản và đặt hàng
    acceptRule(){
        const btn = cy.get('.mz-btn-danger');
        btn.click({force:true}).wait(4000);
    }

    getTotalOrderPrice(){
        return cy.get('.price-label');
    }

    getMessOrderSuccess(){
        return cy.get('.head-content-col > .title-label');
    }

    getPriceAfterOrder(){
        return cy.get('.info-col-body > .price-label');
    }

    getLabelBtnCreateInfo(){
        // Get text "Tao thong tin dat hang" for account no address
        return cy.get('.field-control-group > .mz-btn > .mz-btn__label-col');
    }

    getBtnAddress(){
        // Get btn "So dia chi" in page checkout
        const btn = cy.get('.head-control > .mz-btn');
        btn.click();
    }

    getListAddressBook(){
        // Get list  address in address book
        return  cy.get('.addressbook-list');
    }

    getAddressBookType(){
        // lấy sổ địa chỉ trong PAGE sổ địa chỉ
        return cy.get('.address-book-type');
    }

    getAddressBookItem(el){
        // get address default in page check out
        return cy.get(el).parents('.address-book-item');
    }

    addNewAddress(){
        // Add new address in page order
        const link = cy.get('.add-addressbook-link');
        link.click();
    }

    getBtnLabelAddress(){
        //Get Text of btn So Dia Chi in page https://fado.vn/so-dia-chi
        return cy.get('.head-control > .mz-btn > .mz-btn__label-col');
    }

    getUserNameAddress(el){
        //Get orderer's name in page https://fado.vn/so-dia-chi
        return cy.get(el).find('.title-col');
    }

    getPhoneAddress(el){
        //Get orderer's phone in page https://fado.vn/so-dia-chi
        return cy.get(el).find('.content-field.customer-phone-field');
    }

    getDetailAddress(el){
        //Get orderer's full address in page https://fado.vn/so-dia-chi
        return cy.get(el).find('.content-field.address-detail-field');
    }

    getOrdererName(){
        //Get Orderer's name in page order
        return cy.get('.block-body > .user-info-row > .address-title-col > .address-title');
    }

    getOrdererPhone(){
        //Get Orderer's phone number in page Order
        return cy.get('.block-body > .user-info-row > .main-info-col > .phone-label');
    }

    getOrdererAddress(){
        //Get orderer's adress in page order
        return cy.get('.block-body > .user-info-row > .main-info-col > .mz-text-gray-dark');
    }

    getOrdererDetailAddress(){
        //Get orderer's full address in page detail
        return cy.get('.block-body > .user-info-row > .main-info-col > .full-address-label');
    }

    addAddressReceiver(){
        // Add address receiver
        const btn = cy.get('.control-col > .mz-state-control__inner > .mz-state-control__icon');
        btn.click();
    }

    getBtnAddressBook(){
        // get btn address book
        return cy.get('.control-col > .mz-btn');
    }

    getFirstAddress(){
        // get first address in address bookn receiver
        const btn = cy.get(':nth-child(1) > .address-title-col > .location-type-tag');
        btn.click({force: true});
    }

    getTotalPriceOrder(){
        return cy.get('#user-block__date--order-history > tbody > .user-block__order-tr > .user-block__total-price-td').first();
    }

    checkOutByZalo(){
        const btn = cy.get('.mz-grid > :nth-child(2)');
        btn.click();
    }

    checkOrder(){
        // redirect to detail order from success checkout page 
        const btn = cy.get('.mz-btn-primary');
        btn.click({force:true});
    }

    clickBtnCancelOrder(){
        // click bn hủy đơn hàng
        const btn = cy.get('.user-order-detail-block__head__cancel-order-btn-outer > .my-btn');
        btn.click({force : true});
    }

    getCancelOrderModal(){
        //GET modal xác nhận hủy đơn hàng
        return cy.get('#cancel-order-modal');
    }

    selectReasonCancel(){
        // chọn lý do hủy đơn hàng
        const reason = cy.get('[name="cancelReason"]');
        reason.select('Không còn nhu cầu mua hàng', {force:true});
    }

    cancelOrder(){
        // click btn xác nhận muốn hủy đơn hàng trong modal Hủy đơn hàng
        const btn = cy.get('.-btn-grd-bg');
        btn.click();
        cy.wait(3000);
    }

    getOrderStatusText(){
        return cy.get('.user-order-detail-block__head__order-status-text');
    }

    checkHistoryOrder(){
        // redirect to chi tiet đơn hàng từ trang lịch sử đơn hàng
        const btn = cy.get('.user-block__control-td > .my-control-btn').first();
        btn.click({force:true});
        cy.wait(2000);
    }

    getMethodCheckOutText(){
        return cy.get('.user-order-detail-block__order-info-tb__method-text').invoke('text');
    }

    checkOutByATM(){
        //cHọn thanh toán qua thẻ ATM nội địa
        const btn =  cy.get('.payment-method-group-col > .mz-grid > .payment-method-group-item:nth-child(4)');
        // expect(btn).to.have.class('.is-active');
        btn.click();
    }

    getPaymentGatewayVNPay(){
        return cy.get(':nth-child(1) > .tag-item');
    }
    
    selectBank(el){
        const btn = cy.get('[data-tippy-content="' + el + '"]');
        btn.click();

        cy.get('[data-tippy-content="' + el + '"]').should('have.class', 'is-active', 'Thanh toán qua ngân hàng' + el)
    }
}

export default CheckOut;