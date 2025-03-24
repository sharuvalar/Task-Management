// Task Class to represent each task
class Task {
    constructor(name, description) {
      this.name = name;
      this.description = description;
      this.completed = false;
      this.createdAt = new Date();
    }
  }
  
  // DOM Elements
  const taskList = document.getElementById('taskList');
  const taskForm = document.getElementById('taskForm');
  const greetingMessage = document.getElementById('greetingMessage');
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  // Summary elements
  const totalTasksElement = document.getElementById('totalTasks');
  const completedTasksElement = document.getElementById('completedTasks');
  const pendingTasksElement = document.getElementById('pendingTasks');
  
  // Load tasks from localStorage or initialize empty array
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let currentFilter = 'all';
  
  // Initialize the application
  document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    updateSummary();
  });
  
  // Save tasks to localStorage
  function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateSummary();
  }
  
  // Update task summary
  function updateSummary() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    totalTasksElement.textContent = total;
    completedTasksElement.textContent = completed;
    pendingTasksElement.textContent = pending;
  }
  
  // Render tasks based on current filter
  function renderTasks() {
    taskList.innerHTML = '';
    
    // Filter tasks based on current selection
    let filteredTasks = tasks;
    if (currentFilter === 'pending') {
      filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
      filteredTasks = tasks.filter(task => task.completed);
    }
    
    // Display message if no tasks
    if (filteredTasks.length === 0) {
      const noTasksMsg = document.createElement('li');
      noTasksMsg.textContent = currentFilter === 'all' ? 'No tasks yet. Add one above!' : 
                           currentFilter === 'pending' ? 'No pending tasks!' : 'No completed tasks!';
      noTasksMsg.style.textAlign = 'center';
      noTasksMsg.style.padding = '20px';
      noTasksMsg.style.color = '#7f8c8d';
      taskList.appendChild(noTasksMsg);
      return;
    }
    
    // Render each task
    filteredTasks.forEach((task, index) => {
      const taskItem = document.createElement('li');
      taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
      
      taskItem.innerHTML = `
        <div class="task-content">
          <strong>${task.name}</strong>
          <p>${task.description || 'No description'}</p>
          <small>Created: ${new Date(task.createdAt).toLocaleString()}</small>
        </div>
        <div class="task-buttons">
          <button class="complete-btn" onclick="toggleTask(${index})">
            ${task.completed ? 'Undo' : 'Complete'}
          </button>
          <button class="edit-btn" onclick="editTask(${index})">Edit</button>
          <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
        </div>
      `;
      
      taskList.appendChild(taskItem);
    });
  }
  
  // Add a new task
  function addTask() {
    const taskName = document.getElementById('taskName').value.trim();
    const taskDesc = document.getElementById('taskDesc').value.trim();
  
    if (!taskName) {
      alert('Task name cannot be empty!');
      return;
    }
  
    tasks.push(new Task(taskName, taskDesc));
    updateLocalStorage();
    renderTasks();
    taskForm.reset();
    
    // Focus back on task name input
    document.getElementById('taskName').focus();
  }
  
  // Edit an existing task
  function editTask(index) {
    const task = tasks[index];
    const newName = prompt('Edit Task Name:', task.name);
    const newDesc = prompt('Edit Task Description:', task.description);
  
    if (newName !== null) task.name = newName.trim();
    if (newDesc !== null) task.description = newDesc.trim();
  
    updateLocalStorage();
    renderTasks();
  }
  
  // Delete a task
  function deleteTask(index) {
    if (confirm('Are you sure you want to delete this task?')) {
      tasks.splice(index, 1);
      updateLocalStorage();
      renderTasks();
    }
  }
  
  // Toggle task completion status
  function toggleTask(index) {
    const wasCompleted = tasks[index].completed;
    tasks[index].completed = !wasCompleted;
    updateLocalStorage();
    renderTasks();
    
    // Show greeting if task was marked as completed
    if (!wasCompleted) {
      showGreeting();
    }
  }
  
  // Show greeting message
  function showGreeting() {
    greetingMessage.style.display = 'block';
    
    // Hide after 2 seconds
    setTimeout(() => {
      greetingMessage.style.display = 'none';
    }, 2000);
  }
  
  // Filter tasks
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Set current filter and re-render
      currentFilter = button.dataset.filter;
      renderTasks();
    });
  });
  
  // Event listener for adding task
  document.getElementById('addTaskButton').addEventListener('click', addTask);
  
  // Allow adding task with Enter key
  document.getElementById('taskName').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTask();
    }
  });
  
  // Make functions available globally for onclick attributes
  window.toggleTask = toggleTask;
  window.editTask = editTask;
  window.deleteTask = deleteTask;