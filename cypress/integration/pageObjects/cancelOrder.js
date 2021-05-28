class CancelOrder{
    checkOrder(){
        const btn = cy.get('.mz-btn-primary');
        btn.click();
    }
}

export default CancelOrder;