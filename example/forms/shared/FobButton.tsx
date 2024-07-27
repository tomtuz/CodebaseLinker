import { TrashIcon } from 'lucide-react'

interface FobButtonProps {
  children?: React.ReactNode
  onClickDelete?: () => void
}

// FOB (Floating Action Button)
export function FobButton({ children, onClickDelete }: FobButtonProps) {
  return (
    <button
      type="button"
      className="rounded-full text-white bg-red-500 hover:bg-red-700 focus:ring-white absolute left-[calc(100%+1rem)] top-1/2 -translate-y-1/2 p-2 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2"
      onClick={onClickDelete}
    >
      {children || <TrashIcon size={20} />}
    </button>
  )
}
