window.sales_order_workflow ||= {}
window.sales_order_workflow.payments ||= {}
window.sales_order_workflow.payments.initForm = (container) => {
    new SalesOrderWorkflowPaymentsController(container)
}

class SalesOrderWorkflowPaymentsController {
    constructor(container) {
        this.container = container
        this.paymentsTable = this.container.find('#payments-table')
        this.rowsCounter = this.container.find('#loaded_rows')

        this.container.find('.submit-payments').on('click', (evt) => {
            let clicked = $(evt.currentTarget)
            clicked.closest('form').submit()
        })

        this.container.on('click', '.remove-row', (evt) => {
            $(evt.currentTarget).closest('tr').remove()
            this.runTotalCalculations()
            // reset rows counter before adding more
            let currentRowsCount = this.container.find('.remove-row').length
            this.rowsCounter.val(currentRowsCount)
        })

        this.container.on('click', '.clear-schedule', (evt) => {
            this.container.find('.remove-row').each((index, element) => {
                $(element).trigger('click')
            })
        })
        this.container.find('.add-single-payment').on('click', (evt) => {
            let rowNum = parseInt(this.rowsCounter.val()) + 1
            this.rowsCounter.val(rowNum)
            this.addPayment(rowNum, 'One Time')
        })
        this.container.find('.add-monthly-schedule').on('click', (evt) => {
            this.addPaymentSchedule('Monthly')
        })
        this.container.find('.add-quarterly-schedule').on('click', (evt) => {
            this.addPaymentSchedule('Quarterly')
        })
        this.container.find('.add-yearly-schedule').on('click', (evt) => {
            this.addPaymentSchedule('Yearly')
        })

        this.container.on('change keyup', '.amount', () => {
            this.runTotalCalculations()
        })
        this.runTotalCalculations()
    }

    addPayment(rowNum, schedule_type) {
        // inputs need to be grouped for controller processing
        let salesOrderId = this.container.find('#sales_order_id').val()
        $.get(
            '/sales_order_workflow/edit_payments_row',
            { sales_order_id: salesOrderId, row_num: rowNum, schedule_type: schedule_type },
            (res) => {
                this.paymentsTable.append(res)
                let newRowTarget = '#payments-table tr:last-child'
                bindDatepicker(newRowTarget)
                this.runTotalCalculations()
            }
        )
    }

    addPaymentSchedule(scheduleType) {
        // reset rows counter before adding more
        let currentRowsCount = this.container.find('.remove-row').length
        this.rowsCounter.val(currentRowsCount)

        let totalMonths = this.container.find('#sales_order_month_duration')
        totalMonths = parseInt(totalMonths.val())
        let loopTimes
        if(scheduleType == 'Monthly') {
            loopTimes = totalMonths
        } else if (scheduleType == 'Quarterly') {
            loopTimes = Math.ceil(totalMonths/3)
        } else if (scheduleType == 'Yearly') {
            loopTimes = Math.ceil(totalMonths/12)
        }

        let rowNum = parseInt(this.rowsCounter.val())

        let addRowLoop = (i, loopTimes, rowNum, scheduleType, controllerClass) => {
            setTimeout(() => {
                rowNum++
                this.rowsCounter.val(rowNum)
                controllerClass.addPayment(rowNum, scheduleType)

                i++
                if((i) < loopTimes) {
                    addRowLoop(i, loopTimes, rowNum, scheduleType, controllerClass)
                }
            }, 150)
        }
        addRowLoop(0, loopTimes, rowNum, scheduleType, this)
    }

    runTotalCalculations() {
        let targetAmount = this.container.find('#sales_order_target_amount').val()

        let newCurrent = 0
        let rowTotalFields = this.container.find('.amount')
        rowTotalFields.each((index, element) => {
            newCurrent += parseFloat($(element).val()) || 0
        })

        let newRemaining = targetAmount - newCurrent

        this.container.find('#sales_order_current_amount').val(newCurrent.toFixed(2))
        this.container.find('#sales_order_remaining_amount').val(newRemaining.toFixed(2))
    }
}
