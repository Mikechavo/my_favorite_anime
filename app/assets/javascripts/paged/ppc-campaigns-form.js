window.ppc_campaigns ||= {}
window.ppc_campaigns.initForm = (container) => {
    new PpcCampaignsFormController(container)
}

class PpcCampaignsFormController {
    constructor(container) {
        this.container = container
        this.initNumberToggling()
    }

    initNumberToggling() {
        // hide tracking number select if provider is not ceatus
        let providerSelect = this.container.find("select[name='ppc_campaign[call_tracking_provider]']")
        let trackingNumberFields = this.container.find("#tracking-number-fields")
        let nonTrackingInput = this.container.find("input[name='ppc_campaign[phone]']")
        providerSelect.on('change', (evt) => {
            let changed = $(evt.currentTarget)
            if (changed.val() == 'Ceatus') {
                nonTrackingInput.closest('.stretch-column').hide()
                trackingNumberFields.show()
            } else {
                nonTrackingInput.closest('.stretch-column').show()
                trackingNumberFields.hide()
            }
        })

        // only show number entry when new is selected
        let trackingNumberSelect = trackingNumberFields.find("select[name='ppc_campaign[call_tracking_number_id]']")
        let trackingNumberInput = trackingNumberFields.find("input[name='ppc_campaign[new_tracking_number]']")
        trackingNumberSelect.on('change', (evt) => {
            let changed = $(evt.currentTarget)
            if (changed.val() == '') {
                trackingNumberInput.closest('.stretch-column').show()
            } else {
                trackingNumberInput.closest('.stretch-column').hide()
            }
        })

        // changing the new number field or phone field will always match them
        nonTrackingInput.on('change', (evt) => {
            let changed = $(evt.currentTarget)
            trackingNumberInput.val(changed.val())
        })
        trackingNumberInput.on('change', (evt) => {
            let changed = $(evt.currentTarget)
            nonTrackingInput.val(changed.val())
        })

        // trigger for loaded values
        providerSelect.trigger('change')
        trackingNumberSelect.trigger('change')
        nonTrackingInput.trigger('change')
        trackingNumberInput.trigger('change')
    }
}
