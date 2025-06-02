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
    container.innerHTML = `<p style="color:red;">Erreur lors du chargement du module : ${error.message}</p>`;
  }
}

window.onload = () => loadModule('create');