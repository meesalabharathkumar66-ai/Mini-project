import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, CheckCircle2, AlertCircle, Shield, ArrowUp, Trash2, Archive, Lock, Unlock, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'

interface Activity {
  _id: string
  action: string
  details: any
  createdAt: string
  user: {
    name: string
    avatar: string
  }
}

const actionIcons: Record<string, any> = {
  UPLOAD: <ArrowUp size={14} className="text-blue-400" />,
  DOWNLOAD: <Clock size={14} className="text-teal-400" />,
  DELETE: <Trash2 size={14} className="text-red-400" />,
  ARCHIVE: <Archive size={14} className="text-orange-400" />,
  LOCK: <Lock size={14} className="text-purple-400" />,
  UNLOCK: <Unlock size={14} className="text-green-400" />,
  COMMENT: <MessageSquare size={14} className="text-blue-300" />
}

export const AssetTimeline = ({ assetId }: { assetId: string }) => {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ['timeline', assetId],
    queryFn: async () => {
      const res = await api.get(`/assets/${assetId}/timeline`)
      return res.data
    }
  })

  if (isLoading) return <div className="p-4 text-xs text-slate-500 animate-pulse">Loading timeline...</div>

  return (
    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
      <AnimatePresence>
        {activities?.map((activity, index) => (
          <motion.div
            key={activity._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-3 relative pb-4 border-l border-white/5 ml-2 pl-4"
          >
            <div className={`absolute -left-[7.5px] top-0 w-3.5 h-3.5 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center`}>
              {actionIcons[activity.action] || <Shield size={8} />}
            </div>
            
            <div className="flex-1 min-w-0">
               <div className="flex justify-between items-start mb-0.5">
                  <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">{activity.action}</span>
                  <span className="text-[10px] text-slate-500">{format(new Date(activity.createdAt), 'MMM d, h:mm a')}</span>
               </div>
               <p className="text-[11px] text-slate-400 truncate">
                  {activity.user.name} {activity.action.toLowerCase()}ed {activity.details?.fileName || 'asset'}
               </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {activities?.length === 0 && (
        <div className="text-center py-8">
           <AlertCircle size={20} className="mx-auto text-slate-600 mb-2" />
           <p className="text-xs text-slate-500">No activity recorded yet.</p>
        </div>
      )}
    </div>
  )
}
