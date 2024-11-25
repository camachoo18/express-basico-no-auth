import requests

url = "http://localhost:3000"
r = requests.get(url)
print("[TEST] GET / =>", r.status_code)

r = requests.post(url+"/api/users", data={"user": "admin2", "password": "admin"})
print("[TEST] POST /api/users =>", r.status_code)

r = requests.get(url+"/api/users")
print("[TEST] GET /api/users =>", r.status_code)


old_user = "admin"  # Nombre de usuario actual
new_user = "new_admin"  # Nuevo nombre de usuario
new_password = "new_password_123"  # Nueva contraseña

# Realizar la solicitud PUT para cambiar el nombre de usuario y la contraseña
r = requests.put(f"{url}/api/users/{old_user}", json={"user": new_user, "password": new_password})

# Verificar la respuesta
print("[TEST] PUT /api/users/admin =>", r.status_code)
print("[TEST] Response text =>", r.text)



r = requests.get(url+"/api/users/admin")
print("[TEST] GET /api/users/admin =>", r.status_code)

r = requests.post(url + "/api/login", data={"user": "admin", "password": "admin"})
print("[TEST] POST /api/login =>", r.status_code, r.cookies)
cookie = r.cookies
user = cookie.get("user")