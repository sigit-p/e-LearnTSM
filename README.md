# e-???? 🚀

Sistem pembelajaran dan monitoring mapel produktif TSM berbasis Google Sheets + Apps Script + GitHub Pages.

## Fitur

### Guru
- Input nilai jobsheet
- Edit nilai
- Rekap progres siswa
- Materi pembelajaran
- Monitoring penyelesaian job

### Siswa
- Lihat nilai
- Cek progres jobsheet
- Akses materi pembelajaran
- Melihat job yang belum selesai

## Mapel
- PKSM
- PSSM
- PMSM

## Teknologi

- HTML
- CSS
- JavaScript
- Google Apps Script
- Google Sheets
- GitHub Pages

## Struktur Database

### akun
username | password | nama | role

### mapel
id_mapel | nama_mapel

### kelas
id_kelas | nama_kelas | jurusan | tingkat

### siswa
nis | nama | id_kelas

### materi
id_materi | id_mapel | judul | link

### jobsheet
id_job | id_mapel | tingkat | judul_job | media

### nilai
nis | id_job | nilai | tanggal

### setting
key | value

## Status

🟢 Backend API : Selesai

- [x] getSetting()
- [x] getMapel()
- [x] getKelas()
- [x] getSiswa()
- [x] getMateri()
- [x] getJobsheet()
- [x] getNilai()
- [x] saveNilai()

🟡 Frontend : Dalam Pengembangan

- [ ] Admin
- [ ] Halaman siswa
- [ ] Login
- [ ] Dashboard
- [ ] Rekap progres

---

SMK Muhammadiyah Pakem
Teknik Sepeda Motor
#sigitprabowo@2026
