const API = "https://script.google.com/macros/s/AKfycbyE4bnEuq6V9zYvxxnaqx6Ruo6_yai4RhbbC0CP473AdT9zuomAOF1bsRscd2TOKP5ZKA/exec";

async function getKelas(){
    const r = await fetch(API + "?action=getKelas");
    return await r.json();
}

async function getSiswa(id_kelas=""){
    const r = await fetch(
        API + "?action=getSiswa&id_kelas=" + id_kelas
    );
    return await r.json();
}

async function getJumlahSiswa(){
    const r = await fetch(
        API+"?action=getJumlahSiswa"
    );
    return await r.json();
}

async function getMateri(id_mapel=""){
    const r = await fetch(
        API + "?action=getMateri&id_mapel=" + id_mapel
    );
    return await r.json();
}

async function getJobsheet(id_mapel="", tingkat=""){
    const r = await fetch(
        API +
        "?action=getJobsheet&id_mapel=" +
        id_mapel +
        "&tingkat=" +
        tingkat
    );

    return await r.json();
}

async function getNilaiSemua(){
    const r = await fetch(
        API + "?action=getNilaiSemua"
    );

    return await r.json();
}

async function login(username,password){

    let res = await fetch(

        API +

        "?action=login"

        +

        "&username=" + username

        +

        "&password=" + password

    );

    return await res.json();

}