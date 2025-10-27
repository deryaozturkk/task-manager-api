# 🚀 Task Manager - API (Backend)

**[➡️ Canlı Uygulamayı Gör (Netlify)](https://task-managerui.netlify.app)**

Bu proje, bir Full-Stack web geliştirme mülakatı için Angular (Frontend) ile eşleştirilmiş, Rol Tabanlı Yetkilendirme (RBAC) özellikli bir REST API örneğidir.

## 🛠️ Kullanılan Teknolojiler

* **Framework:** Nest.JS (Node.js)
* **Database:** PostgreSQL (TypeORM ile yönetilir)
* **Authentication:** JWT (JSON Web Tokens) ve Passport.js
* **Yetkilendirme (Authorization):** Rol Tabanlı Erişim Kontrolü (RBAC)

## ✨ Temel Özellikler

* **JWT Auth:** Login/Register endpoint'leri ile token oluşturma ve token doğrulama.
* **RBAC:** Görevleri silme/güncelleme işlemleri **sadece 'admin'** rolüne ait kullanıcılar tarafından yapılabilir.
* **İlişkisel Veri:** Görevler, atandıkları kullanıcılara (Task-User ManyToOne) bağlanmıştır.
* **Ölçeklenebilir Kod:** Service, Controller ve Entity katmanları ayrılmıştır.

## ⚙️ Kurulum ve Çalıştırma Adımları

**Önkoşullar:** Node.js, npm, ve çalışan bir PostgreSQL sunucusu.

1.  **Bağımlılıkları Yükleme:**
    ```bash
    npm install
    ```

2.  **Veritabanı Yapılandırması:**
    * PostgreSQL'de `newcomer_tasks` adında bir veritabanı oluşturun.
    * `src/app.module.ts` dosyasını kendi veritabanı kullanıcı adı ve şifrenizle güncelleyin.
    * Uygulama başladığında tablolar (`task` ve `user`) otomatik olarak oluşturulacaktır (`synchronize: true`).

3.  **Sunucuyu Başlatma:**
    ```bash
    npm run start:dev
    ```
    *API, `http://localhost:3000` adresinde çalışmaya başlayacaktır.*

## 🔑 Test Endpoint'leri (Postman)

| İşlem | Metot | Endpoint | Body | Gereken Yetki |
| :--- | :--- | :--- | :--- | :--- |
| **Kayıt Ol** | `POST` | `/auth/register` | `{ "username": "...", "password": "..." }` | Public |
| **Giriş Yap** | `POST` | `/auth/login` | `{ "username": "...", "password": "..." }` | Public |
| **Görev Ekle** | `POST` | `/tasks` | `{ "title": "...", "userId": "..." }` | `Bearer Token` ve **`User`** rolü (sadece kendine) / **`Admin`** rolü (herkese) |
| **Görevleri Listele**| `GET` | `/tasks` | Yok | `Bearer Token` (**User** sadece kendininkileri görür) |
