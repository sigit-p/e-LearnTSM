async function loadKelas(){

  let res = await fetch(API+"?action=getKelas");

  let data = await res.json();

  let html="";

  data.forEach(k=>{

    html+=`
    <option value="${k.id_kelas}">
      ${k.nama_kelas}
    </option>
    `;

  });

  kelas.innerHTML=html;

}

loadKelas();
