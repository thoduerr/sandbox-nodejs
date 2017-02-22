$(init);

function init() {
    'use strict';

    ///////////////////////////////////////////
    // Cache static selectors
    ///////////////////////////////////////////
    let $form = $('#file_add');
    let $file_content = $('#file_content');
    let $file_list = $('#file_list');

    ///////////////////////////////////////////
    // handle events
    ///////////////////////////////////////////
    function onSubmitForm(event) {
        event.preventDefault();
        $form.find('#form_alert').remove();
        createFile($form);
    }

    function onClickFileName(event) {
        event.preventDefault();
        getFileContent($(this), renderFileContent);
    }

    function onClickFileContentCell() {
        if ($(this).has('input').length) {
            // ignore if same cell
            return;
        }

        renderInput($(this));
    }

    function onFocusoutKeydownInput(event) {
        if (event.type === 'keydown' && event.keyCode !== 13) {
            // do nothing
            return;
        }
        // focus out or enter pressed
        updateFileContent($(this), renderFileContent);
    }

    ///////////////////////////////////////////
    // Subscribe event listeners
    ///////////////////////////////////////////
    $form.on('submit', onSubmitForm);
    $file_list.on('click', '#file_name', onClickFileName);
    $file_content.on('click', 'td', onClickFileContentCell);
    $file_content.on('focusout keydown', 'input', onFocusoutKeydownInput);

    ///////////////////////////////////////////
    // Execute when loaded
    ///////////////////////////////////////////
    getAllFileNames(renderFileList);


    ///////////////////////////////////////////
    // REST API client functions
    ///////////////////////////////////////////
    function getAllFileNames(render) {
        $.get('/files', render);
    }

    function getFileContent(file_name, render) {
        $.get(file_name.attr('href'), render);
    }

    function createFile(form) {
        $.ajax({
            type: 'PUT',
            url: '/files',
            data: $form.serialize(),
            success: function(response) {
                renderFormAlert('success', '"' + response + '" created.');
                renderFileList([response]);
                form.trigger('reset');
                removeFormAlert();
            },
            error: function(response) {
                renderFormAlert('danger', '"' + JSON.parse(response.responseText) + '" already exists.');
                //form.trigger('reset');
            }
        });
    }

    function updateFileContent(input, render) {
        let value = input[0].value;
        if (value === input.attr('placeholder')) {
            // nothing to do
            return;
        }

        let id = input.parent().attr('id').split('_');
        let name = id[0];
        let property_name = id[1];

        let property = {};
        property[property_name] = value;

        let properties = [];
        properties.push(property);

        $.ajax({
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            url: '/files/' + name,
            data: JSON.stringify(properties),
            dataType: 'json',
            success: function(response) {
                render(response);
            },
            error: function(response) {
                console.log('error: ' + response);
            }
        });
    }


    ///////////////////////////////////////////
    // Render functions
    ///////////////////////////////////////////
    function renderFileContent(content) {
        removeFileContent();

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

        $tbody.append(renderRows([content]));

        $table.append($thead);
        $table.append($tbody);

        $file_content.append($table);
    }

    function renderRows(contents) {
        let rows = [];
        for (let i in contents) {
            rows.push($('<tr id="' + contents[i].name + '">').append(renderCellContent(contents[i])));
        }
        return rows;
    }

    function renderCellContent(content) {
        let cells = [];
        for (let property in content) {
            cells.push($('<td id="' + content.name + '_' + property + '">').text(content[property]));
        }
        return cells;
    }

    function removeFileContent() {
        $file_content.children('table').remove();
    }

    function renderFormAlert(type, message) {
        $form.prepend('<div id="form_alert" class="alert alert-' + type + '" role="alert"><span>' + message + '</span></div>');
    }

    function removeFormAlert() {
        $form.find('#form_alert').delay(5000).fadeOut(1000, function() {
            $(this).remove();
        });
    }

    function renderFileList(files) {
        let list = [];
        for (let i in files) {
            list.push($('<a id="file_name" class="list-group-item" href="/files/' + files[i] + '"></a>').text(files[i]));
        }
        $('#file_list').append(list);
    }

    function renderInput(cell) {
        rerenderCell(cell);

        //let value = cell.text().encode();
        let value = cell.text();
        cell.text('');
        cell.append('<input class="form-control" type="text" name="name" value="' + value + '" placeholder="' + value + '"required>');
    }

    function rerenderCell(cell) {
        cell.siblings().each(function() {
            $(this).children('input').each(function() {
                $(this).parent().text($(this)[0].value);
            });
            $(this).children('input').remove();
        });
    }
}
