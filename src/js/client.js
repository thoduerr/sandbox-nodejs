$(function() {
    'use strict';

    $.get('/files', appendToList);

    $('form').on('submit', function(event) {
        event.preventDefault();
        let form = $(this);
        let data = form.serialize();
        !
        $.ajax({
            type: 'PUT',
            url: '/files',
            data: data
        }).done(function(name) {
            appendToList([name]);
            form.trigger('reset');
        });
    });

    function appendToList(files) {
        let list = [];
        for (let i in files) {
            list.push($('<li>', {
                text: files[i]
            }));
        }
        $('.file-list').append(list);
    }

    window.addEventListener('DOMContentLoaded', function appDCL() {
        console.log('Hello World');
    });
}());
