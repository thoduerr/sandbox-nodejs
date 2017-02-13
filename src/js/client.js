$(function() {
    'use strict';

    let $form = $('form');

    $.get('/files', appendToList);

    $form.on('submit', create);

    function create(event) {
        $form.find('#form_alert').remove();
        event.preventDefault();
        let form = $(this);
        let formdata = form.serialize();

        $.ajax({
            type: 'PUT',
            url: '/files',
            data: formdata,
            success: function(response) {
                showFormAlert('success', '"' + response + '" created.');
                appendToList([response]);
                form.trigger('reset');
                removeFormAlert();
            },
            error: function(response) {
                showFormAlert('danger', '"' + JSON.parse(response.responseText) + '" already exists.');
                //form.trigger('reset');
            }
        });
    }

    function showFormAlert(type, message) {
        $form.prepend('<div id="form_alert" class="alert alert-' + type + '" role="alert"><span>' + message + '</span></div>');
    }

    function removeFormAlert() {
        $form.find('#form_alert').delay(5000).fadeOut(1000, function() {
            $(this).remove();
        });
    }

    function appendToList(files) {
        let list = [];
        for (let i in files) {
            list.push($('<a class="list-group-item" href="/files/' + files[i] + '"></a>').text(files[i]));
        }
        $('#file-list').append(list);
    }

    window.addEventListener('DOMContentLoaded', function appDCL() {
        console.log('Hello World');
    });
}());
