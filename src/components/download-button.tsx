'use client'
import JSZip from 'jszip'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import type { GeneratedFiles } from '@/lib/parse-files'

export function DownloadButton({ files }: { files: GeneratedFiles }) {
  async function handleDownload() {
    const zip = new JSZip()
    zip.file('README.md', files.readme)
    zip.file('.env.example', files.envExample)
    zip.file('docker-compose.yml', files.dockerCompose)
    zip.file('.github/workflows/ci.yml', files.ci)
    const blob = await zip.generateAsync({ type: 'blob' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'repoready.zip'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <Button
      onClick={handleDownload}
      className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold w-full cursor-pointer transition-colors duration-200"
    >
      <Download className="w-4 h-4 mr-2" />
      Download ZIP
    </Button>
  )
}
