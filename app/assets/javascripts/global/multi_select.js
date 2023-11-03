$(document).ready(function() {
    // appends (none) to the end of the target field if it is empty
    function addNone(selected_field){
        // if no options are left
        if( selected_field.children().length === 0){
            // add disabled (none) to the target field
            selected_field.append($('<option>', {
                class: ('none_' + selected_field.attr('class')),
                text: '(none)',
                disabled: true
            }));
        }
    }

    // when clicking the add_option button
    $('.add_option').click(function(){
        button = $(this);
        container = button.parents('tr');
        // get the text and value of all selected options in the not_included fields
        fields = container.find('.not_included option:selected').map(function(index, option){
            return {
                value: parseInt(option.value),
                text:  $(option).text(),
                class: $(option).attr('class')
            }
        }).get();
        // add those options to the included field
        fields.forEach(function(field){
            container.find('.included').append($('<option>', {
                value: field.value,
                text: field.text,
                class: field.class
            }));
        });
        // remove those options from the not included field
        container.find('.not_included option:selected').remove();
        // remove (none) from the included field
        container.find('.none_included').remove();
        // check if (none) should be added
        addNone(container.find('.not_included'));
        // clear all selections
        $('select[multiple]').val([]);
    });

    // when clicking the remove_option button
    $('.remove_option').click(function(){
        button = $(this);
        container = button.parents('tr');
        // get the text and value of all selected options in the included fields
        fields = container.find('.included option:selected').map(function(index, option){
            return {
                value: parseInt(option.value),
                text:  $(option).text(),
                class: $(option).attr('class')
        }
        }).get();
        // add those options to the not included field
        fields.forEach(function(field){
            container.find('.not_included').append($('<option>', {
                value: field.value,
                text: field.text,
                class: field.class
            }));
        });
        // remove those options from the included field
        container.find('.included option:selected').remove();
        // remove (none) from the not included field
        container.find('.none_not_included').remove();
        // check if (none) should be added
        addNone(container.find('.included'));
        // clear all selections
        $('select[multiple]').val([]);
    });

    // when double clicking on an option in the included fields
    $('.included').on('dblclick', 'option', function(){
        option = $(this);
        container = option.parents('tr');
        // get the value and text of the clicked element
        clicked_value = option.val();
        clicked_text = option.text();
        clicked_class = option.attr('class');
        // add that option to the not included fields
        container.find('.not_included').append($('<option>', {
            value: clicked_value,
            text: clicked_text,
            class: clicked_class
        }));
        // remove that option from the included fields
        option.remove();
        // remove (none) from the not included field
        container.find('.none_not_included').remove();
        // check if (none) should be added
        addNone(container.find('.included'));
        // clear all selections
        $('select[multiple]').val([]);
    });

    // when double clicking on an option in the not included fields
    $('.not_included').on('dblclick', 'option', function(){
        option = $(this);
        container = option.parents('tr');
        // get the value and text of the clicked element
        clicked_value = option.val();
        clicked_text = option.text();
        clicked_class = option.attr('class');
        // add that option to the included fields
        container.find('.included').append($('<option>', {
            value: clicked_value,
            text: clicked_text,
            class: clicked_class
        }));
        // remove that option from the not included fields
        option.remove();
        // remove (none) from the included field
        container.find('.none_included').remove();
        // check if (none) should be added
        addNone(container.find('.not_included'));
        // clear all selections
        $('select[multiple]').val([]);
    });

    // when submitting to update
    $('input[name="commit"]').click(function(){
        // deselect all options in not included fields
        $('.not_included option').prop('selected', true);
        // select all options in included fields
        $('.included option').prop('selected', true);
    });

    // move options up when up arrow clicked
    $('.option-up').click(function(){
        var selected = $('select.included option:selected');
        if(selected.length){
            selected.first().prev().before(selected)
        }
    });

    // move options down when down arrow clicked
    $('.option-down').click(function(){
        var selected = $('select.included option:selected');
        if(selected.length){
            selected.last().next().after(selected);
        }
    });
});