import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

let firebaseAvailable = true;
let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (err) {
  console.warn('Firebase not available or not configured:', err.message);
  firebaseAvailable = false;
}

const authDiv = document.getElementById('auth');
const dashboardDiv = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const registerBtn = document.getElementById('registerBtn');
const registerModal = document.getElementById('registerModal');
const registerForm = document.getElementById('registerForm');
const regCancel = document.getElementById('regCancel');
const logoutBtn = document.getElementById('logoutBtn');
const userEmailSpan = document.getElementById('userEmail');
const feesP = document.getElementById('fees');
const schedulesUl = document.getElementById('schedules');
const assessmentsUl = document.getElementById('assessments');
const instrumentsUl = document.getElementById('instruments');
const assignmentsUl = document.getElementById('assignments');

function getLocalUsers() { return JSON.parse(localStorage.getItem('lsm_users') || '{}'); }
function saveLocalUsers(u) { localStorage.setItem('lsm_users', JSON.stringify(u)); }
function setLocalCurrent(email) { localStorage.setItem('lsm_current_user', email); }
function getLocalCurrent() { return localStorage.getItem('lsm_current_user'); }
function clearLocalCurrent() { localStorage.removeItem('lsm_current_user'); }

function showDashboard(email, data) {
  authDiv.style.display = 'none';
  dashboardDiv.style.display = 'block';
  userEmailSpan.textContent = email;
  if (data) {
    feesP.textContent = `Amount: MWK ${data.fees.amount || '0'} | Due: ${data.fees.due || 'N/A'}`;
    schedulesUl.innerHTML = (data.schedules || []).map(s => `<li>${s.date || 'TBA'} ${s.time || ''}: ${s.subject || 'Music Lesson'}</li>`).join('') || '<li>No schedules assigned</li>';
    assessmentsUl.innerHTML = (data.assessments || []).map(a => `<li>${a.subject || 'Music'}: <strong>${a.grade || 'N/A'}</strong></li>`).join('') || '<li>No assessments yet</li>';
    instrumentsUl.innerHTML = (data.instruments || []).map(i => `<li>${i}</li>`).join('') || '<li>No instruments assigned</li>';
    assignmentsUl.innerHTML = (data.assignments || []).map(a => `<li><strong>${a.title || ''}</strong> - Due: ${a.dueDate || 'TBA'}</li>`).join('') || '<li>No active assignments</li>';
  } else {
    feesP.textContent = 'No data available';
    schedulesUl.innerHTML = '<li>No schedules assigned</li>';
    assessmentsUl.innerHTML = '<li>No assessments yet</li>';
    instrumentsUl.innerHTML = '<li>No instruments assigned</li>';
    assignmentsUl.innerHTML = '<li>No active assignments</li>';
  }
}

async function tryLoadUserDataFirebase(uid, email) {
  try {
    const docRef = doc(db, 'students', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      showDashboard(email, docSnap.data());
    } else {
      showDashboard(email, null);
    }
  } catch (e) {
    console.warn('Failed loading firebase user data', e.message);
    showDashboard(email, null);
  }
}

if (firebaseAvailable) {
  try {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        tryLoadUserDataFirebase(user.uid, user.email);
      } else {
        authDiv.style.display = 'block';
        dashboardDiv.style.display = 'none';
      }
    });
  } catch (e) {
    console.warn('onAuthStateChanged failed', e.message);
  }
} else {
  const cur = getLocalCurrent();
  if (cur) {
    const users = getLocalUsers();
    showDashboard(cur, users[cur] || null);
  }
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  if (firebaseAvailable) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return;
    } catch (err) {
      console.warn('Firebase login failed, falling back:', err.message);
    }
  }
  const users = getLocalUsers();
  if (users[email] && users[email].password === password) {
    setLocalCurrent(email);
    showDashboard(email, users[email]);
  } else {
    alert('Login failed: invalid credentials');
  }
});

registerBtn.addEventListener('click', () => {
  registerModal.classList.remove('hidden');
  registerModal.style.display = 'flex';
});

regCancel.addEventListener('click', () => {
  registerModal.classList.add('hidden');
  registerModal.style.display = 'none';
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('reg_name').value.trim();
  const email = document.getElementById('reg_email').value.trim();
  const phone = document.getElementById('reg_phone').value.trim();
  const password = document.getElementById('reg_password').value;
  if (!email || !password) { alert('Please enter email and password'); return; }
  if (firebaseAvailable) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      try {
        await setDoc(doc(db, 'students', userCredential.user.uid), {
          name: name,
          email: email,
          phone: phone,
          fees: { amount: 0, due: '' },
          schedules: [],
          assessments: [],
          instruments: [],
          assignments: []
        });
      } catch (e) {
        console.warn('Failed to set firestore doc', e.message);
      }
      registerModal.classList.add('hidden');
      registerModal.style.display = 'none';
      return;
    } catch (err) {
      console.warn('Firebase registration failed, falling back:', err.message);
    }
  }
  const users = getLocalUsers();
  if (users[email]) { alert('An account with that email already exists'); return; }
  users[email] = {
    name: name || '',
    email: email,
    phone: phone || '',
    password: password,
    fees: { amount: 0, due: '' },
    schedules: [],
    assessments: [],
    instruments: [],
    assignments: []
  };
  saveLocalUsers(users);
  setLocalCurrent(email);
  registerModal.classList.add('hidden');
  registerModal.style.display = 'none';
  showDashboard(email, users[email]);
});

logoutBtn.addEventListener('click', async () => {
  if (firebaseAvailable) {
    try { await signOut(auth); return; } catch (e) { console.warn('Firebase signout failed', e.message); }
  }
  clearLocalCurrent();
  authDiv.style.display = 'block';
  dashboardDiv.style.display = 'none';
});

document.querySelectorAll('[data-alert]').forEach(function(button) {
  button.addEventListener('click', function() {
    var message = button.dataset.alert;
    if (message) alert(message);
  });
});
