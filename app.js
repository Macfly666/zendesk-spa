async function loadModule(moduleName) {
  const container = document.getElementById('app-container');
  container.innerHTML = '<p>Chargement...</p>'; // Loading

  try {
    const response = await fetch(`./modules/${moduleName}.html`);
    if (!response.ok) {
      throw new Error('Erreur de chargement');
    }
    const content = await response.text();
    container.innerHTML = content;

    initModuleJS(moduleName);

  } catch (error) {
    container.innerHTML = `<p style="color:red;">Erreur : ${error.message}</p>`;
  }
}

function initModuleJS(moduleName) {
  if (moduleName === 'mailing_vip') {
    if (typeof initializeQuill === 'function') {
      initializeQuill();
    }
  }
  // Ajoute d'autres init pour create/update si besoin plus tard
}

// Toast fonctionnel
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = "show";
  setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}
