export const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbmRyZWQiLCJ1c2VyX2lkIjoiMDI5YWNmZGMtOTQyOS00M2RhLTgzYTctNTJhYTQ5NzZjZDY2IiwidHlwZV91c2VyIjoiMiIsImV4cCI6MTcwMzgyODk1MSwiaXNzIjoiaHR0cDovL3d3dy5zZWN1cml0eS5vcmciLCJhdWQiOiJodHRwOi8vd3d3LnNlY3VyaXR5Lm9yZyJ9.7nt9Z4fc-Nf1YxS0HAqiWEagY2f3qz1EiesLos6EjBQ"

export const ProviderId = "029acfdc-9429-43da-83a7-52aa4976cd66"

export const businessId = 3

export const headers = {
  headers: {
    "Content-Type": "multipart/form-data",
    "Provider-Id": ProviderId,
    "Business-Account-Id": businessId,
  },
}
// Application-Source = BusinessAccount
// 029acfdc-9429-43da-83a7-52aa4976cd66
// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbmRyZWQiLCJ1c2VyX2lkIjoiMDI5YWNmZGMtOTQyOS00M2RhLTgzYTctNTJhYTQ5NzZjZDY2IiwidHlwZV91c2VyIjoiMiIsImV4cCI6MTcwMzgyODk1MSwiaXNzIjoiaHR0cDovL3d3dy5zZWN1cml0eS5vcmciLCJhdWQiOiJodHRwOi8vd3d3LnNlY3VyaXR5Lm9yZyJ9.7nt9Z4fc-Nf1YxS0HAqiWEagY2f3qz1EiesLos6EjBQ
export const headersJson = {
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbmRyZWQiLCJ1c2VyX2lkIjoiMDI5YWNmZGMtOTQyOS00M2RhLTgzYTctNTJhYTQ5NzZjZDY2IiwidHlwZV91c2VyIjoiMiIsImV4cCI6MTcwMzgyODk1MSwiaXNzIjoiaHR0cDovL3d3dy5zZWN1cml0eS5vcmciLCJhdWQiOiJodHRwOi8vd3d3LnNlY3VyaXR5Lm9yZyJ9.7nt9Z4fc-Nf1YxS0HAqiWEagY2f3qz1EiesLos6EjBQ",
    "Provider-Id": ProviderId,
    "Business-Account-Id": businessId,
    "User-Language": "en",
    "Application-Source": "BusinessAccount",
  },
}
export const mulitFormData = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
}
