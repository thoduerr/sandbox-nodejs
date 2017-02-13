$(function() {
    'use strict';

    let $form = $('form');
    let $file_content = $('#file_content');
    let $file_list = $('#file_list');

    $.get('/files', appendToList);

    $form.on('submit', function(event) {
        event.preventDefault();
        $form.find('#form_alert').remove();
        create($form, $form.serialize());
    });

    $file_list.on('click', '#file_name', function(event) {
        event.preventDefault();
        getContent($(this));
    });

    function getContent(file) {
        $.get(file.attr('href'), showContent);
    }

    function create(form, formdata) {
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

    function showContent(content) {
        $file_content.children('table').remove();

        let $table = $('<table class="table table-hover">');
        let $thead = $('<thead>');
        let $tbody = $('<tbody>');

        let headers = [];
        for (let property in content) {
            if (content.hasOwnProperty(property)) {
                headers.push($('<th>').text(property));
            }
        }
        $thead.append($('<tr>').append(headers));

        let rows = [];
        let cells = [];
        for (let property in content) {
            cells.push($('<td>').text(content[property]));
        }
        rows.push($('<tr>').append(cells));

        $tbody.append(rows)

        $table.append($thead);
        $table.append($tbody);

        $file_content.append($table);
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
            list.push($('<a id="file_name" class="list-group-item" href="/files/' + files[i] + '"></a>').text(files[i]));
        }
        $('#file_list').append(list);
    }

    window.addEventListener('DOMContentLoaded', function appDCL() {
        console.log('Hello World');
    });
}());
