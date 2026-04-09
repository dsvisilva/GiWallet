import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAfY-_-nFQIbNwvse30Ctbfsnq9b-FQnLA",
  authDomain: "app-de-financas-do-davi.firebaseapp.com",
  projectId: "app-de-financas-do-davi",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const docRef = doc(db, "financas", "user1");

let state = { transactions: [], theme: 'light' };

// 🔁 sincronização em tempo real
onSnapshot(docRef, (snap) => {
  if (snap.exists()) {
    state = snap.data();
    renderAll();
    showToast("📡 Sincronizado");
  }
});

// 💾 salvar no firebase
async function saveData() {
  await setDoc(docRef, state);
}

// ➕ adicionar transação
window.saveTransaction = function () {
  const desc = document.getElementById('tx-desc').value;
  const amount = parseFloat(document.getElementById('tx-amount').value);
  const cat = document.getElementById('tx-cat').value;
  const date = document.getElementById('tx-date').value;

  if (!desc || !amount || !date) {
    showToast("Preenche tudo aí 😅");
    return;
  }

  state.transactions.push({
    id: Date.now().toString(),
    desc,
    amount,
    cat,
    date
  });

  saveData();
};

// 🧾 render
function renderAll() {
  const list = document.getElementById('allTxList');
  const summary = document.getElementById('summaryCards');

  let total = 0;

  list.innerHTML = state.transactions.map(t => {
    total += t.amount;
    return `<li>${t.desc} - R$ ${t.amount}</li>`;
  }).join('');

  summary.innerHTML = `<strong>Total: R$ ${total}</strong>`;
}

// 🌙 tema
window.toggleTheme = function () {
  document.body.classList.toggle('dark');
};

// 🔔 toast
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');

  setTimeout(() => t.classList.remove('show'), 2000);
}