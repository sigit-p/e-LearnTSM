const kelas = document.getElementById("kelas");
const rekap = document.getElementById("rekap");

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

    rekap.innerHTML = "<div class='card'>Memuat data...</div>";

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

    let html = "";

    for (let s of siswa) {

        let resNilai = await fetch(
            API + "?action=getNilai&nis=" + s.nis
        );

        let nilai = await resNilai.json();

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
        <div class="card">

            <h2>
                👤 ${s.nama}
            </h2>

            <p>
                NIS : ${s.nis}
            </p>

            <p>
                Progress :
                ${selesai}/${jumlahJob}
                (${persen}%)
            </p>

            <div class="progress">

                <div
                    class="progress-bar"
                    style="width:${persen}%">

                </div>

            </div>

            <br>

            <h3>
                Rata-rata : ${rata}
            </h3>

        </div>
        `;

    }

    rekap.innerHTML = html;

}
