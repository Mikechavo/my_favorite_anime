window.creditCards ||= {}
window.creditCards.initFormControls = (form) => {
    new CreditCardFormController(form)
}

window.creditCards.initHtmlFormControls = (fakeForm, encryptedForm) => {
    fakeForm.find('.submit-fake-form').on('click', (evt) => {
        let formData = new FormData(fakeForm[0])
        let encryptedData = encryptFormData(formData)
        formData.forEach(function(value, key){
            if(key != 'utf8' && key != 'authenticity_token'){
                encryptedForm.append("<input type='hidden' name='" + key + "' value='" + value + "'>")
            }
        })
        encryptedForm.submit()
        // encryptedForm.append("<input type='submit' style='display:none'>")
        // encryptedForm.find("input[type='submit']").trigger('click')
    })
}

class CreditCardFormController {
    constructor(form) {
        this.form = form
        this.initFormSubmission()
    }

    initFormSubmission() {
        let modal = $('#unified-modal')
        let modalActions = modal.find('#modal-actions')
        let modalButtons = modalActions.find('.shrink-column')
        let modalLoader = modalActions.find('.unified-loader')
        modal.find('.submit-modal-custom').on('click', () => {
            // prevent double submissions
            modalButtons.hide()
            modalLoader.show()

            // serialize form and submit via ajax
            let formData = new FormData(this.form[0])
            // encrypt form data
            let encryptedData = encryptFormData(formData)

            $.ajax({
                type: 'POST',
                url: this.form.attr('action'),
                data: formData,
                processData: false,
                contentType: false,
                success: (res) => {
                    if (res.status == 'error') {
                        alert(res.error)
                    } else {
                        modalButtons.find('.close-modal').trigger('click')
                    }
                    modalButtons.show()
                    modalLoader.hide()
                }
            })
        })
    }
}

let encryptFormData = (formData) => {
    let encryptableFields = $('#encryptable_fields').val()

    let encrypt = new JSEncrypt()
    encrypt.setPublicKey($('#public_key').val())

    for(const pair of formData.entries()) {
        let fieldNameFull = pair[0]
        if(fieldNameFull.includes('api_credit_card[')){
            let fieldName = fieldNameFull.replace('api_credit_card[', '').replace(']', '')
            if(encryptableFields.includes(fieldName)){
                let fieldValue = pair[1]
                let encryptedValue = encrypt.encrypt(fieldValue)
                formData.set(fieldNameFull, encryptedValue)
            }
        }
    }
    return formData
}
