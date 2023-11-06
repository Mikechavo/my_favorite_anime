window.sales_order_workflow ||= {}
window.sales_order_workflow.line_item_renewal ||= {}
window.sales_order_workflow.line_item_renewal.initForm = (container) => {
    new SalesOrderWorkflowLineItemRenewalController(container)
}

class SalesOrderWorkflowLineItemRenewalController {
    constructor(container) {
        this.container = container
        // check off already selected renewals
        $('.parent_line_item_id').each((index, parentSelectField) => {
            let selectedId = $(parentSelectField).val()
            if(selectedId.length > 0) {
                this.container.find('#line_item-' + selectedId).prop('checked', true)
            }
        })

        this.initFormSubmit()
    }

    addLineItemRow(renewalId) {
        let lineItemsTable = $('#line-items-table')
        let rowNum = lineItemsTable.find('.expand-row').length
        // inputs need to be grouped for controller processing
        let salesOrderId = $('#sales_order_id').val()

        $.get(
            '/sales_order_workflow/edit_line_items_row',
            { sales_order_id: salesOrderId, row_num: rowNum + 1, parent_line_item_id: renewalId },
            (res) => {
                lineItemsTable.prepend(res)
                let newRowTarget = '#line-items-table tr:first-child'
                bindDatepicker(newRowTarget)
                $(newRowTarget).find('.contract-row').trigger('click')
                $(newRowTarget).find('.parent_line_item_id').trigger('change')
                $(newRowTarget).find('.set-active ').trigger('click')
            }
        )
    }

    initFormSubmit() {
        let modal = $('#unified-modal')
        let modalActions = modal.find('#modal-actions')
        let modalButtons = modalActions.find('.shrink-column')
        let modalLoader = modalActions.find('.unified-loader')
        modal.find('.submit-modal-custom').on('click', () => {
            // prevent double submissions
            modalButtons.hide()
            modalLoader.show()

            // find all selected items
            let currentlySelected = []
            $('.parent_line_item_id').each((index, parentSelectField) => {
                let selectedId = $(parentSelectField).val()
                if(selectedId.length > 0) {
                    currentlySelected.push(selectedId)
                }
            })

            let selectedRenewalIds = []
            this.container.find('.line-item-id').each((index, renewalItemField) => {
                if($(renewalItemField).prop('checked')) {
                    let selectedRenewalId = $(renewalItemField).val()
                    // only consider items not already selected in main table
                    if(!currentlySelected.includes('' + selectedRenewalId)) {
                        selectedRenewalIds.push(selectedRenewalId)
                    }
                }
            })

            let addRowLoop = (i, loopTimes, selectedRenewalIds, controllerClass) => {
                setTimeout(() => {
                    controllerClass.addLineItemRow(selectedRenewalIds[i])

                    i++
                    if((i) < loopTimes) {
                        addRowLoop(i, loopTimes, selectedRenewalIds, controllerClass)
                    }
                }, 150)
            }

            if(selectedRenewalIds.length > 0){
                addRowLoop(0, selectedRenewalIds.length, selectedRenewalIds, this)
            }

            modalButtons.find('.close-modal').trigger('click')
        })
    }
}
