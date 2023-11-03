// all pages should have listener for modal closing
$(document).ready(() => {
    new unifiedModalController()
})

class unifiedModalController {
    constructor() {
        this.modal = $('#unified-modal')
        if(this.modal.length > 0) {
            this.modalHistory = this.modal.find('#modal_history')
            this.modalHeader = this.modal.find('#header-text')
            this.modalHeaderIcon = this.modal.find('#header-icon')
            this.modalContent = this.modal.find('#modal-content')
            this.modalActions = this.modal.find('#modal-actions')
            this.modalButtons = this.modalActions.find('.shrink-column')
            this.modalLoader = this.modalActions.find('.unified-loader')
            this.hideActions = true
            this.initOpening()
            this.initClosing()
            this.initFormSubmission()
        }
    }

    initOpening() {
        // clicking on any modal link should show modal
        $('body').on('click', 'a.open-modal', (evt) => {
            evt.preventDefault()
            let clicked = $(evt.currentTarget)

            // check if container in modal
            let inModal = clicked.closest('#unified-modal').length > 0
            if(inModal) {
                this.showModal(clicked, false, 'get')
            } else {
                // clear out modal history
                this.modalHistory.val('[]')
                // close any open modal before opening new one
                this.modal.find('.close-modal').trigger('click')
                this.showModal(clicked, true, 'get')
            }
        })

        // submitting a form with a modal class should show modal
        $('body').on('submit', 'form.open-modal', (evt) => {
            evt.preventDefault()
            let submitted = $(evt.currentTarget)
            let action = submitted.attr('action')
            submitted.attr('href', action)

            // check if container in modal
            let inModal = submitted.closest('#unified-modal').length > 0
            if(inModal) {
                this.showModal(submitted, false, 'post')
            } else {
                // clear out modal history
                this.modalHistory.val('[]')
                // close any open modal before opening new one
                this.modal.find('.close-modal').trigger('click')
                this.showModal(submitted, false, 'post')
            }
        })
    }

    initClosing() {
        this.modal.find('.close-modal').on('click', () => {
            // remove the last (current) modal url from the history
            let fullHistory = JSON.parse(this.modalHistory.val() || '[]')
            fullHistory.pop()
            this.modalHistory.val(JSON.stringify(fullHistory))

            // if there is still history open the last url
            fullHistory = JSON.parse(this.modalHistory.val() || '[]')
            if(fullHistory.length > 0) {
                // remove reverted to url from history
                let lastModalUrl = fullHistory.pop()
                this.modalHistory.val(JSON.stringify(fullHistory))

                let lastModalLink = $('<a></a>')
                lastModalLink.css('display', 'none')
                lastModalLink.attr('href', lastModalUrl)
                lastModalLink.addClass('open-modal')
                // generate invisible link in modal
                this.modalContent.append(lastModalLink)
                // click invisible link
                lastModalLink.trigger('click')
            } else {
                this.modal.hide()
                this.modalHeader.empty()
                this.modalHeaderIcon.hide()
                this.modalHeaderIcon.removeClass()
                this.modalContent.empty()
            }
        })
    }

    initFormSubmission() {
        this.modalLoader.hide()

        // clicking submit will post contained form via ajax
        this.modal.find('.submit-modal').on('click', () => {
            // hide modal actions until form is submitted
            this.modalButtons.hide()
            this.modalLoader.show()
            let modalForm = this.modal.find('form')
            // update ckeditor instances before serializing fields for ajax submission
            let ckKeys = Object.keys(CKEDITOR.instances)
            ckKeys.forEach((ckKey) => {
                CKEDITOR.instances[ckKey].updateElement()
            })
            $.post(
                modalForm.attr('action'),
                modalForm.serialize(),
                (res) => {
                    if(res.status === 'success') {
                        window.location.reload()
                    } else {
                        alert(res.error)
                        this.modalButtons.show()
                        this.modalLoader.hide()
                    }
                }
            )
        })
    }

    showModal(clicked, reposition, submitMethod) {
        let url = clicked.attr('href')
        this.initDraggable()

        this.modalHeader.text('')

        this.modalHeaderIcon.hide()
        this.modalHeaderIcon.removeClass()

        let submit = this.modalActions.find('.submit-modal')
        let submitCustom = this.modalActions.find('.submit-modal-custom')
        // unbind any hanging custom listeners
        submitCustom.off()

        // reset the submission/loader area
        this.modalButtons.show()
        this.modalLoader.hide()


        $.ajax({
            type: submitMethod,
            url: url,
            data: clicked.serialize(),
            success: (res) => {
                if (res.includes('RenderError:')) {
                    alert(res.replace('RenderError:', ''))
                } else {
                    this.modal.show()
                    this.modal.find('#modal-content').html(res)

                    // update header text
                    let headerText = this.modal.find('#header_text').val()
                    this.modalHeader.text(headerText)

                    // update header icon
                    let modalHeaderIcon = this.modal.find('#header_icon').val()
                    if (modalHeaderIcon.length) {
                        this.modalHeaderIcon.show()
                        this.modalHeaderIcon.addClass('fa-solid fa-' + modalHeaderIcon)
                    }

                    // if there is a single form with at least 1 non-hidden field show the actions
                    let modalForms = this.modal.find('form')
                    let formFields = modalForms.find('input:not([type=hidden]), select, textarea')
                    this.hideActions = (modalForms.length !== 1 || formFields.length == 0)
                    if (this.hideActions) {
                        this.modalActions.hide()
                    } else {
                        this.modalActions.show()
                    }

                    // custom submit vs default modal submit visibility
                    let showCustomSubmit = this.modal.find('#custom_submit').val()
                    if (showCustomSubmit) {
                        submit.hide()
                        submitCustom.show()
                    } else {
                        submit.show()
                        submitCustom.hide()
                    }

                    if (reposition) {
                        this.positionModal(clicked)
                    }

                    // record history of opened modals
                    let fullHistory = JSON.parse(this.modalHistory.val() || '[]')
                    fullHistory.push(url)
                    this.modalHistory.val(JSON.stringify(fullHistory))
                }
            }
        })
    }

    initDraggable () {
        // init draggable
        this.modal.draggable({handle: '#modal-header'})
        // unbind any draggable functionality
        this.modal.draggable('disable')
        this.modal.unbind('dragstart')

        // reset height and width to reposition borders
        let fullStyle = this.modal.attr('style')
        let stylesArr = fullStyle.split(';')
        let newStyles = []
        stylesArr.forEach((styleStr) => {
            if(!styleStr.includes('width') && !styleStr.includes('height')) {
                newStyles.push(styleStr.trim())
            }
        })
        this.modal.attr('style', newStyles.join('; '))

        // rebind draggable
        this.modal.draggable('enable')

        this.modal.on('dragstart', () => {
            // widen by 1 px to address truncating
            let width = this.modal.width()
            width += 1
            // appending new width will override existing styled width
            let currentStyles = this.modal.attr('style')
            currentStyles += ('width:' + width + 'px')
            this.modal.attr('style', currentStyles)

            // stop listening after 1st drag
            this.modal.unbind('dragstart')
        })
    }

    positionModal(clicked) {
        let overflowPadding = 16

        let position = clicked.offset()
        let clickedTop = position.top
        let clickedLeft = position.left

        // offset positions to make sure modal never overflows
        let clickedHeight = this.modal.height()
        let clickedWidth = this.modal.width()

        let clickedBot = clickedTop + clickedHeight
        let clickedRight = clickedLeft + clickedWidth

        // add padding to calculation
        clickedBot += overflowPadding
        clickedRight += overflowPadding * 2

        let windowHeight = $(window).height()
        let windowWidth = $(window).width()

        // set base values and offset if overflowing
        let top = clickedTop
        let left = clickedLeft

        if (clickedBot > windowHeight) {
            top -= (clickedBot - windowHeight)
        }

        if (clickedRight > windowWidth) {
            left -= (clickedRight - windowWidth)
        }

        // update the 'inset' inline style of the modal to move it
        // inset: 590.031px auto auto 1004.19px
        let modalStyle = this.modal.attr('style')
        let newStyle = modalStyle + ' inset: ' + top + 'px auto auto ' + left + 'px;'
        this.modal.attr('style', newStyle)
    }
}
