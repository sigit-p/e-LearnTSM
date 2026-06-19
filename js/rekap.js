window.onload = async ()=>{

    const kelas = await getKelas();

    let html='<option value="">Pilih Kelas</option>';

    kelas.forEach(k=>{
        html+=`
        <option value="${k.id_kelas}">
            ${k.nama_kelas}
        </option>`;
    });

    document.getElementById("kelas").innerHTML=html;

}

async function loadRekap(){

    const idKelas=document.getElementById("kelas").value;

    if(!idKelas){
        alert("Pilih kelas");
        return;
    }

    const siswa=await getSiswa();
    const nilai=await getNilai();

    const siswaKelas=siswa.filter(
        s=>s.id_kelas==idKelas
    );

    let html='';

    siswaKelas.forEach((s,i)=>{

        const nilaiSiswa=
            nilai.filter(
                n=>n.nis==s.nis && n.nilai!=""
            );

        let jumlah=0;

        nilaiSiswa.forEach(n=>{
            jumlah+=Number(n.nilai);
        });

        let rata='-';

        if(nilaiSiswa.length>0){
            rata=(jumlah/nilaiSiswa.length).toFixed(1);
        }

        html+=`
        <tr>
            <td>${i+1}</td>
            <td>${s.nis}</td>
            <td>${s.nama}</td>
            <td>${nilaiSiswa.length}</td>
            <td>${rata}</td>
        </tr>
        `;

    });

    document.getElementById("tbodyRekap").innerHTML=html;

}
