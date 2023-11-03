window.invoices ||= {}
window.invoices.initPanel = (container) => {
    new InvoicesPanelController(container)
}

class InvoicesPanelController {
    constructor(container) {
        this.container = container
        this.initToggling()
    }

    initToggling() {
        this.container.find('.toggle-invoice').on('click', (evt) => {
            let clicked = $(evt.currentTarget)
            $.post(
                clicked.attr('href'),
                (res) => {
                    if (res.status == 'error') {
                        alert(res.error)
                    } else {
                        window.location.reload()
                    }
                }
            )
            return false
        })
    }
}
