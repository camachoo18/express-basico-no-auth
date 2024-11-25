import requests

url = "http://localhost:3000"
r = requests.get(url)
print("[TEST] GET / =>", r.status_code)

r = requests.post(url+"/api/users", data={"user": "admin2", "password": "admin"})
print("[TEST] POST /api/users =>", r.status_code)

r = requests.get(url+"/api/users")
print("[TEST] GET /api/users =>", r.status_code)

# Hace update de usuario y contraseña
old_user = "admin"  
new_user = "new_admin"  
new_password = "new_password_123"  

# Realizar la solicitud PUT para cambiar el nombre de usuario y la contraseña
r = requests.put(f"{url}/api/users/{old_user}", json={"user": new_user, "password": new_password})

print("[TEST] PUT /api/users/admin =>", r.status_code)
print("[TEST] Response text =>", r.text)

# Borrar base de datos de usuarios
r = requests.get(url + "/api/users")


if r.status_code == 200:
    users = r.json()  
    print(f"[TEST] GET /api/users => {r.status_code}, usuarios obtenidos: {users}")

   
    for user in users:
        r = requests.delete(f"{url}/api/users/{user['user']}")  
        print(f"[TEST] DELETE /api/users/{user['user']} =>", r.status_code, r.text)
else:
    print(f"[TEST] No se pudieron obtener los usuarios, status: {r.status_code}")


r = requests.get(url+"/api/users/admin")
print("[TEST] GET /api/users/admin =>", r.status_code)

r = requests.post(url + "/api/login", data={"user": "admin", "password": "admin"})
print("[TEST] POST /api/login =>", r.status_code, r.cookies)
cookie = r.cookies
user = cookie.get("user")