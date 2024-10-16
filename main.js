// Function to load lists from localStorage with error handling
function loadLists() {
    try {
        const storedLists = JSON.parse(localStorage.getItem('todolists')) || [];
        storedLists.forEach(list => createNewList(list.title, list.tasks, list.isArchived, false));
    } catch (error) {
        console.error('Error loading lists from localStorage:', error);
    }
}

// Function to save lists to localStorage
function saveLists() {
    const lists = [];
    document.querySelectorAll('.list').forEach(listDiv => {
        const title = listDiv.querySelector('.name').textContent;
        const tasks = [];
        const isArchived = listDiv.closest('.archived') ? true : false; // Check if the list is in the archived section
        listDiv.querySelectorAll('.list-group-item').forEach(item => {
            const label = item.querySelector('label').textContent;
            const isChecked = item.querySelector('input[type="checkbox"]').checked;
            tasks.push({ label, isChecked }); // Save task and its completion status
        });
        lists.push({ title, tasks, isArchived });
    });
    try {
        localStorage.setItem('todolists', JSON.stringify(lists));
    } catch (error) {
        console.error('Error saving lists to localStorage:', error);
        alert('Failed to save lists. Please try again.');
    }
}

// Function to create a new list
function createNewList(listTitle = '', tasks = [], isArchived = false, shouldPrompt = true) {
    // If no title is provided and prompting is allowed, ask the user for the title and first task
    if (!listTitle && shouldPrompt) {
        listTitle = prompt('Enter a name for your new list:');
        if (!listTitle) return; // Exit if title is empty
    }

    // Create a new div element for the list
    const newListDiv = document.createElement('div');
    newListDiv.classList.add('list', 'mb-3'); // Add classes for styling

    // Create the list name element
    const listName = document.createElement('div');
    listName.classList.add('name', 'fw-bold');
    listName.textContent = listTitle;

    // Function to enable editing the list name
    function enableListNameEditing() {
        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('form-control');
        input.value = listName.textContent;
        input.style.maxWidth = '200px'; // Optional: Set a max width for the input

        // Replace the list name with the input field
        newListDiv.replaceChild(input, listName);

        // Handle blur event to save changes
        input.addEventListener('blur', function () {
            const newTitle = input.value.trim();
            if (newTitle !== '') {
                listName.textContent = newTitle;
                newListDiv.replaceChild(listName, input); // Replace input back with the updated name
                saveLists(); // Save changes to localStorage
            } else {
                alert('List name cannot be empty.');
                input.focus(); // Keep focus if the input is empty
            }
        });

        // Handle Enter key for saving changes
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                input.blur();
            }
        });

        // Automatically focus on the input field for editing
        input.focus();
    }

    // Add event listener to the list name to allow editing on click
    listName.addEventListener('click', enableListNameEditing);

    // Create the ul element for tasks
    const listGroup = document.createElement('ul');
    listGroup.classList.add('list-group');

    // Function to check if all tasks are completed
    function checkAllTasksCompleted() {
        const allChecked = [...listGroup.querySelectorAll('.form-check-input')].every(checkbox => checkbox.checked);
        if (allChecked) {
            archiveList(newListDiv);  // Move the list to archive when all tasks are checked
        } else {
            unarchiveList(newListDiv); // Move back to active if at least one task is unchecked
        }
    }

    // Function to add a task to the list
    function addTask(task) {
        const { label: taskText, isChecked = false } = task;
        if (!taskText.trim()) return; 

        // Create a new list item
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

        const taskContent = document.createElement('div');

        const checkbox = document.createElement('input');
        checkbox.classList.add('form-check-input', 'me-1');
        checkbox.type = 'checkbox';
        checkbox.checked = isChecked;

        const label = document.createElement('label');
        label.classList.add('form-check-label');
        label.textContent = taskText;

        // Add an event listener to the checkbox to check for task completion
        checkbox.addEventListener('change', checkAllTasksCompleted);

        taskContent.appendChild(checkbox);
        taskContent.appendChild(label);

        // Settings button to toggle task delete/edit options
        const settingsBtn = document.createElement('button');
        settingsBtn.classList.add('btn', 'btn-secondary', 'btn-sm', 'ms-2');
        settingsBtn.textContent = '⚙';

        // Edit button, initially hidden
        const editTaskBtn = document.createElement('button');
        editTaskBtn.classList.add('btn', 'btn-warning', 'btn-sm', 'ms-2');
        editTaskBtn.textContent = 'Edit';
        editTaskBtn.style.display = 'none'; // Hide by default

        // Delete button, initially hidden
        const deleteTaskBtn = document.createElement('button');
        deleteTaskBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'ms-2');
        deleteTaskBtn.textContent = 'Delete';
        deleteTaskBtn.style.display = 'none'; // Hide by default

        // Show/hide the edit and delete buttons when settings is clicked
        settingsBtn.addEventListener('click', function () {
            const isVisible = editTaskBtn.style.display === 'inline-block';
            editTaskBtn.style.display = deleteTaskBtn.style.display = isVisible ? 'none' : 'inline-block';
        });

        // Add functionality to edit the task when edit button is clicked
        editTaskBtn.addEventListener('click', function () {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = label.textContent;
            input.classList.add('form-control', 'me-2');

            // Replace the label with the input field
            taskContent.replaceChild(input, label);

            // When input loses focus, save changes
            input.addEventListener('blur', function () {
                const newTaskText = input.value.trim();
                if (newTaskText !== '') {
                    label.textContent = newTaskText;  // Update the label with new value
                    taskContent.replaceChild(label, input);
                    saveLists();  // Save changes to localStorage
                } else {
                    alert('Task cannot be empty.');
                    input.focus(); // Keep focus if the input is empty
                }
            });

            // Handle Enter key for saving changes
            input.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    input.blur();
                }
            });

            // Focus the input field for immediate editing
            input.focus();
        });

        // Add functionality to delete the task when delete button is clicked
        deleteTaskBtn.addEventListener('click', function () {
            if (confirm('Are you sure you want to delete this task?')) {
                listItem.remove();  // Remove the specific task from the list
                saveLists();        // Update the saved lists
                checkAllTasksCompleted(); // Re-check if the list should be archived/unarchived
            }
        });

        // Append task content and buttons to list item
        listItem.appendChild(taskContent);
        listItem.appendChild(settingsBtn);
        listItem.appendChild(editTaskBtn);
        listItem.appendChild(deleteTaskBtn);

        // Add the task to the list group
        listGroup.appendChild(listItem);
    }

    // Add the provided tasks (or prompt the user for the first task)
    if (tasks.length === 0 && shouldPrompt) {
        const firstTask = prompt('Enter the first task for your new list:');
        if (firstTask) addTask({ label: firstTask });
    } else {
        tasks.forEach(task => addTask(task));
    }

    // Input field and button to add more tasks dynamically
    const taskInputDiv = document.createElement('div');
    taskInputDiv.classList.add('mb-3');

    const taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.classList.add('form-control');
    taskInput.placeholder = 'Add a task';

    const addTaskBtn = document.createElement('button');
    addTaskBtn.classList.add('btn', 'btn-primary', 'mt-2');
    addTaskBtn.textContent = 'Add Task';

    // Add task functionality when button is clicked (disabled for archived lists)
    addTaskBtn.addEventListener('click', function () {
        if (isArchived) {
            alert('You cannot add tasks to an archived list.');
            return;
        }

        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Task cannot be empty.');
            return;
        }
        addTask({ label: taskText });
        taskInput.value = ''; // Clear input after adding the task
        saveLists();          // Save the lists to localStorage
    });

    // Allow adding task by pressing Enter key
    taskInput.addEventListener('keydown', function(e) {
        if (!isArchived && e.key === 'Enter') {
            addTaskBtn.click();
        }
    });

    // Disable the task input and button for archived lists
    if (isArchived) {
        taskInput.disabled = true;
        addTaskBtn.disabled = true;
        taskInput.placeholder = 'Archived list - cannot add tasks';
    }

    // Create a delete button for the entire list
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn', 'btn-danger', 'mt-2');
    deleteBtn.textContent = 'Delete List';

    // Add functionality to delete the entire list when the button is clicked
    deleteBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to delete this list?')) {
            newListDiv.remove();  // Remove the entire list from the DOM
            saveLists();          // Update the saved lists
        }
    });

    // Append elements to the task input div
    taskInputDiv.appendChild(taskInput);
    taskInputDiv.appendChild(addTaskBtn);

    // Append the list name, task input, list group, and delete button to the new div
    newListDiv.appendChild(listName);
    newListDiv.appendChild(taskInputDiv);
    newListDiv.appendChild(listGroup);
    newListDiv.appendChild(deleteBtn);  // Add the delete button for the list

    // Append the new list div to the appropriate section (active or archive)
    if (isArchived) {
        document.querySelector('.archived').appendChild(newListDiv);
    } else {
        document.querySelector('.todolists').appendChild(newListDiv);
    }

    // Save the lists to localStorage
    saveLists();
}

// Function to move the list to the archive div
function archiveList(listDiv) {
    document.querySelector('.archived').appendChild(listDiv);
    // Disable the task input and button in the archived list
    const taskInput = listDiv.querySelector('input[type="text"]');
    const addTaskBtn = listDiv.querySelector('button.btn-primary');
    if (taskInput && addTaskBtn) {
        taskInput.disabled = true;
        addTaskBtn.disabled = true;
        taskInput.placeholder = 'Archived list - cannot add tasks';
    }
    saveLists();  // Update the saved state in localStorage
}

// Function to move the list back to the active section
function unarchiveList(listDiv) {
    document.querySelector('.todolists').appendChild(listDiv);
    // Enable the task input and button in the active list
    const taskInput = listDiv.querySelector('input[type="text"]');
    const addTaskBtn = listDiv.querySelector('button.btn-primary');
    if (taskInput && addTaskBtn) {
        taskInput.disabled = false;
        addTaskBtn.disabled = false;
        taskInput.placeholder = 'Add a task';
    }
    saveLists();  // Update the saved state in localStorage
}

// Event listener for the 'Create new list' button in dropdown
document.getElementById('createNewList').addEventListener('click', function (e) {
    e.preventDefault();  // Prevent default action
    createNewList();     // Call the function to create a new list
});

// Event listener for the '+' button next to the Active Lists title (if exists)
const createNewListButton = document.getElementById('createNewListButton');
if (createNewListButton) {
    createNewListButton.addEventListener('click', function (e) {
        e.preventDefault();  // Prevent default action
        createNewList();     // Call the function to create a new list
    });
}

// Load the saved lists from localStorage when the page loads
document.addEventListener('DOMContentLoaded', loadLists);
