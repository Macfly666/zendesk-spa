let quill; // Variable globale pour Quill

async function loadModule(moduleName) {
  const container = document.getElementById('app-container');
  container.innerHTML = '<p>Chargement...</p>';

  try {
    const response = await fetch(`./modules/${moduleName}.html`);
    if (!response.ok) {
      throw new Error('Erreur de chargement du module');
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
    initializeQuill();
    attachMailingVipForm();
  } else if (moduleName === 'create') {
    attachCreateForm();
  } else if (moduleName === 'update') {
    attachUpdateForm();
  }
}

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

function attachMailingVipForm() {
  const form = document.getElementById('mailingVipForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    Swal.fire({
      title: 'Confirmer l\'envoi ?',
      text: "Voulez-vous vraiment envoyer ce mailing VIP ?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#255662',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, envoyer',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        document.getElementById('content').value = quill.root.innerHTML;

        const selectedOptions = Array.from(document.getElementById('audience').selectedOptions).map(option => option.value);

        const body = {
          sujet: document.getElementById('subject').value,
          contenu: document.getElementById('content').value,
          audience: selectedOptions
        };

        try {
          const response = await fetch('https://n8n.ubiflow.net/webhook/mailing_vip', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          if (response.ok) {
            showToast("✅ Mailing VIP envoyé avec succès !");
            form.reset();
            quill.setContents([]);
          } else {
            showToast("❌ Erreur : " + await response.text());
          }
        } catch (err) {
          showToast("❌ Problème de connexion.");
        }
      }
    });
  });
}

function attachCreateForm() {
  const form = document.getElementById('createForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const body = {
      name: document.getElementById('name').value,
      domain_names: document.getElementById('domain').value ? [document.getElementById('domain').value] : [],
      organization_fields: {
        email: document.getElementById('email').value,
        telephone: document.getElementById('telephone').value,
        code_societe: document.getElementById('code_societe').value,
        univers: document.getElementById('univers').value,
        fiche_technique: document.getElementById('fiche_technique').value,
        fiche_sugar: document.getElementById('fiche_sugar').value,
        adresse: document.getElementById('adresse').value
      }
    };

    try {
      const response = await fetch('https://n8n.ubiflow.net/webhook/create-org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        showToast("✅ Organisation créée avec succès !");
        e.target.reset();
      } else {
        showToast("❌ Erreur : " + await response.text());
      }
    } catch (err) {
      showToast("❌ Problème de connexion.");
    }
  });
}

function attachUpdateForm() {
  const form = document.getElementById('updateForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const orgId = document.getElementById('org_id').value;
    const body = {
      name: document.getElementById('up_name').value,
      domain_names: document.getElementById('up_domain').value ? [document.getElementById('up_domain').value] : [],
      organization_fields: {
        email: document.getElementById('up_email').value,
        telephone: document.getElementById('up_telephone').value,
        code_societe: document.getElementById('up_code_societe').value,
        univers: document.getElementById('up_univers').value,
        fiche_technique: document.getElementById('up_fiche_technique').value,
        fiche_sugar: document.getElementById('up_fiche_sugar').value,
        adresse: document.getElementById('up_adresse').value
      }
    };

    try {
      const response = await fetch(`https://n8n.ubiflow.net/webhook/update-org?id=${orgId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        showToast("✅ Organisation mise à jour avec succès !");
        e.target.reset();
      } else {
        showToast("❌ Erreur : " + await response.text());
      }
    } catch (err) {
      showToast("❌ Problème de connexion.");
    }
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = "show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}
