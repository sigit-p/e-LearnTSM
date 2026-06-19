const kelas = document.getElementById("kelas");
const siswa = document.getElementById("siswa");
const konten = document.getElementById("konten");

loadKelas();

kelas.onchange = loadSiswa;
siswa.onchange = function(){

    konten.innerHTML = "";

}

async function loadData(){

    if(!kelas.value){

        alert("Pilih kelas terlebih dahulu");
        return;

    }

    if(!siswa.value){

        alert("Pilih siswa terlebih dahulu");
        return;

    }

    let res = await fetch(
        API + "?action=getKelas"
    );

    let data = await res.json();

    let html = "";

    data.forEach(item => {

        html += `
        <option value="${item.id_kelas}">
            ${item.nama_kelas}
        </option>
        `;

    });

    kelas.innerHTML =
        '<option value="">Pilih Kelas</option>' + html;

    siswa.innerHTML =
        '<option value="">Pilih Siswa</option>';

}


async function loadSiswa() {

    konten.innerHTML = "";

    siswa.innerHTML =
        '<option value="">Pilih Siswa</option>';

    if (!kelas.value) {
        return;
    }

    let res = await fetch(
        API + "?action=getSiswa&id_kelas=" + kelas.value
    );

    let data = await res.json();

    let html = "";

    data.forEach(item => {

        html += `
        <option value="${item.nis}">
            ${item.nama}
        </option>
        `;

    });

    siswa.innerHTML =
        '<option value="">Pilih Siswa</option>' + html;

}


async function loadData() {

    let nis = siswa.value;

    if (!nis) {

        konten.innerHTML = "";
        return;

    }

    let resMateri = await fetch(
        API + "?action=getMateri&id_mapel=PKSM"
    );

    let materi = await resMateri.json();

    let resJob = await fetch(
        API + "?action=getJobsheet&id_mapel=PKSM&tingkat=XI"
    );

    let jobs = await resJob.json();

    let resNilai = await fetch(
        API + "?action=getNilai&nis=" + nis
    );

    let nilai = await resNilai.json();

    let nilaiMap = {};

    nilai.forEach(item => {

        nilaiMap[item.id_job] = item.nilai;

    });

    let selesai = Object.keys(nilaiMap).length;

    let persen = jobs.length > 0
        ? Math.round(selesai / jobs.length * 100)
        : 0;

    let html = `
    <div class="card">

        <h2>
            👤 ${siswa.options[siswa.selectedIndex].text}
        </h2>

        <p>NIS : ${nis}</p>

        <p>
            Progress ${selesai}/${jobs.length}
            (${persen}%)
        </p>

        <div class="progress">
            <div class="progress-bar"
                 style="width:${persen}%">
            </div>
        </div>

    </div>
    `;


    // MATERI

    html += `
    <div class="card">

        <h2>📚 Materi</h2>
    `;

    materi.forEach(item => {

        html += `
        <p>
            ✓ ${item.judul_materi}
        </p>
        `;

    });

    html += `
    </div>
    `;


    // JOBSHEET

    html += `
    <div class="card">

        <h2>📝 Jobsheet</h2>
    `;

    jobs.forEach(job => {

        let n = nilaiMap[job.id_job];

        if (n != null) {

            html += `
            <p>

                ✅ ${job.judul_job}

                <br>

                <small>${job.media}</small>

                <br>

                Nilai : ${n}

            </p>
            `;

        } else {

            html += `
            <p>

                ❌ ${job.judul_job}

                <br>

                <small>${job.media}</small>

            </p>
            `;

        }

    });

    html += `
    </div>
    `;

    konten.innerHTML = html;

}
