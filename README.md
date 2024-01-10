Use `docker compose up` para rodar.

Caso tenha problemas com portas:

`.env`
```
BACKEND_PORT=3333
```

`./api/.env`
```
PORT=3333
```

`./web/vite.config.ts`
```ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // troque aqui
    watch: {
      usePolling: true,
    },
  },
});
```
