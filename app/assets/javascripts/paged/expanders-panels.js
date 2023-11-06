let initExpandersPanels = () => {
    $('.expand-panel').each((i, expandElem) => {
        let expander = $(expandElem)
        let panel = expander.closest('.panel')
        let collapser = panel.find('.collapse-panel')
        let panelContentContainer
        let panelContent

        expander.on('click', () => {
            panelContentContainer = panel.find('.panel-content')
            panelContent = panelContentContainer.children('div').not('.panel-header')
            panelContent.show()
            panelContentContainer.find('.content-placeholder').remove()
            expander.hide()
            collapser.show()
        })

        collapser.on('click', () => {
            panelContentContainer = panel.find('.panel-content')
            panelContent = panelContentContainer.children('div').not('.panel-header')
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

let initShowMorePanels = () => {
    let maxHeight = 200
    $('.show-more-segment').each((i, expandable) => {
        // calculate expandable segment
        let currentHeight = $(expandable).height()
        // add expanders if past the max height
        if(currentHeight > maxHeight) {
            let panelContent = $(expandable).closest('.panel').find('.panel-content').first()
            // append expanders
            panelContent.append('<div class="horizontal-grid"><div class="stretch-column"><a class="button-unified full-width show-more">Show More</a></div></div>')

            let showMore = panelContent.find('.show-more')
            let showMoreContainer = showMore.closest('.horizontal-grid')

            // set fixed panel height
            $(expandable).css('height', maxHeight - showMoreContainer.height())
            $(expandable).css('overflow', 'hidden')
            // click to expand logic

            showMore.on('click', () => {
                $(expandable).css('height', '')
                $(expandable).css('overflow', '')
                showMoreContainer.remove()
            })
        }
    })
}
