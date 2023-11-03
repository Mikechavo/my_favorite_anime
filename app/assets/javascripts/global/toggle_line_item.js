function showLoader(element){
    element.prepend(`
        <div id="loader" class="flash">
            <div class="loader-content">
                <span class="color-text">Loading <i class="fa-solid fa-spinner fa-spin"></i></span>
            </div>
        </div>
    `)
}
