$(function() {
    'use strict';

    $.get('/files', appendToList);

    $('form').on('submit', function(event) {
        $('div#alert').remove();
        event.preventDefault();
        let form = $(this);
        let formdata = form.serialize();

        $.ajax({
            type: 'PUT',
            url: '/files',
            data: formdata,
            success: function(response) {
                $('form').prepend('<div id="alert" class="alert alert-success" role="alert"><span>"' + response + '" created</span></div>');
                appendToList([response]);
                form.trigger('reset');
            },
            error: function(response) {
                $('form').prepend('<div id="alert" class="alert alert-danger" role="alert"><span>"' + JSON.parse(response.responseText) + '" already exist</span></div>');
                //form.trigger('reset');
            }
        });
    });

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
