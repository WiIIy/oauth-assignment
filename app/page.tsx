"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Kelompok 7</h1>
      <p>Website Biodata Kelompok</p>

      <hr />

      {/* Auth section */}
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

      {/* Biodata Kelompok */}
      <h2>Anggota Kelompok</h2>

      <ul>
        <li>
          <strong>Nama:</strong> Andi Saputra <br />
          <strong>NIM:</strong> 12345678 <br />
          <strong>Role:</strong> Frontend
        </li>

        <li>
          <strong>Nama:</strong> Budi Santoso <br />
          <strong>NIM:</strong> 87654321 <br />
          <strong>Role:</strong> Backend
        </li>

        <li>
          <strong>Nama:</strong> Citra Lestari <br />
          <strong>NIM:</strong> 11223344 <br />
          <strong>Role:</strong> UI/UX
        </li>
      </ul>

      <hr />

      {/* Conditional feature */}
      {session?.user?.role === "editor" && (
        <>
          <h2>Customize Website</h2>
          <p>You can change theme (placeholder feature).</p>

          <button>Change Background Color</button>
          <button>Change Font</button>
        </>
      )}
    </main>
  );
}