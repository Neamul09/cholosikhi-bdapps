import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera } from 'lucide-react';
import { clsx } from 'clsx';
import { useUserStore } from '@/store/userStore';
import { useSettingsStore } from '@/store/settingsStore';
import { isSupabaseConfigured } from '@/lib/supabase';
import IconAvatar, { AVATAR_ICONS } from '@/components/common/IconAvatar';

interface AvatarModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AvatarModal({ open, onClose }: AvatarModalProps) {
  const { avatar, avatarUrl, setAvatar, setAvatarUrl, uploadAvatar } = useUserStore();
  const { language } = useSettingsStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const onFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadError('');
    setUploading(true);
    try {
      await uploadAvatar(file);
      onClose();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [uploadAvatar, onClose]);

  const canUpload = isSupabaseConfigured;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-panel border-2 border-border-subtle rounded-[3rem] p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black">
                {language === 'bn' ? 'অবতার পরিবর্তন করুন' : 'SELECT AVATAR'}
              </h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-2xl bg-app-bg border-2 border-border-subtle flex items-center justify-center text-app-fg/40 hover:text-app-fg transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {canUpload && (
              <div className="mb-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onFile}
                  className="hidden"
                  aria-hidden="true"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full p-4 rounded-2xl border-2 border-dashed border-blue-500/40 bg-blue-500/5 text-blue-400 font-bold flex items-center justify-center gap-2 hover:bg-blue-500/10 transition-colors disabled:opacity-50"
                >
                  <Camera size={20} />
                  {uploading
                    ? (language === 'bn' ? 'আপলোড হচ্ছে...' : 'Uploading...')
                    : (language === 'bn' ? 'ছবি আপলোড করুন' : 'Upload a photo')}
                </button>
                {uploadError && (
                  <p role="alert" className="mt-2 text-xs text-rose-400 font-bold">{uploadError}</p>
                )}
                <p className="mt-2 text-[10px] text-app-fg/40 uppercase tracking-widest text-center">
                  {language === 'bn' ? 'সর্বোচ্চ ২ এমবি, ছবির ফাইল' : 'Max 2MB · JPG/PNG/WebP'}
                </p>
              </div>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-subtle" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-panel px-3 text-app-fg/40 font-black uppercase tracking-widest">
                  {language === 'bn' ? 'অথবা আইকন বেছে নিন' : 'or pick an icon'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 overflow-y-auto max-h-[40vh] pr-2 custom-scrollbar">
              {AVATAR_ICONS.map((iconName) => {
                const isActive = !avatarUrl && avatar === iconName;
                return (
                  <button
                    key={iconName}
                    onClick={() => {
                      setAvatar(iconName);
                      setAvatarUrl('');
                      onClose();
                    }}
                    className={clsx(
                      'w-full aspect-square rounded-2xl flex items-center justify-center transition-all active:scale-90',
                      isActive
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 border-2 border-blue-400'
                        : 'bg-app-bg border-2 border-border-subtle text-app-fg/60 hover:border-blue-500/50 hover:text-blue-400',
                    )}
                    aria-label={iconName}
                    aria-pressed={isActive}
                  >
                    <IconAvatar name={iconName} size={24} />
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}