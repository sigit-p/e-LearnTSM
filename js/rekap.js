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
