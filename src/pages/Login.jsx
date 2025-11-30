function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Iniciar sesión
        </h2>
        {/* Después conectamos este form con FastAPI */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-900 text-white rounded py-2 font-medium hover:bg-slate-800"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
