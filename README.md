Karena tidak ada spesifikasi batasan, framework yang saya pilih adalah NextJS menggunakan prisma sebagai ORM.
Saya menggunakan database lokal Postgre.

Masalah yang saya encounter selama development:

1. Memilih framework yang cocok. Kebetulan NextJS merupakan framework react yang sudah pernah saya gunakan. Saya melakukan browsing ORM untuk konek ke data lokal postgre dan memilih prisma ORM.
2. Saya sempat bingung dengan penamaan folder dalam api. Ternyata nextjs memiliki skema tertentu untuk menentukan routing, sebuah folder harus dinamakan sesuatu seperti [...nextauth] 
3. Type checking. Typescript adalah bahasa yang type safe, semua argumen wajib memiliki type untuk memastikan program berjalan seperti seharusnya. Field seperti session dan user akan memiliki type any secara default. Saya tambahkan file deklarasi next-auth.d.ts agar compiler mengerti tipe apa saja yang diekspektasi dari program yang ditulis.
4. 
Dalam pembuatan sistem autentikasi saya sempat bertemu dinding dimana saya dapat error "Try signing in with a different account."
Error ini disebabkan karena sudah ada row dengan email tersebut di tabel User. package NextAuth secara otomatis membuat User lagi, schema @unique prisma untuk field email akhirnya gagal dan memberikan error itu.
5. 
Selain itu saya juga bertemu error (OAuthAccountNotLinked)  "To confirm your identity, sign in with the same account you used originally".
Ini membuat saya sangat bingung karena setelah saya cari eror ini terjadi ketika seseorang mencoba menggunakan email yang sama dan metode berbeda, misalnya menggunakan github atau google dengan email sama. Nextauth memang tidak membolehkan adanya relation di antara kedua akun tersebut dalam database.

Jadi masalahnya
a. Ketika DB kosong, keluar error  "Try signing in with a different account."
b. Setelah error itu keluar, saya coba login lagi, keluar error "To confirm your identity, sign in with the same account you used originally".

Solusinya
- Saya downgrade ke prisma 6 yang tidak membutuhkan field adapter dan pg pool
- Prisma memiliki fungsionalitas internal yang sudah menghandle pembuatan akun (seharusnya tidak memanggil prisma.user.upsert)
- Mendelete semua anak tabel public."User" agar NextAuth bisa membuat akun baru.

6. Safety tips. Saya awalnya menyetor kredensial allowedEmails dalam constant di page [...nextauth]/route.ts untuk testing. Seharusnya kredensial ini tidak di push ke github. Jika repositori publik, orang dapat melihat commit history dan melihat data tersebut. Saya telah menyetor allowed emails dalam database untuk keamanan


- Sherin Khaira A.M. ~ 2406404112