window.ppc_campaigns ||= {}
window.ppc_campaigns.initPanel = (container) => {
    new PpcCampaignsPanelController(container)
}

class PpcCampaignsPanelController {
    constructor(container) {
        this.container = container
        this.initDestroyLinks()
    }

    initDestroyLinks() {
        this.container.on('click', '.destroy', (evt) => {
            if (confirm('Delete this PPC Campaign?')) {
                let clicked = $(evt.currentTarget)
                let clickedRow = clicked.closest('.index-row')
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
