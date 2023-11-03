window.profiles ||= {}
window.profiles.initFormControls = (container, profileId) => {
    new profileFormController(container, profileId)
}

class profileFormController {
    constructor(container, profileId) {
        this.container = container
        this.profileId = profileId
        this.initProfileLinking()
        this.initProfilesFields()
        this.initCountryStatesSelect()
    }

    initProfileLinking() {
        let linkingField = this.container.find('#profile_linked')
        let linkedInputs = this.container.find('.profile-linked')
        let sharedAttrField = this.container.find('#profile_shared_attributes_id')

        // linking a profile should autofill the fields with values from the linked profile
        sharedAttrField.on('change', (evt) => {
            // only autofill if profile is not unique
            let sharedVal = $(evt.currentTarget).val()
            if(parseInt(sharedVal) > 0) {
                $.get(
                    "/js_loaders/profiles/" + sharedAttrField.val() + '/json_attributes',
                    (res) => {
                        let sharedProfile = res.record.profile
                        this.container.find("#profile_designation").val(sharedProfile.designation)
                        this.container.find("#profile_send_to").val(sharedProfile.send_to)
                        this.container.find("#profile_send_cc").val(sharedProfile.send_cc)
                        this.container.find("#profile_send_bcc").val(sharedProfile.send_bcc)
                        this.container.find("#profile_template_id").val(sharedProfile.template_id)
                    }
                )
            }
        })

        // linking a profile should disable the address and content fields
        // linking a profile should not allow a unique option
        linkingField.on('change', (evt) => {
            let changed = $(evt.currentTarget)
            if (JSON.parse(changed.val())) {
                linkedInputs.attr('disabled', true)

                sharedAttrField.find("option[value=0]").hide()
                sharedAttrField.find('option:not([value=0])').show()
                sharedAttrField.val(sharedAttrField.find('option:not([value=0])').val())
            } else {
                linkedInputs.removeAttr('disabled')

                sharedAttrField.find("option[value=0]").show()
                sharedAttrField.find('option:not([value=0])').hide()
                sharedAttrField.val(0)
            }
            sharedAttrField.trigger('change')
        })

        linkingField.trigger('change')
        sharedAttrField.trigger('change')
    }

    initProfilesFields() {
        this.profileLinksContainer = this.container.find('.profile-links')
        this.addLinksButton = this.profileLinksContainer.find('.add-profile_link')

        this.profileLinksContainer.on('click', '.remove-profile_link', (evt) => {
            let clicked = $(evt.currentTarget)
            let profileLinkId = clicked.data('pl-id')
            this.profileLinksContainer.find("[data-pl-id='" + profileLinkId + "']").remove()
            this.toggleAddLinks()
        })

        this.addLinksButton.on('click', (evt) => {
            let clicked = $(evt.currentTarget)
            $.get(
                '/js_loaders/profiles/profile_link_fields',
                { profile_id: this.profileId },
                (res) => {
                    clicked.closest('.horizontal-grid').before(res)
                    this.toggleAddLinks()
                }
            )
        })

        this.toggleAddLinks()

        // if there are no profile links, create the first one
        if(this.profileLinksContainer.find('.remove-profile_link').length == 0) {
            this.addLinksButton.trigger('click')
        }
    }

    toggleAddLinks() {
        if(this.profileLinksContainer.find('.remove-profile_link').length > 2) {
            this.addLinksButton.hide()
        } else {
            this.addLinksButton.show()
        }
    }

    initCountryStatesSelect() {
        let countryField = this.container.find('#address_country_id')
        this.selectedState = this.container.find('#address_state_id').val()
        countryField.on('change', () => {
            $.get(
                '/states/by_country',
                { country_id: countryField.val(), name_prefix: 'address' },
                (res) => {
                    this.container.find('#address_state_id').replaceWith(res)
                    this.container.find('#address_state_id').val(this.selectedState)
                }
            )
        })
        countryField.trigger('change')
    }
}
