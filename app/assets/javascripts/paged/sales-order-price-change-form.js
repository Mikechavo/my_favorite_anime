window.sales_orders ||= {}
window.sales_orders.initPriceChangeForm = (container) => {
    new SalesOrderPriceChangeController(container)
}

class SalesOrderPriceChangeController {
    constructor(container) {
        this.container = container
        this.lineItemsTable = this.container.find('#line-items-table')
        this.paymentsTable = this.container.find('#payments-table')
        this.rowsCounter = this.container.find('#loaded_rows')

        this.chargesTable = this.container.find('#charges-table')
        this.chargesTable.on('click', '.fill-full-amount', (evt) => {
            const clicked = $(evt.currentTarget)
            const amountCents = clicked.closest('tr').find('.old_amount').val()
            const amountDollars = amountCents / 100
            const fillableField = clicked.closest('tr').find('.new_amount')
            fillableField.val(amountDollars)
            this.runRefundCalculations()
        })

        this.lineItemsTable.on('change keyup', '.amount, .cancelled', (evt) => {
            this.processLineItemRow($(evt.currentTarget))
        })

        this.paymentsTable.on('change keyup', '.amount', (evt) => {
            this.processPaymentRow($(evt.currentTarget))
        })

        this.container.on('click', '#payments-table .remove-row', (evt) => {
            $(evt.currentTarget).closest('tr').remove()
            this.runPaymentCalculations()
        })

        this.container.find('.add-single-payment').on('click', (evt) => {
            let rowNum = parseInt(this.rowsCounter.val()) + 1
            this.rowsCounter.val(rowNum)
            this.addPayment(rowNum)
        })

        // fast cancel button
        this.container.find('.cancel-order').on('click', () => {
            this.container.find('.cancelled').prop('checked', true)
            this.container.find('.remove-row').trigger('click')
        })

        // initial loading logic
        this.lineItemsTable.find('.amount').each((index, elem) => {
            this.processLineItemRow($(elem))
        })

        this.paymentsTable.find('.amount').each((index, elem) => {
            this.processPaymentRow($(elem))
        })
        this.runRefundCalculations()
    }

    processLineItemRow(changedField) {
        this.runLineItemCalculations()
        const oldAmountField = changedField.closest('tr').find('.old_amount')
        const newAmountField = changedField.closest('tr').find('.amount')

        const oldAmount = parseFloat(oldAmountField.val())
        const newAmount = parseFloat(newAmountField.val())

        if(newAmount == oldAmount) {
            newAmountField.removeClass('changed-color')
        } else {
            newAmountField.addClass('changed-color')
        }
    }

    runLineItemCalculations() {
        const originalAmountField = this.container.find('#original_amount')
        const originalAmount = parseFloat(originalAmountField.val())

        let newTotalAmount = 0
        const rowTotalFields = this.lineItemsTable.find('.amount')
        rowTotalFields.each((index, element) => {
            let statusField = $(element).closest('tr').find('.cancelled')
            if (!statusField.prop('checked')) {
                newTotalAmount += parseFloat($(element).val()) || 0
            }
        })

        let amountDifference = newTotalAmount - originalAmount
        amountDifference = Math.round(amountDifference * 100) / 100

        this.container.find('.line_items_current_total').val(newTotalAmount)
        this.container.find('.line_items_total_change').val(amountDifference)
        this.runOverviewCalculations()
    }

    processPaymentRow(newField) {
        this.runPaymentCalculations()
        const oldField = newField.closest('tr').find('.old_amount')

        const newAmount = parseFloat(newField.val())
        const oldAmount = parseFloat(oldField.val())

        if(newAmount == oldAmount) {
            newField.removeClass('changed-color')
        } else {
            newField.addClass('changed-color')
        }
    }

    runPaymentCalculations() {
        let originalAmount = this.container.find('#original_amount')
        originalAmount = parseFloat(originalAmount.val())

        let newTotalAmount = 0
        let rowTotalFields = this.paymentsTable.find('.amount')
        rowTotalFields.each((index, element) => {
            newTotalAmount += parseFloat($(element).val()) || 0
        })

        let amountDifference = newTotalAmount - originalAmount
        amountDifference = Math.round(amountDifference * 100) / 100

        this.container.find('#payments_current_total').val(newTotalAmount)
        this.container.find('#payments_new_total').val(amountDifference)
        this.runOverviewCalculations()
    }

    addPayment(rowNum) {
        // inputs need to be grouped for controller processing
        const salesOrderId = this.container.find('#sales_order_id').val()
        $.get(
            '/price_change_batches/price_change_row',
            { sales_order_id: salesOrderId, row_num: rowNum },
            (res) => {
                this.paymentsTable.append(res)
                bindDatepicker('#payments-table tr:last-child')
                this.runPaymentCalculations()
            }
        )
    }

    runRefundCalculations() {
        let newTotalAmount = 0
        let refundFields = this.container.find('#charges-table').find('.new_amount')
        refundFields.each((index, element) => {
            newTotalAmount += parseFloat($(element).val()) || 0
        })

        this.container.find('#total_refunds').val(newTotalAmount)
        this.runOverviewCalculations()
    }

    runOverviewCalculations() {
        let totalCharged = this.container.find('#line_items_charged_total').val()
        totalCharged = parseFloat(totalCharged) || 0
        let totalRefunded = this.container.find('#total_refunds').val()
        totalRefunded = parseFloat(totalRefunded) || 0

        let totalBalance = totalCharged - totalRefunded
        this.container.find('#total_balance').val(totalBalance)

        let newTotal = this.container.find('.line_items_current_total').val()
        newTotal = parseFloat(newTotal) || 0

        let oldTotalCents = this.container.find('#line_items_original_total').val()
        oldTotalCents = parseFloat(oldTotalCents) || 0

        let toPayTotal
        if (totalBalance > newTotal) {
            toPayTotal = totalBalance
        } else {
            toPayTotal = newTotal
        }
        let creditTotal = oldTotalCents - toPayTotal

        this.container.find('#total_credits').val(creditTotal)
    }
}
