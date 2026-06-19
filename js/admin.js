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
    jobs = [];
    jobsheet.innerHTML = "";
    
if(!kelas.value){

    siswa.innerHTML =
    '<option value="">Pilih Siswa</option>';

    return;
}
    
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

    html += `
    <div class="card">
    <h2>${siswa.options[siswa.selectedIndex].text}</h2>
    <p>NIS : ${nis}</p>
    </div>
    `;

    let nilaiMap = {};
    nilai.forEach(item=>{
    nilaiMap[item.id_job] = item.nilai;
    });

    let selesai = Object.keys(nilaiMap).length;
    let persen = Math.round(selesai / jobs.length * 100);

    html += `
<div class="card">

<h2>
👤 ${siswa.options[siswa.selectedIndex].text}
</h2>

<p>
NIS : ${nis}
</p>

<p>
Progress : ${selesai}/${jobs.length}
(${persen}%)
</p>

</div>
`;
    
    jobs.forEach(job=>{

    let n = nilaiMap[job.id_job] || "";

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
    <button
        id="btnSimpan"
        onclick="simpanNilai()">
        💾 Simpan Nilai
    </button>
    `;

    jobsheet.innerHTML = html;

}

async function simpanNilai() {

    if (!siswa.value) {
    alert("Pilih siswa terlebih dahulu");
    return;
}
    let btn = document.getElementById("btnSimpan");

    try {

        btn.disabled = true;
        btn.innerHTML = "Menyimpan...";

        let nis = siswa.value;

        for (let job of jobs) {

            let nilai = document.getElementById(job.id_job).value;

            if (nilai != "") {

                nilai = Number(nilai);

                if (nilai < 0) nilai = 0;
                if (nilai > 100) nilai = 100;

                let res = await fetch(
                    API
                    + "?action=saveNilai"
                    + "&nis=" + nis
                    + "&id_job=" + job.id_job
                    + "&nilai=" + nilai
                );

                let hasil = await res.json();

                if (!hasil.status) {
                    throw new Error("Gagal menyimpan");
                }

            }

        }

        alert("Nilai berhasil disimpan");
        await loadJobsheet();
    } catch (err) {

        console.error(err);
        alert("Terjadi kesalahan");

    } finally {

        btn.disabled = false;
        btn.innerHTML = "💾 Simpan Nilai";

    }

}
