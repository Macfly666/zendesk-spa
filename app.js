let quill; // Variable globale pour l'éditeur Quill

// Fonction pour charger dynamiquement un module HTML
async function loadModule(moduleName) {
  const container = document.getElementById('app-container');
  container.innerHTML = '<p>Chargement...</p>'; // Affichage pendant le chargement

  try {
    const response = await fetch(`./modules/${moduleName}.html`);
    if (!response.ok) {
      throw new Error('Erreur de chargement du module');
    }
    const content = await response.text();
    container.innerHTML = content;

    initModuleJS(moduleName); // Initialisation spécifique après chargement

  } catch (error) {
    container.innerHTML = `<p style="color:red;">Erreur : ${error.message}</p>`;
  }
}

// Initialisation des modules en fonction de leur nom
function initModuleJS(moduleName) {
  if (moduleName === 'mailing_vip') {
    initializeQuill();
    attachMailingVipForm();
  } else if (moduleName === 'create') {
    attachCreateForm();
  } else if (moduleName === 'update') {
    attachUpdateForm();
  }
  // Module 'mailing' n'a pas de JS à initier (juste lien GSheet)
}

// Initialisation de l'éditeur Quill
function initializeQuill() {
  quill = new Quill('#editor-container', {
    theme: 'snow',
    placeholder: 'Rédigez votre message...',
    modules: {
      toolbar: [
        ['bold', 'italic'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link'],
        ['clean']
      ]
    }
  });
}

// Mailing VIP - Formulaire
function attachMailingVipForm() {
  const form = document.getElementById('mailingVipForm');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!confirm("Confirmez-vous l'envoi du mailing VIP ?")) {
      return;
    }

    // Met à jour le champ hidden avec le contenu Quill
    document.getElementById('content').value = quill.root.innerHTML;

    const selectedOptions = Array.from(document.getElementById('audience').selectedOptions).map(option => option.value);

    const body = {
      sujet: document.getElementById('subject').value,
      contenu: document.getElementById('content').value,
      audience: selectedOptions
    };

    try {
      const response = await fetch('https://n8n.ubiflow.net/webhook-test/mailing_vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        showToast("✅ Mailing VIP envoyé avec succès !");
        form.reset();
        quill.setContents([]); // Vide l'éditeur après succès
      } else {
        showToast("❌ Erreur : " + await response.text());
      }
    } catch (err) {
      showToast("❌ Problème de connexion.");
    }
  });
}

// Créer une organisation - Formulaire
function attachCreateForm() {
  const form = document.getElementById('createForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    // Ton code JS pour soumettre les données création ici
    showToast("✅ Organisation créée avec succès !");
  });
}

// Mettre à jour une organisation - Formulaire
function attachUpdateForm() {
  const form = document.getElementById('updateForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    // Ton code JS pour soumettre les données update ici
    showToast("✅ Organisation mise à jour avec succès !");
  });
}

// Gestion des toasts de notification
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = "show"; // Affiche le toast
  setTimeout(() => {
    toast.className = toast.className.replace("show", ""); // Cache après 3s
  }, 3000);
}
