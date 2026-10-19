(() => {
  "use strict";

  const STORAGE_KEY = "equipcontrol-equipments-v1";
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const form = $("#equipmentForm");
  const dialog = $("#deleteDialog");
  let equipment = loadEquipment();
  let pendingDeleteId = null;
  let toastTimer = null;

  function loadEquipment() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Não foi possível ler os dados salvos:", error);
      return [];
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(equipment));
      return true;
    } catch (error) {
      console.error("Não foi possível salvar os dados:", error);
      showToast("Não foi possível salvar. Verifique o espaço disponível no navegador.");
      return false;
    }
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function dateLabel(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("pt-BR").format(date);
  }

  function nowISO() {
    return new Date().toISOString();
  }

  function statusClass(status) {
    if (status === "Disponível") return "available";
    if (status === "Emprestado") return "loaned";
    return "maintenance";
  }

  function categoryIcon(category) {
    const icons = {
      "Notebook": "▱", "Computador": "▣", "Monitor": "▤", "Impressora": "▧",
      "Teclado": "⌨", "Mouse": "⌁", "Rede": "⌘", "Outro": "⚙"
    };
    return icons[category] || "▣";
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  function showSection(id) {
    const target = document.getElementById(id);
    if (!target) return;
    $$(".section").forEach(section => section.classList.toggle("hidden", section.id !== id));
    $$(".nav-link").forEach(link => link.classList.toggle("active", link.dataset.section === id));
    if (id === "equipamentos") renderTable();
    if (id === "painel") renderDashboard();
    window.location.hash = id;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToForm(id = null) {
    form.reset();
    $("#equipmentId").value = "";
    $("#formTitle").textContent = "Cadastrar equipamento";
    $("#saveBtn").textContent = "Salvar equipamento";
    if (id) {
      const item = equipment.find(entry => entry.id === id);
      if (!item) return;
      $("#equipmentId").value = item.id;
      $("#name").value = item.name;
      $("#assetTag").value = item.assetTag;
      $("#category").value = item.category;
      $("#brand").value = item.brand || "";
      $("#model").value = item.model || "";
      $("#condition").value = item.condition || "Bom";
      $("#status").value = item.status;
      $("#location").value = item.location || "";
      $("#notes").value = item.notes || "";
      $("#formTitle").textContent = "Editar equipamento";
      $("#saveBtn").textContent = "Salvar alterações";
    }
    showSection("cadastro");
    $("#name").focus();
  }

  function renderDashboard() {
    $("#totalCount").textContent = equipment.length;
    $("#availableCount").textContent = equipment.filter(item => item.status === "Disponível").length;
    $("#loanedCount").textContent = equipment.filter(item => item.status === "Emprestado").length;
    $("#maintenanceCount").textContent = equipment.filter(item => item.status === "Em manutenção").length;

    const recent = [...equipment].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);
    const container = $("#recentEquipment");
    if (!recent.length) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon" aria-hidden="true">▣</div><h3>Seu inventário começa aqui</h3><p>Cadastre o primeiro equipamento para acompanhar sua situação.</p><button class="button button-primary" id="firstAddBtn" type="button">＋ Cadastrar equipamento</button></div>`;
      $("#firstAddBtn").addEventListener("click", () => goToForm());
      return;
    }
    container.innerHTML = recent.map(item => `
      <div class="recent-item">
        <div class="device-icon" aria-hidden="true">${categoryIcon(item.category)}</div>
        <div class="recent-info"><strong>${escapeHTML(item.name)}</strong><span>${escapeHTML(item.assetTag)} · ${escapeHTML(item.category)}</span></div>
        <span class="badge ${statusClass(item.status)}">${escapeHTML(item.status)}</span>
      </div>`).join("");
  }

  function getFilteredEquipment() {
    const term = $("#searchInput").value.trim().toLocaleLowerCase("pt-BR");
    const status = $("#statusFilter").value;
    return [...equipment]
      .filter(item => !status || item.status === status)
      .filter(item => !term || [item.name, item.assetTag, item.category, item.brand, item.model, item.location]
        .some(value => String(value || "").toLocaleLowerCase("pt-BR").includes(term)))
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }

  function renderTable() {
    const items = getFilteredEquipment();
    $("#equipmentTableBody").innerHTML = items.map(item => `
      <tr>
        <td><div class="equipment-name"><span class="device-icon" aria-hidden="true">${categoryIcon(item.category)}</span><span><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.brand || "Marca não informada")}${item.model ? " · " + escapeHTML(item.model) : ""}</small></span></div></td>
        <td>${escapeHTML(item.assetTag)}</td>
        <td>${escapeHTML(item.category)}</td>
        <td><span class="badge ${statusClass(item.status)}">${escapeHTML(item.status)}</span></td>
        <td>${dateLabel(item.updatedAt)}</td>
        <td><div class="actions"><button class="icon-button" type="button" data-action="edit" data-id="${escapeHTML(item.id)}" aria-label="Editar ${escapeHTML(item.name)}" title="Editar">✎</button><button class="icon-button delete" type="button" data-action="delete" data-id="${escapeHTML(item.id)}" aria-label="Excluir ${escapeHTML(item.name)}" title="Excluir">×</button></div></td>
      </tr>`).join("");
    $("#emptyState").classList.toggle("hidden", items.length !== 0);
    $(".table-wrap").classList.toggle("hidden", items.length === 0);
    $("#resultCount").textContent = `${items.length} ${items.length === 1 ? "registro" : "registros"}`;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const id = $("#equipmentId").value;
    const assetTag = $("#assetTag").value.trim();
    const duplicate = equipment.some(item => item.assetTag.toLocaleLowerCase("pt-BR") === assetTag.toLocaleLowerCase("pt-BR") && item.id !== id);
    if (duplicate) {
      $("#assetTag").setCustomValidity("Este número de patrimônio já está cadastrado.");
      $("#assetTag").reportValidity();
      $("#assetTag").setCustomValidity("");
      return;
    }

    const oldItem = equipment.find(item => item.id === id);
    const item = {
      id: id || (window.crypto && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`),
      name: $("#name").value.trim(),
      assetTag,
      category: $("#category").value,
      brand: $("#brand").value.trim(),
      model: $("#model").value.trim(),
      condition: $("#condition").value,
      status: $("#status").value,
      location: $("#location").value.trim(),
      notes: $("#notes").value.trim(),
      createdAt: oldItem ? oldItem.createdAt : nowISO(),
      updatedAt: nowISO()
    };
    if (oldItem) {
      equipment = equipment.map(entry => entry.id === id ? item : entry);
    } else {
      equipment.push(item);
    }
    if (!persist()) return;
    renderDashboard();
    renderTable();
    showSection("equipamentos");
    showToast(oldItem ? "Equipamento atualizado com sucesso!" : "Equipamento cadastrado com sucesso!");
  });

  $("#equipmentTableBody").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const { action, id } = button.dataset;
    if (action === "edit") goToForm(id);
    if (action === "delete") {
      const item = equipment.find(entry => entry.id === id);
      if (!item) return;
      pendingDeleteId = id;
      $("#deleteMessage").textContent = `O equipamento "${item.name}" (${item.assetTag}) será removido do inventário. Esta ação não pode ser desfeita.`;
      if (typeof dialog.showModal === "function") dialog.showModal();
      else if (window.confirm($("#deleteMessage").textContent)) deleteEquipment();
    }
  });

  function deleteEquipment() {
    if (!pendingDeleteId) return;
    equipment = equipment.filter(item => item.id !== pendingDeleteId);
    if (persist()) {
      renderDashboard();
      renderTable();
      showToast("Equipamento excluído.");
    }
    pendingDeleteId = null;
    if (dialog.open) dialog.close();
  }

  $("#confirmDeleteBtn").addEventListener("click", deleteEquipment);
  $("#cancelDeleteBtn").addEventListener("click", () => { pendingDeleteId = null; dialog.close(); });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) { pendingDeleteId = null; dialog.close(); }
  });

  $("#searchInput").addEventListener("input", renderTable);
  $("#statusFilter").addEventListener("change", renderTable);
  $("#newEquipmentBtn").addEventListener("click", () => goToForm());
  $("#newEquipmentBtn2").addEventListener("click", () => goToForm());
  $("#emptyAddBtn").addEventListener("click", () => goToForm());
  $("#cancelFormBtn").addEventListener("click", () => showSection("equipamentos"));
  $$("[data-section]").forEach(link => link.addEventListener("click", (event) => {
    event.preventDefault();
    showSection(link.dataset.section);
  }));

  $("#exportBtn").addEventListener("click", () => {
    const items = getFilteredEquipment();
    if (!items.length) {
      showToast("Não há equipamentos para exportar com os filtros atuais.");
      return;
    }
    const headers = ["Nome", "Patrimônio", "Categoria", "Marca", "Modelo", "Conservação", "Situação", "Localização", "Observações", "Criado em", "Atualizado em"];
    const keys = ["name", "assetTag", "category", "brand", "model", "condition", "status", "location", "notes", "createdAt", "updatedAt"];
    const csvCell = value => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csv = "\uFEFF" + [headers, ...items.map(item => keys.map(key => item[key] || ""))]
      .map(row => row.map(csvCell).join(";")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "inventario-equipamentos.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Arquivo CSV exportado.");
  });

  // Abre a seção indicada no endereço, se ela existir.
  const initialSection = window.location.hash.replace("#", "");
  if (["painel", "equipamentos", "cadastro"].includes(initialSection)) showSection(initialSection);
  else renderDashboard();
  renderTable();
})();
