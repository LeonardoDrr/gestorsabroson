// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, onSnapshot, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCKpkREkmXuuMKSrHIjMnWXcZRlNRhTCY4",
    authDomain: "gestor-de-tareas-d8b35.firebaseapp.com",
    projectId: "gestor-de-tareas-d8b35",
    storageBucket: "gestor-de-tareas-d8b35.firebasestorage.app",
    messagingSenderId: "736697027471",
    appId: "1:736697027471:web:ba03c48a2c5b6386d059fa"
};

// Initialize Firebase
let app, db;
const statusMessage = document.getElementById('status-message');

function showStatus(msg, type = 'info') {
    if (!statusMessage) return;
    statusMessage.textContent = msg;
    statusMessage.className = type;
    statusMessage.classList.remove('hidden');
    console.log(`[STATUS] ${msg}`);

    // Auto-hide success messages
    if (type === 'success') {
        setTimeout(() => statusMessage.classList.add('hidden'), 3000);
    }
}

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase Initialized");
} catch (e) {
    showStatus("Error iniciando Firebase: " + e.message, "error");
}

// State
const PROJECT_ID = "vanilla-project-v1";
let projectData = null;
let debounceTimer;

// DOM Elements
const screenWelcome = document.getElementById('welcome-screen');
const screenApp = document.getElementById('app');
const taskContainer = document.getElementById('task-container');
const projectTitle = document.getElementById('project-title');
const mainProgressBar = document.getElementById('main-progress-bar');
const mainProgressText = document.getElementById('main-progress-text');
const btnAddRoot = document.getElementById('btn-add-root');
const inputRootTask = document.getElementById('new-root-task');

// --- Helper Functions ---

function debounce(func, wait) {
    return function (...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), wait);
    };
}

function calculateProgress(task) {
    if (!task.subtasks || task.subtasks.length === 0) {
        return task.completed ? 100 : 0;
    }
    const total = task.subtasks.reduce((acc, t) => acc + calculateProgress(t), 0);
    return Math.round(total / task.subtasks.length);
}

function updateTaskInTree(tasks, taskId, updateFn) {
    return tasks.map(t => {
        if (t.id === taskId) {
            return updateFn(t);
        }
        if (t.subtasks && t.subtasks.length > 0) {
            return {
                ...t,
                subtasks: updateTaskInTree(t.subtasks, taskId, updateFn)
            };
        }
        return t;
    });
}

function deleteTaskInTree(tasks, taskId) {
    return tasks.filter(t => {
        if (t.id === taskId) return false;
        if (t.subtasks) {
            t.subtasks = deleteTaskInTree(t.subtasks, taskId);
        }
        return true;
    });
}

// --- Render Logic ---

function switchScreen(screenName) {
    if (screenWelcome && screenApp) {
        if (screenName === 'welcome') {
            screenWelcome.classList.remove('hidden');
            screenApp.classList.add('hidden');
        } else {
            screenWelcome.classList.add('hidden');
            screenApp.classList.remove('hidden');
        }
    }
}

function renderTree(renderingTasks = null) {
    const tasksToRender = renderingTasks || projectData.tasks;
    taskContainer.innerHTML = '';

    // Global Progress
    const totalProgress = tasksToRender.length > 0
        ? Math.round(tasksToRender.reduce((acc, t) => acc + calculateProgress(t), 0) / tasksToRender.length)
        : 0;

    mainProgressBar.style.width = `${totalProgress}%`;
    mainProgressText.textContent = `${totalProgress}%`;

    tasksToRender.forEach(task => {
        taskContainer.appendChild(createTaskElement(task));
    });
}

function createTaskElement(task) {
    const progress = calculateProgress(task);
    const hasSubtasks = task.subtasks && task.subtasks.length > 0;
    const isLeaf = !hasSubtasks;

    const el = document.createElement('div');
    el.className = 'task-item';

    el.innerHTML = `
        <div class="task-content ${task.completed && isLeaf ? 'completed' : ''}">
            <button class="btn-toggle ${hasSubtasks ? 'expanded' : 'hidden'}" data-id="${task.id}">
                <i class="ri-arrow-right-s-line"></i>
            </button>
            <button class="btn-check ${task.completed && isLeaf ? 'checked' : ''} ${!isLeaf ? 'disabled' : ''}" data-id="${task.id}">
                <i class="ri-check-line"></i>
            </button>
            <span class="task-title" contenteditable="true" spellcheck="false" data-id="${task.id}">${task.title}</span>
            ${!isLeaf ? `<span class="task-progress-text">${progress}%</span>` : ''}
            
            <div class="task-actions">
                <button class="action-btn btn-add" title="Agregar subtarea"><i class="ri-add-line"></i></button>
                <button class="action-btn btn-delete" title="Eliminar"><i class="ri-delete-bin-line"></i></button>
            </div>
        </div>
        ${!isLeaf ? `
            <div class="task-mini-progress">
                <div class="fill" style="width: ${progress}%"></div>
            </div>
        ` : ''}
        <div class="subtasks-container ${hasSubtasks ? 'open' : ''}" id="subtasks-${task.id}"></div>
    `;

    // Recursive render children
    const subContainer = el.querySelector(`#subtasks-${task.id}`);
    if (hasSubtasks) {
        task.subtasks.forEach(sub => subContainer.appendChild(createTaskElement(sub)));
    }

    // --- Interaction ---

    // Toggle Expand
    const toggleBtn = el.querySelector('.btn-toggle');
    if (hasSubtasks) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            subContainer.classList.toggle('open');
            toggleBtn.classList.toggle('expanded');
            toggleBtn.querySelector('i').className = subContainer.classList.contains('open')
                ? 'ri-arrow-down-s-line'
                : 'ri-arrow-right-s-line';
        });
        // Set initial icon
        toggleBtn.querySelector('i').className = 'ri-arrow-down-s-line';
    }

    // Add Subtask
    el.querySelector('.btn-add').addEventListener('click', () => {
        const title = prompt("Nombre de la subtarea:");
        if (title) {
            updateProjectState(tasks =>
                updateTaskInTree(tasks, task.id, t => ({
                    ...t,
                    subtasks: [...(t.subtasks || []), {
                        id: crypto.randomUUID(),
                        title,
                        completed: false,
                        subtasks: []
                    }]
                }))
            );
        }
    });

    // Delete
    el.querySelector('.btn-delete').addEventListener('click', () => {
        if (confirm(`¿Eliminar "${task.title}"?`)) {
            updateProjectState(tasks => deleteTaskInTree(tasks, task.id));
        }
    });

    // Check (Complete)
    if (isLeaf) {
        el.querySelector('.btn-check').addEventListener('click', () => {
            updateProjectState(tasks =>
                updateTaskInTree(tasks, task.id, t => ({ ...t, completed: !t.completed }))
            );
        });
    }

    // Live Edit (Debounced)
    const titleSpan = el.querySelector('.task-title');

    titleSpan.addEventListener('focus', () => titleSpan.dataset.editing = "true");
    titleSpan.addEventListener('blur', () => titleSpan.removeAttribute('data-editing'));

    titleSpan.addEventListener('input', debounce((e) => {
        const newTitle = e.target.textContent;
        if (newTitle !== task.title) {
            // Save directly avoiding full re-render loop conflict
            saveToFirestore(tasks => updateTaskInTree(tasks, task.id, t => ({ ...t, title: newTitle.trim() })));
        }
    }, 500));

    return el;
}

// wrapper to update state and UI immediately (optimistic), then save
function updateProjectState(updaterFn) {
    if (!projectData) return;
    const newTasks = updaterFn(projectData.tasks);
    projectData.tasks = newTasks;
    renderTree();
    saveToFirestore(() => newTasks);
}

async function saveToFirestore(tasksOrFn) {
    if (!projectData) return;
    const tasksToSave = typeof tasksOrFn === 'function' ? tasksOrFn(projectData.tasks) : tasksOrFn;

    try {
        await updateDoc(doc(db, "projects", PROJECT_ID), {
            tasks: tasksToSave
        });
        // Silent success or subtle indicator
    } catch (e) {
        console.error("Save error:", e);
        showStatus("Error guardando cambios. Revisa tu conexión.", "error");
    }
}

// --- Main Listener with Auto-Creation ---

console.log("Setting up snapshot listener...");
showStatus("Conectando con base de datos...", "info");

onSnapshot(doc(db, "projects", PROJECT_ID), (docSnap) => {
    if (docSnap.exists()) {
        const data = docSnap.data();
        projectData = data;

        // Update Title if not editing it
        if (document.activeElement !== projectTitle) {
            projectTitle.textContent = data.title;
        }

        renderTree();
        switchScreen('app');
        showStatus("Sincronizado", "success");
    } else {
        // --- AUTO-CREATE DEFAULT PROJECT ---
        console.log("No project found. Auto-creating default...");
        showStatus("Creando proyecto por defecto...", "info");

        const defaultProject = {
            title: "Mi Primer Proyecto",
            tasks: [
                {
                    id: crypto.randomUUID(),
                    title: "¡Bienvenido! Empieza aquí",
                    completed: false,
                    subtasks: [
                        { id: crypto.randomUUID(), title: "Edita este texto", completed: false, subtasks: [] },
                        { id: crypto.randomUUID(), title: "Agrega más tareas con Enter", completed: true, subtasks: [] }
                    ]
                }
            ]
        };

        setDoc(doc(db, "projects", PROJECT_ID), defaultProject)
            .then(() => console.log("Default project created"))
            .catch(e => showStatus("Error creando default: " + e.message, "error"));
    }
}, (error) => {
    console.error("Snapshot error:", error);
    showStatus("Error FATAL de conexión: " + error.message, "error");
});


// --- Global Listeners ---

// Add Root Task
inputRootTask.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const title = inputRootTask.value.trim();
        if (title) {
            updateProjectState(tasks => [...tasks, {
                id: crypto.randomUUID(),
                title,
                completed: false,
                subtasks: []
            }]);
            inputRootTask.value = '';
        }
    }
});

btnAddRoot.addEventListener('click', () => {
    const title = inputRootTask.value.trim();
    if (title) {
        updateProjectState(tasks => [...tasks, {
            id: crypto.randomUUID(),
            title,
            completed: false,
            subtasks: []
        }]);
        inputRootTask.value = '';
    }
});

// Project Title Live Edit
projectTitle.addEventListener('input', debounce((e) => {
    const newTitle = e.target.textContent.trim();
    updateDoc(doc(db, "projects", PROJECT_ID), { title: newTitle });
}, 800));
