// This file is now deprecated - all pages have been migrated to individual component files
// Keeping this file for backward compatibility, but it should not be imported anywhere

import { AlertCircle } from 'lucide-react';

// All placeholder pages have been migrated to full implementations:
// - See individual page files in frontend/src/pages/
// - Total pages migrated: 29/29 (100%)
// - This file can be safely deleted after verifying all imports are updated

export function Deprecated() {
    return (
        <div className="min-h-screen bg-gray-50 p-dense-6">
            <div className="card">
                <div className="flex items-center gap-3 text-brand-800">
                    <AlertCircle size={24} />
                    <p className="font-semibold">此文件已废弃 | This file is deprecated</p>
                </div>
                <p className="text-gray-600 mt-2">所有页面已迁移至独立组件文件</p>
            </div>
        </div>
    );
}
