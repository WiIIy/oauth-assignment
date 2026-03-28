// app/page.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  // state untuk form kustomisasi
  const [bgInput, setBgInput] = useState("#ffffff");
  const [colorInput, setColorInput] = useState("#000000"); //react hooks for state storage
  const [fontInput, setFontInput] = useState("sans-serif");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveTheme = async () => {
    setIsSaving(true);
    await fetch("/api/settings", {
      method: "POST",
      body: JSON.stringify({ 
        background: bgInput, 
        textColor: colorInput, 
        fontFamily: fontInput 
      }),
    });
    setIsSaving(false);
    
    // refresh halaman instan untuk menampilkan perubahan server-side
    router.refresh(); 
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Kelompok 7</h1>
      <p>Website Biodata Kelompok</p>

      <hr />

      {/* autentikasi */}
      <div style={{ marginBottom: "1rem" }}>
        {!session ? (
          <button onClick={() => signIn("google")}>
            Login with Google
          </button>
        ) : (
          <>
            <p>
              Logged in as: {session.user?.email} <br />
              Role: {session.user?.role}
            </p>
            <button onClick={() => signOut()}>Logout</button>
          </>
        )}
      </div>

      <hr />

      {/*Biodata */}
      <h2>Anggota Kelompok</h2>
      <ul>
        <li>
          <strong>Nama:</strong> Sherin Khaira 1 <br />
          <strong>NPM:</strong> 2406404112 <br />
          <strong>Lahir:</strong> 28 Januari 2007 <br/>
          <strong>Email:</strong> sherinkhaira@gmail.com
        </li>
        <li>
          <strong>Nama:</strong> Sherin Khaira 2 <br />
          <strong>NPM:</strong> 2406404112 <br />
          <strong>Lahir:</strong> 28 Januari 2007 <br/>
          <strong>Email:</strong> sherinkhairalol@gmail.com
        </li>
      </ul>

      <hr />

      {/* setting background color + font (hanya tampil kalau role adalah editor) */}
      {session?.user?.role === "editor" && (
        <div style={{ background: "rgba(128,128,128,0.1)", padding: "1rem", borderRadius: "8px" }}>
          <h2>Customize Website (Global)</h2>
          <p>Perubahan di sini akan mengubah tampilan untuk semua pengunjung.</p>

          {/*ganti warna background */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
            <label>
              Background Color:
              <input 
                type="color" 
                value={bgInput} 
                onChange={(e) => setBgInput(e.target.value)} 
                style={{ marginLeft: "10px" }}
              />
            </label>

            {/*ganti text color */}
            <label>
              Text Color:
              <input 
                type="color" 
                value={colorInput} 
                onChange={(e) => setColorInput(e.target.value)} 
                style={{ marginLeft: "10px" }}
              />
            </label>

            {/*ganti font family */}
            <label>
              Font Family:
              <select 
                value={fontInput} 
                onChange={(e) => setFontInput(e.target.value)}
                style={{ marginLeft: "10px" }}
              >
                <option value="sans-serif">Sans Serif</option>
                <option value="serif">Serif</option>
                <option value="monospace">Monospace</option>
                <option value="'Courier New', Courier, monospace">Courier New</option>
              </select>
            </label>

            {/*simpan theme */}
            <button 
              onClick={handleSaveTheme} 
              disabled={isSaving}
              style={{ padding: "8px", marginTop: "10px", cursor: "pointer" }}
            >
              {isSaving ? "Saving..." : "Apply Global Theme"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}