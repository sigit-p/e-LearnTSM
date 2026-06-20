const kelas = document.getElementById("kelas");
const tbodyRekap = document.getElementById("tbodyRekap");
const modal = document.getElementById("modal");
const detail = document.getElementById("detailSiswa");

loadKelas();

async function loadKelas() {

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

}


async function loadRekap() {

    if (!kelas.value) {

        alert("Pilih kelas terlebih dahulu");
        return;

    }

    tbodyRekap.innerHTML = `
    <tr>
        <td colspan="5">
            Memuat data...
        </td>
    </tr>
    `;

    // daftar siswa
    let resSiswa = await fetch(
        API + "?action=getSiswa&id_kelas=" + kelas.value
    );

    let siswa = await resSiswa.json();

    // daftar jobsheet
    let resJob = await fetch(
        API + "?action=getJobsheet&id_mapel=PKSM&tingkat=XI"
    );

    let jobs = await resJob.json();

    let jumlahJob = jobs.length;

    // seluruh nilai
    let resNilai = await fetch(
        API + "?action=getNilaiSemua"
    );

    let semuaNilai = await resNilai.json();

    let html = "";
    let no = 1;

    for (let s of siswa) {

        // nilai siswa ini saja
        let nilai = semuaNilai.filter(
            item => item.nis == s.nis
        );

        let selesai = nilai.length;

        let persen = jumlahJob > 0
            ? Math.round(selesai / jumlahJob * 100)
            : 0;

        let total = 0;

        nilai.forEach(item => {

            total += Number(item.nilai);

        });

        let rata = selesai > 0
            ? Math.round(total / selesai)
            : 0;

        html += `
        <tr>

            <td>${no}</td>

            <td>
                ${s.nama}
            </td>

            <td>
                ${selesai}/${jumlahJob}
                (${persen}%)
            </td>

            <td>
                ${rata}
            </td>

            <td>

                <button
                    onclick="detailSiswa('${s.nis}','${s.nama}')">

                    👁

                </button>

            </td>

        </tr>
        `;

        no++;

    }

    if (html == "") {

        html = `
        <tr>
            <td colspan="5">
                Tidak ada data
            </td>
        </tr>
        `;

    }

    tbodyRekap.innerHTML = html;

}

async function detailSiswa(nis){

    modal.style.display = "block";

    let resNilai = await fetch(
        API + "?action=getNilai&nis=" + nis
    );

    let nilai = await resNilai.json();

    let resJob = await fetch(
        API + "?action=getJobsheet&id_mapel=PKSM&tingkat=XI"
    );

    let jobs = await resJob.json();

    let nilaiMap = {};

    nilai.forEach(item=>{

        nilaiMap[item.id_job] = item.nilai;

    });

    let html = `
    <h2>📋 Detail Nilai</h2>
    `;

    jobs.forEach(job=>{

        let n = nilaiMap[job.id_job];

        if(n != null){

            html += `
            <p>
            ✅ ${job.judul_job}

            <br>

            Nilai : ${n}
            </p>
            <hr>
            `;

        }else{

            html += `
            <p>
            ❌ ${job.judul_job}
            </p>
            <hr>
            `;

        }

    });

    detail.innerHTML = html;

}

function tutupModal(){

    modal.style.display = "none";

}
