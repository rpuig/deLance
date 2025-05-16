import CurrencyPreferenceForm from "@/components/currency-preference-form"

export default function CurrencyPreferencesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Preferencias de Moneda</h1>
      <p className="mb-6 text-gray-600">
        Configura la moneda en la que deseas recibir tus pagos. Cuando un cliente te pague, el sistema convertirá
        automáticamente el pago a tu moneda preferida utilizando Orderly.
      </p>

      <CurrencyPreferenceForm />
    </div>
  )
}
