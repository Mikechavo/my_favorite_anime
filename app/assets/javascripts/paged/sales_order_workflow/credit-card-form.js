window.sales_order_workflow ||= {}
window.sales_order_workflow.credit_cards ||= {}
window.sales_order_workflow.credit_cards.initForm = (form, showFormButton, hideFormButton) => {
    new SalesOrderWorkflowCreditCardsController(form)
}

class SalesOrderWorkflowCreditCardsController {
    constructor(form) {
        this.form = form
        this.container = form.closest('.stretch-column')
        this.submitButton = this.form.find('.submit-authorization')
        this.formControls = this.form.find('.form-controls')
        this.formLoader = this.form.find('.form-loader')
        this.generateButton = this.form.find('.generate-authorization-preview')
        this.htmlButton = this.form.find('.html-authorization')
        this.previewPanel = this.container.find('#preview-authorization').closest('.panel')

        this.initPreviewGeneration()
        this.initFormSubmit()
        this.initHtmlFormSubmit()
    }

    initPreviewGeneration() {
        this.previewPanel.hide()
        this.submitButton.hide()
        this.formLoader.hide()
        let salesOrderId = this.form.find('#invoice_sales_order_id').val()

        this.generateButton.on('click', () => {
            this.previewPanel.show()
            this.formControls.hide()

            this.form.find('input').prop('readonly', true)
            this.form.find('select option:not(:selected)').hide()
            $.post(
                '/sales_order_workflow/' + salesOrderId + '/create_authorization?is_sample=1',
                this.form.serialize(),
                (res) => {
                    if(res.status == 'error') {
                        alert(res.error)
                        this.previewPanel.hide()
                        this.form.find('input').prop('readonly', false)
                        this.form.find('select option:not(:selected)').show()
                    } else {
                        let fileReader = new FileReader()
                        fileReader.onload = (fileLoadedEvent) => {
                        this.container.find('.preview-loader').remove()
                        this.container.find('#preview-authorization').attr('src', '/temp/invoice_samples/sales_order_' + salesOrderId + '.pdf')
                        }
                        let blogResp = new Blob([res], { type: 'application/pdf' })
                        fileReader.readAsDataURL(blogResp)
                        this.generateButton.hide()
                        this.submitButton.show()
                    }
                    this.formControls.show()
               }
           )
        })
    }

    initFormSubmit() {
        this.submitButton.on('click', () => {
            this.formLoader.show()
            this.formControls.hide()
            let salesOrderId = this.form.find('#invoice_sales_order_id').val()

            $.post(
                '/sales_order_workflow/' + salesOrderId + '/create_authorization',
                this.form.serialize(),
                (createRes) => {
                    if(createRes.status == 'error') {
                        alert(createRes.error)
                        this.formLoader.hide()
                        this.formControls.show()
                    } else {
                        $.post(
                            '/sales_order_workflow/' + salesOrderId + '/send_invoice',
                            (sendRes) => {
                                if ((sendRes || {}).status == 'error') {
                                    alert(sendRes.error)
                                    this.formLoader.hide()
                                    this.formControls.show()
                                } else {
                                    window.location.href = '/sales_orders/' + salesOrderId
                                }
                            }
                        )
                    }
                }
            )
        })
    }

    initHtmlFormSubmit() {
        this.htmlButton.on('click', () => {
            let salesOrderId = this.form.find('#invoice_sales_order_id').val()
            window.open(
                '/sales_order_workflow/' + salesOrderId + '/html_authorization?' + this.form.serialize()
            )
        })
    }
}
