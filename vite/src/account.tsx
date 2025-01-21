import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

  return (
    <div className="flex flex-col items-center space-y-6 p-6 rounded-lg bg-white shadow-xl w-72">
      {/* Show ENS Avatar if available */}
      {ensAvatar && (
        <img
          alt="ENS Avatar"
          src={ensAvatar}
          className="w-20 h-20 rounded-full border-4 border-gradient-to-r from-purple-500 to-pink-500 shadow-xl"
        />
      )}

      {/* Show ENS Name if available */}
      {ensName && (
        <div className="text-lg font-semibold text-gray-900 text-center">
          <span className="text-purple-600">{ensName}</span>
        </div>
      )}

      {/* Show Address */}
      {address && (
        <div className="text-gray-600 text-sm text-center truncate w-full">
          {address}
        </div>
      )}

      {/* Disconnect Button */}
      <button
        onClick={() => disconnect()}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-6 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-300 w-full"
      >
        Disconnect
      </button>
    </div>
  )
}
