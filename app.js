async function loadModule(moduleName) {
  const container = document.getElementById('app-container');
  container.innerHTML = '<p>Chargement...</p>'; // Loading state

  try {
    const response = await fetch(`modules/${moduleName}.html`);
    if (!response.ok) {
      throw new Error('Erreur de chargement');
    }
    const content = await response.text();
    container.innerHTML = content;
  } catch (error) {
    container.innerHTML = `<p style="color:red;">Erreur : ${error.message}</p>`;
  }
}

// Fonction pour afficher un toast
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = "show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000); // Disparait après 3s
}

window.onload = () => loadModule('create');
