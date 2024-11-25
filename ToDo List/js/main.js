// Liste des tâches initiales (ou récupérées depuis le localStorage)
let tasks = [
    { title: "Perfectionner les gestes techniques", priority: 3 },
    { title: "Améliorer la précision des frappes", priority: 2 },
    { title: "Marquer 1 but à 10 mètres", priority: 1 }
];

// Affiche les tâches dans le DOM
function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Efface la liste existante

    const ul = document.createElement('ul');

    // Tri des tâches par priorité
    tasks.sort((a, b) => a.priority - b.priority);

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `priority-${task.priority}`;
        li.innerHTML = `
            <label>
                <input type="checkbox" data-index="${index}">
                ${task.title}
            </label>
        `;
        ul.appendChild(li);
    });

    taskList.appendChild(ul);
}

// Afficher les feedbacks
function displayFeedback(message, type = 'success') {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
    feedback.style.display = 'block';

    setTimeout(() => {
        feedback.style.display = 'none';
    }, 3000);
}

// Ajouter une nouvelle tâche
function addTask(event) {
    event.preventDefault(); // Empêche la soumission du formulaire

    const title = document.getElementById('task-title').value.trim();
    const priority = document.getElementById('task-priority').value;

    if (!title) {
        displayFeedback("Veuillez saisir un nom de tâche !", 'error');
        return;
    }

    // Ajoute la tâche dans le tableau
    tasks.push({ title, priority: parseInt(priority, 10) });
    saveTasks(); // Sauvegarde dans le LocalStorage
    renderTasks(); // Actualise la liste
    document.getElementById('task-title').value = ''; // Réinitialise le champ
    displayFeedback("Tâche ajoutée avec succès !");
}

// Supprime les tâches sélectionnées
function deleteSelectedTasks() {
    const checkboxes = document.querySelectorAll('#task-list input[type="checkbox"]');

    // Filtrage des tâches qui ne sont pas sélectionnées
    const remainingTasks = tasks.filter((_, index) => !checkboxes[index].checked);

    const deletedCount = tasks.length - remainingTasks.length;

    if (deletedCount > 0) {
        tasks = remainingTasks; // Met à jour la liste des tâches
        saveTasks(); // Sauvegarde la nouvelle liste
        renderTasks(); // Actualise l'affichage
        showNotification(`${deletedCount} tâche(s) supprimée(s) avec succès !`); // Affiche une notification
    } else {
        displayFeedback("Aucune tâche sélectionnée.", 'error');
    }
}



// Fonction pour afficher une notification temporaire
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');

    // Masquer la notification après 3 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');

        // Retire complètement l'élément après la transition
        setTimeout(() => notification.classList.remove('hide'), 300);
    }, 3000);
}

// Sauvegarde les tâches dans le LocalStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Charge les tâches depuis le LocalStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks); // Charge les tâches stockées
    }
}

// Initialisation de la page
document.addEventListener('DOMContentLoaded', () => {
    loadTasks(); // Charge les tâches depuis le LocalStorage
    renderTasks(); // Affiche les tâches

    // Ajout des gestionnaires d'événements
    document.getElementById('add-task').addEventListener('click', addTask);
    document.getElementById('delete-tasks').addEventListener('click', deleteSelectedTasks);
});
