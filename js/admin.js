const kelas = document.getElementById("kelas");
const siswa = document.getElementById("siswa");
const jobsheet = document.getElementById("jobsheet");

loadKelas();

kelas.onchange = loadSiswa;

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

}
