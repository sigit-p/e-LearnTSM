const kelas = document.getElementById("kelas");
const siswa = document.getElementById("siswa");
const jobsheet = document.getElementById("jobsheet");

let jobs = [];

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

    kelas.innerHTML =
        '<option value="">Pilih Kelas</option>' + html;

    siswa.innerHTML =
        '<option value="">Pilih Siswa</option>';

    jobsheet.innerHTML="";

}


async function loadSiswa() {
 
    jobsheet.innerHTML = "";
    jobs = [];
    
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

    siswa.innerHTML =
        '<option value="">Pilih Siswa</option>' + html;

    jobsheet.innerHTML="";
}

async function loadJobsheet(){

    let nis = siswa.value;

    if(!nis){
        jobsheet.innerHTML="";
        return;
    }

    let resJob = await fetch(
        API+"?action=getJobsheet&id_mapel=PKSM&tingkat=XI"
    );

    jobs = await resJob.json();


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
            min="0"
            max="100"
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

async function simpanNilai() {

    let nis = siswa.value;

    for (let job of jobs) {

        let nilai = document.getElementById(job.id_job).value;

        if (nilai != "") {

    await fetch(
            API
            + "?action=saveNilai"
            + "&nis=" + nis
            + "&id_job=" + job.id_job
            + "&nilai=" + nilai
        );

        }

    }

    alert("Nilai berhasil disimpan");

}


