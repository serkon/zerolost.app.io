# Getting Started with Create React App

### DEV

npm i -D @commitlint/config-conventional @types/redux-mock-store @typescript-eslint/eslint-plugin @typescript-eslint/parser env-cmd eslint eslint-config-prettier eslint-plugin-import eslint-plugin-json-format eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-simple-import-sort eslint-plugin-unused-imports husky jsonc-eslint-parser lint-staged postcss-scss prettier react-scripts sass stylelint stylelint-config-standard stylelint-no-unsupported-browser-features stylelint-order stylelint-scss @types/react-router-dom

### ROOT

npm i react-redux react-router-dom redux axios rxjs redux-mock-store

```tsx
const initialValues2: FormData = {
  storageType: 'ZFS',
  storageVersion: '1.0.0',
  name: 'STORAGE-1',
  ipAddress: 'https://192.168.2.129',
  port: '215',
  username: 'root',
  password: '18319000Ek',
  // id: 'c5df0827-b3d8-4a4d-9837-5a5cf56a144d',
};
```

### SCP

service firewalld stop
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl status nginx

scp -pr \* root@192.168.1.12:/usr/share/nginx/html/.
scp -pr root@192.168.1.12:/etc/nginx/nginx.conf ./
scp -pr nginx.conf root@192.168.1.12:/etc/nginx/.
18319000Ek

### TODO:

- ssh root@192.168.1.11
- sudo yum install nginx
- scp -pr nginx.conf root@192.168.1.11:/etc/nginx/.
- sudo systemctl stop nginx
- sudo systemctl start nginx
- sudo systemctl status nginx
- sudo systemctl enable nginx
- /usr/share/nginx/html
- /etc/nginx/nginx.conf
- sudo firewall-cmd --permanent --zone=public --add-service=http
- sudo firewall-cmd --permanent --zone=public --add-service=https
- sudo firewall-cmd --reload
- scp -pr root@192.168.1.12:/etc/nginx/. root@192.168.1.11:/etc/nginx/.
- scp -pr \. root@192.168.1.11:/usr/share/nginx/html/.
