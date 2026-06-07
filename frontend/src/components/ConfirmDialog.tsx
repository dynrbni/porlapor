import { type ReactNode } from 'react'
import { Trash2, AlertTriangle, ArrowUpCircle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './ui/alert-dialog'

export type ConfirmAction = 'delete' | 'promote' | 'warning'

const actionConfig: Record<ConfirmAction, {
  icon: ReactNode
  title: string
  confirmLabel: string
  confirmClass: string
  iconClass: string
}> = {
  delete: {
    icon: <Trash2 className="h-5 w-5" />,
    title: 'Hapus',
    confirmLabel: 'Hapus',
    confirmClass: 'bg-red-600 hover:bg-red-700 text-white',
    iconClass: 'bg-red-100 text-red-600',
  },
  promote: {
    icon: <ArrowUpCircle className="h-5 w-5" />,
    title: 'Promosi',
    confirmLabel: 'Promosi',
    confirmClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    iconClass: 'bg-indigo-100 text-indigo-600',
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5" />,
    title: 'Peringatan',
    confirmLabel: 'Ya, Lanjutkan',
    confirmClass: 'bg-amber-600 hover:bg-amber-700 text-white',
    iconClass: 'bg-amber-100 text-amber-600',
  },
}

interface ConfirmDialogProps {
  action: ConfirmAction
  title?: string
  description: string
  onConfirm: () => void
  children: ReactNode
}

export default function ConfirmDialog({
  action,
  title,
  description,
  onConfirm,
  children,
}: ConfirmDialogProps) {
  const config = actionConfig[action]

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full sm:mx-0 ${config.iconClass}`}>
            {config.icon}
          </div>
          <AlertDialogTitle>{title || config.title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            className={config.confirmClass}
            onClick={onConfirm}
          >
            {config.icon}
            {config.confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
