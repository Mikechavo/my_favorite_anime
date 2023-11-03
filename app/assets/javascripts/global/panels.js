initPanelExpanders = (container) => {
    container.find('.expand-panel').each((i, expandElem) => {
        let expander = $(expandElem)
        let panel = expander.closest('.panel')
        let collapser = panel.find('.collapse-panel').first()
        let panelContentContainer = panel.children('.panel-content')
        let panelContent = panelContentContainer.children('div').not('.panel-header')

        expander.on('click', () => {
            panelContent.show()
            panelContentContainer.find('.content-placeholder').remove()
            expander.hide()
            collapser.show()
        })

        collapser.on('click', () => {
            panelContent.hide()
            panelContentContainer.append('<div class="content-placeholder"></div>')
            expander.show()
            collapser.hide()
        })

        if(collapser.hasClass('collapsed')) {
            collapser.trigger('click')
        } else {
            expander.trigger('click')
        }
    })
}
