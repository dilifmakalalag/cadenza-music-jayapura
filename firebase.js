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
  setDoc,
  where,
  getDocs,
  writeBatch,
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
export const db = getFirestore(app); // <-- PENTING: ekspor db
const auth = getAuth(app);

/* ========================
   2) Koleksi
======================== */
const siswaCol = collection(db, "siswa");
const nilaiCol = collection(db, "nilai");
const qrCol = collection(db, "qr");

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
   4) SISWA: Realtime list
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
   5) SISWA: by id
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
   6) SISWA: CREATE (auto-ID)
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
   9) NILAI: CRUD ringkas
======================== */
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
   10) QR: CRUD singkat
======================== */
export function onQrSnapshot(callback) {
  const q = query(qrCol, orderBy("kode"));
  return onSnapshot(
    q,
    (qs) => callback(qs.docs.map(withId)),
    (err) => {
      console.error("onQrSnapshot error:", err);
      alert("Gagal memuat data QR.");
    }
  );
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

/* ========================
   12) Re-ekspos util Firestore (dipakai HTML)
======================== */
export {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  writeBatch,
};
