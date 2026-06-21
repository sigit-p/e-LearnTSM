let user =
    JSON.parse(
        localStorage.getItem("user")
    );


function halamanLogin(){

    konten.innerHTML = `

    <div class="header">

        <h1>🔒 Login Admin</h1>

        <small>
            Masuk sebagai guru/admin
        </small>

    </div>

    <div class="card login-card">

        <input
            type="text"
            id="username"
            class="search-input"
            placeholder="Username">

        <input
            type="password"
            id="password"
            class="search-input"
            placeholder="Password">

        <button
            class="btn-detail"
            onclick="cekLogin()">

            Login

        </button>

    </div>

    `;

}

async function cekLogin(){

    let username =
        document
        .getElementById("username")
        .value;

    let password =
        document
        .getElementById("password")
        .value;

    let data =
        await login(
            username,
            password
        );

    if(data.status){

    localStorage.setItem(
        "user",
        JSON.stringify(data)
    );

    user = data;
    
    updateMenuLogin();

    tampilMenuAdmin();

    halamanDashboard();
    
    alert(
        "Login berhasil"
    );

}else{

    alert(
        data.pesan
    );

}

}

function tampilMenuAdmin(){

 document.getElementById("menuAdmin").innerHTML = `

<button onclick="halamanInput();closeSidebar()">
📝 Input Nilai
</button>

<button onclick="halamanRekap();closeSidebar()">
📊 Rekap Nilai
</button>

<button>
⚙ Pengaturan
</button>
`;

document.getElementById("userPanel").innerHTML = `

<div class="user-card">

    <div class="user-avatar">
        👤
    </div>

    <div class="user-info">

        <div class="user-name">
            ${user.nama}
        </div>

        <div class="user-role">
            ${user.role}
        </div>

        <div class="user-status">
            🟢 Online
        </div>

    </div>

</div>

<button
    class="btn-logout"
    onclick="logout()">

    🚪 Logout

</button>

`;

}


function logout(){

    localStorage.removeItem(
        "user"
    );

    user = null;

    document.getElementById(
        "menuAdmin"
    ).innerHTML = "";

    document.getElementById(
        "userPanel"
    ).innerHTML = "";

    updateMenuLogin();

    halamanDashboard();

}


function updateMenuLogin(){

    let btn =
        document.getElementById(
            "btnLogin"
        );

    if(user){

        btn.style.display = "none";

    }else{

        btn.style.display = "";

    }

}
