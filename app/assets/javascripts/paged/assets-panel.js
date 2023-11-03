window.assets ||= {}
window.assets.initPanel = (container, attachmentId, attachmentType, lastEpoch) => {
    new AssetPanelController(container, attachmentId, attachmentType, lastEpoch)
}

window.assets.initNewForm = (newForm) => {
    new AssetNewFormController(newForm)
}

class AssetPanelController {
    constructor(container, attachmentId, attachmentType, lastEpoch) {
        this.container      = container
        this.attachmentId   = attachmentId
        this.attachmentType = attachmentType
        this.lastEpoch      = lastEpoch
        
        this.toggleNoRecords()
        this.initStatusChanges()
        this.initDestroyRow()
        // ==================================================
        // Allows for immediate update of attachments on load
        // --------------------------------------------------
        this.toggleAttachments()
    }

    toggleNoRecords() {
        if (this.container.find('.active-records .index-row').length > 0) {
            this.container.find('.no-records').hide()
        } else {
            this.container.find('.no-records').show()
        }
    }

    // =======================================================================
    // Toggles the Inactive attachments section and updates the inactive count
    // -----------------------------------------------------------------------
    toggleAttachments() {
        // =========================
        // Inactive Attachment Count
        // -------------------------
        let inactiveAttachmentCount = $('#assets-panel .panel-main.inactive-records > div').length

        // ==========================================================
        // Updates Number of Attachments in Inactive Collapse Section
        // ----------------------------------------------------------
        $('#inactive-count').text(`Inactive (${inactiveAttachmentCount})`);

        // ===========================================
        // Hides or Displays Inactive Collapse Section
        // Depending if there are Attachments
        // -------------------------------------------
        if (inactiveAttachmentCount > 0) {
            $('#assets-panel .panel.no-pad.flash-panel.inactive').show();
        } else {
            $('#assets-panel .panel.no-pad.flash-panel.inactive').hide();
        }
    }

    loadSingleRow(id, placeholder, containerName) {
        $.get(
            (
                "/js_loaders/asset_fogs/" + id + "/single_record"
            ),
            (renderRes) => {
                if (placeholder.length) {
                    // ========================
                    // remove the current asset
                    // ------------------------
                    placeholder.remove()
                } else {
                    this.container.find('.no-records').show()
                    console.log('Placeholder not found!');
                }
                // ======================================
                // insert record to top of relevant table
                // --------------------------------------
                const targetContainer = this.container.find(containerName);
                if (targetContainer.length > 0) {
                    targetContainer.prepend(renderRes);
                } else {
                    console.log('Target container not found!');
                }
                // =========================================================
                // Allows for immediate update of attachments on click event
                // ---------------------------------------------------------
                this.toggleAttachments()
            }
        )
    }

    initStatusChanges() {
        this.container.on('click', '.deactivate', (evt) => {
            let clicked    = $(evt.currentTarget)
            let clickedRow = clicked.closest('.index-row')
            let id         = clickedRow.data('id')
            replaceContentWithLoader(clickedRow)
            $.post(
                '/js_loaders/asset_fogs/' + id + '/update_record',
                {asset_fog: {status: 'Inactive'}},
                (res) => {
                    if (res.status != 'success') {
                        alert(res)
                    }
                    this.loadSingleRow(id, clickedRow, '.inactive-records')
                }
            )
        })

        this.container.on('click', '.activate', (evt) => {
            let clicked    = $(evt.currentTarget)
            let clickedRow = clicked.closest('.index-row')
            let id         = clickedRow.data('id')
            replaceContentWithLoader(clickedRow)

            $.post(
                '/js_loaders/asset_fogs/' + id + '/update_record',
                {asset_fog: {status: 'Active'}},
                (res) => {
                    if (res.status != 'success') {
                        alert(res)
                    }
                    this.loadSingleRow(res.record.id, clickedRow, '.active-records')
                }
            )
        })
    }

    initDestroyRow() {
        this.container.on('click', '.destroy', (evt) => {
            if (confirm('Delete this attachment?')) {
                let clicked = $(evt.currentTarget)
                let clickedRow = clicked.closest('.index-row')
                let id = clickedRow.data('id')
                replaceContentWithLoader(clickedRow)

                $.post(
                    '/js_loaders/asset_fogs/' + id + '/destroy_record',
                    (res) => {
                        if (res.status == 'success') {
                            clickedRow.remove()
                        }
                        this.toggleNoRecords()
                        // =====================================================
                        // Allows for immediate update of attachments on destroy
                        // -----------------------------------------------------
                        this.toggleAttachments()
                    }
                )
            }
        })
    }
}

class AssetNewFormController {
    constructor(newForm) {
        this.newForm = newForm
        this.initAddAttachments()
        this.initFormSubmission()
    }

    initAddAttachments() {
        let inputTemplate = this.newForm.find("input[type=file]").closest('.horizontal-grid').clone()
        inputTemplate.removeClass('no-top-pad')

        let addAsset = this.newForm.find('.add-asset')
        addAsset.on('click', () => {
            addAsset.closest('.horizontal-grid').before(inputTemplate.clone())
        })

        // ===============================
        // logic to remove attachment rows
        // -------------------------------
        this.newForm.on('click', '.remove-asset', (evt) => {
            $(evt.currentTarget).closest('.horizontal-grid').remove()
        })
    }

    initFormSubmission() {
        let modal          = $('#unified-modal')
        let modalActions   = modal.find('#modal-actions')
        let modalButtons= modalActions.find('.shrink-column')
        let modalLoader = modalActions.find('.unified-loader')

        modal.find('.submit-modal-custom').on('click', () => {
            modalButtons.hide()
            modalLoader.show()
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
                        modal.find('.close-modal').trigger('click')
                        let assetsContainer = $('.assets-index-container')
                        showLoader(assetsContainer)
                        $.get(
                            (
                                '/js_loaders/asset_fogs?' +
                                'assetable_type=' + formData.get('asset_fog[assetable_type]') + '&' +
                                'assetable_id=' + formData.get('asset_fog[assetable_id]')
                            ),
                            (getRes) => {
                                assetsContainer.effect("highlight", {}, 1000)
                                assetsContainer.closest('.panel').replaceWith(getRes)
                            }
                        )
                    }
                    modalButtons.show()
                    modalLoader.hide()
                }
            })
        })
    }
}
