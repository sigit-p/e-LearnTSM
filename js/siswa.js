let semuaSiswa = [];
let semuaNilai = [];
let semuaJobs = [];

async function halamanNilai() {

    konten.innerHTML = `

    <div class="header">
        <h1>📖 Cek Nilai</h1>
        <small>Lihat hasil penilaian siswa</small>
    </div>

    <div class="card">

        <label>Kelas</label>

        <select id="kelas"></select>

        <input
            type="text"
            id="cariSiswa"
            class="search-input"
            placeholder="🔍 Cari siswa...">

    </div>

    <div id="listSiswa"></div>

    <div id="modal" class="modal">

        <div class="modal-content">

            <span class="close"
                onclick="closeModal()">

                ×

            </span>

            <div id="modalBody">

            </div>

        </div>

    </div>

    `;

    await loadKelas();

    document.getElementById("kelas")
        .onchange = loadDaftarSiswa;

    document.getElementById("cariSiswa")
        .addEventListener(
            "input",
            filterSiswa
        );

}



async function loadKelas() {

    let data = await getKelas();

    let html =
        '<option value="">Pilih Kelas</option>';

    data.forEach(item => {

        html += `
        <option value="${item.id_kelas}">
            ${item.nama_kelas}
        </option>
        `;

    });

    document.getElementById("kelas")
        .innerHTML = html;

}


async function loadDaftarSiswa() {
console.log("load siswa");
    let id_kelas =
        document.getElementById("kelas").value;

    if (!id_kelas) {

        listSiswa.innerHTML = "";

        return;

    }

    listSiswa.innerHTML = "Memuat...";

    semuaSiswa =
        await getSiswa(id_kelas);

    semuaNilai =
        await getNilaiSemua();

    semuaJobs =
        await getJobsheet(
            "PKSM",
            "XI"
        );

    tampilDaftarSiswa(
        semuaSiswa
    );

}



function tampilDaftarSiswa(data) {

    let html = "";

    data.forEach(s => {

        let nilai =
            semuaNilai.filter(
                n => n.nis == s.nis
            );

        let selesai = nilai.length;

        let persen =
            semuaJobs.length > 0
            ? Math.round(
                selesai /
                semuaJobs.length *
                100
            )
            : 0;

        let total = 0;

        nilai.forEach(item => {

            total += Number(item.nilai);

        });

        let rata =
            selesai > 0
            ? Math.round(total / selesai)
            : 0;

        html += `

        <div class="siswa-card">

            <div>

                <div class="nama-siswa">

                    👤 ${s.nama}

                </div>

                <small>${s.nis}</small>

                <div class="progress-mini">

                    <div class="progress-fill"
                        style="width:${persen}%">

                    </div>

                </div>

                <small>

                    Progress ${persen}%

                    <br>

                    ⭐ Rata-rata ${rata}

                </small>

            </div>

            <button class="btn-detail"
                onclick="showDetail('${s.nis}')">

                Detail

            </button>

        </div>

        `;

    });

    listSiswa.innerHTML = html;

}



function filterSiswa() {

    let keyword =
        document
        .getElementById("cariSiswa")
        .value
        .toLowerCase();

    let hasil =
        semuaSiswa.filter(
            s =>
            s.nama
            .toLowerCase()
            .includes(keyword)
        );

    tampilDaftarSiswa(
        hasil
    );

}



function showDetail(nis) {

    let siswa =
        semuaSiswa.find(
            s => s.nis == nis
        );

    let nilai =
        semuaNilai.filter(
            n => n.nis == nis
        );

    let nilaiMap = {};

    nilai.forEach(item => {

        nilaiMap[item.id_job] =
            item.nilai;

    });

    let selesai = nilai.length;

    let persen =
        semuaJobs.length > 0
        ? Math.round(
            selesai /
            semuaJobs.length *
            100
        )
        : 0;

    let total = 0;

    nilai.forEach(item => {

        total += Number(item.nilai);

    });

    let rata =
        selesai > 0
        ? Math.round(total / selesai)
        : 0;

    let tabel = "";

    semuaJobs.forEach(job => {

        let n = nilaiMap[job.id_job];

        tabel += `

        <tr>

            <td>
                ${n != null ? "✅" : "❌"}
            </td>

            <td>
                ${job.judul_job}
            </td>

            <td>
                ${n ?? "-"}
            </td>

        </tr>

        `;

    });

    modalBody.innerHTML = `

    <h2>

        👤 ${siswa.nama}

    </h2>

    <p>

        ${siswa.nis}

    </p>

    <p>

        Progress ${persen}%

    </p>

    <div class="progress">

        <div class="progress-bar"
            style="width:${persen}%">

        </div>

    </div>

    <h3>

        ⭐ Rata-rata : ${rata}

    </h3>

    <table class="table">

        <thead>

            <tr>

                <th></th>

                <th>Jobsheet</th>

                <th>Nilai</th>

            </tr>

        </thead>

        <tbody>

            ${tabel}

        </tbody>

    </table>

    `;

    modal.classList.add("show");

}



function closeModal() {

    modal.classList.remove("show");

}