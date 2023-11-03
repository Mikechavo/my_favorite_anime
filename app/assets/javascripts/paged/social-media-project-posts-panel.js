window.social_media_project_posts ||= {}
window.social_media_project_posts.initPanel = (container) => {
    new SocialMediaProjectPostsPanelController(container)
}

class SocialMediaProjectPostsPanelController {
    constructor(container) {
        this.container = container
        this.initDestroyLinks()
        this.initDestroyBatch()
    }

    initDestroyLinks() {
        this.container.on('click', '.destroy', (evt) => {
            if (confirm('Delete this post?')) {
                let clicked = $(evt.currentTarget)
                let clickedRow = clicked.closest('tr')
                let destroyUrl = clicked.attr('href')

                $.post(
                    destroyUrl,
                    (res) => {
                        if (res.status == 'success') {
                            clickedRow.remove()
                        } else {
                            alert(res)
                        }
                    }
                )
            }
            return false
        })
    }

    initDestroyBatch() {
        this.container.on('click', '.destroy-batch', (evt) => {
            if (confirm('Delete all project posts?')) {
                if (confirm('Posts from all associated projects will be deleted')) {
                    let clicked = $(evt.currentTarget)
                    let destroyUrl = clicked.attr('href')

                    $.post(
                        destroyUrl,
                        (res) => {
                            if (res.status == 'success') {
                                window.location.reload()
                            } else {
                                alert(res)
                            }
                        }
                    )
                }
            }
            return false
        })
    }
}
