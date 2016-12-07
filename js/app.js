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
    var departments = document.getElementById('departments');
    departments.innerHTML = html;
}

function getDepartments() {
    var request = new XMLHttpRequest();
    request.open('GET', 'http://ebsexpress-env.us-west-2.elasticbeanstalk.com/users/departments/', true);

    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 400) {
                var departments = JSON.parse(request.responseText);
                updateDepartments(departments);
                updateDepartmentsOptions(departments)
            }
        }
    };
    request.send();
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
    var employees = document.getElementById('employees');
    employees.innerHTML = html;
}

function getEmployees(id) {


    var request = new XMLHttpRequest();
    request.open('GET', 'http://ebsexpress-env.us-west-2.elasticbeanstalk.com/users/employees');

    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 400) {
                var employees = JSON.parse(request.responseText);

                function idFilter(value) {
                    return value.departmentId == id;
                };

                var filtered = employees.filter(idFilter);
                updateEmployees(filtered);
            }
        }
    }
    request.send();
}

// -----------descriptions of employee----------

function renderEmployeesDescription(employees) {
    var obj = employees[0];
    var lis = '';
    for (var i in obj) {
        lis += '<li class="list-group-item">' + i + ' : ' + obj[i] + '</li>';
    }
    return lis;
}

function updateEmployeesDescription(employees) {
    var html = renderEmployeesDescription(employees);
    var descriptionEmployee = document.getElementById('description-employee');
    descriptionEmployee.innerHTML = html;
}

function getEmployeesDescription(id) {

    var request = new XMLHttpRequest();
    request.open('GET', 'http://ebsexpress-env.us-west-2.elasticbeanstalk.com/users/employees');

    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 400) {
                var employeeDescrp = JSON.parse(request.responseText);

                function idFilter(value) {
                    return value.id == id;
                };

                var filtered = employeeDescrp.filter(idFilter);
                updateEmployeesDescription(filtered);
            }
        }
    }
    request.send();
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
    var departmentOptions = document.getElementsByClassName('departmentOptions');
    departmentOptions[0].innerHTML = html;
}





document.addEventListener("DOMContentLoaded", function(event) {
    getDepartments();

    var departments = document.getElementById('departments');
    var departmentsLists = departments.getElementsByTagName('li');
    departments.addEventListener('click', function(e) {
        if (e.target && e.target.nodeName == 'LI') {
            var idDepartment = e.target.getAttribute('data-departmentId');
            var heading = document.getElementById('heading');
            heading.style.display = 'block';
            var departmentForm = document.getElementById('form-add');
            var employeeForm = document.getElementById('form-add-department');
            if (!departmentForm.classList.contains('form-add') || !employeeForm.classList.contains('form-add')) {
                document.getElementById('form-add-department').classList.add('form-add');
                document.getElementById('form-add').classList.add('form-add');

            }
            getEmployees(idDepartment);
        }
    });

    document.getElementById('employees').style.display = 'none';
    document.getElementById('description-employee').style.display = 'none';

    var end = null;

    document.getElementById('departments').addEventListener('click', function(e) {
        var listGroupLi = document.getElementsByTagName('li');
        var listGroupLiArray = [].slice.call(listGroupLi);

        if (e.target && e.target.nodeName == 'LI') {
        	if(!end) end = listGroupLiArray.indexOf(e.target);

            if (e.ctrlKey) {
                e.target.classList.toggle('active');
            } else if (e.shiftKey) {
                var start = listGroupLiArray.indexOf(e.target);
                var slicedArray = listGroupLiArray.slice(Math.min(start, end), Math.max(start, end) + 1);
                slicedArray.map(function(x) {
                    x.classList.add('active');
                });
            } else {
                if (!e.target.classList.contains('active')) {
                    end = listGroupLiArray.indexOf(e.target);
                    for (i = 0; i < listGroupLi.length; i++) {
                        listGroupLi[i].classList.remove('active');
                        e.target.classList.add('active');
                    }
                } else {
                    // end = listGroupLiArray.indexOf(e.target);
                    for (i = 0; i < listGroupLi.length; i++) {
                        listGroupLi[i].classList.remove('active');
                        e.target.classList.add('active');
                    }
                }
            }
        };
       end = listGroupLiArray.indexOf(e.target);

        document.getElementById('employees').style.display = 'block';
    });

    // Delete departments
    document.getElementById('delete-btn').addEventListener('click', function(e) {
        var activeId = document.getElementsByClassName('active');
        var activeIdArray = [];

        for (var i = 0; i < activeId.length; i++) {
            activeIdArray.push(activeId[i].getAttribute('data-departmentId'));
        }
        var conformation = confirm('Are you sure that you want to delete ' + activeIdArray.length + ' departments?');
        if (conformation) {
            for (var i = 0; i < activeIdArray.length; i++) {
                var request = new XMLHttpRequest();
                request.open('DELETE', 'http://ebsexpress-env.us-west-2.elasticbeanstalk.com/users/departments/' + activeIdArray[i] + '');
                request.onload = function() {
                    if (this.status >= 200 && this.status < 400) {
                        console.log(this.responseText);
                    } else {
                        console.error(error);
                        return;
                    }
                }
                request.send();
            }
            getDepartments();
        }

    });

    // toggle forms
    // --------------------------------------------------------------------

    document.getElementById('add-btn').addEventListener('click', function() {
        document.getElementById('form-add').classList.toggle('form-add');
        document.getElementById('form-add-department').classList.add('form-add');
        document.getElementById('employees').style.display = 'none';
        document.getElementById('heading').style.display = 'none';
    });

    document.getElementById('add-employee-btn').addEventListener('click', function() {
        document.getElementById('form-add-department').classList.toggle('form-add');
        document.getElementById('form-add').classList.add('form-add');
        document.getElementById('employees').style.display = 'none';
        document.getElementById('heading').style.display = 'none';
    });

    document.getElementById('employees').style.display = 'none';

    // ---------------------------------------------------------------------

    // ----------Add departments----------

    document.getElementById('form-add-department').addEventListener('submit', function(event) {
        event.preventDefault();
        var request = new XMLHttpRequest();

        var nameDepartmentVal = document.getElementsByClassName('name-department')[0].value;
        var descriptionVal = document.getElementsByClassName('description')[0].value;

        var newDepartment = JSON.stringify({
            name: nameDepartmentVal,
            description: descriptionVal
        });


        request.open('POST', 'http://ebsexpress-env.us-west-2.elasticbeanstalk.com/users/departments/');
        request.setRequestHeader('Content-type', 'application/json');

        request.send(newDepartment);
        getDepartments();
    });

    // -------------add employee---------------------------------

    document.getElementById('form-add').addEventListener('submit', function(event) {
        event.preventDefault();
        var request = new XMLHttpRequest();

        var firstNameVal = document.getElementsByClassName('firstName')[0].value,
            lastNameVal = document.getElementsByClassName('lastName')[0].value,
            phoneVal = document.getElementsByClassName('phone')[0].value,
            salaryVal = document.getElementsByClassName('salary')[0].value,
            departmentIdVal = document.getElementsByClassName('departmentOptions')[0].value;
        // departmentNameVal = document.getElementsByClassName('departmentName')[0].value;

        var newEmployee = JSON.stringify({
            firstName: firstNameVal,
            lastName: lastNameVal,
            phone: phoneVal,
            salary: salaryVal,
            departmentId: departmentIdVal
        });

        request.open('POST', 'http://ebsexpress-env.us-west-2.elasticbeanstalk.com/users/employees/');
        request.setRequestHeader('Content-type', 'application/json');
        request.send(newEmployee);

    });

    document.getElementById('employees').addEventListener('click', function(e) {
        if (e.target && e.target.nodeName == 'LI') {
            var idEmployee = e.target.getAttribute('data-id');
            document.getElementsByClassName('heading1')[0].style.display = 'block';
            document.getElementsByClassName('description-employee')[0].style.display = 'block';

            document.getElementById('departments').addEventListener('click', function() {
                document.getElementsByClassName('heading1')[0].style.display = 'none';
                document.getElementsByClassName('description-employee')[0].style.display = 'none';
            });
        }
        getEmployeesDescription(idEmployee);
    });


});
