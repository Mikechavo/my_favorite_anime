window.accountLogs ||= {}
window.accountLogs.initPanel = () => {
    new AccountLogsPanelController()
}

window.accountLogs.initNewForm = (newForm) => {
    new AccountLogNewFormController(newForm)
}

class AccountLogsPanelController {
    constructor() {
        this.container = $('.account-logs-container').closest('.panel')
        this.pinnedLogsContainer = this.container.find('.pinned-logs-container')
        this.initLoggableFiltering()
        this.evalPinnedLogs()
        this.initPinItem()
        this.initUnpinItem()
    }

    initLoggableFiltering() {
        let filterButtons = this.container.find('.type-filter')
        filterButtons.on('click', (evt) => {
            let clicked = $(evt.currentTarget)

            filterButtons.removeClass('selected')
            clicked.addClass('selected')

            let loggableType = clicked.data('loggable-type')
            let loggableId = clicked.data('loggable-id')
            if(loggableType == 'All') {
                this.container.find('.index-row').show()
            } else {
                this.container.find('.index-row').hide()
                this.container.find('.index-row[data-loggable-type=' + loggableType + '][data-loggable-id=' + loggableId + ']').show()
            }
        })

        filterButtons.first().trigger('click')
    }

    evalPinnedLogs() {
        let pinnedLogsRows = this.pinnedLogsContainer.find('.index-row')
        if(pinnedLogsRows.length) {
            this.pinnedLogsContainer.show()
        } else {
            this.pinnedLogsContainer.hide()
        }
    }

    initPinItem() {
        this.container.on('click', '.pin-account-log', (evt) => {
            let clicked = $(evt.currentTarget)
            $.post(
                clicked.attr('href'),
                (res) => {
                    if(res.status == 'success') {
                        let clickedRow = clicked.closest('.index-row')
                        let logId = clickedRow.data('id')
                        $.get(
                            (
                                "/js_loaders/account_logs/" + logId + "/single_record"
                            ),
                            (renderRes) => {
                                clickedRow.replaceWith(renderRes)
                                this.pinnedLogsContainer.find('.panel-main').prepend(renderRes)
                                this.evalPinnedLogs()
                            }
                        )
                    } else {
                        alert(res)
                    }
                }
            )
            return false
        })
    }

    initUnpinItem() {
        this.container.on('click', '.unpin-account-log', (evt) => {
            let clicked = $(evt.currentTarget)
            $.post(
                clicked.attr('href'),
                (res) => {
                    if(res.status == 'success') {
                        let clickedRow = clicked.closest('.index-row')
                        let logId = clickedRow.data('id')

                        let pinnedLog = this.pinnedLogsContainer.find('.panel-main').find('.index-row[data-id=' + logId + ']')
                        pinnedLog.remove()
                        this.evalPinnedLogs()

                        $.get(
                            (
                                "/js_loaders/account_logs/" + logId + "/single_record"
                            ),
                            (renderRes) => {
                                let originalLog = this.container.find('.account-logs-container').find('.index-row[data-id=' + logId + ']')
                                originalLog.replaceWith(renderRes)
                            }
                        )
                    } else {
                        alert(res)
                    }
                }
            )
            return false
        })
    }
}

class AccountLogNewFormController {
    constructor(newForm) {
        this.newForm = newForm
        // enable ck editor for account_log_note
        CKEDITOR.replace('account_log_note')
        this.initAddAttachments()
        this.initLoggableEditor()
        this.initUserHelpers()
        this.initFormSubmission()
    }

    initAddAttachments () {
        let inputTemplate = this.newForm.find("input[type=file]").closest('.horizontal-grid').clone()
        inputTemplate.removeClass('no-top-pad')

        let addAsset = this.newForm.find('.add-asset')
        addAsset.on('click', () => {
            addAsset.closest('.horizontal-grid').before(inputTemplate.clone())
        })

        // logic to remove attachment rows
        this.newForm.on('click', '.remove-asset', (evt) => {
            $(evt.currentTarget).closest('.horizontal-grid').remove()
        })
    }

    initLoggableEditor() {
        let loggableFields = this.newForm.find('#loggable-editor input')

        // convert to radio (can only associate note with 1 loggable)
        loggableFields.toArray().forEach((loggableField) => {
            $(loggableField).attr('type', 'radio')
        })

        // clicking a radio will update the loggable fields
        loggableFields.on('change', (evt) => {
            let changed = $(evt.currentTarget)
            let newVals = changed.val().split(':')
            let newLoggableType = newVals[0]
            let newLoggableId = newVals[1]

            let loggableTypeField = this.newForm.find('input[name="account_log[loggable_type]"]')
            let loggableIdField = this.newForm.find('input[name="account_log[loggable_id]"]')

            loggableTypeField.val(newLoggableType)
            loggableIdField.val(newLoggableId)
        })

        // select project by default
        loggableFields.first().trigger('click')
    }

    initUserHelpers() {
        let showAllUsers = this.newForm.find('.show-all-users')
        let hideAllUsers = this.newForm.find('.hide-all-users')
        let allUsers = this.newForm.find('.all-users')

        showAllUsers.on('click', () => {
            allUsers.show()
            showAllUsers.hide()
            hideAllUsers.show()
        })

        hideAllUsers.on('click', () => {
            allUsers.hide()
            hideAllUsers.hide()
            showAllUsers.show()
        })

        showAllUsers.trigger('click')

        // clicking on helper will select all relevant users
        this.newForm.find('.department-helpers a').on('click', (evt) => {
            let clicked = $(evt.currentTarget)
            let userIds = clicked.data('value')
            userIds.forEach((userId) => {
                let userOpt = this.newForm.find("input[name='account_log[user_ids][]'][value='" + userId + "']")
                if (!userOpt.prop('checked')) {
                    userOpt.trigger('click')
                }
            })
        })
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
            CKEDITOR.instances['account_log_note'].updateElement();
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
                        modal.find('.close-modal').trigger('click')
                        $.get(
                            (
                                "/js_loaders/account_logs/" + res.account_log.id + "/single_record"
                            ),
                            (renderRes) => {
                                $('.account-logs-container').prepend(renderRes)
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
