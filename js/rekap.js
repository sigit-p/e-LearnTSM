const kelas = document.getElementById("kelas");
const tbodyRekap = document.getElementById("tbodyRekap");

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
                    onclick="detailSiswa('${s.nis}')">

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

function detailSiswa(nis){

    alert(
        "Detail siswa : " + nis
    );

}
