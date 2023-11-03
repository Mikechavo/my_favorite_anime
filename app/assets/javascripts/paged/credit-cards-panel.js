window.creditCards ||= {}
window.creditCards.initPanelControls = (container) => {
    new CreditCardPanelController(container)
}

class CreditCardPanelController {
    constructor(container) {
        this.container = container
        this.inactivesPanel = this.container.find('.inactive-cards-container')
        this.inactivesTable = this.inactivesPanel.find('.credit-cards-table')
        this.activesTable = this.container.find('.active-cards-container .credit-cards-table')

        this.initActivateLinks()
        this.initDeactivateLinks()
        this.initDetachLinks()
        this.initDestroyLinks()

        this.evaluateInactiveDisplay()
        this.evaluateStatusLinks()
    }

    evaluateStatusLinks() {
        this.inactivesTable.find('.deactivate-card').each((i, elem) => {
            $(elem).closest('.shrink-column').hide()
        })
        this.inactivesTable.find('.activate-card').each((i, elem) => {
            $(elem).closest('.shrink-column').show()
        })

        this.activesTable.find('.activate-card').each((i, elem) => {
            $(elem).closest('.shrink-column').hide()
        })
        this.activesTable.find('.deactivate-card').each((i, elem) => {
            $(elem).closest('.shrink-column').show()
        })
    }

    evaluateInactiveDisplay() {
        let inactiveRows = this.inactivesTable.find('tbody tr').length
        if (inactiveRows == 0) {
            this.inactivesPanel.hide()
        } else {
            this.inactivesPanel.show()
        }
        let counterText = '(' + inactiveRows + ')'
        this.inactivesPanel.find('.inactives-counter').text(counterText)
    }

    initActivateLinks() {
        this.container.on('click', '.activate-card', (evt) => {
            let clicked = $(evt.currentTarget)
            let alertMsg = clicked.data('confirm-post')
            if (confirm(alertMsg)) {
                let clickedRow = clicked.closest('tr')
                let url = clicked.attr('href')

                $.post(
                    url,
                    (res) => {
                        if (res.status == 'success') {
                            clickedRow.detach()
                            clickedRow.appendTo(this.activesTable)
                            this.evaluateInactiveDisplay()
                            this.evaluateStatusLinks()
                        } else {
                            alert(res)
                        }
                    }
                )
            }
            return false
        })
    }

    initDeactivateLinks() {
        this.container.on('click', '.deactivate-card', (evt) => {
            let clicked = $(evt.currentTarget)
            let alertMsg = clicked.data('confirm-post')
            if (confirm(alertMsg)) {
                let clickedRow = clicked.closest('tr')
                let url = clicked.attr('href')

                $.post(
                    url,
                    (res) => {
                        if (res.status == 'success') {
                            clickedRow.detach()
                            clickedRow.appendTo(this.inactivesTable)
                            this.evaluateInactiveDisplay()
                            this.evaluateStatusLinks()
                        } else {
                            alert(res)
                        }
                    }
                )
            }
            return false
        })
    }

    initDetachLinks() {
        this.container.on('click', '.detach-card', (evt) => {
            let clicked = $(evt.currentTarget)
            let alertMsg = clicked.data('confirm-post')
            if (confirm(alertMsg)) {
                let clickedRow = clicked.closest('tr')
                let url = clicked.attr('href')

                $.post(
                    url,
                    (res) => {
                        if (res.status == 'success') {
                            clickedRow.remove()
                            this.evaluateInactiveDisplay()
                        } else {
                            alert(res)
                        }
                    }
                )
            }
            return false
        })
    }

    initDestroyLinks() {
        this.container.on('click', '.destroy', (evt) => {
            let clicked = $(evt.currentTarget)
            let alertMsg = clicked.data('confirm-post')
            if (confirm(alertMsg)) {
                let clickedRow = clicked.closest('tr')
                let url = clicked.attr('href')

                $.post(
                    url,
                    (res) => {
                        if (res.status == 'success') {
                            clickedRow.remove()
                            this.evaluateInactiveDisplay()
                        } else {
                            alert(res)
                        }
                    }
                )
            }
            return false
        })
    }
}
