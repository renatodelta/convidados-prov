// ===== GUEST DATA (from spreadsheet) =====
const guestData = [
    {
        head: "Adelaide Maria",
        spouse: null,
        count: 1,
        isHonoree: true,
        members: []
    },
    {
        head: "Marco Antônio",
        spouse: "Eni",
        count: 18,
        members: [
            {
                name: "Guilherme",
                children: ["Ana"]
            },
            {
                name: "Bruno",
                children: ["Patrícia", "Rafael"]
            },
            {
                name: "Gisele",
                children: ["Wanderson", "Gustavo", "Victor", "Jhonny", "Jhoe Romeu"]
            },
            {
                name: "Jonathan",
                children: []
            },
            {
                name: "Jennifer",
                children: ["Marido", "Yuri"]
            },
            {
                name: "Gabriel",
                children: []
            }
        ]
    },
    {
        head: "Flavio dos Santos",
        spouse: "Tamires",
        count: 4,
        members: [
            {
                name: "Junior",
                children: ["Parceira"]
            }
        ]
    },
    {
        head: "Wanderley",
        spouse: "Edna",
        count: 5,
        members: [
            {
                name: "Matheus",
                children: ["Esposa"]
            },
            {
                name: "Thais",
                children: []
            }
        ]
    },
    {
        head: "Carlos Romeu",
        spouse: null,
        count: 2,
        members: [],
        extraPeople: ["Edyr José"]
    },
    {
        head: "Ednéia Maria",
        spouse: "Rogério",
        count: 7,
        members: [
            {
                name: "Laís",
                children: ["Rony", "Davi", "Levi"]
            },
            {
                name: "Rogério Júnior",
                children: []
            }
        ]
    },
    {
        head: "Fabiana Aparecida",
        spouse: "Lauro",
        count: 5,
        members: [
            {
                name: "Beatriz",
                children: ["Vinícius"]
            },
            {
                name: "Miguel",
                children: []
            }
        ]
    },
    {
        head: "Renato Domingues",
        spouse: "Elizabeth",
        count: 5,
        members: [
            {
                name: "Luiza",
                children: []
            },
            {
                name: "Camila",
                children: []
            },
            {
                name: "Pedro Henrique",
                children: []
            }
        ]
    },
    {
        head: "Tio Laurindo",
        spouse: "Regina",
        count: 2,
        members: []
    },
    {
        head: "Tio Tião",
        spouse: "Laudelina",
        count: 4,
        members: [
            {
                name: "Motorista",
                children: ["Mulher do motorista"]
            }
        ]
    },
    {
        head: "Tio César",
        spouse: "Pessoa 1",
        count: 3,
        members: [
            {
                name: "Pessoa 2",
                children: []
            }
        ]
    },
    {
        head: "Ivone Maria de Almeida",
        spouse: null,
        count: 3,
        members: [],
        extraPeople: ["Ana Cláudia Silva", "Judiceia Portela"]
    }
];

// ===== CONFIRMED GUESTS =====
const confirmedPeople = new Set([
    "Tio Laurindo",
    "Regina",
    "Elizabeth",
    "Luiza",
    "Camila",
    "Pedro Henrique",
    "Carlos Romeu",
    "Edyr José",
    "Tio César",
    "Pessoa 1",
    "Pessoa 2",
    "Rogério",
    "Laís",
    "Rony",
    "Davi",
    "Levi",
    "Rogério Júnior",
    "Ednéia Maria",
    "Guilherme",
    "Ana",
    "Flavio dos Santos",
    "Thais",
    "Matheus",
    "Ivone Maria de Almeida",
    "Ana Cláudia Silva",
    "Judiceia Portela",
    "Beatriz",
    "Miguel",
    "Fabiana Aparecida",
    "Bruno",
    "Renato Domingues"
]);

// ===== GOOGLE SHEETS INTEGRATION =====
// Cole aqui a URL do seu Google Apps Script (veja o guia setup_google_script.md)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwQt6VitFUA9oKKJ6yPTN84UHyOWXlTU34sHqyvPF-NLhjAO3LjGhAmKq4Wqu9O-o8QbA/exec";

function getStatusClass(name) {
    return confirmedPeople.has(name) ? "confirmed" : "invited";
}

// ===== UTILITY FUNCTIONS =====

function getInitials(name) {
    return name
        .split(" ")
        .filter(w => w.length > 2 || name.split(" ").length <= 2)
        .slice(0, 2)
        .map(w => w[0])
        .join("")
        .toUpperCase();
}

function countAllMembers(family) {
    // Use the spreadsheet count if available
    if (family.count) return family.count;

    let total = 1; // head
    if (family.spouse) total++;
    family.members.forEach(m => {
        total++;
        total += m.children.length;
    });
    if (family.extraPeople) total += family.extraPeople.length;
    return total;
}

// ===== RENDER FUNCTIONS =====

function createMemberTree(family) {
    let html = '<ul class="member-tree">';

    // Show spouse at top level if exists
    if (family.spouse) {
        html += `
            <li class="member-item">
                <span class="member-name-badge">
                    <span class="member-dot ${getStatusClass(family.spouse)}"></span>
                    ${family.spouse}
                </span>
            </li>`;
    }

    // Show extra people (like Edyr José under Carlos Romeu)
    if (family.extraPeople) {
        family.extraPeople.forEach(person => {
            html += `
                <li class="member-item">
                    <span class="member-name-badge">
                        <span class="member-dot ${getStatusClass(person)}"></span>
                        ${person}
                    </span>
                </li>`;
        });
    }

    // Show members (children) and their sub-members
    family.members.forEach(member => {
        html += `
            <li class="member-item">
                <span class="member-name-badge">
                    <span class="member-dot ${getStatusClass(member.name)}"></span>
                    ${member.name}
                </span>`;

        if (member.children.length > 0) {
            html += '<ul class="sub-members">';
            member.children.forEach(child => {
                html += `
                    <li class="member-item">
                        <span class="member-name-badge">
                            <span class="member-dot ${getStatusClass(child)}"></span>
                            ${child}
                        </span>
                    </li>`;
            });
            html += '</ul>';
        }

        html += '</li>';
    });

    html += '</ul>';
    return html;
}

function createFamilyCard(family, index) {
    if (family.isHonoree) return ''; // Skip honoree, shown separately

    const initials = getInitials(family.head);
    const count = countAllMembers(family);
    const hasMembers = family.members.length > 0 || family.spouse || (family.extraPeople && family.extraPeople.length > 0);

    const spouseHtml = family.spouse
        ? `<div class="spouse-name">& ${family.spouse}</div>`
        : '';

    const card = document.createElement('div');
    card.className = 'family-card';
    card.style.animationDelay = `${index * 0.08}s`;
    card.id = `family-${index}`;

    card.innerHTML = `
        <div class="card-header">
            <div class="card-header-left">
                <div class="family-avatar">${initials}<span class="head-status-dot ${getStatusClass(family.head)}"></span></div>
                <div class="card-header-info">
                    <h3>${family.head}</h3>
                    ${spouseHtml}
                </div>
            </div>
            <div style="display:flex;align-items:center;">
                <div class="card-count">
                    <span class="count-icon">👤</span> ${count}
                </div>
                ${hasMembers ? '<span class="expand-icon">▼</span>' : ''}
            </div>
        </div>
        ${hasMembers ? `<div class="card-body">${createMemberTree(family)}</div>` : ''}
    `;

    if (hasMembers) {
        card.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });
    }

    return card;
}

function countConfirmedInFamily(family) {
    let count = 0;
    if (confirmedPeople.has(family.head)) count++;
    if (family.spouse && confirmedPeople.has(family.spouse)) count++;
    if (family.extraPeople) {
        family.extraPeople.forEach(p => { if (confirmedPeople.has(p)) count++; });
    }
    family.members.forEach(m => {
        if (confirmedPeople.has(m.name)) count++;
        m.children.forEach(c => { if (confirmedPeople.has(c)) count++; });
    });
    return count;
}

function renderGuestList() {
    const grid = document.getElementById('guestGrid');
    let guestCount = 0;
    let confirmedCount = 0;

    guestData.forEach((family, index) => {
        if (family.isHonoree) {
            guestCount += family.count;
            if (confirmedPeople.has(family.head)) confirmedCount++;
            return;
        }

        guestCount += countAllMembers(family);
        confirmedCount += countConfirmedInFamily(family);

        const card = createFamilyCard(family, index);
        if (card) grid.appendChild(card);
    });

    // Update stats: Confirmados = green, Convidados = total
    animateCounter('statGuests', confirmedCount);
    animateCounter('statTotal', guestCount);
}

// ===== ANIMATED COUNTER =====

function animateCounter(elementId, target) {
    const el = document.querySelector(`#${elementId} .stat-number`);
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        el.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    // Start animation when element is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(update);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(el.closest('.stat-card'));
}

// ===== FLOATING PARTICLES =====

function createParticles() {
    const container = document.getElementById('particles');
    const count = 25;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 4 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 10;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        // Alternate colors
        if (Math.random() > 0.5) {
            particle.style.background = 'rgba(244, 114, 182, 0.6)';
        }

        container.appendChild(particle);
    }
}

// ===== MISSING GUEST FORM & LOCAL STORAGE =====

function loadSuggestions() {
    const saved = localStorage.getItem('adelaide_80_suggestions');
    return saved ? JSON.parse(saved) : [];
}

function saveSuggestion(item) {
    const current = loadSuggestions();
    current.unshift(item);
    localStorage.setItem('adelaide_80_suggestions', JSON.stringify(current));
    return current;
}

function renderPendingSuggestions() {
    const suggestions = loadSuggestions();
    const container = document.getElementById('pendingGuestsContainer');
    const list = document.getElementById('pendingList');

    if (!suggestions || suggestions.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    list.innerHTML = '';

    suggestions.forEach(item => {
        const card = document.createElement('div');
        card.className = 'pending-card';
        card.innerHTML = `
            <div class="pending-info">
                <h4>${item.guestName} ${item.familyGroup ? `<span style="color: var(--gold-400); font-weight: normal;">(${item.familyGroup})</span>` : ''}</h4>
                <p>${item.notes ? `Obs: ${item.notes} • ` : ''}<small>${item.date}</small></p>
            </div>
            <div class="pending-status">⏳ Em Análise</div>
        `;
        list.appendChild(card);
    });
}

function initMissingGuestForm() {
    const form = document.getElementById('missingGuestForm');
    if (!form) return;

    renderPendingSuggestions();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const guestName = document.getElementById('guestName').value.trim();
        const notesField = document.getElementById('notes');
        const notes = notesField ? notesField.value.trim() : '';

        if (!guestName) return;

        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;

        const newEntry = {
            id: Date.now(),
            guestName,
            notes,
            date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
        };

        // Send to Google Sheets if URL is configured
        if (GOOGLE_SCRIPT_URL) {
            try {
                submitBtn.innerHTML = '<span>⏳ Enviando...</span>';
                submitBtn.disabled = true;

                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ guestName, notes })
                });

                newEntry.sentToSheet = true;
            } catch (err) {
                console.error('Erro ao enviar para planilha:', err);
                newEntry.sentToSheet = false;
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        }

        saveSuggestion(newEntry);
        renderPendingSuggestions();

        form.reset();

        alert(`✨ O nome "${guestName}" foi ${GOOGLE_SCRIPT_URL ? 'enviado para a planilha' : 'registrado localmente'} com sucesso!`);
    });

    const copyBtn = document.getElementById('copySuggestionsBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const suggestions = loadSuggestions();
            if (suggestions.length === 0) return;

            const text = suggestions.map(s =>
                `• ${s.guestName}${s.familyGroup ? ` (Família: ${s.familyGroup})` : ''}${s.notes ? ` [Obs: ${s.notes}]` : ''}`
            ).join('\n');

            navigator.clipboard.writeText(`NOMES SUGERIDOS PARA A PLANILHA (Aniversário Adelaide Maria):\n\n${text}`).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✅ Copiado!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            });
        });
    }
}

// ===== PEOPLE LIST MODAL =====

function getAllPeople() {
    const people = [];
    guestData.forEach(family => {
        const familyLabel = family.isHonoree ? "Aniversariante" : family.head;

        // Head
        people.push({
            name: family.head,
            confirmed: confirmedPeople.has(family.head),
            family: family.isHonoree ? "" : "Responsável"
        });

        // Spouse
        if (family.spouse) {
            people.push({
                name: family.spouse,
                confirmed: confirmedPeople.has(family.spouse),
                family: familyLabel
            });
        }

        // Extra people
        if (family.extraPeople) {
            family.extraPeople.forEach(person => {
                people.push({
                    name: person,
                    confirmed: confirmedPeople.has(person),
                    family: familyLabel
                });
            });
        }

        // Members and their children
        family.members.forEach(member => {
            people.push({
                name: member.name,
                confirmed: confirmedPeople.has(member.name),
                family: familyLabel
            });
            member.children.forEach(child => {
                people.push({
                    name: child,
                    confirmed: confirmedPeople.has(child),
                    family: familyLabel
                });
            });
        });
    });
    return people;
}

function openModal(type) {
    const overlay = document.getElementById('modalOverlay');
    const title = document.getElementById('modalTitle');
    const countEl = document.getElementById('modalCount');
    const list = document.getElementById('modalList');

    const allPeople = getAllPeople();
    let filtered;

    if (type === 'confirmed') {
        filtered = allPeople.filter(p => p.confirmed);
        title.textContent = '🎉 Confirmados';
    } else {
        filtered = allPeople;
        title.textContent = '🥂 Todos os Convidados';
    }

    countEl.textContent = `${filtered.length} pessoa${filtered.length !== 1 ? 's' : ''}`;

    list.innerHTML = '';
    filtered.forEach(person => {
        const li = document.createElement('li');
        const dotColor = person.confirmed ? 'green' : 'yellow';
        li.innerHTML = `
            <span class="modal-dot ${dotColor}"></span>
            <span>${person.name}</span>
            ${person.family ? `<span class="family-label">${person.family}</span>` : ''}
        `;
        list.appendChild(li);
    });

    overlay.classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

function initModal() {
    const statGuests = document.getElementById('statGuests');
    const statTotal = document.getElementById('statTotal');
    const closeBtn = document.getElementById('modalClose');
    const overlay = document.getElementById('modalOverlay');

    statGuests.addEventListener('click', () => openModal('confirmed'));
    statTotal.addEventListener('click', () => openModal('all'));
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    renderGuestList();
    initMissingGuestForm();
    initModal();
});
