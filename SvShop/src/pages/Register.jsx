import { useState } from "react"
import { ArrowLeft } from "lucide-react"

function Register({ navigate, showToast }) {
  const countries = [
    { name: "El Salvador", code: "+503" }, { name: "Guatemala", code: "+502" }, { name: "Honduras", code: "+504" },
    { name: "Costa Rica", code: "+506" }, { name: "México", code: "+52" }, { name: "Colombia", code: "+57" }
  ];

  const [form, setForm] = useState({ fullName: "", email: "", password: "", country: "", phone: "" });
  const selectedCountry = countries.find((c) => c.name === form.country);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.country || !form.phone) {
      showToast("Completa todos los campos", "error");
      return;
    }
    showToast("Cuenta creada con éxito 🎉", "success");
    navigate('login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F57656] p-8">
      <div className="w-full max-w-6xl bg-[#FDE4DD] rounded-3xl p-10 shadow-xl">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="bg-[#FCD6CC] rounded-3xl p-10 shadow-lg">
             <button onClick={() => navigate('login')} className="flex items-center gap-2 text-sm text-[#CB6045] mb-4 hover:underline">
               <ArrowLeft className="h-4 w-4" /> Volver
            </button>
            <p className="text-sm text-[#CB6045] mb-2">Crea tu cuenta</p>
            <h2 className="text-4xl font-bold text-black mb-8">Regístrate</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-[#5F6362] mb-2">Nombre completo</label>
                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7FEEF0]" />
              </div>
              <div>
                <label className="block text-sm text-[#5F6362] mb-2">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7FEEF0]" />
              </div>
              <div>
                <label className="block text-sm text-[#5F6362] mb-2">Contraseña</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7FEEF0]" />
              </div>
              <div>
                <label className="block text-sm text-[#5F6362] mb-2">País</label>
                <select name="country" value={form.country} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7FEEF0]">
                  <option value="">Selecciona tu país</option>
                  {countries.map((country) => (<option key={country.name} value={country.name}>{country.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#5F6362] mb-2">Número de teléfono</label>
                <div className="flex">
                  <div className="px-4 py-3 bg-gray-200 rounded-l-lg text-gray-700 font-medium">{selectedCountry ? selectedCountry.code : "+_"}</div>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Tu número" className="w-full px-4 py-3 rounded-r-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7FEEF0]" />
                </div>
              </div>
              <button type="submit" className="w-full py-3 rounded-lg bg-[#F57656] text-white font-semibold hover:bg-[#CB6045] transition">Crear cuenta</button>
            </form>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <img src="/svshop-logo.png" alt="Login Illustration" className="w-full max-w-md mb-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register