"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "@/components/wallet-provider"
import { Wallet, LogOut, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function WalletButton() {
  const { connected, address, balance, openWalletModal, disconnect } = useWallet()

  if (!connected) {
    return (
      <Button onClick={openWalletModal} className="bg-solana-purple hover:bg-solana-purple/90">
        <Wallet className="mr-2 h-4 w-4" />
        Conectar Wallet
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-solana-purple text-solana-purple">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-solana-blue rounded-full mr-2"></div>
            <span className="hidden sm:inline mr-1">
              {address?.substring(0, 4)}...{address?.substring(address.length - 4)}
            </span>
            <span className="sm:hidden mr-1">{address?.substring(0, 4)}...</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Mi Wallet</DropdownMenuLabel>
        <DropdownMenuItem className="flex justify-between">
          <span>Dirección:</span>
          <span className="font-mono text-xs">
            {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex justify-between">
          <span>Balance:</span>
          <span>{balance} SOL</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnect} className="text-red-500 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Desconectar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
