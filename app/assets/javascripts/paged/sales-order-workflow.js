window.sales_order_workflow ||= {}
window.sales_order_workflow.initLineItemsForm = (container) => {
    new SalesOrderWorkflowLineItemsController(container)
}

class SalesOrderWorkflowLineItemsController {
    constructor(container) {
        this.container = container
        this.lineItemsTable = this.container.find('#line-items-table')

        this.container.find('.submit-line-items').on('click', (evt) => {
            let clicked = $(evt.currentTarget)
            clicked.closest('form').submit()
        })

        this.initAddLineItems()
        this.initRenewalAutopop()
        this.initLineItemToggles()
        this.initLineItemStatusControls()

        // admins have line items opened by default
        let isSalesAdmin = this.container.find('#is_sales_admin').val()
        if(isSalesAdmin == 'true') {
            this.container.find('.expand-row').trigger('click')
        }

        this.container.on('click', '.remove-row', (evt) => {
            $(evt.currentTarget).closest('tr').remove()
            this.triggerTotalCalculations()
        })

        this.initGroupCodeRestrictions()
        this.initListPricePopulation()
        this.initBulkDateFields()

        this.container.on('change keyup', '.total_price', () => {
            this.triggerTotalCalculations()
        })
        this.triggerTotalCalculations()

        // initial line item settings
        this.container.find('.status-controls').each((index, element) => {
            let controls = $(element)
            let row = controls.closest('tr')
            let status = row.find('.status').val()

            controls.find('a[data-status="' + status + '"]').trigger('click')
        })

        // renewal configurations
        this.container.find('.parent_line_item_id').each((index, element) => {
            $(element).trigger('change')
        })
    }

    initAddLineItems() {
        let rowNum = this.container.find('.expand-row').length
        // inputs need to be grouped for controller processing
        let salesOrderId = this.container.find('#sales_order_id').val()
        this.container.find('.add-line-item').on('click', (evt) => {
            $.get(
                '/sales_order_workflow/edit_line_items_row',
                { sales_order_id: salesOrderId, row_num: rowNum },
                (res) => {
                    this.lineItemsTable.prepend(res)
                    let newRowTarget = '#line-items-table #line_item_row-' + rowNum
                    bindDatepicker(newRowTarget)
                    $(newRowTarget).find('.contract-row').trigger('click')
                    $(newRowTarget).find('.parent_line_item_id').trigger('change')
                    rowNum += 1
                }
            )
        })
    }

    initRenewalAutopop() {
        let parentLineItemsData = this.container.find('#parent_line_items_data').val()
        parentLineItemsData = JSON.parse(parentLineItemsData)
        this.container.on('change', '.parent_line_item_id', (evt) => {
            let changed = $(evt.currentTarget)
            let parentLineItemId = parseInt(changed.val())

            let row = changed.closest('tr')

            // group fields
            let groupSelect = row.find('.select-fields .product_group')
            let groupFixed = row.find('.fixed-fields .product_group')

            // product_code fields
            let codeSelect = row.find('.select-fields .product_code')
            let codeFixed = row.find('.fixed-fields .product_code')

            if(parentLineItemId > 0 ) {
                let parentLineItemData = parentLineItemsData[parentLineItemId]

                // set field data
                groupSelect.val(parentLineItemData.product_group)
                let selectedGroup = groupSelect.find('option:selected')
                groupFixed.val(selectedGroup.val())
                let groupDisplay = groupFixed.closest('.compound-field').find('span')
                groupDisplay.text(selectedGroup.text())

                codeSelect.val(parentLineItemData.product_code_id)
                let selectedCode = codeSelect.find('option:selected')
                codeFixed.val(selectedCode.val())
                let codeDisplay = codeFixed.closest('.compound-field').find('span')
                codeDisplay.text(selectedCode.text())

                // set field visibility and submittable
                groupSelect.closest('.compound-field').hide()
                groupSelect.attr('disabled', true)
                groupFixed.closest('.compound-field').show()
                groupFixed.attr('disabled', false)

                codeSelect.closest('.compound-field').hide()
                codeSelect.attr('disabled', true)
                codeFixed.closest('.compound-field').show()
                codeFixed.attr('disabled', false)
            } else {
                // set field visibility and submittable
                groupSelect.closest('.compound-field').show()
                groupSelect.attr('disabled', false)
                groupFixed.closest('.compound-field').hide()
                groupFixed.attr('disabled', true)

                codeSelect.closest('.compound-field').show()
                codeSelect.attr('disabled', false)
                codeFixed.closest('.compound-field').hide()
                codeFixed.attr('disabled', true)
            }
        })
    }

    initLineItemToggles() {
        this.container.on('click', '.expand-row', (evt) => {
            let clicked = $(evt.currentTarget)
            let row = clicked.closest('tr')

            clicked.hide()
            row.find('.contract-row').show()
            row.find('.additional-fields').show()
        })

        this.container.on('click', '.contract-row', (evt) => {
            let clicked = $(evt.currentTarget)
            let row = clicked.closest('tr')

            clicked.hide()
            row.find('.expand-row').show()
            row.find('.additional-fields').hide()
        })

        this.container.find('.contract-row').trigger('click')
    }

    initLineItemStatusControls() {
        this.container.on('click', '.status-controls a', (evt) => {
            let clicked = $(evt.currentTarget)
            let statusControls = clicked.closest('.status-controls')
            statusControls.find('a').addClass('default-color')
            clicked.removeClass('default-color')

            let statusField = clicked.closest('tr').find('.status')
            if (clicked.hasClass('set-active')) {
                statusField.val('Active')
            }
            if (clicked.hasClass('set-pending')) {
                statusField.val('Pending')
                clicked.closest('tr').find('.expand-row').trigger('click')
            }
            if (clicked.hasClass('set-not-renewed')) {
                statusField.val('Not Renewed')
                clicked.closest('tr').find('.expand-row').trigger('click')
            }
            this.triggerTotalCalculations()
        })
    }

    triggerTotalCalculations() {
        let targetAmount = this.container.find('#sales_order_target_amount').val()

        let newCurrent = 0
        let rowTotalFields = this.container.find('.total_price')
        rowTotalFields.each((index, element) => {
            let totalField = $($(element))
            let row = totalField.closest('tr')
            let status = row.find('.status').val()
            if(status == 'Active' || status == 'Inactive') {
                newCurrent += parseInt(totalField.val()) || 0
            }
        })

        let newRemaining = targetAmount - newCurrent

        this.container.find('#sales_order_current_amount').val(newCurrent)
        this.container.find('#sales_order_remaining_amount').val(newRemaining)
    }

    initGroupCodeRestrictions() {
        let allGroupCodes = this.container.find('#line_item_group_codes').val()
        allGroupCodes = JSON.parse(allGroupCodes)
        this.container.on('change', 'select.product_group', (evt) => {
            let groupSelect = $(evt.currentTarget)
            let row = groupSelect.closest('tr')
            let codeSelect = row.find('select.product_code')
            let groupCodes = allGroupCodes[groupSelect.val()] || []

            let selectedCode = codeSelect.val()
            let includeSelectedCode = false
            codeSelect.find('option').hide()
            codeSelect.find('option[value=""]').show()
            groupCodes.forEach((codeName) => {
                let optionToShow = codeSelect.find('option:contains(' + codeName + ')')
                optionToShow.show()
                if (optionToShow.val() == selectedCode) {
                    includeSelectedCode = true
                }
            })

            if(!includeSelectedCode) {
                codeSelect.val('')
            }
            codeSelect.trigger('change')
        })
        this.container.find('select.product_group').trigger('change')
    }

    initListPricePopulation() {
        let groupCodePrices = this.container.find('#line_item_group_code_prices').val()
        groupCodePrices = JSON.parse(groupCodePrices)
        this.container.on('change', 'select.product_code', (evt) => {
            let changed = $(evt.currentTarget)
            let row = changed.closest('tr')
            let productGroup = row.find('select.product_group').val()
            let selectedOpt = changed.find('option:selected')
            let productCode = selectedOpt.text()
            let groupPrices = groupCodePrices[productGroup] || {}
            let codePrice = groupPrices[productCode] || 0
            row.find('.list_price').val(codePrice)
            row.find('.total_price').val(codePrice).trigger('change')
        })
    }

    initBulkDateFields() {
        let targetField = this.container.find('#batch_expiration')
        let applyButton = this.container.find('.apply-expiration')
        let matchExpiration = this.container.find('.match-sales-order-expiration')
        let salesOrderExpiration = this.container.find('#sales_order_expiration').val()

        matchExpiration.on('click', () => {
            targetField.val(salesOrderExpiration)
            applyButton.trigger('click')
        })

        applyButton.on('click', () => {
            let targetValue = targetField.val()
            this.container.find('.line_item-expiration').val(targetValue)
        })
    }
}
