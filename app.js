async function loadModule(moduleName) {
  const container = document.getElementById('app-container');
  container.innerHTML = '<p>Chargement...</p>';

  try {
    const response = await fetch(`./modules/${moduleName}.html`);
    if (!response.ok) {
      throw new Error('Erreur de chargement');
    }
    const content = await response.text();
    container.innerHTML = content;

    initModuleJS(moduleName); // Init JS listeners

  } catch (error) {
    container.innerHTML = `<p style="color:red;">Erreur : ${error.message}</p>`;
  }
}

function initModuleJS(moduleName) {
  if (moduleName === 'create') {
    const form = document.getElementById('createForm');
    if (form) {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log("Submit triggered (create)");

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
  }

  if (moduleName === 'update') {
    const form = document.getElementById('updateForm');
    if (form) {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log("Submit triggered (update)");

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
  }

  if (moduleName === 'mailing') {
    const form = document.getElementById('mailingForm');
    if (form) {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log("Submit triggered (mailing)");

        if (!confirm("Confirmez-vous l'ajout de ce contact à la liste mailing ?")) {
          return;
        }

        const body = {
          compte: document.getElementById('compte').value,
          contact: document.getElementById('contact').value,
          email: document.getElementById('email_contact').value,
          type: document.getElementById('type_contact').value
        };

        try {
          const response = await fetch('https://n8n.ubiflow.net/webhook-test/mailing_list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          if (response.ok) {
            showToast("✅ Contact ajouté avec succès !");
            e.target.reset();
          } else {
            showToast("❌ Erreur : " + await response.text());
          }
        } catch (err) {
          showToast("❌ Problème de connexion.");
        }
      });
    }
  }

  if (moduleName === 'mailing_vip') {
    const formVip = document.getElementById('mailingVipForm');
    if (formVip) {
      formVip.addEventListener('submit', async function (e) {
        e.preventDefault();
        console.log("Submit triggered (mailing VIP)");

        if (!confirm("Confirmez-vous l'envoi du mailing VIP ?")) {
          return;
        }

        const body = {
          sujet: document.getElementById('subject').value,
          contenu: document.getElementById('content').value,
          audience: document.getElementById('audience').value
        };

        try {
          const response = await fetch('https://n8n.ubiflow.net/webhook-test/mailing_vip', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          if (response.ok) {
            showToast("✅ Mailing VIP envoyé avec succès !");
            e.target.reset();
          } else {
            showToast("❌ Erreur : " + await response.text());
          }
        } catch (err) {
          showToast("❌ Problème de connexion.");
        }
      });
    }
  }
}
