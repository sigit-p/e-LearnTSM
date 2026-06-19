const kelas = document.getElementById("kelas");
const siswa = document.getElementById("siswa");
const jobsheet = document.getElementById("jobsheet");

loadKelas();

kelas.onchange = loadSiswa;

siswa.onchange = loadJobsheet;

async function loadKelas() {

    let res = await fetch(API + "?action=getKelas");
    let data = await res.json();

    let html = "";

    data.forEach(item => {

        html += `
        <option value="${item.id_kelas}">
            ${item.nama_kelas}
        </option>
        `;

    });

    kelas.innerHTML = html;

    loadSiswa();

}


async function loadSiswa() {

    let id_kelas = kelas.value;

    let res = await fetch(
        API + "?action=getSiswa&id_kelas=" + id_kelas
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

    siswa.innerHTML = html;
    
    loadJobsheet();
}

async function loadJobsheet(){

    let nis = siswa.value;

    let resJob = await fetch(
        API+"?action=getJobsheet&id_mapel=PKSM&tingkat=XI"
    );

    let jobs = await resJob.json();


    let resNilai = await fetch(
        API+"?action=getNilai&nis="+nis
    );

    let nilai = await resNilai.json();

    let html = "";

    jobs.forEach(job=>{

        let n = "";

        nilai.forEach(item=>{

            if(item.id_job==job.id_job){

                n = item.nilai;

            }

        });

        html += `
        <div class="card">

        <h3>${job.judul_job}</h3>

        <small>${job.media}</small>

        <br><br>

        <input
            type="number"
            id="${job.id_job}"
            value="${n}"
        >

        </div>
        `;

    });

    html += `
    <button onclick="simpanNilai()">
        💾 Simpan
    </button>
    `;

    jobsheet.innerHTML = html;

}


