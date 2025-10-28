# 🚀 Task Manager - API (Backend)

**[➡️ Canlı Uygulamayı Gör (Netlify)](https://task-managerui.netlify.app)**

Bu proje, Angular (Frontend) ile eşleştirilmiş, Rol Tabanlı Yetkilendirme (RBAC) özellikli, **güvenli bir REST API örneğidir.**

## 🛠️ Kullanılan Teknolojiler

* **Framework:** Nest.JS (Node.js)
* **Database:** PostgreSQL (TypeORM ile yönetilir)
* **Authentication:** JWT (JSON Web Tokens) ve Passport.js (`passport-local`, `passport-jwt`)
* **Yetkilendirme (Authorization):** Rol Tabanlı Erişim Kontrolü (RBAC) - `Guards` ve `@Roles` decorator'ları ile.
* **Validation:** `class-validator` ile DTO (Data Transfer Object) doğrulaması.
* **Şifreleme:** `bcrypt` ile güvenli şifre hash'leme.

## ✨ Temel Özellikler

* **JWT Auth:** `/auth/login` ve `/auth/register` endpoint'leri ile token oluşturma ve token doğrulama (`JwtStrategy`). İlk kaydolan kullanıcı otomatik olarak 'admin' rolünü alır.
* **RBAC:**
    * **Admin:** Tüm kullanıcıları listeleyebilir (`GET /users`), kullanıcı rollerini güncelleyebilir (`PATCH /users/:id/role`), tüm görevleri görebilir (`GET /tasks`), herkese görev atayabilir (`POST /tasks`), tüm görevleri güncelleyebilir/silebilir (`PATCH /tasks/:id`, `DELETE /tasks/:id`).
    * **User:** Sadece kendine atanan görevleri görebilir (`GET /tasks`), sadece kendine görev atayabilir (`POST /tasks`), sadece kendi görevlerinin **durumunu** güncelleyebilir (`PATCH /tasks/:id`).
* **Hesap Yönetimi:** Giriş yapan kullanıcılar kendi şifrelerini değiştirebilir (`PATCH /auth/password`).
* **İlişkisel Veri:** Görevler (`Task`), atandıkları kullanıcılara (`User`) `ManyToOne` ilişkisi ile bağlanmıştır.
* **Ölçeklenebilir Kod:** Modüler yapı (App, Auth, Users, Tasks), Service, Controller ve Entity katmanları ayrılmıştır.

## ⚙️ Kurulum ve Çalıştırma Adımları

**Önkoşullar:** Node.js, npm, ve çalışan bir PostgreSQL sunucusu (veya Render gibi bir platform).

1.  **Bağımlılıkları Yükleme:**
    ```bash
    npm install
    ```

2.  **Veritabanı Yapılandırması:**
    * **Lokal:** PostgreSQL'de `newcomer_tasks` adında bir veritabanı oluşturun. Gerekirse `src/app.module.ts` dosyasındaki lokal bağlantı ayarlarını (`host`, `port`, `username`, `password`, `database`) güncelleyin.
    * **Canlı (Render vb.):** `DATABASE_URL` adında bir ortam değişkeni (Environment Variable) tanımlayın ve `ssl: { rejectUnauthorized: false }` ayarının `app.module.ts` içinde aktif olduğundan emin olun.
    * Uygulama başladığında tablolar (`task` ve `user`) otomatik olarak oluşturulacaktır (`synchronize: true`).

3.  **Sunucuyu Başlatma:**
    * **Lokal:**
      ```bash
      npm run start:dev
      ```
    * **Canlı:**
      ```bash
      npm run start:prod
      ```
    *API, lokalde `http://localhost:3000`, canlıda platformun verdiği adreste çalışmaya başlayacaktır.*

## 🔑 API Endpoint'leri (Test)

| İşlem | Metot | Endpoint | Body | Gereken Yetki |
| :--- | :--- | :--- | :--- | :--- |
| **Kayıt Ol** | `POST` | `/auth/register` | `{ "username": "...", "password": "..." }` | Public |
| **Giriş Yap** | `POST` | `/auth/login` | `{ "username": "...", "password": "..." }` | Public |
| **Şifre Değiştir** | `PATCH` | `/auth/password` | `{ "currentPassword": "...", "newPassword": "..." }` | `Bearer Token` (Herkes kendi şifresini) |
| **Görev Ekle** | `POST` | `/tasks` | `{ "title": "...", "userId": "..." }` | `Bearer Token` (**User** sadece kendine, **Admin** herkese) |
| **Görevleri Listele**| `GET` | `/tasks` | Yok | `Bearer Token` (**User** sadece kendininkileri) |
| **Görevi Güncelle**| `PATCH` | `/tasks/:id` | `{ "status": "COMPLETED", "title": "...", ... }` | `Bearer Token` (**User** sadece kendi görevinin `status`'ünü, **Admin** her şeyi) |
| **Görevi Sil**| `DELETE` | `/tasks/:id` | Yok | `Bearer Token` ve **`Admin`** rolü |
| **Kullanıcıları Listele**| `GET` | `/users` | Yok | `Bearer Token` ve **`Admin`** rolü |
| **Kullanıcı Rolünü Güncelle**| `PATCH` | `/users/:id/role` | `{ "role": "admin" }` | `Bearer Token` ve **`Admin`** rolü (Kendini hariç) |
