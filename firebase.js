// firebase.js — ESM (Firebase v10.x, modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  orderBy,
  query,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut as fbSignOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* ========================
   1) Init Firebase
======================== */
const firebaseConfig = {
  apiKey: "AIzaSyD6TadYuSQ2bF-e8JLQloYv2ZsRQg7rA4Y",
  authDomain: "student-course-777.firebaseapp.com",
  projectId: "student-course-777",
  storageBucket: "student-course-777.firebasestorage.app",
  messagingSenderId: "70458879285",
  appId: "1:70458879285:web:30cf6079f71265dff0b07c",
  measurementId: "G-FY2VRJ6NP0",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/* ========================
   2) Koleksi
======================== */
const siswaCol = collection(db, "siswa"); // sudah ada (Data Siswa)
const nilaiCol = collection(db, "nilai"); // baru (Data Nilai)
const qrCol = collection(db, "qr"); // baru (Data QR)

/* ========================
   3) Helpers
======================== */
function withId(snap) {
  return { id: snap.id, ...snap.data() };
}
function sanitizeForFirestore(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    out[k] = v === undefined ? null : typeof v === "string" ? v.trim() : v;
  }
  return out;
}

/* ========================
   4) SISWA: READ (Realtime)
======================== */
export function onStudentsSnapshot(callback) {
  const q = query(siswaCol, orderBy("namaSiswa"));
  return onSnapshot(
    q,
    (qs) => callback(qs.docs.map(withId)),
    (err) => {
      console.error("onStudentsSnapshot error:", err);
      alert("Gagal memuat data siswa.");
    }
  );
}

/* ========================
   5) SISWA: READ (by id)
======================== */
export async function getStudent(id) {
  try {
    const ref = doc(db, "siswa", id);
    const snap = await getDoc(ref);
    return snap.exists() ? withId(snap) : null;
  } catch (e) {
    console.error("getStudent error:", e);
    alert("Gagal mengambil data siswa.");
    return null;
  }
}

/* ========================
   6) SISWA: CREATE
======================== */
export async function addStudent(payload) {
  try {
    const data = sanitizeForFirestore({
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const ref = await addDoc(siswaCol, data);
    return ref.id;
  } catch (e) {
    console.error("addStudent error:", e);
    alert(`Gagal menyimpan data siswa: ${e.message || ""}`);
    return null;
  }
}

/* ========================
   7) SISWA: UPDATE
======================== */
export async function updateStudent(id, payload) {
  try {
    const ref = doc(db, "siswa", id);
    const data = sanitizeForFirestore({
      ...payload,
      updatedAt: serverTimestamp(),
    });
    await updateDoc(ref, data);
    return true;
  } catch (e) {
    console.error("updateStudent error:", e);
    alert(`Gagal memperbarui data siswa: ${e.message || ""}`);
    return false;
  }
}

/* ========================
   8) SISWA: DELETE
======================== */
export async function deleteStudent(id) {
  try {
    const ref = doc(db, "siswa", id);
    await deleteDoc(ref);
    return true;
  } catch (e) {
    console.error("deleteStudent error:", e);
    alert(`Gagal menghapus data: ${e.message || ""}`);
    return false;
  }
}

/* ========================
   9) NILAI: CRUD
======================== */
// Realtime list nilai (urut tanggal desc, lalu nama siswa kalau mau)
export function onNilaiSnapshot(callback) {
  const q = query(nilaiCol, orderBy("tanggal", "desc"));
  return onSnapshot(
    q,
    (qs) => callback(qs.docs.map(withId)),
    (err) => {
      console.error("onNilaiSnapshot error:", err);
      alert("Gagal memuat data nilai.");
    }
  );
}
export async function getNilai(id) {
  try {
    const ref = doc(db, "nilai", id);
    const snap = await getDoc(ref);
    return snap.exists() ? withId(snap) : null;
  } catch (e) {
    console.error("getNilai error:", e);
    alert("Gagal mengambil data nilai.");
    return null;
  }
}
export async function addNilai(payload) {
  try {
    const data = sanitizeForFirestore({
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const ref = await addDoc(nilaiCol, data);
    return ref.id;
  } catch (e) {
    console.error("addNilai error:", e);
    alert(`Gagal menyimpan nilai: ${e.message || ""}`);
    return null;
  }
}
export async function updateNilai(id, payload) {
  try {
    const ref = doc(db, "nilai", id);
    const data = sanitizeForFirestore({
      ...payload,
      updatedAt: serverTimestamp(),
    });
    await updateDoc(ref, data);
    return true;
  } catch (e) {
    console.error("updateNilai error:", e);
    alert(`Gagal memperbarui nilai: ${e.message || ""}`);
    return false;
  }
}
export async function deleteNilai(id) {
  try {
    const ref = doc(db, "nilai", id);
    await deleteDoc(ref);
    return true;
  } catch (e) {
    console.error("deleteNilai error:", e);
    alert(`Gagal menghapus nilai: ${e.message || ""}`);
    return false;
  }
}

/* ========================
   10) QR: CRUD
======================== */
export function onQrSnapshot(callback) {
  const q = query(qrCol, orderBy("kode")); // bisa diubah ke createdAt desc
  return onSnapshot(
    q,
    (qs) => callback(qs.docs.map(withId)),
    (err) => {
      console.error("onQrSnapshot error:", err);
      alert("Gagal memuat data QR.");
    }
  );
}
export async function getQr(id) {
  try {
    const ref = doc(db, "qr", id);
    const snap = await getDoc(ref);
    return snap.exists() ? withId(snap) : null;
  } catch (e) {
    console.error("getQr error:", e);
    alert("Gagal mengambil data QR.");
    return null;
  }
}
export async function addQr(payload) {
  try {
    const data = sanitizeForFirestore({
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const ref = await addDoc(qrCol, data);
    return ref.id;
  } catch (e) {
    console.error("addQr error:", e);
    alert(`Gagal menyimpan data QR: ${e.message || ""}`);
    return null;
  }
}
export async function updateQr(id, payload) {
  try {
    const ref = doc(db, "qr", id);
    const data = sanitizeForFirestore({
      ...payload,
      updatedAt: serverTimestamp(),
    });
    await updateDoc(ref, data);
    return true;
  } catch (e) {
    console.error("updateQr error:", e);
    alert(`Gagal memperbarui data QR: ${e.message || ""}`);
    return false;
  }
}
export async function deleteQr(id) {
  try {
    const ref = doc(db, "qr", id);
    await deleteDoc(ref);
    return true;
  } catch (e) {
    console.error("deleteQr error:", e);
    alert(`Gagal menghapus data QR: ${e.message || ""}`);
    return false;
  }
}

/* ========================
   11) Auth
======================== */
export function onAuthStateChangedHandler(callback) {
  return onAuthStateChanged(auth, callback);
}
export async function signOut() {
  try {
    await fbSignOut(auth);
  } catch (e) {
    console.error("signOut error:", e);
    alert("Gagal logout.");
  }
}
