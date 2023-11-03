window.charges ||= {}
window.charges.initPanelControls = (container) => {
    new ChargesPanelController(container)
}

class ChargesPanelController {
    constructor(container) {
        this.container = container
        this.initDestroyLinks()
    }

    initDestroyLinks() {
        this.container.on('click', '.destroy', (evt) => {
            if (confirm('Delete this Charge?')) {
                let clicked = $(evt.currentTarget)
                let clickedRow = clicked.closest('tr')
                let destroyUrl = clicked.attr('href')

                $.post(
                    destroyUrl,
                    (res) => {
                        if (res.status == 'success') {
                            clickedRow.remove()
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
