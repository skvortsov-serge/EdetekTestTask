// Department Logic
function renderDepartments(departments) {
    var lis = '';
    for (var i = 0; i < departments.length; i++) {
        lis += '<li class="list-group-item" data-departmentId="' + departments[i].id + '">' + departments[i].name + '</li>';
    }
    return lis;
}


function updateDepartments(array) {
    var html = renderDepartments(array);
    $('#departments').html(html);
}

function getDepartments() {
    $.get('http://ebsexpress-env.us-west-2.elasticbeanstalk.com/users/departments/').done(function(response) {
        var departments = JSON.parse(response);
        updateDepartments(departments);
        updateDepartmentsOptions(departments)
    });
}

// Employees
function renderEmployees(employees) {
    var lis = '';
    for (var i = 0; i < employees.length; i++) {
        lis += '<li class="list-group-item" data-id="' + employees[i].id + '">' + employees[i].firstName + '</li>';
    }
    return lis;
}

function updateEmployees(employees) {
    var html = renderEmployees(employees);
    $('#employees').html(html);
}

function getEmployees(id) {

    $.ajax({
            type: "GET",
            url: "http://ebsexpress-env.us-west-2.elasticbeanstalk.com/users/employees",
            dataType: "json"
        })
        .done(function(response) {
            function idFilter(value) {
                return value.departmentId == id;
            };

            var filtered = response.filter(idFilter);
            updateEmployees(filtered);
        });

}

// -----------descriptions of employee----------

function renderEmployeesDescription(employees) {
    var obj = employees[0];
    // var objLength = Object.keys(obj).length;
    // console.log(employees[0]);
    var lis = '';
    for (var i in obj) {
        lis += '<li class="list-group-item">' + i + ' : ' + obj[i] + '</li>';
    }
    return lis;
}

function updateEmployeesDescription(employees) {
    var html = renderEmployeesDescription(employees);
    $('#description-employee').html(html);
}

function getEmployeesDescription(id) {

    $.ajax({
            type: "GET",
            url: "http://ebsexpress-env.us-west-2.elasticbeanstalk.com/users/employees",
            dataType: "json"
        })
        .done(function(response) {
            function idFilter(value) {
                return value.id == id;
            };

            var filtered = response.filter(idFilter);
            updateEmployeesDescription(filtered);
        });

}




function renderDepartmentsOptions(departments) {
    var options = '';
    for (var i = 0; i < departments.length; i++) {
        options += '<option value="' + departments[i].id + '">' + departments[i].name + '</option>';
    }
    return options;
}

function updateDepartmentsOptions(departments) {
    var html = renderDepartmentsOptions(departments);
    $('.departmentOptions').html(html);
}




$(document).ready(function() {

    getDepartments();

    $('#departments').on('click', '.list-group-item', function() {
        var idDepartment = $(this).data('departmentid');
        $('.heading').show();
        getEmployees(idDepartment);

    });

    $('.list-group-item').hide();

    $('#departments, #employees').on('click', '.list-group-item', function() {
        $('ul li').removeClass('active');
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
        }
    });

    // Delete departments
    $('#delete-btn').on('click', function() {
        var activeId = $('.active').data('departmentid');

        $.ajax({
            url: 'http://ebsexpress-env.us-west-2.elasticbeanstalk.com/users/departments/' + activeId + '',
            type: 'DELETE',
            success: function(res) {
                console.log(res);
            },
            error: function(error) {
                console.error(error);
            }
        });
        getDepartments();
    });


    // toggle forms
    // --------------------------------------------------------------------
    $('#add-btn').on('click', function() {
        $('.form-add').toggle();
        $('.emloyees-list').toggle();
        $('.form-add-department').hide();
    });


    $('#add-employee-btn').on('click', function() {
        $('.form-add-department').toggle();
        $('.emloyees-list').toggle();
        $('.form-add').hide();
    });

    // ---------------------------------------------------------------------

    // ----------Add departments----------

    $('.form-add-department').on('submit', function(event) {
        event.preventDefault();
        var nameDepartmentVal = $('.name-department').val(),
            descriptionVal = $('.description').val();

        var newDepartment = {
            name: nameDepartmentVal,
            description: descriptionVal
        };

        $.ajax({
            type: 'POST',
            url: 'http://ebsexpress-env.us-west-2.elasticbeanstalk.com/users/departments/',
            data: newDepartment,
            dataType: 'JSON',
            success: function(res) {
                console.log(res);
            },
            error: function(error) {
                console.error(error);
            }
        });
        getDepartments();
    });

    // -------------add employee---------------------------------

    $('.form-add').on('submit', function(event) {
        event.preventDefault();
        var firstNameVal = $('.firstName').val(),
            lastNameVal = $('.lastName').val(),
            phoneVal = $('.phone').val(),
            salaryVal = $('.salary').val(),
            departmentIdVal = $('.departmentOptions').val(),
            departmentNameVal = $('.departmentName').val();

        var newEmployee = {
            firstName: firstNameVal,
            lastName: lastNameVal,
            phone: phoneVal,
            salary: salaryVal,
            departmentId: departmentIdVal
        };
        console.log(newEmployee);

        $.ajax({
            type: 'POST',
            url: 'http://ebsexpress-env.us-west-2.elasticbeanstalk.com/users/employees/',
            data: newEmployee,
            dataType: 'JSON',
            success: function(res) {
                console.log(res);
            },
            error: function(error) {
                console.error(error);
            }
        });
    });

    $('#employees').on('click', '.list-group-item', function() {
        var idEmployee = $(this).data('id');
        $('.heading1, .description-employee').show();

        $('#departments').on('click', '.list-group-item', function() {
            $('.heading1, .description-employee').hide();
        });
        getEmployeesDescription(idEmployee);
    });
});
