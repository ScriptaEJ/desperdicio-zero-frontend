import { DownloadIcon, FileIcon } from '../ReportIcons/ReportIcons';

export default function ReportCard({ report, onDownload }) {
  return (
    <article className="flex gap-4 rounded-[20px] border border-[#e8eae6] bg-white p-6">
      <div className="grid size-11 flex-none place-items-center rounded-xl bg-[#f0f1ee] text-[#0f6b4f]">
        <FileIcon />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[14.5px] font-semibold text-[#16211c]">{report.title}</h3>
          <span className="rounded-full bg-[#f0f1ee] px-[11px] py-[5px] text-[10.5px] font-bold text-[#76807b]">
            {report.format}
          </span>
        </div>

        <p className="mb-[18px] mt-2 text-[12.5px] text-[#76807b]">{report.description}</p>

        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-xs text-[#76807b]">{report.period}</span>
          <button
            type="button"
            onClick={() => onDownload(report)}
            className="inline-flex cursor-pointer items-center gap-1.5 text-[12.5px] font-bold text-[#0f6b4f] hover:underline"
          >
            <DownloadIcon className="size-[13px]" />
            Baixar
          </button>
        </div>
      </div>
    </article>
  );
}