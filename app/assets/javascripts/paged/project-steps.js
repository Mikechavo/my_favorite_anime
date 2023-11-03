window.projects ||= {}
window.projects.initStepControls = (stepConfigs, stepHasInterval) => {
    new StepController(stepConfigs, stepHasInterval)
}

class StepController {
    constructor(stepConfigs, stepHasInterval) {
        this.stepConfigs = stepConfigs
        this.stepHasInterval = stepHasInterval
        this.form = $('.work-time')
        this.formSubmit = this.form.find('input.complete')
        this.initCandidatesSelect()
        this.initActionAlerts()
        this.initExplanationBox()
        this.initFormSubmitState()
        this.initFormValidations()
    }

    initCandidatesSelect() {
        // match hidden candidate_id field to candidate from select dropdown on change
        $('.candidates-select').on('change', (evt) => {
            let selectedId = $(evt.currentTarget).val()
            $('#candidate_id').val(selectedId)
        })
        // trigger change for page load
        $('.candidates-select').trigger('change')
    }

    initActionAlerts() {
        $('.action-choice').on('click', (evt) => {
            let actionAlert = $(evt.currentTarget).data('alert')
            let alertCont =  $('.action-alert-container')
            if(actionAlert != undefined){
                alertCont.find('.stage-alert').text(actionAlert)
                alertCont.show()
            } else {
                alertCont.hide()
            }
        })
    }

    initExplanationBox() {
        let explanationField = this.form.find('#brief_explanation')
        // set field configs
        explanationField.charCount({
            allowed: 500,
            warning: 15,
            counterText: 'Characters left: ',
            cssWarning: 'char_warning',
            cssExceeded: 'char_exceeded'
        })

        this.form.find('.action-choice').on('click', (evt)=>{
            let clicked = $(evt.currentTarget)
            let explanationCont = explanationField.closest('div')
            if(clicked.val() == 'fail'){
                // clicking 'fail' action choice will show the explanation box
                explanationCont.show()
            } else {
                // anything else will hide the explanation box
                explanationCont.hide()
            }
        })
    }

    // some validations will completely disable the form submission button
    initFormSubmitState() {
        if(this.intervalValidations()) {
            this.enableFormSubmission()
        } else {
            this.disableFormSubmission()
        }
    }

    // passing validations should return true
    initFormValidations() {
        this.form.on('submit', () => {
            // store submit button text for restoring if submit fails
            let submitText = this.formSubmit.val()
            // disable form submission to prevent double submissions
            this.disableFormSubmission()
            this.formSubmit.val('Please Wait ...')
            // use && to ensure all validations pass
            if(
                this.actionValidations() &&
                this.explanationValidations()
            ){

            } else {
                this.enableFormSubmission()
                this.formSubmit.val(submitText)
                return false
            }
        })
    }

    intervalValidations(){
        if(this.stepConfigs.record_intervals){
            if(!this.stepHasInterval){
                return false
            }
        }
        return true
    }

    actionValidations() {
        // if there are multiple action choices
        if(this.form.find('.action-choice').length > 1){
            // require one to be selected
            if(this.form.find('.action-choice:checked').length == 0){
                alert("You haven't made a selection.")
                return false
            }
        }
        return true
    }

    explanationValidations() {
        let validationsFailed = false
        let explanationField = this.form.find('#brief_explanation')

        // if fail is the selected action, require an explanation
        if(this.form.find('.action-choice[value="fail"]:checked').length > 0){
            if(explanationField.val().length == 0){
                alert('A brief explanation is required')
                validationsFailed = true
            }
            if(explanationField.val().length > 500){
                alert('Description must be less than 500 characters')
                validationsFailed = true
            }
        }
        if(validationsFailed){
            explanationField.focus()
            explanationField.select()
            return false
        } else {
            return true
        }
    }

    enableFormSubmission() {
        this.formSubmit.removeAttr('disabled')
        this.formSubmit.removeClass('disabled')
    }

    disableFormSubmission() {
        this.formSubmit.attr('disabled', 'disabled')
        this.formSubmit.addClass('disabled')
    }
}
