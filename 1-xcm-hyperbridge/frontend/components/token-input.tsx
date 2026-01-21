"use client"

import { useState } from "react"

const tokens = [
  {
    id: "usdc",
    name: "USDC",
    icon: (
      <img
        src="https://github.com/TalismanSociety/chaindata/raw/main/assets/tokens/usdc.svg"
        alt="USDC"
        className="w-7 h-7 inline-block align-middle"
      />
    ),
  },
  {
    id: "dot",
    name: "DOT",
    icon: (
      <img
        src="https://github.com/TalismanSociety/chaindata/raw/main/assets/tokens/dot.svg"
        alt="DOT"
        className="w-7 h-7 inline-block align-middle"
      />
    ),
  },
]

interface TokenInputProps {
  amount: string
  onAmountChange: (amount: string) => void
  sourceChain: { name: string }
}

export function TokenInput({ amount, onAmountChange, sourceChain }: TokenInputProps) {
  const [selectedToken, setSelectedToken] = useState(tokens[0])
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-black uppercase">Amount</label>
      <div className="bg-gray-100 rounded-2xl p-4 border-3 border-black">
        <div className="flex gap-3">
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-white border-3 border-black rounded-2xl px-4 py-3 flex items-center gap-2 font-bold text-black hover:bg-gray-50 transition-colors h-16"
            >
              <span className="text-2xl">{selectedToken.icon}</span>
              <span>{selectedToken.name}</span>
              <span className="text-lg">▼</span>
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border-3 border-black rounded-2xl shadow-lg z-10 min-w-max">
                {tokens.map((token) => (
                  <button
                    key={token.id}
                    onClick={() => {
                      setSelectedToken(token)
                      setIsOpen(false)
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-2 font-bold text-black border-b-2 border-black last:border-b-0 transition-colors"
                  >
                    <span className="text-2xl">{token.icon}</span>
                    <span>{token.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Amount input */}
          <div className="flex-1 flex items-center justify-center">
            <input
              type="number"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              placeholder="0.00"
              className="w-full bg-transparent text-4xl font-black text-black placeholder-black/30 outline-none no-spinner"
              style={{ MozAppearance: 'textfield' }}
            />
          </div>
       
        <style jsx global>{`
          input[type=number].no-spinner::-webkit-inner-spin-button,
          input[type=number].no-spinner::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type=number].no-spinner {
            -moz-appearance: textfield;
          }
        `}</style>
        </div>

        <div className="flex justify-between mt-3 pt-3 border-t-2 border-black">
          <div className="text-sm font-bold text-black">Balance: 6.94</div>
          <div className="flex gap-2">
            {["25%", "50%", "75%", "Max"].map((pct) => (
              <button
                key={pct}
                onClick={() =>
                  onAmountChange(pct === "Max" ? "1000" : ((Number.parseInt(pct) / 100) * 1000).toString())
                }
                className="px-2 py-1 rounded-lg text-xs font-bold bg-gray-200 hover:bg-gray-300 text-black border-2 border-black transition-colors"
              >
                {pct}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
