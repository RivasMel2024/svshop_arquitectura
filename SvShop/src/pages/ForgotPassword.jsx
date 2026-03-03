import { useState } from "react"
import { ArrowLeft } from "lucide-react"

function ForgotPassword({ navigate, showToast }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      showToast("Ingresa tu correo electrónico", "error");
      return;
    }
    showToast("Te enviamos un enlace para restablecer tu contraseña 📩", "success");
    setTimeout(() => navigate('login'), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F57656] p-8">
      <div className="w-full max-w-6xl bg-[#FDE4DD] rounded-3xl p-10 shadow-xl">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="bg-[#FCD6CC] rounded-3xl p-10 shadow-lg">
            <button onClick={() => navigate("login")} className="flex items-center gap-2 text-sm text-[#CB6045] mb-6 hover:underline">
              <ArrowLeft className="h-4 w-4" /> Volver al inicio de sesión
            </button>
            <p className="text-sm text-[#CB6045] mb-2">Recupera tu acceso</p>
            <h2 className="text-4xl font-bold text-black mb-6">¿Olvidaste tu contraseña?</h2>
            <p className="text-gray-700 mb-8 text-sm">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-[#5F6362] mb-2">Email</label>
                <input type="email" placeholder="usuario@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7FEEF0]" />
              </div>
              <button type="submit" className="w-full py-3 rounded-lg bg-[#F57656] text-white font-semibold hover:bg-[#CB6045] transition">Enviar enlace</button>
            </form>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-6xl font-black text-[#CB6045] tracking-tighter mb-4">SV<span className="text-white">SHOP</span></h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword