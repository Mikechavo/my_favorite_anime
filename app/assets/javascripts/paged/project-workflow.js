window.projectWorkflow ||= {}
window.projectWorkflow.initWorkflow = (project, container) => {
    new projectWorkflowController(project, container)
}

window.projectWorkflow.initEditDescription = (project, container) => {
    CKEDITOR.replace('project_description')
}

class projectWorkflowController {
    constructor(project, container) {
        this.project = project
        this.container = container
        this.loadAccountLogs()
        this.loadAttachments()
    }

    loadAccountLogs() {
        let accountLogsContainer = this.container.find('.account-logs-index-container')
        showLoader(accountLogsContainer)
        $.get(
            (
                "/js_loaders/account_logs/loggable_index?" +
                "loggable_type=Project&" +
                "loggable_id=" + this.project.id
            ),
            (res) => {
                accountLogsContainer.effect("highlight", {}, 1000)
                accountLogsContainer.replaceWith(res)
            }
        )
    }

    loadAttachments() {
        let assetsContainer =  this.container.find('.assets-index-container')
        showLoader(assetsContainer)
        $.get(
            (
                '/js_loaders/asset_fogs?' +
                'assetable_type=Project&' +
                'assetable_id=' + this.project.id
            ),
            (res) => {
                assetsContainer.effect("highlight", {}, 1000)
                assetsContainer.closest('.panel').replaceWith(res)
            }
        )
    }
    
    loadFogAttachments() {
        let assetsContainer =  this.container.find('.assets-index-container')
        showLoader(assetsContainer)
        $.get(
            (
                '/js_loaders/asset_fogs?' +
                'assetable_type=Project&' +
                'assetable_id=' + this.project.id
            ),
            (res) => {
                assetsContainer.effect("highlight", {}, 1000)
                assetsContainer.closest('.panel').replaceWith(res)
            }
        )
    }
}