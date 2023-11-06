window.projectWorkflow ||= {}
window.projectWorkflow.initStepControls = (container, project) => {
    new workflowStepsController(container, project)
}

window.projectWorkflow.initProgressForm = (newForm) => {
    new ProgressFormController(newForm)
}

class workflowStepsController {
    constructor(container, project) {
        this.container = container
        this.project = project
        this.progressForm = this.container.find('.progress-project')
        this.initCheckOut()
        this.initIntervalSubmission()
        this.initEstimateSubmission()
        this.runFormRestrictions()
    }

    initCheckOut() {
        let checkIn = this.container.find('.check-in')
        let checkOut = this.container.find('.check-out')
        let statusField = $('.project-status')
        let currentStatus = this.project.status_id

        checkIn.on('click', () => {
            checkIn.hide()
            checkOut.show()
            // only check in if checked out
            if(currentStatus == 21){
                $.post(
                    '/project_workflow/' + this.project.id + '/update_record',
                    { project: { status_id: 9 } },
                    (res) => {
                        if (res.status == 'error') {
                            alert(res.error)
                        } else {
                            currentStatus = 9
                            statusField.text('Open')
                        }
                    }
                )
            }
        })

        checkOut.on('click', () => {
            checkOut.hide()
            checkIn.show()
            // only check out if checked in
            if(currentStatus == 9){
                $.post(
                    '/project_workflow/' + this.project.id + '/update_record',
                    { project: { status_id: 21 } },
                    (res) => {
                        if (res.status == 'error') {
                            alert(res.error)
                        } else {
                            currentStatus = 21
                            statusField.text('Checked Out')
                        }
                    }
                )
            }
        })

        // initialize button statuses
        if(currentStatus === 21) {
            checkOut.trigger('click')
        } else {
            checkIn.trigger('click')
        }
    }

    initIntervalSubmission() {
        let isSubmitting = false
        let intervalForm = this.container.find('.create-interval').closest('form')
        this.totalIntervalField = intervalForm.closest('.horizontal-grid').find('.total-step-hours')

        // can skip interval creation if no hours spent
        this.container.find('.skip-intervals').on('click', () => {
            this.progressForm.show()
        })

        // logic for interval creation
        intervalForm.find('.create-interval').on('click', (evt) => {
            // preventing double submissions
            if(isSubmitting){
                return false
            } else {
                isSubmitting = true
            }

            let submittedHours = intervalForm.find('input[name="interval[hours]"]').val()

            let computedHours = parseFloat(submittedHours)
            if(isNaN(computedHours)){
                alert('Invalid time')
                isSubmitting = false
            } else {
                $.post(
                    intervalForm.attr('action'),
                    intervalForm.serialize(),
                    (res) => {
                        if(res.status == 'success') {
                            // clear the form
                            intervalForm.find('input[name="interval[hours]"]').val('')
                            intervalForm.find('input[name="interval[work_type]"]').val('')
                            // add the new amount to total hours
                            let oldTotalHours = parseFloat(this.totalIntervalField.text())
                            let newTotalHours = oldTotalHours + res.interval.hours
                            this.totalIntervalField.text(newTotalHours.toFixed(2))
                            // visual to indicate the hours have updated
                            flashElem(this.totalIntervalField)
                        } else {
                            alert(res.error)
                        }
                        // after an interval amount has been submitted, rerun the verification
                        this.runFormRestrictions()
                        isSubmitting = false
                    }
                )
            }
        })
    }

    initEstimateSubmission() {
        this.estimateField = this.container.find('#step-proposed-time')
        this.estimateField.on('keyup', (evt) => {
            this.runFormRestrictions()
        })
    }

    runFormRestrictions() {
        if(
            this.intervalValidations() &&
            this.estimateValidations()
        ) {
            this.progressForm.show()
        } else {
            this.progressForm.hide()
        }
    }

    intervalValidations() {
        // if interval fields are present, current total interval must be > 0
        if(this.totalIntervalField.length > 0 && parseFloat(this.totalIntervalField.text()) == 0) {
            return false
        } else {
            return true
        }
    }

    estimateValidations() {
        // if estimate field is present, must have a number > 0
        if(this.estimateField.length > 0) {
            if (parseFloat(this.estimateField.val()) > 0) {
                return true
            } else {
                return false
            }
        } else {
            return true
        }
    }
}


class ProgressFormController {
    constructor(container) {
        this.container = container
        this.initExplanation()

        this.estimateField = $('#step-proposed-time')
        this.estimateForm = this.estimateField.closest('form')
        if(this.estimateField.length > 0) {
            // if there is an estimate field and form on the page
            // submit the form before the auto submission
            $.post(
                this.estimateForm.attr('action'),
                { step: { proposed_time: this.estimateField.val() } },
                (res) => {
                    if(res.status == 'success') {
                        this.initAutoSubmit()
                    } else {
                        alert(res.error)
                    }
                }
            )
        } else {
            this.initAutoSubmit()
        }
    }

    initExplanation() {
        this.explanationCharLimit = 500
        this.explanationContainer = this.container.find('.explanation-container')
        this.explanationField = this.explanationContainer.find('textarea[name="brief_explanation"]')
        let charLimitText = this.explanationContainer.find('.char-limit')

        this.explanationField.on('input propertychange', (evt) => {
            let changed = $(evt.currentTarget)
            let fieldLength = changed.val().length
            let remainingChars = this.explanationCharLimit - fieldLength
            charLimitText.text(remainingChars)
        })

        this.explanationField.trigger('input')
    }

    initAutoSubmit() {
        // if there is only 1 candidate and no fields required submit the form
        let hasMultipleCandidates = this.container.find('#candidate_id option').length > 1
        let hasRequired = this.container.find('.required-field-container').length > 0
        if(!hasMultipleCandidates && !hasRequired){
            this.container.closest('#unified-modal').find('.submit-modal').trigger('click')
        }
    }
}
