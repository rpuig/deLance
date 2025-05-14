import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <>
      <section className="py-8 md:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  <span className="solana-gradient-text">Conecta, Trabaja y Cobra</span> en Solana
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  La plataforma descentralizada que conecta freelancers y clientes con pagos seguros a través de smart
                  contracts en Solana.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/connect">
                  <Button className="bg-solana-purple hover:bg-solana-purple/90">
                    Conectar Wallet <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto lg:mr-0 flex items-center justify-center">
              <Image
                src="/images/crypto-freelancer.png"
                alt="deLance - Freelancer en Solana"
                className="rounded-lg object-cover shadow-xl"
                width={500}
                height={400}
                priority
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-8 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-3 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Cómo funciona</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Un proceso simple y seguro para trabajar en la blockchain
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-solana-purple/20 text-solana-purple">
                <span className="font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold">Conecta tu Wallet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Conecta tu wallet de Solana para acceder a la plataforma de forma segura.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-solana-purple/20 text-solana-purple">
                <span className="font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold">Elige tu Rol</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Decide si quieres ofrecer servicios como freelancer o contratar como cliente.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-solana-purple/20 text-solana-purple">
                <span className="font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold">Pagos Seguros</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Los pagos se mantienen en un smart contract hasta que el trabajo sea completado y validado.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
