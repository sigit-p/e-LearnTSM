async function halamanDashboard() {

    konten.innerHTML = `

    <div class="header">
        <h1>Dashboard</h1>
        <small>e-Nilai Praktik TSM Mupa</small>
    </div>

    <div class="grid statistik">

        <div class="info-box">
            <p>Total Kelas</p>
            <h2 id="jmlKelas">0</h2>
        </div>

        <div class="info-box">
            <p>Total Siswa</p>
            <h2 id="jmlSiswa">0</h2>
        </div>

        <div class="info-box">
            <p>Materi</p>
            <h2 id="jmlMateri">0</h2>
        </div>

        <div class="info-box">
            <p>Jobsheet</p>
            <h2 id="jmlJobsheet">0</h2>
        </div>

    </div>

    <div class="card">

        <h2>Progress Penilaian</h2>

        <div class="progress">

            <div
                class="progress-bar"
                id="progressBar"
                style="width:0%">

            </div>

        </div>

        <p id="progressText">
            Memuat data...
        </p>

    </div>

    <div class="card">

        <h2>e-Nilai Praktik Mupa</h2>

        <p>
            Selamat datang di sistem informasi nilai praktik
            SMK Muhammadiyah Pakem.
        </p>

        <p>
            Gunakan menu <b>📖 Cek Nilai</b>
            untuk melihat perkembangan dan hasil penilaian siswa.
        </p>

    </div>

    <div class="card">

        <h2>Aktivitas Terbaru</h2>

        <div id="aktivitas">

            <p>Memuat data...</p>

        </div>

    </div>

    `;

    loadDashboard();

}