/*
 Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config )
{
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';


    // Rails CSRF token

    CKEDITOR.on('instanceReady', function( ev ) {
        var blockTags = ['div','h1','h2','h3','h4','h5','h6','p','pre','li','blockquote','ul','ol',
            'table','thead','tbody','tfoot','td','th','br'];

        for (var i = 0; i < blockTags.length; i++)
        {
            ev.editor.dataProcessor.writer.setRules( blockTags[i], {
                indent : false,
                breakBeforeOpen : false,
                breakAfterOpen : false,
                breakBeforeClose : false,
                breakAfterClose : false
            });
        }
    });

    config.filebrowserParams = function(){
        var csrf_token = $('meta[name=csrf-token]').attr('content'),
            csrf_param = $('meta[name=csrf-param]').attr('content'),
                params = new Object();

        if (csrf_param !== undefined && csrf_token !== undefined) {
            params[csrf_param] = csrf_token;
        }

        return params;
    };

    /* Toolbars */
    // hack to remove ckeditor right click menu
    //config.removePlugins = 'scayt,menubutton,contextmenu';
    config.toolbar_Minimal = [['Bold', 'Italic', 'Underline', 'Strike','SpellChecker']];
    config.disableNativeSpellChecker = false;
    config.toolbar = 'Minimal';
    config.forcePasteAsPlainText = true;
    config.enterMode = CKEDITOR.ENTER_BR;
    //config.enterMode = CKEDITOR.ENTER_P;
    config.autoParagraph = false;
};
