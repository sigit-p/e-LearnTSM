function halamanSiswa(){

}

function halamanInput(){

}

function halamanRekap(){

}

async function loadDashboard(){

    // kelas
    const kelas = await getKelas();
    document.getElementById("jmlKelas").innerText = kelas.length;


    // siswa
    const siswa = await getSiswa();
    document.getElementById("jmlSiswa").innerText = siswa.length;


    // materi
    const materi = await getMateri();
    document.getElementById("jmlMateri").innerText = materi.length;


    // jobsheet
    const jobsheet = await getJobsheet();
    document.getElementById("jmlJobsheet").innerText = jobsheet.length;


    // nilai
    const nilai = await getNilaiSemua();

    const totalNilai = nilai.length;
    const totalTarget = siswa.length * jobsheet.length;

    const persen = Math.round(totalNilai / totalTarget * 100);

    document.getElementById("progressBar")
        .style.width = persen + "%";

    document.getElementById("progressText")
        .innerHTML =
        totalNilai +
        " dari " +
        totalTarget +
        " nilai sudah masuk (" +
        persen +
        "%)";


    document.getElementById("aktivitas").innerHTML = `
        <p>✓ Sistem siap digunakan</p>
        <p>✓ ${kelas.length} kelas berhasil dimuat</p>
        <p>✓ ${siswa.length} siswa berhasil dimuat</p>
        <p>✓ ${jobsheet.length} jobsheet berhasil dimuat</p>
    `;
}
