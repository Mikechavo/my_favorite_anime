window.units ||= {}
window.units.initWritingUnitsForm = (container) => {
    new WritingUnitsFormController(container)
}

class WritingUnitsFormController {
    constructor(container) {
        this.container = container
        this.initWordsFields()
        this.initPageConversionCalculator()
    }

    initWordsFields() {
        let calculated = this.container.find('#calculated_words').val()
        let useCustomField = this.container.find('#use_words_unit')
        let customCountField = this.container.find('#words_unit_number')

        useCustomField.on('change', (evt) => {
            let useCustom = $(evt.currentTarget).val() == 'true'
            if(useCustom) {
                customCountField.prop('disabled', false)
            } else {
                customCountField.prop('disabled', true)
                customCountField.val(calculated)
            }
        })

        useCustomField.trigger('change')
    }

    initPageConversionCalculator() {
        let conversionType = this.container.find('#conversion_type')
        let conversionRate = this.container.find('#conversion_rate')
        let conversionPages = this.container.find('#conversion_pages')
        let conversionTotal = this.container.find('#conversion_total')

        conversionType.on('change', (evt) => {
            let newRate = $(evt.currentTarget).val()
            conversionRate.val(newRate)
            conversionRate.trigger('change')
        })

        let calculateWords = () => {
            let rateVal = parseInt(conversionRate.val())
            let pagesVal = parseInt(conversionPages.val())
            return (rateVal * pagesVal) || 0
        }

        conversionRate.on('change', () => {
            conversionTotal.val(calculateWords())
        })

        conversionPages.on('change', () => {
            conversionTotal.val(calculateWords())
        })

        conversionType.trigger('change')
    }
}
