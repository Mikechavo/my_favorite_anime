window.accounts ||= {}
window.accounts.initFormControls = (newForm) => {
    new AccountFormController(newForm)
}

class AccountFormController {
    constructor(newForm) {
        this.newForm = newForm
        if(this.newForm.hasClass('new_account')){
            this.initNewFormSubmission()
        }
    }

    initNewFormSubmission() {
        let modal = $('#unified-modal')
        let modalActions = modal.find('#modal-actions')
        let modalButtons = modalActions.find('.shrink-column')
        let modalLoader = modalActions.find('.unified-loader')
        modal.find('.submit-modal-custom').on('click', () => {
            // prevent double submissions
            modalButtons.hide()
            modalLoader.show()

            // serialize form and submit via ajax
            let formData = new FormData(this.newForm[0])
            $.ajax({
                type: 'POST',
                url: this.newForm.attr('action'),
                data: formData,
                processData: false,
                contentType: false,
                success: (res) => {
                    if (res.status == 'error') {
                        alert(res.error)
                    } else {
                        console.log(res)
                        let accountId = res.record.id
                        window.location.href = '/accounts/' + accountId
                    }
                    modalButtons.show()
                    modalLoader.hide()
                }
            })
        })
    }
}
