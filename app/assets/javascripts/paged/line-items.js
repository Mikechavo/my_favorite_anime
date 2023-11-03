window.line_items ||= {}
window.line_items.initPanel = (container) => {
    new LineItemsPanelController(container)
}

class LineItemsPanelController {
    constructor(container) {
        this.container = container
        this.initToggling()
    }

    initToggling() {
        this.container.find('.toggle-line-item').on('click', (evt) => {
            let clicked = $(evt.currentTarget)
            $.post(
                clicked.attr('href'),
                (res) => {
                    if (res.status == 'error') {
                        alert(res.error)
                    } else {
                        window.location.reload()
                    }
                }
            )
            return false
        })
    }
}
