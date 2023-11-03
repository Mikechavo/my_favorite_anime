let initPostLink = (link, confirmMsg) => {
    link.on('click', (evt) => {
        if (confirmMsg == null || confirm(confirmMsg)) {
            let clicked = $(evt.currentTarget)
            clicked.append("<form method='post'></form>")
            let form = clicked.find('form')
            let clickAction = clicked.attr('href')
            form.attr('action', clickAction)
            let authenticityToken = $('html head meta[name="csrf-token"]').attr('content')
            form.append('<input type="hidden" name="authenticity_token" value="' + authenticityToken + '">')
            form.trigger('submit')
            form.remove()
        }
        return false
    })
}

let postLinkJs = (clicked) => {
    $.post(
        clicked.attr('href'),
        {},
        (res) => {
            if(res.status != 'success') {
                alert(res.error)
            } else {
                window.location.reload()
            }
        }
    )
}

$(document).ready(() => {
    $('.post-link').each((i, link) => {
        let jqueryLink = $(link)
        let confirmMessage = jqueryLink.data('confirm')
        initPostLink(jqueryLink, confirmMessage)
    })

    $(document).on('click', '.post-link-js', (evt) => {
        let clicked = $(evt.currentTarget)
        let confirmMessage = clicked.data('confirm-post')
        if(confirmMessage == null || confirm(confirmMessage)) {
            postLinkJs(clicked)
        }
        return false
    })
})
