

async function getDashboard(){

    const r = await fetch(
        API + "?action=getDashboard"
    );

    return await r.json();

}

async function loadDashboard(){

    if (!document.getElementById("jmlKelas")) return;
    
    const d = await getDashboard();

        document.getElementById("jmlKelas").innerText =
        d.jmlKelas;

        document.getElementById("jmlSiswa").innerText =
        d.jmlSiswa;

        document.getElementById("jmlMateri").innerText =
        d.jmlMateri;

        document.getElementById("jmlJobsheet").innerText =
        d.jmlJobsheet;


        // Progress
        let totalTarget =
            d.jmlSiswa *
            d.jmlJobsheet;

        let persen = 0;

        if(totalTarget>0){
            persen = Math.round(
                d.jmlNilai / totalTarget * 100
            );
        }

        document.getElementById("progressBar")
            .style.width = persen + "%";

        document.getElementById("progressText")
            .innerHTML =
            d.jmlNilai +
            " dari " +
            totalTarget +
            " nilai sudah masuk (" +
            persen +
            "%)";


    document.getElementById("aktivitas").innerHTML = `
        <p>✓ Sistem siap digunakan</p>
        <p>✓ ${d.jmlKelas} kelas berhasil dimuat</p>
        <p>✓ ${d.jmlSiswa} siswa berhasil dimuat</p>
        <p>✓ ${d.jmlJobsheet} jobsheet berhasil dimuat</p>
    `;

}

function toggleSidebar(){

    document.querySelector(".sidebar")
        .classList.toggle("show");

    document.querySelector(".overlay")
        .classList.toggle("show");

}


function closeSidebar(){

    if(window.innerWidth <= 768){

        document.querySelector(".sidebar")
            .classList.remove("show");

        document.querySelector(".overlay")
            .classList.remove("show");

    }

}